package edu.harvard.med.hcp.mcknight.game.moves;

import java.text.DateFormat;

import edu.harvard.med.hcp.mcknight.game.Player;

/**
 * The player chooses to cooperate this round.
 * @author Mark McKnight
 */
public class CancelGameMove extends PlayerMove
{
	public CancelGameMove(Player p)
	{
		super(p, p.getGame().getCurRound());
	}

	@Override
	public void doMove()
	{
		// do nothing
	}

	@Override
	public String toCSV()
	{
		String returnString = "";
		returnString += timestamp + ", ";
		returnString += getRound() + ", ";
		returnString += player.getGame().getGid() + ", ";
		returnString += "128, ";
		returnString += "CancelGame";

		return returnString;
	}

	@Override
	public String toString()
	{
		return DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG).format(timestamp) + ": \t" + "Admin is cancelling the game.";
	}
}
