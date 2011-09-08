package edu.harvard.med.hcp.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

@Entity
public class Feedback extends AbstractTimestampEntity {

	@NotNull
	@ManyToOne
	private Pgg game;
	@NotNull
	@ManyToOne
	private Player player;
	private int speed;
	private int instruction;
	private int interesting;
	private String strategy;
	private String thoughts;
	public Pgg getGame() {
		return game;
	}
	public int getInstruction() {
		return instruction;
	}
	public int getInteresting() {
		return interesting;
	}
	public Player getPlayer() {
		return player;
	}
	public int getSpeed() {
		return speed;
	}
	@Column(length=1000)
	public String getStrategy() {
		return strategy;
	}
	@Column(length=5000)
	public String getThoughts() {
		return thoughts;
	}
	public void setGame(Pgg game) {
		this.game = game;
	}
	public void setInstruction(int instruction) {
		this.instruction = instruction;
	}
	public void setInteresting(int interesting) {
		this.interesting = interesting;
	}
	public void setPlayer(Player player) {
		this.player = player;
	}
	public void setSpeed(int speed) {
		this.speed = speed;
	}
	public void setStrategy(String strategy) {
		this.strategy = strategy;
	}
	public void setThoughts(String thoughts) {
		this.thoughts = thoughts;
	}
}
