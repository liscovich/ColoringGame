package edu.harvard.med.hcp.model;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

@Entity
public class Part extends AbstractTimestampEntity {

	@NotNull
	@ManyToOne
	private Pgg game;
	@NotNull
	private String partName;
	private int numberOfCooperation;
	private String partOrder;
	@ManyToMany
	private List<Player> players;
	private String playerOrder;
	public Pgg getGame() {
		return game;
	}
	public int getNumberOfCooperation() {
		return numberOfCooperation;
	}
	public String getPartName() {
		return partName;
	}
	public String getPartOrder() {
		return partOrder;
	}
	public String getPlayerOrder() {
		return playerOrder;
	}
	public List<Player> getPlayers() {
		return players;
	}
	public void setGame(Pgg game) {
		this.game = game;
	}
	public void setNumberOfCooperation(int numberOfCooperation) {
		this.numberOfCooperation = numberOfCooperation;
	}
	public void setPartName(String partName) {
		this.partName = partName;
	}
	public void setPartOrder(String partOrder) {
		this.partOrder = partOrder;
	}
	public void setPlayerOrder(String playerOrder) {
		this.playerOrder = playerOrder;
	}
	public void setPlayers(List<Player> players) {
		this.players = players;
	}
}
