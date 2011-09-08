package edu.harvard.med.hcp.mcknight.game;

/**
 * This is a class to simply store game status.
 *
 * @author Mark McKnight
 */
public class PlayerStatus {
	public static enum Status {
		INACTIVE, IDLE, ACTIVE, DROPPED;
	};

	public String id; // Player id
	public String name; // Player name
	public String turkerid; // Player turker Id
	public String status; // Player status
	public String ai; // AI / Human?
	public int points; // Amount of money they have
	public int curMove;
	public int lastMove;
	public String neighbors = "";
	public boolean doneTutorial;
	public boolean doneElicitation;
	public int idleTime; // Time since player last contacted the serer, rounded
							// to nearest second
	public int rule;
	public int eliFirstMove;
	public int tutorialTime;
	public int elicitationTime;
	public int lastPing;

	public PlayerStatus() {
	}
}
