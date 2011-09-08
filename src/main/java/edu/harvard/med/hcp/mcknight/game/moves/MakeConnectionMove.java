package edu.harvard.med.hcp.mcknight.game.moves;

import java.text.DateFormat;

import edu.harvard.med.hcp.mcknight.game.Player;

/**
 * The player chooses to cooperate this round.
 * @author Mark McKnight
 */
public class MakeConnectionMove extends PlayerMove
{
	private Player neighbor;

	public MakeConnectionMove(Player p, Player n)
	{
		super(p, p.getGame().getCurRound());
		neighbor = n;
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
		returnString += "MakeConnection, ";
		returnString += player.getId() + ", ";
		returnString += neighbor.getId();

		return returnString;
	}

	@Override
	public String toString()
	{
		return DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG).format(timestamp) + ": \t" + "Admin is connecting " + player.getName() + " with " + neighbor.getName() + ".";
	}
}
