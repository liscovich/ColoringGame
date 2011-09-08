package edu.harvard.med.hcp.mcknight.game.moves;


/**
 * This move is not made by player.
 */
public class GeneralMove extends PlayerMove {

	private String allocation;

	public GeneralMove(String allocation)
	{
		super(null, 0);
		this.allocation = allocation;
	}

	@Override
	public void doMove()
	{
		// do nothing
	}

	@Override
	public String toCSV()
	{
		return allocation;
	}
}
