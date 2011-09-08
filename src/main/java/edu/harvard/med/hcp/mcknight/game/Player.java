package edu.harvard.med.hcp.mcknight.game;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import edu.harvard.med.hcp.mcknight.game.moves.CooperateMove;
import edu.harvard.med.hcp.mcknight.game.moves.DoNotCooperateMove;

/**
 *
 * @author Mark McKnight
 */
@SuppressWarnings("unused")
public class Player {
	private int id;
	private String name;
	private String robotName = "";
	// Players start out INACTIVE until they make first contact.
	private PlayerStatus.Status status = PlayerStatus.Status.INACTIVE;

	private ArrayList<Player> neighbors;
	private int cents; // Amount of money, in cents, the player has collected
	private int cooperate; // Whether this player has decided to cooperate or
							// defect -1 (not decided), 0 (do not cooperate), 1
							// (cooperate)
	private int lastMove; // Whether this player cooperated during their last
							// move or not
	private int ai; // If 0, not AI controlled, if 1 randomly controlled, other
					// numbers reserved for specific strategies
	private LiscovichGame game; // Our current game
	private HashMap<Integer, Integer> decisionHistory = new HashMap<Integer, Integer>();
	private HashMap<Integer, String> decisionMaker = new HashMap<Integer, String>();
	private HashMap<Integer, Boolean> decidedCooperate = new HashMap<Integer, Boolean>();
	private HashMap<Integer, Boolean> shownPayoff = new HashMap<Integer, Boolean>();
	private String turkerId = "";
	private boolean doneTutorial = false;
	private boolean doneElicitation = false;
	private String progess = "";
	private String note = "";
	private String dropReason = "";
	private Date lastContact, lastPing, startTime, fTutorialTime, fElicitationTime;
	private int rule = -1; // memory-1 strategy, 0 - 255 or -1 if unknown
	private int eliFirstMove = -1; // first move to calculate memory-1 payoff, 0
									// for nothing, 1 for cooperate, -1 for
									// unknown
	private int firstAllocationCents = 0; // we store the allocation A bonus to
											// this temp variable
	private int secondAllocationCents = 0; // we store the allocation B bonus to
											// this temp variable
	private int thirdAllocationCents = 0; // we store the random order simulation
	private String svgSupported = "";
	private String ip = ""; // IP address
	private String browserCode = "";
	private String browserName = "";
	private String browserVersion = "";
	private String platform = "";
	private String cookieEnabled = "";
	private String userAgent = "";
	private String longtitude = "";
	private String latitude = "";
	private String location = "";
	private String clientWidth = "";
	private String clientHeight = "";
	private String latency = "";
	private String assignmentId = "";
	private String hitId = "";
	private String turkSubmitTo = "";
	private Date stopTime;
	private boolean[] shownPartIntro = new boolean[2];
	// mouse position, browser status, latency
	private Map<String, String> mouseLog = new HashMap<String, String>();
	// item click log
	private Map<String, Long> clickLog = new HashMap<String, Long>();

	Player(int _id, String n, int _ai, int sm, LiscovichGame g) {
		neighbors = new ArrayList<Player>();
		cents = sm;
		id = _id;
		name = n;
		ai = _ai;
		game = g;
		cooperate = -1;
		lastMove = -1;

		if (ai > 0) {
			// AI players are always ready and don't need to do the tutorial
			status = PlayerStatus.Status.ACTIVE;
			doneTutorial = true;
			doneElicitation = true;
			Random randomGenerator = new Random();
			rule = randomGenerator.nextInt(256);
			eliFirstMove = randomGenerator.nextInt(2);
			shownPartIntro[0] = true;
			shownPartIntro[1] = true;
		}
	}

	public void addClickLog(String value, long timeStamp) {
		clickLog.put(value, timeStamp);
	}

	public void addMouseLog(Date timestamp, String record) {
		mouseLog.put(timestamp.getTime() + "", record);
	}

	public void addNeighbor(Player p) {
		if (neighbors.contains(p)) {
			// Already connected with this player, perhaps throw exception here?
		} else {
			neighbors.add(p);
		}
	}

	public void calculatePayoff() {
		int netGain = 0;
		if (cooperate == 1) // If you cooperate, you pay the cost of cooperation
							// for every neighbor
		{
			netGain -= (game.getCostOfCooperation() * neighbors.size());
			netGain += game.getPayoff();
		}

		for (Player n : neighbors) // For every neighbor, if they cooperated add
									// the payoff
		{
			if (n.getCooperation() == 1) {
				netGain += game.getPayoff();
			}
		}
		cents += netGain;
	}

	public void checkIn(boolean updateLastContact) {
		// Called when the player client makes contact with the server.
		synchronized (status) {
			lastPing = new Date();
			if (status != PlayerStatus.Status.DROPPED) {
				if (updateLastContact || status == PlayerStatus.Status.INACTIVE) {
					updateLastContact();
				}
				status = PlayerStatus.Status.ACTIVE;
			}
			if (!game.isRealStarted()) {
				game.startRealGame();
			}
		}
	}

	public void clearStatusA() {
		shownPayoff.clear();
		decidedCooperate.clear();
		lastMove = -1; // we want to reset this too
		cooperate = -1;
		firstAllocationCents = cents;
		cents = game.getSeedMoney();
	}

	public void clearStatusB() {
		shownPayoff.clear();
		decidedCooperate.clear();
		lastMove = -1; // we want to reset this too
		cooperate = -1;
		secondAllocationCents = cents;
		cents = game.getSeedMoney();
	}

	private boolean connectDecision(boolean currentlyConnected,
			boolean knowsLastMove, boolean cooperatedLastMove) {
		switch (ai) {
		case 1: // Fully random AI
			if (Math.random() < .5) {
				return true;
			} else {
				return false;
			}
		default:
			return false;
		}
	}

	public void considerCooperation() {
		// if (game.getCurRound() > 1)
		lastMove = cooperate; // if a round has been played already, store your
								// previous decision in lastMove

		if (ai > 0) { // is computer controlled
			// for now let's do this randomly
			if (Math.random() < .5) {
				game.addMove(new CooperateMove(this, ""));
				// cooperate = 1;
			} else {
				game.addMove(new DoNotCooperateMove(this, ""));
				// cooperate = 0;
			}
		} else if (status == PlayerStatus.Status.DROPPED) {
			// DROPPED players will defect and drop all their connections as
			// soon as possible.
			game.addMove(new DoNotCooperateMove(this, ""));
		} else { // player will have to decide
			setDecidedCooperate(game.getCurRound(), false);
		}
	}

	public void drop(String note, String reason) {
		synchronized (status) {
			status = PlayerStatus.Status.DROPPED;
			if (fElicitationTime == null) {
				fElicitationTime = new Date();
			}
			if (fTutorialTime == null) {
				fTutorialTime = new Date();
			}
			stopTime = new Date();
			this.note += note + " ";
			this.dropReason = reason;
		}
	}

	public int getAi() {
		return ai;
	}

	public String getAssignmentId() {
		return assignmentId;
	}

	public String getBrowserCode() {
		return browserCode;
	}
	public String getBrowserName() {
		return browserName;
	}

	public String getBrowserVersion() {
		return browserVersion;
	}

	public int getCents() {
		return cents;
	}

	public Long getClickLog(String value) {
		if (clickLog.containsKey(value)) {
			return clickLog.get(value);
		} else {
			return 0L;
		}
	}

	public String getClientHeight() {
		return clientHeight;
	}

	public String getClientWidth() {
		return clientWidth;
	}

	public String getCookieEnabled() {
		return cookieEnabled;
	}

	public int getCooperation() {
		return cooperate;
	}
	public boolean getDecidedCooperate(int round) {
		if (decidedCooperate.containsKey(round)) {
			return decidedCooperate.get(round);
		}
		return false;
	}
	public HashMap<Integer, String> getDecisionMaker() {
		return decisionMaker;
	}
	public String getDropReason() {
		return dropReason;
	}

	public int getEliFirstMove() {
		return eliFirstMove;
	}

	public Date getfElicitationTime() {
		return fElicitationTime;
	}

	public int getFirstSetCents() {
		return firstAllocationCents;
	}

	public Date getfTutorialTime() {
		return fTutorialTime;
	}

	public LiscovichGame getGame() {
		return game;
	}

	public HashMap<Integer, Integer> getHistory() {
		return decisionHistory;
	}

	public String getHitId() {
		return hitId;
	}

	public int getId() {
		return id;
	}

	/**
	 * The time from the last time player sent tracker to server.
	 * @return idle time in second
	 */
	public int getIdleTime() {
		int result;
		if (status != PlayerStatus.Status.DROPPED
				&& status != PlayerStatus.Status.INACTIVE
				&& ai == 0
				&& game.getStatus() != GameStatus.Status.CANCELLED
				&& game.getStatus() != GameStatus.Status.FINISHED
				&& game.getStatus() != GameStatus.Status.NOT_ENOUGH_PLAYER
				&& game.getStatus() != GameStatus.Status.STOPPED) {
			if (game.getGameStop() == -1) {
				long curTime = new Date().getTime();
				return (int) ((curTime - lastContact.getTime()) / 1000);
			} else {
				return (int) ((game.getGameStop() - lastContact.getTime()) / 1000);
			}
		} else {
			result = 0;
		}
		return result;
	}

	public String getIp() {
		return ip;
	}

	public Date getLastContact() {
		return lastContact;
	}

	public int getLastMove() {
		return lastMove;
	}

	public int getLastPing() {
		int result;
		if (ai != 0) {
			result = 0;
		} else if (lastPing == null) {
			result = -1;
		} else {
			if (stopTime == null) {
				if (game.getGameStop() == -1) {
					result = Math.round((new Date().getTime() - lastPing.getTime()) / 1000);
				} else {
					result = Math.round((game.getGameStop() - lastPing.getTime()) / 1000);
					if (result < 0) {
						result = 0;
					}
				}
			} else {
				result = Math.round((stopTime.getTime() - lastPing.getTime()) / 1000);
				if (result < 0) {
					result = 0;
				}
			}
		}
		return result;
	}

	public String getLatency() {
		return latency;
	}

	public String getLatitude() {
		return latitude;
	}

	public String getLocation() {
		return location;
	}

	public String getLongtitude() {
		return longtitude;
	}

	public String getName() {
		return name;
	}

	public ArrayList<Player> getNeighbors() {
		return neighbors;
	}

	public String getNote() {
		return note;
	}

	public String getPlatform() {
		return platform;
	}

	public PlayerStatus getPlayerStatus() {
		PlayerStatus ps = new PlayerStatus();
		ps.id = getId() + "";
		ps.name = getName();
		ps.status = getStatus() + "";
		ps.ai = getAi() + "";
		ps.points = getCents();
		ps.curMove = getCooperation();
		ps.lastMove = getLastMove();
		for (Player player : getNeighbors()) {
			ps.neighbors += (player.getId() + " ");
		}
		ps.doneTutorial = doneTutorial;
		ps.turkerid = getTurkerId();
		ps.rule = getRule();
		ps.eliFirstMove = getEliFirstMove();

		// Calculate idleTime
		Date curDate = new Date();
		if (ai == 0 && startTime != null) {
			if (fElicitationTime == null) {
				if (fTutorialTime != null) {
					if (game.getGameStop() == -1) {
						ps.elicitationTime = Math.round((curDate.getTime() - fTutorialTime.getTime()) / 1000);
					} else {
						ps.elicitationTime = Math.round((game.getGameStop() - fTutorialTime.getTime()) / 1000);
					}
				}
			} else {
				ps.elicitationTime = (int) ((fElicitationTime.getTime() - fTutorialTime.getTime()) / 1000);
			}
			if (fTutorialTime == null) {
				if (game.getGameStop() == -1) {
					ps.tutorialTime = Math.round((curDate.getTime() - startTime.getTime()) / 1000);
				} else {
					ps.tutorialTime = Math.round((game.getGameStop() - startTime.getTime()) / 1000);
				}
			} else {
				ps.tutorialTime = (int) ((fTutorialTime.getTime() - startTime.getTime()) / 1000);
			}
		}

		ps.idleTime = getIdleTime();
		ps.lastPing = getLastPing();
		return ps;
	}

	public String getProgess() {
		return progess;
	}

	public String getRobotName() {
		return robotName;
	}

	public int getRule() {
		return rule;
	}

	public int getSecondSetCents() {
		return secondAllocationCents;
	}

	public boolean getShownPartIntro(int i) {
		return shownPartIntro[i];
	}

	public boolean getShownPayoff(int round) {
		if (shownPayoff.containsKey(round)) {
			return shownPayoff.get(round);
		}
		return false;
	}

	public Date getStartTime() {
		return startTime;
	}

	public PlayerStatus.Status getStatus() {
		return status;
	}

	public Date getStopTime() {
		return stopTime;
	}

	public String getSvgSupported() {
		return svgSupported;
	}

	public int getThirdAllocationCents() {
		return thirdAllocationCents;
	}

	public String getTurkerId() {
		return turkerId;
	}

	public String getTurkSubmitTo() {
		return turkSubmitTo;
	}

	public String getUserAgent() {
		return userAgent;
	}

	public boolean hasNeighbor(Player p) {
		if (neighbors.contains(p)) {
			return true;
		} else {
			return false;
		}
	}

	public boolean isActive() {
		if (status == PlayerStatus.Status.ACTIVE
				|| status == PlayerStatus.Status.IDLE) {
			return true;
		}
		return false;
	}

	public boolean isDoneElicitation() {
		return doneElicitation;
	}

	public boolean isDoneTutorial() {
		return doneTutorial;
	}

	public void removeNeighbor(Player p) {
		if (neighbors.contains(p)) {
			neighbors.remove(p);
		} else {
			// Not a neighbor, perhaps throw exception here?
		}
	}

	public void setAssignmentId(String assignmentId) {
		this.assignmentId = assignmentId;
	}

	public void setBrowserCode(String browserCode) {
		this.browserCode = browserCode;
	}

	public void setBrowserName(String browserName) {
		this.browserName = browserName;
	}

	public void setBrowserVersion(String browserVersion) {
		this.browserVersion = browserVersion;
	}

	public void setCents(int c) {
		cents = c;
	}

	public void setClientHeight(String clientHeight) {
		this.clientHeight = clientHeight;
	}

	public void setClientWidth(String clientWidth) {
		this.clientWidth = clientWidth;
	}

	public void setCookieEnabled(String cookieEnabled) {
		this.cookieEnabled = cookieEnabled;
	}

	public void setCooperation(int c, String decisionMaker) {
		decisionHistory.put(game.getCurRound(), c);
		this.decisionMaker.put(game.getCurRound(), decisionMaker);
		if (ai == 0 && !decisionMaker.equals(turkerId)) {
			game.setRegular(false);
		}
		lastMove = c;
		cooperate = c;
		setDecidedCooperate(game.getCurRound(), true);
	}

	public void setDecidedCooperate(int round, boolean d) {
		decidedCooperate.put(round, d);
	}

	public void setDoneElicitation(boolean doneElicitation) {
		this.doneElicitation = doneElicitation;
		fElicitationTime = new Date();
	}

	public void setDoneTutorial(boolean doneTutorial) {
		this.doneTutorial = doneTutorial;
		fTutorialTime = new Date();
	}

	public void setDropReason(String dropReason) {
		this.dropReason = dropReason;
	}

	public void setEliFirstMove(int firstMove) {
		this.eliFirstMove = firstMove;
	}

	public void setfElicitationTime(Date fElicitationTime) {
		this.fElicitationTime = fElicitationTime;
	}

	public void setfTutorialTime(Date fTutorialTime) {
		this.fTutorialTime = fTutorialTime;
	}

	public void setHitId(String hitId) {
		this.hitId = hitId;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public void setLastContact(Date lastContact) {
		this.lastContact = lastContact;
	}

	public void setLatency(String latency) {
		this.latency = latency;
	}

	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public void setLongtitude(String longtitude) {
		this.longtitude = longtitude;
	}

	public void setPlatform(String platform) {
		this.platform = platform;
	}

	public void setProgess(String progess) {
		this.progess = progess;
	}

	public void setRobotName(String robotName) {
		this.robotName = robotName;
	}

	public void setRule(int rule) {
		this.rule = rule;
	}

	public void setShownPartIntro(int set, boolean shownPartIntro) {
		this.shownPartIntro[set] = shownPartIntro;
	}

	public void setShownPayoff(int round, boolean b) {
		shownPayoff.put(round, b);
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public void setSvgSupported(String svgSupported) {
		this.svgSupported = svgSupported;
	}

	public void setThirdAllocationCents(int thirdAllocationCents) {
		this.thirdAllocationCents = thirdAllocationCents;
	}

	public void setTurkerId(String turkerId) {
		this.turkerId = turkerId;
	}

	public void setTurkSubmitTo(String turkSubmitTo) {
		this.turkSubmitTo = turkSubmitTo;
	}

	public void setUserAgent(String userAgent) {
		this.userAgent = userAgent;
	}

	public void toggleNeighbor(Player p) {
		if (neighbors.contains(p)) {
			neighbors.remove(p);
			p.removeNeighbor(this);
		} else {
			neighbors.add(p);
			p.addNeighbor(this);
		}
	}

	@Override
	public String toString() {

		String returnString = "";
		returnString += id + ", " + name + ", " + ai + ", " + cents + ", "
				+ turkerId + ", " + status + "\n";
		return returnString;
	}
	private void updateLastContact() {
		lastContact = new Date();
		if (startTime == null) {
			startTime = new Date();
		}
	}
}
