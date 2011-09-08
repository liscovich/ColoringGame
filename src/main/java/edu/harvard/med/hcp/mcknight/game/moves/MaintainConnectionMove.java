package edu.harvard.med.hcp.mcknight.game.moves;

import java.text.DateFormat;

import edu.harvard.med.hcp.mcknight.game.Player;

/**
 * This class has nothing but a playerId and a timestamp
 * @author Mark McKnight
 */
public class MaintainConnectionMove extends PlayerMove
{
	private Player neighbor;

	public MaintainConnectionMove(Player p, Player n)
	{
		super(p, p.getGame().getCurRound());
		neighbor = n;
	}

	@Override
	public void doMove()
	{
		/* Do nothing.*/
	}

	@Override
	public String toCSV()
	{
		String returnString = "";
		returnString += timestamp + ", ";
		returnString += getRound() + ", ";
		returnString += player.getGame().getGid() + ", ";
		returnString += player.getId() + ", ";
		returnString += "MaintainConnection, ";
		returnString += neighbor.getId();

		return returnString;
	}

	@Override
	public String toString()
	{
		return DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG).format(timestamp) + ": \t" + player.getName() + " decided to maintain his current connection with " + neighbor.getName() + ".";
	}
}
