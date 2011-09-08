package edu.harvard.med.hcp.mcknight.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.log4j.Logger;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.google.gson.Gson;

import edu.harvard.med.hcp.exception.GeneralException;
import edu.harvard.med.hcp.mcknight.game.GameStatus;
import edu.harvard.med.hcp.mcknight.game.LiscovichGame;
import edu.harvard.med.hcp.mcknight.game.Player;
import edu.harvard.med.hcp.mcknight.game.PlayerStatus;
import edu.harvard.med.hcp.mcknight.game.Relationship;
import edu.harvard.med.hcp.mcknight.game.moves.CooperateMove;
import edu.harvard.med.hcp.mcknight.game.moves.DoNotCooperateMove;
import edu.harvard.med.hcp.service.PggService;

/**
 * @author Mark McKnight
 * @version 1.0
 * This Servlet accepts and returns JSON encoded requests from the client.
 */
//public class EventManagerServlet extends HttpServlet implements Observer
@SuppressWarnings({"serial", "unused"})
public class EventManagerServlet extends HttpServlet {
	private class AdminResponseData {
		public String selectedGame;
		public String clientInstructions = "";
		public List<String> report;
		public int round;
		public int[][] edges;
		public Map<Integer, Integer> cooperating;
		public List<String> moveQueue;
		public GameStatus[] games;
		public PlayerStatus[] players;
		public String gameStatus;
		public String maxPayoffLog, minPayoffLog;
		public String logUrl;
		public String reportUrl;
		public long freeMemory;
		public long totalMemory;
		public long maxMemory;
		public long usedMemory;
		AdminResponseData(){}
	}

	private class ClientResponseData {
		public String selectedGame;
		public String eli;
		public String clientInstructions = "";
		public boolean decidedCooperate;
		public boolean shownPayoff;
		public boolean shownRewiring;
		public int round;
		public int lastRound;
		public int bonus;
		public int coc;
		public int payOff;
		public int lastMove;
		public Relationship[] relationships;
		public GameStatus.Status gameStatus;
		public boolean doneTutorial;
		public int firstBonus, secondBonus;
		private boolean firstAllocationFinished;
		public int seedMoney;
		public double exchangeRate;
		public int thirdBonus;
		public int minRound;
		public boolean doneElicitation;
		public String progress;
		public String robotName;
		public int waitTime;
		public String reason;
		public double poe;
		public String roundPoe;
		ClientResponseData(){}
	};  // This could potentially be extended for other roles.

	public enum Privileges {CLIENT, ADMIN}

	private static Logger logger = Logger.getLogger(EventManagerServlet.class);

	private HashMap<String, LiscovichGame> games; // currently prepared games
	private List<LiscovichGame> gamesList = new ArrayList<LiscovichGame>();
	private Gson gson;  // this translates Java classes into JSON objects

	private ApplicationContext applicationContext;

	private PggService pggService;

	private void cancelServer(String sid) throws JGenerousException,
			IOException, GeneralException {
		getGame(sid).cancelGame();
	}

	private void deleteServer(String sid) throws JGenerousException,
			IOException, GeneralException {
		if (getGame(sid).getStatus() != GameStatus.Status.FINISHED
				&& getGame(sid).getStatus() != GameStatus.Status.CANCELLED) {
			// first, cancel the game
			cancelServer(sid);
		}
		gamesList.remove(games.get(sid));
		games.remove(sid);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		request.getServletPath();
		String responseString = "";
		// TODO: Implement simple security here
		try {
			String clientid = request.getParameter("clientid").trim();
			switch (getPrivileges(clientid))
			{
				case ADMIN:
					responseString = getAdminResponse(request);
					break;
				case CLIENT:
					responseString = getClientResponse(request);
					break;
				default:
					responseString = "Authentication Error!";
					break;
			}
		} catch (NullPointerException npe) {
			logger.error(npe.getMessage(), npe);
		} catch (JGenerousException e) {
			logger.error(e.getMessage(), e);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}

		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		out.println(responseString);
	}

	String getAdminResponse(HttpServletRequest request) throws JGenerousException, IOException {
		String serverid = request.getParameter("serverid").trim();
		String serverAction = request.getParameter("action").trim();
		AdminResponseData rData = new AdminResponseData();
		try {
			// if the admin client sent a "PrepareServer" command and the specified id does not already exist.
			if (serverAction.equals("PrepareServer")
					&& (!games.containsKey(serverid))
					&& (pggService.checkDuplicateServerId(serverid))) {// prepare the game
				try {
					// grab the game variables from the request
					Properties gameProperties = new Properties();
					gameProperties.setProperty("numAiPlayers", "" + Integer.parseInt(request.getParameter("numAiPlayers").trim(), 10));
					gameProperties.setProperty("numHumanPlayers", "" + Integer.parseInt(request.getParameter("numHumanPlayers").trim(), 10));
					gameProperties.setProperty("costOfCooperation",  "" + Integer.parseInt(request.getParameter("costOfCooperation").trim(), 10));
					gameProperties.setProperty("payOff", "" + Integer.parseInt(request.getParameter("payOff").trim(), 10));
					gameProperties.setProperty("seedMoney", "" + Integer.parseInt(request.getParameter("seedMoney").trim(), 10));
					gameProperties.setProperty("roundsA", "" + Integer.parseInt(request.getParameter("numRoundsA").trim(), 10));
					gameProperties.setProperty("roundsB", "" + Integer.parseInt(request.getParameter("numRoundsB").trim(), 10));
					gameProperties.setProperty("eli", "" + request.getParameter("eli").trim());
					gameProperties.setProperty("orderA", request.getParameter("orderA").trim());
					gameProperties.setProperty("orderB", request.getParameter("orderB").trim());
					gameProperties.setProperty("poe", "" + Double.parseDouble(request.getParameter("poe").trim()));
					gameProperties.setProperty("globalTimeout", "" + Integer.parseInt(request.getParameter("globalTimeout").trim()));
					gameProperties.setProperty("playerTimeout", "" + Integer.parseInt(request.getParameter("playerTimeout").trim()));
					gameProperties.setProperty("idleTimeout", "" + Integer.parseInt(request.getParameter("idleTimeout").trim()));
					gameProperties.setProperty("exchangeRate", "" + Double.parseDouble(request.getParameter("exchangeRate").trim()));
					gameProperties.setProperty("fixed", request.getParameter("fixed").trim());

					prepareServer(serverid, gameProperties, request.getContextPath());
				} catch (NumberFormatException nfe) {
					logger.info(nfe.getMessage(), nfe);
				}
			} else if (serverAction.equals("StartServer")
					&& games.containsKey(serverid)
					&& !getGame(serverid).isStarted()) {
				startServer(serverid);
			} else if (serverAction.equals("DropPlayer")
					&& (games.containsKey(serverid))) {
				// The player requested to drop
				int playerid = Integer.parseInt(request.getParameter("playerid")
						.trim(), 10);

				// If this player exists, drop him
				if (getGame(serverid).isPlayer(playerid)) {
					getGame(serverid).dropPlayer(
							getGame(serverid).getPlayer(playerid));
				}
			} else if (serverAction.equals("StopServer")
					&& (games.containsKey(serverid))) {
				stopServer(serverid);
			} else if (serverAction.equals("CancelServer")
					&& (games.containsKey(serverid))) {
				cancelServer(serverid);
			} else if (serverAction.equals("DeleteServer")
					&& (games.containsKey(serverid))) {
				deleteServer(serverid);
			} else if (serverAction.equals("GetUpdate")) {
				// If a game has been selected to watch, return current round
				if (games.containsKey(serverid)) {
					rData.round = getGame(serverid).getCurRound();

					// Prepare a response to the request
					int[][] edges = getGame(serverid).getConnections();
					Map<Integer, Integer> cooperating = getGame(serverid).getCooperating();

					rData.gameStatus = getGame(serverid).getStatus().toString();
					rData.selectedGame = getGame(serverid).getName();
					rData.clientInstructions = "UpdateGraph";
					rData.edges = edges;
					rData.cooperating = cooperating;
					rData.moveQueue = getGame(serverid).getLog();
					rData.report = getGame(serverid).getReport();
					rData.logUrl = getGame(serverid).getLogUrl();
					rData.reportUrl = getGame(serverid).getReportUrl();
					PlayerStatus[] playerStatusArray = new PlayerStatus[getGame(serverid).getPlayers().size()];
					for (int i = 0; i < getGame(serverid).getPlayers().size(); i++) {
						Player p = getGame(serverid).getPlayers().get(i);
						playerStatusArray[i] = p.getPlayerStatus();
					}
					rData.players = playerStatusArray;
				}
			} else if (serverAction.equals("IgnoreTimeout")) {
				getGame(serverid).setTimeoutIgnored(true);
			}
		} catch (GeneralException e) {
			logger.error(e.getMessage(), e);
		}


		GameStatus[] gameStatusArray = new GameStatus[games.size()];
		int i = 0;
		for (LiscovichGame g : gamesList) {
			gameStatusArray[i] = g.getGameStatus();
			i++;
		}
		rData.games = gameStatusArray;

		Runtime rt = Runtime.getRuntime();
		rData.freeMemory = rt.freeMemory() / 1048576;
		rData.totalMemory = rt.totalMemory() / 1048576;
		rData.maxMemory = rt.maxMemory() / 1048576;
		rData.usedMemory = rData.totalMemory - rData.freeMemory;
		String json = gson.toJson(rData);
		return json;
	}

	String getClientResponse(HttpServletRequest request) throws Exception {
		String serverid = request.getParameter("serverid").trim();
		if (! games.containsKey(serverid)) {
			throw new JGenerousException(JGenerousException.LogLevel.ALL,
					"Specified Game ID not found, maybe it hasn't started yet?");
		}

		ClientResponseData rData = new ClientResponseData();
		try {
			int clientid = Integer.parseInt(request.getParameter("clientid").trim(), 10);

			if (! getGame(serverid).isPlayer(clientid)) {
				throw new JGenerousException(JGenerousException.LogLevel.ALL,
						"Specified Player ID not found, are you sure this is the correct game?");
			}
			Player p = getGame(serverid).getPlayer(clientid);
			// Implement the player action unless the player has been dropped
			if (getGame(serverid).getPlayer(clientid).getStatus() != PlayerStatus.Status.DROPPED) {
				String serverAction = request.getParameter("action").trim();
				if (serverAction.equals("GetUpdate")) {
					if (request.getParameter("workerId") != null) {
						if (p.getTurkerId().isEmpty()
								&& !request.getParameter("workerId").isEmpty()) {
							p.setTurkerId(request.getParameter("workerId"));
							getGame(serverid).verifyTurkerId(p);
						}
						if (p.getAssignmentId().isEmpty()
								&& !request.getParameter("assignmentId").isEmpty()) {
							p.setAssignmentId(request.getParameter("assignmentId"));
						}
						if (p.getTurkSubmitTo().isEmpty()
								&& !request.getParameter("turkSubmitTo").isEmpty()) {
							p.setTurkSubmitTo(request.getParameter("turkSubmitTo"));
						}
						if (p.getHitId().isEmpty()
								&& !request.getParameter("hitId").isEmpty()) {
							p.setHitId(request.getParameter("hitId"));
						}
						p.setBrowserCode(request.getParameter("browserCode"));
						p.setBrowserName(request.getParameter("browserName"));
						p.setBrowserVersion(request.getParameter("browserVersion"));
						p.setCookieEnabled(request.getParameter("cookiesEnabled"));
						p.setPlatform(request.getParameter("platform"));
						p.setUserAgent(request.getParameter("userAgent"));
						if (p.getIp().isEmpty() && !request.getRemoteAddr().isEmpty()) {
							p.setIp(request.getRemoteAddr());
							getGame(serverid).verifyIp(p);
						}
						p.setClientHeight(request.getParameter("ch"));
						p.setClientWidth(request.getParameter("cw"));
					}
					if (request.getParameter("loc") != null
							&& !request.getParameter("loc").equals("")
							&& p.getLocation().equals("")) {
						p.setLatitude(request.getParameter("la"));
						p.setLongtitude(request.getParameter("lo"));
						p.setLocation(request.getParameter("loc"));
					}
					String mx = request.getParameter("mx");
					if (mx != null && !mx.equals("")) {
						SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
						Date date = new Date();
						String timestamp = dateFormat.format(date);

						String my = request.getParameter("my");
						String activeBrowser = request.getParameter("active");
						String latency = request.getParameter("lag");
						String record = mx + "\t" + my + "\t" + activeBrowser + "\t" + latency;
						p.addMouseLog(date, record);
						getGame(serverid).recordLog("Player Status\t" + p.getId()
								+ "\t" + timestamp
								+ "\t" + record);
						p.setLatency(latency);
					}
					String progress = request.getParameter("p");
					if (progress != null && !progress.equals("")) {
						p.setProgess(progress);
					}
					String svg = request.getParameter("svg");
					if (svg != null && !svg.equals("")) {
						p.setSvgSupported(svg);
					}
				} else if (serverAction.equals("DoTutorial")
						&& getGame(serverid).isStarted()) {
					getGame(serverid).getPlayer(clientid).setDoneTutorial(true);
				} else if (serverAction.equals("DoElicitation") && getGame(serverid).isStarted()) {
					getGame(serverid).getPlayer(clientid).setDoneElicitation(true);
					int rule = Integer.parseInt(request.getParameter("rule").trim());
					int firstMove = Integer.parseInt(request.getParameter("firstmove").trim());
					getGame(serverid).getPlayer(clientid).setRule(rule);
					getGame(serverid).getPlayer(clientid).setEliFirstMove(firstMove);
				} else if (serverAction.equals("ShowPayoff") && getGame(serverid).isStarted()) {
					try {
						int roundSent = Integer.parseInt(request.getParameter("round").trim());
						// If the player exists and the request is being sent for the current round
						if (getGame(serverid).isPlayer(clientid)
								&& (getGame(serverid).getCurRound() == roundSent)) {
							String value = "Set " + (getGame(serverid).isFirstAllocationFinished() ? "2" : "1")
								+ ", Round " + getGame(serverid).getCurRound() + " Payoff Viewed";
							String weight = "3";
							getGame(serverid).getPlayer(clientid).setShownPayoff(getGame(serverid).getCurRound(), true);
							track(value, weight, p, getGame(serverid));
						}
					} catch (NumberFormatException nfe) {
						logger.info(nfe.getMessage(), nfe);
					}
				} else if (serverAction.equals("ViewIntro") && getGame(serverid).isStarted()) {
					try {
						if (getGame(serverid).isPlayer(clientid)) {
							String value = "Set " + (getGame(serverid).isFirstAllocationFinished() ? "2" : "1")
								+ ", Round 1 I'm ready";
							String weight = "3";
							getGame(serverid).getPlayer(clientid).setShownPartIntro(getGame(serverid).getCurSet(), true);
							track(value, weight, p, getGame(serverid));
						}
					} catch (NumberFormatException nfe) {
						logger.info(nfe.getMessage(), nfe);
					}
				} else if (serverAction.equals("Cooperate") && getGame(serverid).isStarted()) {
					try {
						if (request.getParameter("workerId") != null
								&& !request.getParameter("workerId").isEmpty()) {
							int roundSent = Integer.parseInt(request.getParameter("round").trim());

							// If the player exists and the request is being sent for the current round
							if (getGame(serverid).isPlayer(clientid) && (getGame(serverid).getCurRound() == roundSent)) {
								// Add the decision to the queue
								getGame(serverid).addMove(new CooperateMove(getGame(serverid).getPlayer(clientid), request.getParameter("workerId")));
								getGame(serverid).getPlayer(clientid).setDecidedCooperate(getGame(serverid).getCurRound(), true);
							}
						}
					} catch (NumberFormatException nfe) {
						logger.info(nfe.getMessage(), nfe);
					}
				} else if (serverAction.equals("DoNothing") && getGame(serverid).isStarted()) {
					try {
						if (request.getParameter("workerId") != null
								&& !request.getParameter("workerId").isEmpty()) {
							int roundSent = Integer.parseInt(request.getParameter("round").trim());

							// If the player exists and the request is being sent for the current round
							if (getGame(serverid).isPlayer(clientid) && (getGame(serverid).getCurRound() == roundSent)) {
								// Add the decision to the queue
								getGame(serverid).addMove(new DoNotCooperateMove(getGame(serverid).getPlayer(clientid), request.getParameter("workerId")));
								getGame(serverid).getPlayer(clientid).setDecidedCooperate(getGame(serverid).getCurRound(), true);
							}
						}
					} catch (NumberFormatException nfe) {
						logger.info(nfe.getMessage(), nfe);
					}
				} else if (serverAction.equals("SendFeedback")
						&& getGame(serverid).getStatus().equals(GameStatus.Status.FINISHED)) {
					String instr = request.getParameter("instr").trim();
					String inter = request.getParameter("inter").trim();
					String speed = request.getParameter("speed").trim();
					String strat = request.getParameter("strat").trim();
					String think = request.getParameter("think").trim();
					String log = "" + clientid;
					log += "\t" + instr;
					log += "\t" + inter;
					log += "\t" + speed;
					log += "\t" + strat;
					log += "\t" + think;
					pggService.addFeedback(getGame(serverid).getGid(), p.getId(),
							instr, inter, speed, strat, think);
					getGame(serverid).writeReport(log);
				} else if (serverAction.equals("Track")) {
					String value = request.getParameter("v").trim();
					String weight = request.getParameter("w").trim();
					track(value, weight, p, getGame(serverid));
				} else if (serverAction.equals("RobotName")) {
					String name = StringEscapeUtils.escapeHtml(request.getParameter("name").trim());
					if (name.matches("^[\\w\\d]+$")) {
						p.setRobotName(name);
					} else {
						throw new Exception();
					}
				}
			}

			getGame(serverid).getPlayer(clientid).checkIn(false);
			// Update the game state before returning data
			getGame(serverid).update();

			rData.clientInstructions = "UpdateGraph";
			rData.relationships = getGame(serverid).getRelationships(clientid);
			rData.gameStatus = getGame(serverid).getStatus();
			rData.roundPoe = "000";
			if (getGame(serverid).getPlayer(clientid).getStatus() == PlayerStatus.Status.DROPPED) {
				rData.gameStatus = GameStatus.Status.DROPPED;
				rData.reason = getGame(serverid).getPlayer(clientid).getDropReason();
			} else if (getGame(serverid).getStatus() == GameStatus.Status.ELICITATION_ROUND
					|| getGame(serverid).getStatus() == GameStatus.Status.TUTORIAL_ROUND) {
				rData.gameStatus = GameStatus.Status.WAITING_FOR_PLAYERS;
			} else if (getGame(serverid).getStatus() == GameStatus.Status.PAYOFF_ROUND) {
				rData.roundPoe = getGame(serverid).getRoundPoe();
			}

			rData.selectedGame = getGame(serverid).getName();
			rData.decidedCooperate = getGame(serverid).getPlayer(clientid).getDecidedCooperate(getGame(serverid).getCurRound());
			rData.shownPayoff = getGame(serverid).getPlayer(clientid).getShownPayoff(getGame(serverid).getCurRound());
			rData.round = getGame(serverid).getCurRound();
			rData.lastRound = getGame(serverid).getLastRound();
			rData.bonus = getGame(serverid).getPlayer(clientid).getCents();
			rData.doneElicitation = getGame(serverid).getPlayer(clientid).isDoneElicitation();
			rData.progress = getGame(serverid).getPlayer(clientid).getProgess();
			rData.firstBonus = getGame(serverid).getPlayer(clientid).getFirstSetCents();
			rData.secondBonus = getGame(serverid).getPlayer(clientid).getSecondSetCents();
			rData.thirdBonus = getGame(serverid).getPlayer(clientid).getThirdAllocationCents();
			rData.lastMove = getGame(serverid).getPlayer(clientid).getCooperation();
			rData.coc = getGame(serverid).getCostOfCooperation();
			rData.payOff = getGame(serverid).getPayoff();
			rData.doneTutorial = getGame(serverid).getPlayer(clientid).isDoneTutorial();
			rData.poe = getGame(serverid).getPoe();
			rData.exchangeRate = getGame(serverid).getExchangeRate();
			rData.firstAllocationFinished = getGame(serverid).isFirstAllocationFinished();
			rData.seedMoney = getGame(serverid).getSeedMoney();
			rData.eli = getGame(serverid).getEli();
			rData.minRound = getGame(serverid).getRoundsA();
			rData.robotName = getGame(serverid).getPlayer(clientid).getRobotName();
			rData.waitTime = getGame(serverid).getWaitTime();
		} catch(NumberFormatException nfe) {
			logger.info(nfe.getMessage(), nfe);
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		} catch (GeneralException e) {
			logger.error(e.getMessage(), e);
		}

		String json = gson.toJson(rData);
		return json;
	}


	private LiscovichGame getGame(String sid) throws JGenerousException {
		try {
			return games.get(sid);
		} catch (Exception e) {
			logger.info(e.getMessage(), e);
			throw new JGenerousException(JGenerousException.LogLevel.ALL, "Invalid game id provided to the server: " + sid);
		}
	}

	// A function for taking a UID string and returning whether the user
	// is a client or an admin
	private Privileges getPrivileges(String uid)
	{
		if (uid.equals("128")) {
			return Privileges.ADMIN;
		} else {
			return Privileges.CLIENT;
		}
	}

	@Override
	public void init() throws ServletException {
		super.init();
		gson = new Gson();
		games = new HashMap<String, LiscovichGame>();
		applicationContext = WebApplicationContextUtils
			.getWebApplicationContext(getServletContext());
		pggService = (PggService) applicationContext.getBean("pggService");
	}

	private void prepareServer(String sid, Properties p, String contextPath)
			throws JGenerousException {
		LiscovichGame game = new LiscovichGame(sid, p, pggService, contextPath);
		games.put(sid, game);
		gamesList.add(game);
	}

	public void removeGame(String gid) {
		if (games.containsKey(gid)) {
			gamesList.remove(games.get(gid));
			games.remove(gid);
		}
	}

	private void startServer(String sid) throws JGenerousException {
		getGame(sid).startGame();
	}

	private void stopServer(String sid) throws JGenerousException {
		getGame(sid).stopGame();
	}

	private void track(String value, String weight, Player p, LiscovichGame g) throws IOException {
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
		Date date = new Date();
		String timestamp = dateFormat.format(date);
		p.addClickLog(value, date.getTime());
		g.recordLog("Player Progress\t" + p.getId()
				+ "\t" + timestamp
				+ "\t" + value);
		g.addTracker(value, weight);
		// Check in with the server
		p.checkIn(true);
	}
}