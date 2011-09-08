package edu.harvard.med.hcp.model;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

@Entity
public class Decision extends AbstractTimestampEntity {

	@NotNull
	@ManyToOne
	private Part part;
	@NotNull
	@ManyToOne
	private Pgg game;
	private int player_id;
	private int round;
	private int cooperation;
	private int leftNeighbor_id;
	private int rightNeighbor_id;
	private String decisionMaker;// decision maker'sr turk ID or "Admin"
	private int earned;
	public int getCooperation() {
		return cooperation;
	}
	public String getDecisionMaker() {
		return decisionMaker;
	}
	public int getEarned() {
		return earned;
	}
	public Pgg getGame() {
		return game;
	}

	public int getLeftNeighbor_id() {
		return leftNeighbor_id;
	}
	public Part getPart() {
		return part;
	}
	public int getPlayer_id() {
		return player_id;
	}
	public int getRightNeighbor_id() {
		return rightNeighbor_id;
	}
	public int getRound() {
		return round;
	}
	public void setCooperation(int cooperation) {
		this.cooperation = cooperation;
	}
	public void setDecisionMaker(String decisionMaker) {
		this.decisionMaker = decisionMaker;
	}
	public void setEarned(int earned) {
		this.earned = earned;
	}
	public void setGame(Pgg game) {
		this.game = game;
	}
	public void setLeftNeighbor_id(int leftNeighbor_id) {
		this.leftNeighbor_id = leftNeighbor_id;
	}
	public void setPart(Part part) {
		this.part = part;
	}
	public void setPlayer_id(int player_id) {
		this.player_id = player_id;
	}
	public void setRightNeighbor_id(int rightNeighbor_id) {
		this.rightNeighbor_id = rightNeighbor_id;
	}
	public void setRound(int round) {
		this.round = round;
	}
}
