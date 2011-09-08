package edu.harvard.med.hcp.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

@Entity
public class Log extends AbstractTimestampEntity {

	@NotNull
	@ManyToOne
	private Pgg game;
	@NotNull
	@Column(length=1000)
	private String content;
	public String getContent() {
		return content;
	}
	public Pgg getGame() {
		return game;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public void setGame(Pgg game) {
		this.game = game;
	}
}
