package edu.harvard.med.hcp.mcknight.game;

/**
 * This is a class to simply store game status.
 * @author Mark McKnight
 */
public class GameStatus
{
	public static enum Status {
		PREPARED,
		WAITING_FOR_PLAYERS,
		TUTORIAL_ROUND,
		ELICITATION_ROUND,
		PART_INTRO,
		COOPERATION_ROUND_A,
		COOPERATION_ROUND_B,
		PAYOFF_ROUND,
		STOPPED,
		CANCELLED,
		FINISHED,
		DROPPED,
		NOT_ENOUGH_PLAYER
	}
	public String id; // Game id
	public String type; // Type of game;
	/*
	 * PREPARED:  The initial state of the game before it has been started.  The game object has been created.
	 * WAITING_FOR_PLAYERS:  The game has been started but the number of players joined and gone through the tutorial is less than minN.
	 * TUTORIAL_ROUND:  Enough players have joined, still waiting for players to finish the tutorial.
	 * INITIAL_ROUND:  The first round of the game, this is usually handled differently than subsequent rounds.
	 * COOPERATION_ROUND:  A cooperate / defect round, not the 1st round.
	 * REWIRING_ROUND:  A rewiring round, not the 1st round.
	 * STOPPED:  The administrator stopped the game before it was completed but may resume it.
	 * CANCELLED:  The game was stopped before it was completed, it may not be resumed.
	 * FINISHED:  The game completed normally.
	 */
	public String status;
	public int numPlayers;
	public int numAIPlayers;
	public int costOfCooperation; //Cost of Cooperation (cents):
	public int payOff; //Payoff (cents):
	public int seedMoney; //Seed Money (cents):
	public int numRoundsB; //Edge changes per rd. (k):
	public int numRoundsA; //Number of Rounds:
	public int curRound; //Current round
	public int playerTimeout; // How long, in seconds, before an idle player is disconnected
	public int globalTimeout;
	public double exchangeRate; // dollars/point
	public String eli, orderA, orderB;
	public boolean timeoutIgnored;
	public int elapseTime;
	public int idleTimeout;
	public int roundElapseTime;
	public boolean regular;
	public double poe;
	public boolean fixed;

	public GameStatus() {}
}