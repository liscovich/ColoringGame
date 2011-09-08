package edu.harvard.med.hcp.mcknight.game.moves;

import edu.harvard.med.hcp.mcknight.game.Player;
import java.util.Date;

/**
 * This class is used to track the various moves the player may make during
 * the game.
 *
 * @author Mark McKnight
 */
public abstract class PlayerMove
{
	Player player;
	long timestamp;
	int round;

	public PlayerMove(Player p, int r)
	{
		round = r;
		player = p;
		Date date = new Date();
		timestamp = date.getTime();
	}

	public void setPlayer(Player p)
	{
		player = p;
	}

	public Player getPlayer()
	{
		return player;
	}

	public void setTimestamp(long ts)
	{
		timestamp = ts;
	}

	public long getTimestamp()
	{
		return timestamp;
	}

	public int getRound()
	{
		return round;
	}

	public void setRound(int round)
	{
		this.round = round;
	}

	public abstract void doMove();

	public abstract String toCSV();
}