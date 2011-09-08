package edu.harvard.med.hcp.mcknight.game;

/**
 * This is a class to simply store each relationship with a client.
 * @author Mark McKnight
 */
public class Relationship
{
	public int id; // Server-side id
	public int lastDecision; // 0: do nothing, 1: cooperate, 2: don't know
	public boolean connected; // are we currently connected to this person?

	public Relationship() {}
}
