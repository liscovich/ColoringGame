package edu.harvard.med.hcp.mcknight.game;

/**
 * @author Mark McKnight
 */
public class Edge
{
	private Player playerA;
	private Player playerB;

	public Edge(Player a, Player b)
	{
		playerA = a;
		playerB = b;
	}

	public Player[] getPlayers()
	{
		Player[] returnPlayers = new Player[2];
		returnPlayers[0] = playerA;
		returnPlayers[1] = playerB;

		return returnPlayers;
	}

	public boolean isConnected()
	{
		if (playerA.hasNeighbor(playerB) || playerB.hasNeighbor(playerA))
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	public boolean contains(Player p)
	{
		if (playerA.equals(p) || playerB.equals(p))
			return true;

		return false;
	}

	@Override
	public String toString()
	{
		String returnString = playerA.getName() + " : " + playerB.getName();
		return returnString;
	}
}
