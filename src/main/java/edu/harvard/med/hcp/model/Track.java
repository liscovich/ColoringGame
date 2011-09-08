package edu.harvard.med.hcp.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

@Entity
public class Track extends AbstractTimestampEntity {

	@NotNull
	@ManyToOne
	private Pgg game;
	@NotNull
	@ManyToOne
	private Player player;
	private int weight;
	@Temporal(TemporalType.TIMESTAMP)
	private Date trackTime;
	private String content;
	public String getContent() {
		return content;
	}
	public Pgg getGame() {
		return game;
	}
	public Player getPlayer() {
		return player;
	}
	public Date getTrackTime() {
		return trackTime;
	}
	public int getWeight() {
		return weight;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public void setGame(Pgg game) {
		this.game = game;
	}
	public void setPlayer(Player player) {
		this.player = player;
	}
	public void setTrackTime(Date trackTime) {
		this.trackTime = trackTime;
	}
	public void setWeight(int weight) {
		this.weight = weight;
	}
}
