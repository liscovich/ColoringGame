package edu.harvard.med.hcp.mcknight.game.moves;

import java.text.DateFormat;

import edu.harvard.med.hcp.mcknight.game.Player;

/**
 * This class has nothing but a playerId and a timestamp
 * @author Mark McKnight
 */
public class CheckInMove extends PlayerMove
{
	public CheckInMove(Player p)
	{
		super(p, p.getGame().getCurRound());
	}

	@Override
	public void doMove()
	{
		/* Do nothing.*/
	}

	public String toCSV()
	{
		String returnString = "";
		returnString += timestamp + ", ";
		returnString += getRound() + ", ";
		returnString += player.getGame().getGid() + ", ";
		returnString += player.getId() + ", ";
		returnString += "CheckingIn, 0";

		return returnString;
	}

	@Override
	public String toString()
	{
		return DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG).format(timestamp) + ": \t" + player.getName() + " is checking in.";
	}
}
