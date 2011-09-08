package edu.harvard.med.hcp.model;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;

@Entity
public class Earning extends AbstractTimestampEntity {

	@NotNull
	@ManyToOne
	private Pgg game;
	@NotNull
	private int part1;
	private int part2;
	private int randomSimulationPart;
	private int total;
	private double money;
	private double exchangeRate;
	private String turkerId;
	private String ip;
	@NotNull
	@OneToOne
	private Player player;
	public double getExchangeRate() {
		return exchangeRate;
	}
	public Pgg getGame() {
		return game;
	}
	public String getIp() {
		return ip;
	}
	public double getMoney() {
		return money;
	}
	public int getPart1() {
		return part1;
	}
	public int getPart2() {
		return part2;
	}
	public Player getPlayer() {
		return player;
	}
	public int getRandomSimulationPart() {
		return randomSimulationPart;
	}
	public int getTotal() {
		return total;
	}
	public String getTurkerId() {
		return turkerId;
	}
	public void setExchangeRate(double exchangeRate) {
		this.exchangeRate = exchangeRate;
	}
	public void setGame(Pgg game) {
		this.game = game;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
	public void setMoney(double money) {
		this.money = money;
	}
	public void setPart1(int part1) {
		this.part1 = part1;
	}
	public void setPart2(int part2) {
		this.part2 = part2;
	}
	public void setPlayer(Player player) {
		this.player = player;
	}
	public void setRandomSimulationPart(int randomSimulationPart) {
		this.randomSimulationPart = randomSimulationPart;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	public void setTurkerId(String turkerId) {
		this.turkerId = turkerId;
	}
}
