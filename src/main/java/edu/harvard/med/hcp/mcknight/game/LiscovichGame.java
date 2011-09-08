package edu.harvard.med.hcp.mcknight.game;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.RandomAccessFile;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Random;
import java.util.Set;

import org.apache.log4j.Logger;

import edu.harvard.med.hcp.exception.GeneralException;
import edu.harvard.med.hcp.mcknight.game.GameStatus.Status;
import edu.harvard.med.hcp.mcknight.game.moves.CooperateMove;
import edu.harvard.med.hcp.mcknight.game.moves.DoNotCooperateMove;
import edu.harvard.med.hcp.mcknight.game.moves.PlayerMove;
import edu.harvard.med.hcp.mcknight.web.JGenerousException;
import edu.harvard.med.hcp.service.PggService;


/**
 * @author Mark McKnight
 * @version 1.0
 */
@SuppressWarnings("unused")
public class LiscovichGame {
	private static Logger logger = Logger.getLogger(LiscovichGame.class);
	// Unique identifier of this game
	private String gid;
	// Initial status of the game
	private GameStatus.Status status = GameStatus.Status.PREPARED;

	private boolean started = false;  // has the game been started
	private boolean realStarted = false;  // has the game been started and first player joined
	private int maxN; // maximum number of participants
	private int numHumanPlayers; // number of non-AI participants
	private int numAiPlayers; // number of non-AI participants
	private int costOfCooperation; // cost (per round) of cooperation in cents
	private int payOff; // payoff for yourself as well as your neighbors in cents
	private int seedMoney; // Amount of money, in cents, each player starts with
	private int playerTimeout; // Time, in sec. before idle players are dropped
	private int globalTimeout; // Time, in sec. players who don't complete tutorial and elicitation after this timeout will be dropped
	private int idleTimeout; // Time, in sec. players idle after timeout will be dropped
	private int[] minRoundsOption = new int[2]; // number of rounds to run experiment
	private double poe; // chance of game ending after each round
	private double exchangeRate; // dollars/point
	private int curRound = 1;
	private int curSet = 0;
	private String[] orderOptions = new String[2];// Max/Min/Rnd for set 1 and set 2
	private long gameStart = -1; // moment game start
	private long gameStop = -1; // moment game stop
	private LinkedList<PlayerMove> moveQueue; // store submitted player moves here and process them at the end of each round
	private ArrayList<String> log; // store player moves here for analysis
	private List<Player> players, validPlayers;
	private ArrayList<Edge> edges;
	private boolean dataWritten = false;
	private String eli;
	private int[] minOrder, maxOrder; // the order of players that have minRules, maxRules
	private boolean[] payoffCalculateds = new boolean[3];
	private Boolean finalLog = false;
	private Boolean payoffCalculated = false;
	private String[] payoffLogs = new String[3];
	private PggService pggService;
	private int[][] orders = new int[3][];
	private int[] currentOrder;
	private Thread dropThread, substituteThread, logThread;
	private List<String> reports = new ArrayList<String>();
	private Set<String> trackers = new HashSet<String>();
	private Map<String, Integer> trackersWeight = new HashMap<String, Integer>();
	private int lastRound = -1;
	private PrintWriter logStream, reportStream;
	private File logFile, reportFile;
	private String contextPath;
	private String logUrl, reportUrl;
	private boolean timeoutIgnored = false;
	private boolean globalTimeoutProcessed = false;
	private int waitTime = -1; // the time to wait before the game start.
	private long roundStart = -1;
	private boolean regular = true;
	private String[][] probs = new String[2][]; // the end chances of set 1 and set 2. These chances from admin page - client side.
	private boolean fixed; // true: the number of rounds are entered by the admin; false: sampling using the probability of end
	private long set2Start = -1;

	public LiscovichGame(String id, Properties p, PggService pggService,
			String contextPath) {
		this.contextPath = contextPath;
		this.pggService = pggService;
		gid = id;
		numAiPlayers = Integer.parseInt(p.getProperty("numAiPlayers"));
		numHumanPlayers = Integer.parseInt(p.getProperty("numHumanPlayers"));
		maxN = (numAiPlayers + numHumanPlayers);
		costOfCooperation = Integer.parseInt(p.getProperty("costOfCooperation"));
		payOff = Integer.parseInt(p.getProperty("payOff"));
		seedMoney = Integer.parseInt(p.getProperty("seedMoney"));
		minRoundsOption[0] = Integer.parseInt(p.getProperty("roundsA"));
		minRoundsOption[1] = Integer.parseInt(p.getProperty("roundsB"));
		playerTimeout = Integer.parseInt(p.getProperty("playerTimeout"));
		globalTimeout = Integer.parseInt(p.getProperty("globalTimeout"));
		idleTimeout = Integer.parseInt(p.getProperty("idleTimeout"));
		poe = Double.parseDouble(p.getProperty("poe"));
		exchangeRate = Double.parseDouble(p.getProperty("exchangeRate"));
		eli = p.getProperty("eli");
		if (eli.equals("Yes")) {
			orderOptions[0] = p.getProperty("orderA");
			orderOptions[1] = p.getProperty("orderB");
		} else {
			orderOptions[0] = "Rnd";
			orderOptions[1] = "Rnd";
		}
		players = new ArrayList<Player>(); // The players in this game.  Use player.getId() to get their ID, the INDEX DOES NOT EQUAL THEIR ID.
		moveQueue = new LinkedList<PlayerMove>(); // Moves are stored here until the end of the round and then moved to the moveRecord as they are processed.
		log = new ArrayList<String>(); // Moves are stored here permenantly for analysis
		fixed = p.getProperty("fixed").equals("true");
		for (int j = 0; j < 2; j++) {
			probs[j] = new String[minRoundsOption[j]];
			Random random = new Random();
			int endChance = (int) Math.round(poe * 1000);
			int contChance = 1000 - endChance;
			for (int i = 0; i < minRoundsOption[j] - 1; i++) {
				int prob = random.nextInt(contChance) + endChance;
				probs[j][i] = "" + prob;
			}
			probs[j][minRoundsOption[j] - 1] = "" + random.nextInt((int) Math.round(poe * 1000));
			for (int i = 0; i < minRoundsOption[j]; i++) {
				while (probs[j][i].length() < 3) {
					probs[j][i] = "0" + probs[j][i];
				}
			}
		}

		// add the human players
		for (int i=0; i < numHumanPlayers; i++) {
			players.add(new Player(i + 1, "Player " + (i+1), 0, seedMoney, this));
		}

		//add the remaining ai players
		for (int i = numHumanPlayers; i < maxN; i++) {
			players.add(new Player(i + 1, "AI " + (i+1), 1, seedMoney, this));
		}

		dropThread = new Thread() {
			@Override
			public void run() {
				// only drop people when there is no one dropped because of global timeout
				// this mean after global timeout, there is no more people to be dropped.
				while(!globalTimeoutProcessed) {
					synchronized (status) {
						// only drop people before the game ring formed
						if (status == Status.WAITING_FOR_PLAYERS
								|| status == Status.ELICITATION_ROUND
								|| status == Status.PREPARED
								|| status == Status.TUTORIAL_ROUND) {
							calculateWaitTime();
							Date curDate = new Date();
							long curTime = curDate.getTime();
								if (getElapseTime() > globalTimeout) {
									globalTimeoutProcessed = true;
									for (Player p : players) {
										if ((eli.equals("Yes") && !p.isDoneElicitation())
												|| !p.isDoneTutorial()
												|| !p.getShownPartIntro(0)) {
											if (p.getStatus() != PlayerStatus.Status.DROPPED) {
												p.drop("Cannot complete Tutorial/Elicitation before global timeout " + globalTimeout + " seconds.",
														"<p>Error: you have exceeded the game timeout. Unfortunately " +
														"the game will have to proceed without you.</p>" +
														"<p> Please contact us at <a href='mailto:mturkgroup@gmail.com'>mturkgroup@gmail.com</a> " +
														"if you think that this message is incorrect.</p>");
											}
										}
									}
								} else if (!timeoutIgnored) {
									for (Player p : players) {
										if (p.getStartTime() != null) {
											if ((eli.equals("Yes") && !p.isDoneElicitation())
													|| !p.isDoneTutorial()
													|| !p.getShownPartIntro(0)) {
												if ((curTime - p.getStartTime().getTime()) > (playerTimeout * 1000)) {
													if (p.getStatus() != PlayerStatus.Status.INACTIVE
															&& p.getStatus() != PlayerStatus.Status.DROPPED) {
														p.drop("Cannot complete Tutorial/Elicitation before player timeout " + playerTimeout + " seconds.",
																"<p>Error: you have exceeded the game timeout. Unfortunately " +
																"the game will have to proceed without you.</p>" +
																"<p> Please contact us at <a href='mailto:mturkgroup@gmail.com'>mturkgroup@gmail.com</a> " +
																"if you think that this message is incorrect.</p>");
													}
												}
											}
										}
									}
								}
								for (Player p : players) {
									if ((eli.equals("Yes") && !p.isDoneElicitation()) || !p.isDoneTutorial()) {
										if (p.getIdleTime() > idleTimeout) {
											p.drop("Dropped because player is idle more than " + idleTimeout + " seconds.",
													"<p>Error: you have exceeded the game timeout. Unfortunately " +
													"the game will have to proceed without you.</p>" +
													"<p> Please contact us at <a href='mailto:mturkgroup@gmail.com'>mturkgroup@gmail.com</a> " +
													"if you think that this message is incorrect.</p>");
										}
									}
								}
						} else {
							break;
						}
					}
					try {
						sleep(2000);
					} catch (Exception e) {
						logger.error(e.getMessage(), e);
					}
				}
			};
		};
		try {
			final Properties properties = new Properties();
			properties.load(this.getClass().getResourceAsStream("/config.properties"));
			String logReportPath = (String) properties.get("logReportPath");
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
			Date date = new Date();
			String timestamp = dateFormat.format(date);
			logFile = new File(logReportPath + contextPath + "/" + timestamp + "_" + id + "_log.txt");
			logFile.getParentFile().mkdirs();
			logUrl = "/data" + contextPath + "/" + timestamp + "_" + id + "_log.txt";
			logStream = new PrintWriter(new BufferedOutputStream(
					new FileOutputStream(logFile)));
			reportFile = new File(logReportPath + contextPath + "/" + timestamp + "_" + id + "_report.txt");
			reportUrl = "/data" + contextPath + "/" + timestamp + "_" + id + "_report.txt";
			reportStream = new PrintWriter(new BufferedOutputStream(new FileOutputStream(reportFile)));
			writeReport(toString());
			logThread = new Thread() {
				@Override
				public void run() {
					String cpuLogPath = (String) properties.get("cpuLogPath");
					String bandWidthLog = (String) properties.get("bandWidthLog");
					File file = new File(cpuLogPath);
					RandomAccessFile inFile = null;
					try {
						if (file.exists()) {
							inFile = new RandomAccessFile(file, "r");
						}
						while (status != GameStatus.Status.CANCELLED
								&& status != GameStatus.Status.FINISHED
								&& status != GameStatus.Status.NOT_ENOUGH_PLAYER) {
							if (inFile != null) {
								byte[] buffer1 = new byte[100];
								inFile.seek(0);
								int count = inFile.read(buffer1);
								String line = new String(buffer1, 0, count);
								if (line != null) {
									writeLog("CPU usage (1m, 5m, 15m, Running Processes, Total Processes: " + line);
								}

								byte[] buffer2 = new byte[1000];
								Process exec = Runtime.getRuntime().exec(bandWidthLog);
								InputStream inputStream = exec.getInputStream();
								count = inputStream.read(buffer2);
								String log = "";
								while (count != -1) {
									log = log + new String(buffer2, 0, count);
									count = inputStream.read(buffer2);
								}
								if (!log.isEmpty()) {
									writeLog("Bandwidth usage: " + log);
								}
							}
							try {
								sleep(2000);
							} catch (Exception e) {
								logger.error(e.getMessage(), e);
							}
						}
					} catch (IOException e) {
						logger.error(e.getMessage(), e);
					}
				};
			};
			pggService.createGame(this);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
	}
	public void addMove(PlayerMove m) {
		// Add a player move to be executed
		moveQueue.add(m);
	}
	public void addTracker(String tracker, String weight) {
		trackers.add(tracker);
		trackersWeight.put(tracker, Integer.valueOf(weight));
	}
	private void calculateMaxTotalPayoff() throws IOException, GeneralException {
		if (!payoffCalculateds[curSet]) {
			int[] rules = new int[validPlayers.size()];
			int[] order = new int[validPlayers.size()];
			int[] firstMoves = new int[validPlayers.size()];
			Collections.sort(validPlayers, new Comparator<Player>() {
				@Override
				public int compare(Player o1, Player o2) {
					if (o1.getRule() < o2.getRule()) {
						return -1;
					} else if (o1.getRule() > o2.getRule()) {
						return 1;
					} else {
						return 0;
					}
				}
			});
			for (int i = 0; i < validPlayers.size(); i++) {
				rules[i] = validPlayers.get(i).getRule();
				if (rules[i] == -1) {
					rules[i] = 0;
				}
				order[i] = i;
				firstMoves[i] = validPlayers.get(i).getEliFirstMove();
				if (firstMoves[i] == -1) {
					firstMoves[i] = 0;
				}
			}

			PermutationGenerator x = new PermutationGenerator(rules);
			maxOrder = new int[rules.length];
			double max = 0; // highest number of cooperations
			while (x.hasMore()) {
				int[] nextOrder = x.getNext();
				int count = countNumberOfCooperation(nextOrder, minRoundsOption[curSet]);
				if (count > max) {
					System.arraycopy(nextOrder, 0, maxOrder, 0, rules.length);
					max = count;
				}
			}
			payoffCalculateds[curSet] = true;

			String result = logStrategy(minRoundsOption[curSet], maxOrder,
					"Max payoff simulation " + (curSet + 1), "Max");
			payoffLogs[curSet] = result;
			writeReport(payoffLogs[curSet]);
		}
	}
	private void calculateMinTotalPayoff() throws IOException, GeneralException {
		if (!payoffCalculateds[curSet]) {
			int[] rules = new int[validPlayers.size()];
			int[] order = new int[validPlayers.size()];
			int[] firstMoves = new int[validPlayers.size()];
			Collections.sort(validPlayers, new Comparator<Player>() {
				@Override
				public int compare(Player o1, Player o2) {
					if (o1.getRule() < o2.getRule()) {
						return -1;
					} else if (o1.getRule() > o2.getRule()) {
						return 1;
					} else {
						return 0;
					}
				}
			});
			for (int i = 0; i < validPlayers.size(); i++) {
				rules[i] = validPlayers.get(i).getRule();
				if (rules[i] == -1) {
					rules[i] = 0;
				}
				order[i] = i;
				firstMoves[i] = validPlayers.get(i).getEliFirstMove();
				if (firstMoves[i] == -1) {
					firstMoves[i] = 0;
				}
			}

			PermutationGenerator x = new PermutationGenerator(rules);
			minOrder = new int[rules.length];
			double min = Double.MAX_VALUE; // lowest number of cooperations
			while (x.hasMore()) {
				int[] nextOrder = x.getNext();
				int count = countNumberOfCooperation(nextOrder, minRoundsOption[curSet]);
				if (count < min) {
					System.arraycopy(nextOrder, 0, minOrder, 0, rules.length);
					min = count;
				}
			}
			payoffCalculateds[curSet] = true;

			String result = logStrategy(minRoundsOption[curSet], minOrder,
					"Min payoff simulation " + (curSet + 1), "Min");
			payoffLogs[curSet] = result;
			writeReport(payoffLogs[curSet]);
		}
	}
	public void calculatePayoff() {
		synchronized (payoffCalculated) {
			if (payoffCalculated.equals(Boolean.FALSE)) {
				for (int i = 0; i < validPlayers.size(); i++) {
					Player curPlayer = validPlayers.get(i);
					int netChange = 0;
					if (curPlayer.getCooperation() == 1) { // If you cooperate, you pay the fixed cost of cooperation
						netChange -= getCostOfCooperation();
						// but you also net the payoff
						netChange += getPayoff();
					}

					for (Player n : curPlayer.getNeighbors()) {// For every neighbor, if they cooperated add the payoff
						if (n.getCooperation() == 1)
						{
							netChange += getPayoff();
						}
					}
					curPlayer.setCents(curPlayer.getCents() + netChange);
				}
			}
			payoffCalculated = true;
		}
	}
	private void calculateRandomPayoff() throws IOException, GeneralException {
		if (!payoffCalculateds[2]) {
			int[] rules = new int[validPlayers.size()];
			int[] order = randomOrder();
			int[] firstMoves = new int[validPlayers.size()];
			for (int i = 0; i < validPlayers.size(); i++) {
				rules[i] = validPlayers.get(i).getRule();
				if (rules[i] == -1) {
					rules[i] = 0;
				}
				order[i] = i;
				firstMoves[i] = validPlayers.get(i).getEliFirstMove();
				if (firstMoves[i] == -1) {
					firstMoves[i] = 0;
				}
			}

			List<int[]> log = new ArrayList<int[]>();
			log.add(firstMoves);
			// use first min round for this simulation
			for (int i = 1; i < minRoundsOption[0]; i++) {
				int[] input = log.get(log.size() - 1); // the last entry from the
														// array
				int[] output = new int[validPlayers.size()];
				int[] inputForPlayer = new int[3];
				for (int j = 0; j < validPlayers.size(); j++) {
					inputForPlayer[0] = input[(j - 1 + validPlayers.size()) % validPlayers.size()];
					inputForPlayer[1] = input[j];
					inputForPlayer[2] = input[(j + 1) % validPlayers.size()];
					int index = inputForPlayer[0] * 4 + inputForPlayer[1] * 2
							+ inputForPlayer[2];
					int outputForPlayer = (1 << index) & rules[j];
					if (outputForPlayer > 0) {
						output[j] = 1;
					}

					Player player = validPlayers.get(j);
					int cents = player.getCents();
					cents += (inputForPlayer[0] + inputForPlayer[1] + inputForPlayer[2]) * payOff;
					cents -= inputForPlayer[1] * costOfCooperation;
					player.setCents(cents);
				}
				log.add(output);
			}

			int[] input = log.get(log.size() - 1); // the last entry from the array
			int[] inputForPlayer = new int[3];
			for (int j = 0; j < validPlayers.size(); j++) {
				inputForPlayer[0] = input[(j - 1 + validPlayers.size()) % validPlayers.size()];
				inputForPlayer[1] = input[j];
				inputForPlayer[2] = input[(j + 1) % validPlayers.size()];

				Player player = validPlayers.get(j);
				int cents = player.getCents();
				cents += (inputForPlayer[0] + inputForPlayer[1] + inputForPlayer[2]) * payOff;
				cents -= inputForPlayer[1] * costOfCooperation;
				player.setCents(cents);
				player.setThirdAllocationCents(player.getCents());
			}

			// use first min round for this simulation
			String result = logStrategy(minRoundsOption[0], order,
					"Random order simulation", "Rnd");
			writeLog(result);
			writeReport(result);
			payoffLogs[2] = result;
			payoffCalculateds[2] = true;
		}
	}
	private void calculateWaitTime() {
		long curTime = new Date().getTime();
		int globalElapseTime = getElapseTime();
		if (curSet == 0) {
			waitTime = globalTimeout - globalElapseTime;
			if (!timeoutIgnored) {
				long max = -1;
				boolean allStarted = true;
				for (Player player : players) {
					// get the player who are not ready to play game
					if (player.getStatus() != PlayerStatus.Status.DROPPED
							&& (!player.isDoneTutorial()
								|| (eli.equals("Yes") && !player.isDoneElicitation()))) {
						if (player.getStartTime() == null) {
							allStarted = false;
						} else {
							if (max < player.getStartTime().getTime()) {
								max = player.getStartTime().getTime();
							}
						}
					}
				}
				if (allStarted) { // if all players started
					int playerElapseTime = (int) ((curTime - max) / 1000);
					int playerWaitTime = playerTimeout - playerElapseTime;
					if (playerWaitTime < waitTime) {
						waitTime = playerWaitTime;
					}
				}
			}
		} else {
			int setElapseTime = (int) (new Date().getTime() - set2Start);
			waitTime = idleTimeout - (setElapseTime / 1000);
		}
		if (waitTime < 0) {
			waitTime = 0;
		}
	}

	public void cancelGame() throws IOException, GeneralException {
		writeLog("Game cancelled");
		createReport();
		synchronized (status) {
			this.status = Status.CANCELLED;
			globalTimeoutProcessed = true;
		}
		if (! dataWritten)  // Only write the data once, not when every player checks in.
		{
			writeToDisk();
		}
	}

	private int countNumberOfCooperation(int[] order, int minRounds) {
		int result = 0;

		/**
		 * The first round behave, we assume on the first round, all players
		 * don't cooperate
		 */
		List<int[]> log = new ArrayList<int[]>();
		int[] firstMoves = new int[order.length];
		for (int i = 0; i < order.length; i++) {
			if (validPlayers.get(order[i]).getEliFirstMove() > 0) {
				result++;
			}
			firstMoves[i] = validPlayers.get(order[i]).getEliFirstMove();
		}
		log.add(firstMoves);

		for (int i = 1; i < minRounds; i++) {
			int[] input = log.get(log.size() - 1); // the last entry from the
													// array
			int[] output = new int[order.length];
			int[] inputForPlayer = new int[3];
			for (int j = 0; j < order.length; j++) {
				inputForPlayer[0] = input[(j - 1 + order.length) % order.length];
				inputForPlayer[1] = input[j];
				inputForPlayer[2] = input[(j + 1) % order.length];
				int index = inputForPlayer[0] * 4 + inputForPlayer[1] * 2
						+ inputForPlayer[2];
				int outputForPlayer = (1 << index) & validPlayers.get(order[j]).getRule();
				if (outputForPlayer > 0) {
					output[j] = 1;
					result++;
				}
			}
			log.add(output);
		}
		return result;
	}

	private void createReport() throws IOException, GeneralException {
		String report = "\nPlayers track report:\n\t";
		for (Player player : players) {
			report = report + player.getId() + "\t";
		}
		report += "\n";

		List<String> sortedList = new ArrayList<String>();
		sortedList.addAll(trackers);
		Collections.sort(sortedList, new Comparator<String>() {
			@Override
			public int compare(String o1, String o2) {
				if (trackersWeight.get(o1) == trackersWeight.get(o2)) {
					return o1.compareTo(o2);
				} else {
					if (trackersWeight.get(o1) != null
							&& trackersWeight.get(o2) != null) {
						return trackersWeight.get(o1) - trackersWeight.get(o2);
					} else {
						return 0;
					}
				}
			}
		});

		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
		for (String tracker : sortedList) {
			report = report + tracker  + "\t";
			for (Player player : players) {
				if (player.getClickLog(tracker) == 0L) {
					report = report + "\t";
				} else {
					report = report + dateFormat.format(new Date(player.getClickLog(tracker))) + "\t";
				}
			}
			report += "\n";
		}
		writeReport(report);
		pggService.saveTracks(gid, players, trackers, trackersWeight);

		writeReport("Feedback from players:\n" +
				"Player ID\t" +
				"Instruction (1:Not at all; 5-Very clear)\t" +
				"Interesting (1:Not at all; 5-Very interesting)\t" +
				"Speed (1-Too slow; 5-Too fast)\t" +
				"Strategy\t" +
				"Thoughts");
	}

	public void dropPlayer(Player p) throws IOException {
		// If they haven't already been dropped
		if (p.getStatus() != PlayerStatus.Status.DROPPED) {
			p.drop("Dropped manually by admin.",
					"<p>Error: you have exceeded the game timeout. Unfortunately " +
					"the game will have to proceed without you.</p>" +
					"<p> Please contact us at <a href='mailto:mturkgroup@gmail.com'>mturkgroup@gmail.com</a> " +
					"if you think that this message is incorrect.</p>");
		}
	}

	private synchronized void finish() throws IOException, GeneralException {
		if (!finalLog) {
			logMove();
			for (Player player : validPlayers) {
				player.clearStatusB();
			}
			if (eli.equals("Yes")) {
				//calculateRandomPayoff();
			}

			String move = "\nPlayers earning:\nPlayer ID\tSet 1\tSet 2\t"
					+ "Random Order Simulate\tTotal\tEarned Money\t"
					+ "Turker ID\tIP address";
			List<Player> sorted = new ArrayList<Player>();
			Collections.sort(validPlayers, new Comparator<Player>() {
				@Override
				public int compare(Player o1, Player o2) {
					return o1.getId() - o2.getId();
				}
			});
			for (Player player : validPlayers) {
				move += "\n" + player.getId() + "\t" + player.getFirstSetCents();
				move += "\t" + player.getSecondSetCents();
				int total = player.getFirstSetCents() + player.getSecondSetCents();
				if (eli.equals("Yes")) {
					move += "\t" + player.getThirdAllocationCents();
					total += player.getThirdAllocationCents();
				}
				move += "\t" + total;
				move += "\t" + (total * exchangeRate);
				move += "\t" + player.getTurkerId();
				move += "\t" + player.getIp();
			}
			pggService.savePlayerEarning(validPlayers, gid, exchangeRate,
					eli.equals("Yes"));
			writeReport(move);
			createReport();
			synchronized (status) {
				this.status = Status.FINISHED;
				globalTimeoutProcessed = true;
			}
			finalLog = true;
		}
	}

	// Utility methods
	public int getActivePlayers() {
		int activePlayers = 0;

		for (Player p : players) {
			if (p.isActive()) {
				activePlayers++;
			}
		}

		return activePlayers;
	}

	public double getConnected() {
		return 0.0;
	}

	public int[][] getConnections() {
		if (edges == null) {
			return null;
		}
		ArrayList<Player[]> connectedPlayers = new ArrayList<Player[]>();
		for (Edge e : edges) {
			if (e.isConnected()) {
				connectedPlayers.add(e.getPlayers());
			}
		}
		int[][] returnArray = new int[connectedPlayers.size()][2];
		for (int i = 0; i < connectedPlayers.size(); i++) {
			Player[] curPlayers = connectedPlayers.get(i);
			returnArray[i][0] = curPlayers[0].getId();
			returnArray[i][1] = curPlayers[1].getId();
		}
		return returnArray;
	}

	public Map<Integer, Integer> getCooperating() {
		if (validPlayers != null) {
			Map<Integer, Integer> cooperating = new HashMap<Integer, Integer>();
			for (int i = 0; i < players.size(); i++) {
				cooperating.put(players.get(i).getId(), players.get(i)
						.getCooperation());
			}
			return cooperating;
		} else {
			return null;
		}
	}

	public int getCostOfCooperation() {
		return costOfCooperation;
	}

	public int getCurRound() {
		return curRound;
	}

	public int getCurSet() {
		return curSet;
	}

	public int getElapseTime() {
		if (gameStart == -1) {
			return 0;
		} else {
			if (gameStop == -1) {
				long curTime = new Date().getTime();
				return (int) ((curTime - gameStart) / 1000);
			} else {
				return (int) ((gameStop - gameStart) / 1000);
			}
		}
	}

	public String getEli() {
		return eli;
	}

	public double getExchangeRate() {
		return exchangeRate;
	}

	public long getGameStart() {
		return gameStart;
	}

	public GameStatus getGameStatus() {
		GameStatus gs = new GameStatus();
		gs.id = gid;
		gs.type = getName();
		gs.numPlayers = numHumanPlayers;
		gs.numAIPlayers = numAiPlayers;
		gs.costOfCooperation = getCostOfCooperation();
		gs.payOff = getPayoff();
		gs.seedMoney = getSeedMoney();
		gs.numRoundsA = getRoundsA();
		gs.numRoundsB = getRoundsB();
		gs.curRound = getCurRound();
		gs.poe = poe;
		gs.globalTimeout = globalTimeout;
		gs.playerTimeout = getPlayerTimeout();
		gs.idleTimeout = idleTimeout;
		gs.orderA = orderOptions[0];
		gs.orderB = orderOptions[1];
		gs.eli = eli;
		gs.exchangeRate = exchangeRate;
		gs.elapseTime = getElapseTime();
		gs.roundElapseTime = getRoundElapseTime();
		gs.regular = regular;
		gs.fixed = fixed;
		Status status = getStatus();
		if (status == Status.PART_INTRO) {
			gs.status = "Set " + (curSet + 1) + ", Part Intro";
		} else if (status == Status.COOPERATION_ROUND_A
				|| status == Status.COOPERATION_ROUND_B
				|| status == Status.PAYOFF_ROUND) {
			gs.status = "Set " + (curSet + 1)
				+ ", Round " + (curRound);
			if (status == Status.COOPERATION_ROUND_A
				|| status == Status.COOPERATION_ROUND_B) {
				gs.status += ", Cooperation";
			} else {
				gs.status += ", Payoff";
			}
		} else {
			gs.status = status.toString();
		}
		gs.timeoutIgnored = timeoutIgnored;
		return gs;
	}

	public long getGameStop() {
		return gameStop;
	}

	public String getGid() {
		return gid;
	}

	public int getGlobalTimeout() {
		return globalTimeout;
	}

	public int getIdleTimeout() {
		return idleTimeout;
	}

	public int getLastRound() {
		return lastRound;
	}

	public List<String> getLog() {
		return log;
	}

	public String getLogUrl() {
		return logUrl;
	}

	public String getMaxPayoffOutput() {
		if (payoffLogs[curSet] == null) {
			return "";
		}
		return payoffLogs[curSet];
	}

	public String getMinPayoffOutput() {
		if (payoffLogs[curSet] == null) {
			return "";
		}
		return payoffLogs[curSet];
	}

	public LinkedList<PlayerMove> getMoveQueue()
	{
		return moveQueue;
	}

	public String getName()
	{
		return "Liscovich Game";
	}

	public int getNumAiPlayers() {
		return numAiPlayers;
	}

	public int getNumHumanPlayers() {
		return numHumanPlayers;
	}

	public int getNumPlayers()
	{
		return players.size();
	}

	public String getOrderA() {
		return orderOptions[0];
	}

	public String getOrderB() {
		return orderOptions[1];
	}

	public String[] getOrderOptions() {
		return orderOptions;
	}

	public int getPayoff() {
		return payOff;
	}

	public Player getPlayer(int id) throws JGenerousException {
		// Because the index is not equal to their ID let's loop through and
		// find the player with the specified id
		Player returnPlayer = null;

		for (Player p : players) {
			if (p.getId() == id) {
				returnPlayer = p;
			}
		}

		// We didn't find a player with that ID, throw an exception
		if (returnPlayer == null) {
			throw new JGenerousException(JGenerousException.LogLevel.ALL,
					"getPlayer method was called with an invalid id parameter.");
		}

		// We found a player, return it.
		return returnPlayer;
	}

	public List<Player> getPlayers() {
		return players;
	}

	public int getPlayerTimeout() {
		return playerTimeout;
	}

	public double getPoe() {
		return poe;
	}

	public String getRandomOutput() {
		if (payoffLogs[2] == null) {
			return "";
		}
		return payoffLogs[2];
	}

	public Relationship[] getRelationships(int playerId) throws JGenerousException {
		// Create empty array to return if the ID is invalid.
		Relationship[] returnArray = new Relationship[0];

		if (isPlayer(playerId)) {
			// get the player by integer id
			Player curPlayer = getPlayer(playerId);
			// get all neighbors
			ArrayList<Player> neighbors = curPlayer.getNeighbors();
			// create our array of relationships
			returnArray = new Relationship[neighbors.size()];
			for (int i = 0; i < neighbors.size(); i ++) {
				returnArray[i] = new Relationship();
				returnArray[i].id = neighbors.get(i).getId();
				returnArray[i].lastDecision = neighbors.get(i).getLastMove();  // 1 for cooperated, 0 for didn't cooperate
				returnArray[i].connected = (neighbors.contains(neighbors.get(i)));
			}
		}

		return returnArray;
	}

	public List<String> getReport() {
		return reports;
	}

	public String getReportUrl() {
		return reportUrl;
	}

	public int getRoundElapseTime() {
		if (roundStart == -1) {
			return 0;
		} else {
			if (gameStop == -1) {
				long curTime = new Date().getTime();
				return (int) ((curTime - roundStart) / 1000);
			} else {
				return (int) ((gameStop - roundStart) / 1000);
			}
		}
	}

	public String getRoundPoe() {
		if (curRound - 1 < minRoundsOption[curSet]) {
			return probs[curSet][curRound - 1];
		} else {
			return "000";
		}
	}

	public int getRoundsA() {
		return minRoundsOption[0];
	}

	public int getRoundsB() {
		return minRoundsOption[1];

	}

	public int getSeedMoney() {
		return seedMoney;
	}

	public Status getStatus() {
		Status result;
		if (!started && status != Status.CANCELLED) {
			result = Status.STOPPED;
		} else {
			result = status;
		}
		return result;
	}

	public Set<String> getTrackers() {
		return trackers;
	}

	public int getWaitTime() {
		return waitTime;
	}

	public boolean isFirstAllocationFinished() {
		return curSet > 0;
	}

	public boolean isFixed() {
		return fixed;
	}

	public boolean isPlayer(int id) {
		// Returns if there is a player with the specified ID.
		boolean returnAnswer = false;
		for (Player p : players) {
			if (p.getId() == id) {
				returnAnswer = true;
			}
		}
		return returnAnswer;
	}

	public boolean isRealStarted() {
		return realStarted;
	}

	public boolean isRegular() {
		return regular;
	}

	public boolean isStarted() {
		return started;
	}

	public boolean isTimeoutIgnored() {
		return timeoutIgnored;
	}

	private void logMove() throws IOException, GeneralException {
		int count = 0;
		String playerOrder = "";
		String result = "\nAllocation " + (curSet + 1) + " log: \n";
		for (int i = 0; i < validPlayers.size(); i++) {
			result += validPlayers.get(orders[curSet][i]).getId();
			result += "\t";
			playerOrder += validPlayers.get(orders[curSet][i]).getId() + " ";
		}
		result += "\n";
		List<int[]> log = new ArrayList<int[]>();
		for (int i = 1; i <= curRound; i++) {
			int[] moves = new int[validPlayers.size()];
			for (int j = 0; j < validPlayers.size(); j++) {
				Player p = validPlayers.get(orders[curSet][j]);
				Integer decision = p.getHistory().get(i);
				if (decision.intValue() == 1) {
					count++;
				}
				result += decision;
				moves[j] = decision;
				if (p.getAi() == 0) {
					if (p.getDecisionMaker().get(i).startsWith("cnt")) {
						result += " Admin";
					} else if (!p.getDecisionMaker().get(i).equals(p.getTurkerId())) {
						result += " " + p.getDecisionMaker().get(i);
					}
				}
				result += "\t";
			}
			log.add(moves);
			result += "\n";
		}
		result += "Number of cooperate: " + count;
		pggService.savePart(this, "Allocation " + (curSet + 1), count,
				orderOptions[curSet], playerOrder, validPlayers, log, orders[curSet], false);
		writeReport(result);
	}

	private String logStrategy(int minRounds, int[] order, String name,
			String partOrder) throws GeneralException {
		String result = "\n" + name + ": \n";
		for (int i = 0; i < validPlayers.size(); i++) {
			Player player = validPlayers.get(order[i]);
			result += player.getId();
			result += "\t";
		}
		result += "\n";

		int count = 0;
		List<int[]> log = new ArrayList<int[]>();
		int[] firstMoves = new int[order.length];
		String playerOrder = "";
		for (int i = 0; i < order.length; i++) {
			if (validPlayers.get(order[i]).getEliFirstMove() > 0) {
				count++;
			}
			firstMoves[i] = validPlayers.get(order[i]).getEliFirstMove();
			playerOrder += validPlayers.get(order[i]).getId() + " ";
		}
		log.add(firstMoves);

		for (int i = 1; i < minRounds; i++) {
			int[] input = log.get(log.size() - 1); // the last entry from the
													// array
			int[] output = new int[order.length];
			int[] inputForPlayer = new int[3];
			for (int j = 0; j < order.length; j++) {
				inputForPlayer[0] = input[(j - 1 + order.length) % order.length];
				inputForPlayer[1] = input[j];
				inputForPlayer[2] = input[(j + 1) % order.length];
				int index = inputForPlayer[0] * 4 + inputForPlayer[1] * 2
						+ inputForPlayer[2];
				int outputForPlayer = (1 << index) & validPlayers.get(order[j]).getRule();
				if (outputForPlayer > 0) {
					output[j] = 1;
					count++;
				}
			}
			log.add(output);
		}

		for (int[] is : log) {
			for (int i = 0; i < is.length; i++) {
				result += is[i];
				result += "\t";
			}
			result += "\n";
		}
		result += "Number of cooperate: " + count;

		pggService.savePart(this, name,
				count, partOrder, playerOrder, validPlayers, log, order, true);

		return result;
	}

	private void newSet(){
		try {
			String move;
			if (orderOptions[curSet].equals("Max")) {
				calculateMaxTotalPayoff();
				reorder(maxOrder);
				move = "\nStart allocation with max payoff order: ";
			} else if (orderOptions[curSet].equals("Min")) {
				calculateMinTotalPayoff();
				reorder(minOrder);
				move = "\nStart allocation with min payoff order: ";
			} else {
				reorder(null);
				move = "\nStart allocation with random order: ";
			}
			orders[curSet] = currentOrder;
			for (int i = 0; i < validPlayers.size(); i++) {
				move += validPlayers.get(currentOrder[i]).getId() + " ";
			}
			writeLog(move);
			curRound = 1;
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
	}

	private boolean playersDoneCooperation() {
		for (Player p : players) {
			// Have all non-dropped human players decided wherther or not to
			// cooperate?
			if (p.getStatus() != PlayerStatus.Status.DROPPED && p.getAi() == 0
					&& !p.getDecidedCooperate(curRound)) {
				// if they haven't decided whether to cooperate or not
				return false;
			}
		}
		return true;
	}

	public boolean playersDoneTutorial() {
		for (Player p : players) {
			if (p.isActive() && !p.isDoneTutorial()) {
				return false;
			}
		}
		return true;
	}

	// If any player is INACTIVE and hasn't been DROPPED
	public boolean playersReady() {
		for (Player p : players) {
			if (p.getStatus() == PlayerStatus.Status.INACTIVE) {
				return false;
			}
		}
		return true;
	}

	private boolean playersReadyToPlay() {
		for (Player p : players) {
			if (p.isActive() && !p.isDoneTutorial()) {
				return false;
			}
			if (eli.equals("Yes")) {
				if (p.isActive() && !p.isDoneElicitation()) {
					return false;
				}
			}
		}
		return true;
	}

	private boolean playersSawPartIntro() {
		for (Player p : players) {
			if (p.isActive() && !p.getShownPartIntro(curSet)) {
				return false;
			}
		}
		return true;
	}

	private boolean playersShownPayoff() {
		for (Player p : players) {
			// Have all human players decided wherther or not to cooperate?
			// if they haven't decided whether to cooperate or not
			if (p.getStatus() != PlayerStatus.Status.DROPPED && p.getAi() == 0
					&& !p.getShownPayoff(curRound)) {
				return false;
			}
		}
		return true;
	}

	public void playRound()
	{
		// every player must decide whether to cooperate or not
		for (int i = 0; i < validPlayers.size(); i++)
		{
			validPlayers.get(i).considerCooperation();
		}
	}
	private int[] randomOrder() {
		int[] order = new int[validPlayers.size()];
		Random rnd = new Random();
		for (int i = 0; i < order.length; i++) {
			order[i] = i;
		}
		for (int i = order.length; i > 1; i--) {
			int swap = rnd.nextInt(i);
			int temp = order[i - 1];
			order[i - 1] = order[swap];
			order[swap] = temp;
		}
		return order;
	}

	public void recordLog(String m) throws IOException {
		// Add a player move for analysis
		writeLog(m);
	}

	private void removeDroppedPlayers() {
		// Remove dropped player and connect their neighbors together
		List<Player> newList = new ArrayList<Player>();
		for (Player p : players) {
			if (p.getStatus() != PlayerStatus.Status.DROPPED) {
				if (p.getLastPing() > 10) {
					p.drop("Dropped because player closes browser more than 10 seconds when the game start",
							"<p>Error: you have exceeded the game timeout. Unfortunately " +
							"the game will have to proceed without you.</p>" +
							"<p> Please contact us at <a href='mailto:mturkgroup@gmail.com'>mturkgroup@gmail.com</a> " +
							"if you think that this message is incorrect.</p>");
				} else {
					newList.add(p);
				}
			}
		}
		validPlayers = newList;
	}

	private void reorder(int[] order) {
		if (!this.eli.equals("Yes") || order == null) {
			order = randomOrder();
		}
		for (int i = 0; i < order.length; i++) {
			Player player = validPlayers.get(order[i]);
			player.getNeighbors().clear();

			Player rightNeighbor = validPlayers.get( order[(i+1) % validPlayers.size()] );
			player.addNeighbor(rightNeighbor);

			Player leftNeighbor = (i==0) ? validPlayers.get(order[validPlayers.size() - 1]) : validPlayers.get(order[i - 1]);
			player.addNeighbor(leftNeighbor);
		}
		currentOrder = order;
	}

	private void reportPlayer() throws IOException {
		String log = "\nPlayers Information:\nPlayer ID\t";
		if (eli.equals("Yes")) {
			log += "First Move\tRule\t";
		}
		log += "Turker ID\tAssignment ID\tHIT ID\tTurk Submit To\t" +
				"IP Address\tBrowser Code\tBrowser Name\t" +
				"Browser Version\tCookie Enabled\tPlatform\tUser Agent\t" +
				"Client Width\tClient Height\tSVG supported\tLocation\tLatitude\tLongitude" +
				"\tLatency\tRobot Name\tNote";
		log += "\n";
		for (int i = 0; i < players.size(); i++) {
			log += players.get(i).getId() + "\t";
			if (eli.equals("Yes")) {
				log = log + players.get(i).getEliFirstMove() + "\t";
				log = log + players.get(i).getRule() + "\t";
			}
			log = log + players.get(i).getTurkerId() + "\t";
			log = log + players.get(i).getAssignmentId() + "\t";
			log = log + players.get(i).getHitId() + "\t";
			log = log + players.get(i).getTurkSubmitTo() + "\t";
			log = log + players.get(i).getIp() + "\t";
			log = log + players.get(i).getBrowserCode() + "\t";
			log = log + players.get(i).getBrowserName() + "\t";
			log = log + players.get(i).getBrowserVersion() + "\t";
			log = log + players.get(i).getCookieEnabled() + "\t";
			log = log + players.get(i).getPlatform() + "\t";
			log = log + players.get(i).getUserAgent() + "\t";
			log = log + players.get(i).getClientWidth() + "\t";
			log = log + players.get(i).getClientHeight() + "\t";
			log = log + players.get(i).getSvgSupported() + "\t";
			log = log + players.get(i).getLocation() + "\t";
			log = log + players.get(i).getLatitude() + "\t";
			log = log + players.get(i).getLongtitude() + "\t";
			log = log + players.get(i).getLatency() + "\t";
			log = log + players.get(i).getRobotName() + "\t";
			log = log + players.get(i).getNote() + "\t";
			log += "\n";
		}
		writeReport(log);
	}
	public void resolveRound() {
		// Resolve the players' choices from the round
		while (moveQueue.size() > 0) {
			PlayerMove curMove = moveQueue.remove();
			curMove.doMove();
		}

		calculatePayoff();
	}

	public void setCurRound(int cr) {
		curRound = cr;
	}
	public void setEli(String eli) {
		this.eli = eli;
	}
	public void setExchangeRate(double exchangeRate) {
		this.exchangeRate = exchangeRate;
	}
	public void setLastRound(int lastRound) {
		this.lastRound = lastRound;
	}
	public void setPggService(PggService pggService) {
		this.pggService = pggService;
	}
	public void setPlayerTimeout(int playerTimeout) {
		this.playerTimeout = playerTimeout;
	}
	public void setRegular(boolean regular) {
		this.regular = regular;
	}
	public void setTimeoutIgnored(boolean timeoutIgnored) {
		this.timeoutIgnored = timeoutIgnored;
	}
	public void setTrackers(Set<String> trackers) {
		this.trackers = trackers;
	}
	private void setupCooperation() {
		synchronized (payoffCalculated) {
			payoffCalculated = false;
			// every player must decide whether to cooperate or not
			for (int i = 0; i < validPlayers.size(); i++) {
				validPlayers.get(i).considerCooperation();
			}
			roundStart = new Date().getTime();
		}
	}
	private void startFirstAllocation() throws IOException {
		removeDroppedPlayers();

		// Create our list of potential edges
		edges = new ArrayList<Edge>();
		for (int i = 0; i < validPlayers.size(); i++) {
			for (int j = i + 1; j < validPlayers.size(); j++) {
				edges.add(new Edge(validPlayers.get(i), validPlayers.get(j)));
			}
		}

		reportPlayer();

		if (eli.equals("Yes")) {
			substituteThread = new Thread() {
				public void run() {
					while(true) {
						synchronized (status) {
							if (status == Status.COOPERATION_ROUND_A
									|| status == Status.COOPERATION_ROUND_B
									|| status == Status.PAYOFF_ROUND
									|| status == Status.STOPPED
									|| status == Status.PART_INTRO) {
								if (status == Status.COOPERATION_ROUND_A
									|| status == Status.COOPERATION_ROUND_B) {
									Date now = new Date();
									if (now.getTime() - roundStart > 10000) {
										for (Player p : players) {
											if (!p.getDecidedCooperate(curRound)
													&& p.getIdleTime() > 20) {
												// substitute player with his robot
												int nextMove;
												if (p.getLastMove() == -1) {
													nextMove = p.getEliFirstMove();
												} else {
													int rightMove = p.getNeighbors().get(0).getLastMove();
													int leftMove = p.getNeighbors().get(1).getLastMove();
													int lastMove = p.getLastMove();
													int bit = rightMove + 2 * lastMove + 4 * leftMove;
													int situation = 1 << bit;
													nextMove = situation & p.getRule();
												}
												if (nextMove > 0) {
													addMove(new CooperateMove(p, "Robot"));
												} else {
													addMove(new DoNotCooperateMove(p, "Robot"));
												}
												p.setDecidedCooperate(curRound, true);
											}
										}
									}
								}
							} else {
								break;
							}
						}
						try {
							sleep(2000);
						} catch (Exception e) {
							logger.error(e.getMessage(), e);
						}
					}
				}
			};
		}
		synchronized (status) {
			if (edges.size() < 3) {
				edges = null;
				status = GameStatus.Status.NOT_ENOUGH_PLAYER;
				globalTimeoutProcessed = true;
			} else {
				newSet();
				setupCooperation();
				status = Status.COOPERATION_ROUND_A;
				if (eli.equals("Yes")) {
					substituteThread.start();
				}
				logThread.start();
			}
		}
	}
	public void startGame() {
		started = true;
		if (realStarted) {
			if (gameStop != -1) {
				long added = new Date().getTime() - gameStop;
				gameStart += added;
				gameStop = -1;
				Date now = new Date();
				for (Player player : players) {
					player.setLastContact(now);
					if (player.getfElicitationTime() != null) {
						player.setfElicitationTime(new Date(player.getfElicitationTime().getTime() + added));
					}
					if (player.getStartTime() != null) {
						player.setStartTime(new Date(player.getStartTime().getTime() + added));
					}
					if (player.getfTutorialTime() != null) {
						player.setfTutorialTime(new Date(player.getfTutorialTime().getTime() + added));
					}
				}
				roundStart = now.getTime();
				if (curSet == 1) {
					set2Start = now.getTime();
				}
			}
		}
	}

	/**
	 * Called when the first player joined.
	 */
	public void startRealGame() {
		gameStart = new Date().getTime();
		gameStop = -1;
		dropThread.start();
		realStarted = true;
	}
	public void stopGame() {
		started = false;
		gameStop = new Date().getTime();
	}
	@Override
	public String toString() {
		String returnString = "Game Information:\nGame ID\tHuman Players\tAI Players\t" +
				"Cost of Cooperation\tPayoff\tSeed Money\tMin Rounds A\t" +
				"Min Rounds B\tElicitation\tOrder A\tOrder B\tProb of end\t"
				+ "Timeout\tFixed Round\tRound PoE A\t Round PoE B\n";
		returnString += gid + "\t"
				+ numHumanPlayers + "\t"
				+ numAiPlayers + "\t"
				+ costOfCooperation + "\t"
				+ payOff + "\t"
				+ seedMoney + "\t"
				+ minRoundsOption[0] + "\t"
				+ minRoundsOption[1] + "\t"
				+ eli + "\t"
				+ orderOptions[0] + "\t"
				+ orderOptions[1] + "\t"
				+ poe + "\t"
				+ playerTimeout + "\t"
				+ fixed + "\t"
				+ Arrays.toString(probs[0]) + "\t"
				+ Arrays.toString(probs[1]) + "\t";
		return returnString;
	}
	public void update() throws IOException, GeneralException {
		synchronized (status) {
			switch (status) {
				case PREPARED:
					// This is the default status, when the first player contacts us, this should change to WAITING_FOR_PLAYERS
					status = Status.WAITING_FOR_PLAYERS;
					break;
				case WAITING_FOR_PLAYERS:
					// If there are no INACTIVE players
					if (playersReady()) {
						if (playersReadyToPlay()) {
							status = Status.PART_INTRO;
						} else if (playersDoneTutorial() && eli.equals("Yes")) {
							status = Status.ELICITATION_ROUND;
						} else {
							status = Status.TUTORIAL_ROUND;
						}
					}
					break;
				case TUTORIAL_ROUND:
					if (playersReadyToPlay()) {
						status = Status.PART_INTRO;
					} else if (playersDoneTutorial() && eli.equals("Yes")) {
						status = Status.ELICITATION_ROUND;
					}
					break;
				case ELICITATION_ROUND:
					if (playersReadyToPlay()) {
						status = Status.PART_INTRO;
					}
					break;
				case PART_INTRO:
					if (playersSawPartIntro()) {
						if (curSet == 0) {
							startFirstAllocation();
						} else {
							int validPlayersCount = validPlayers.size();
							for (Player player : validPlayers) {
								player.getNeighbors().clear();
							}
							removeDroppedPlayers();
							reportPlayer();
							if (validPlayersCount != validPlayers.size()) {
								regular = false;
							}
							if (validPlayers.size() < 3) {
								edges = null;
								status = GameStatus.Status.NOT_ENOUGH_PLAYER;
								globalTimeoutProcessed = true;
							} else {
								newSet();
								setupCooperation();
								status = Status.COOPERATION_ROUND_B;
							}
						}
					}
					break;
				case COOPERATION_ROUND_A:
				case COOPERATION_ROUND_B:
					// Check if everyone has made their choice to cooperate or defect
					if (playersDoneCooperation()) {
						// resolve their choices
						resolveRound();

						// Move on to the next round
						Date date = new Date();
						lastRound = curRound;
						// Show the results for the previous round
						status = Status.PAYOFF_ROUND;
					}
					break;
				case PAYOFF_ROUND:
					if ( playersShownPayoff()) {
						// Check if the game is over
						// If we're past the minimum number of rounds and we roll a die greater than the chance to continue
						if (curRound >= minRoundsOption[curSet]) {
							if (curSet > 0) {
								finish();
							} else {
								logMove();
								dropThread = new Thread() {
									@Override
									public void run() {
										set2Start = new Date().getTime();
										while (!playersSawPartIntro()) {
											calculateWaitTime();
											for (Player p : players) {
												if (!p.getShownPartIntro(curSet)) {
													if (new Date().getTime() - set2Start > idleTimeout * 1000) {
														p.drop("Dropped because player does not start Set 2",
																"<p>Error: you have exceeded the game timeout. Unfortunately " +
																"the game will have to proceed without you.</p>" +
																"<p> Please contact us at <a href='mailto:mturkgroup@gmail.com'>mturkgroup@gmail.com</a> " +
																"if you think that this message is incorrect.</p>");
													}
												}
											}
											try {
												sleep(2000);
											} catch (Exception e) {
												logger.error(e.getMessage(), e);
											}
										}
									};
								};
								curSet++;
								for (Player player : validPlayers) {
									player.clearStatusA();
								}
								status = Status.PART_INTRO;
								dropThread.start();
							}
						} else {
							// set up the next round
							curRound++;
							setupCooperation();
							if (curSet == 0) {
								status = Status.COOPERATION_ROUND_A;
							} else {
								status = Status.COOPERATION_ROUND_B;
							}
						}
					}
					break;
				case FINISHED:
				case CANCELLED:
				case NOT_ENOUGH_PLAYER:
					if (!dataWritten) { // Only write the data once, not when every player checks in.
						writeToDisk();
						logStream.close();
						logStream = null;
						reportStream.close();
						reportStream = null;
						globalTimeoutProcessed = true;
						gameStop = new Date().getTime();
					}
					break;
				default:
					// Shouldn't get here, let's go to "PREPARED" status
					status = Status.PREPARED;
					break;
			}
		}
	}
	/**
	 * Make sure there are no two players with the same IP addresses in a game.
	 * If found another player with the same IP, the verified player is
	 * dropped.
	 * @param p player to be verified.
	 */
	public synchronized void verifyIp(Player p) {
		String ip = p.getIp();
		if (!ip.isEmpty()
				&& p.getStatus() != PlayerStatus.Status.DROPPED
				&& !p.getTurkerId().isEmpty()
				&& !p.getTurkerId().startsWith("cnt")) {
			for (Player player : players) {
				if (p != player
						&& player.getIp().equals(ip)
						&& !player.getTurkerId().startsWith("cnt")
						&& player.getStatus() == PlayerStatus.Status.ACTIVE
						&& player.getAi() == 0) {
					p.drop("Have the same IP with another player.",
							"<p>Error: according to our records you are already " +
							"in the game. Please close this browser window. </p><p>" +
							"If you think that this is a mistake, please " +
							"contact us at <a href='mailto:mturkgroup@gmail.com'>mturkgroup@gmail.com</a></p>");
					break;
				}
			}
		}
	}
	/**
	 * Make sure there are no two players with the same TurkerID in a game.
	 * If found another player with the same TurkerID, the verified player is
	 * dropped.
	 * @param p player to be verified.
	 */
	public synchronized void verifyTurkerId(Player p) {
		String value = p.getTurkerId();
		if (!value.isEmpty()
				&& p.getStatus() != PlayerStatus.Status.DROPPED
				&& !value.startsWith("cnt")) {
			for (Player player : players) {
				if (p != player
					&& player.getTurkerId().equals(value)
					&& player.getStatus() == PlayerStatus.Status.ACTIVE
					&& !player.getTurkerId().startsWith("cnt")
					&& player.getAi() == 0) {
					p.drop("Have the same Turker ID with another player.",
							"<p>Error: according to our records you are already " +
							"in the game. Please close this browser window. </p><p>" +
							"If you think that this is a mistake, please " +
							"contact us at <a href='mailto:mturkgroup@gmail.com'>mturkgroup@gmail.com</a></p>");
					break;
				}
			}
		}
	}
	private synchronized void writeLog(String content) throws IOException {
		log.add(content);
		if (logStream == null) {
			logStream = new PrintWriter(new BufferedOutputStream(
					new FileOutputStream(logFile, true)));
			logStream.println(content);
			logStream.close();
			logStream = null;
		} else {
			logStream.println(content);
			logStream.flush();
		}
	}
	public synchronized void writeReport(String content) throws IOException {
		reports.add(content);
		if (reportStream == null) {
			reportStream = new PrintWriter(new BufferedOutputStream(
					new FileOutputStream(reportFile, true)));
			reportStream.println(content);
			reportStream.close();
			reportStream = null;
		} else {
			reportStream.println(content);
			reportStream.flush();
		}
		writeLog(content);
	}
	private synchronized void writeToDisk() {
		if (!dataWritten) {
			try {
				pggService.saveGame(this);
			} catch (Exception e) {
				logger.warn(e.getMessage(), e);
			}
			dataWritten = true;
		}
	}
}