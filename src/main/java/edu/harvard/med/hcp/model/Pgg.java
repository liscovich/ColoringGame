package edu.harvard.med.hcp.model;

import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
public class Pgg extends AbstractTimestampEntity {
	@NotEmpty
	private String gid;
	private int humanPlayer;
	private int aiPlayer;
	private int costOfCooperation;
	private int payoff;
	private int seedMoney;
	private int indTimeout; // Time, in sec. before idle players are dropped
	private int globalTimeout; // Time, in sec. players who don't complete tutorial and elicitation after this timeout will be dropped
	private int idleTimeout; // Time, in sec. players idle after timeout will be dropped
	private int minRoundA, minRoundB;
	private double poe;
	private double exchangeRate;
	private String orderA;
	private String orderB;
	private boolean elicitation;
	private boolean regular;
	private String status;
	private boolean fixed;
	@Temporal(TemporalType.TIMESTAMP)
	private Date gameStart;
	private int elapseTime; // in seconds
	@OneToMany(mappedBy = "game")
	private List<Player> players;
	@OneToMany(mappedBy = "game")
	private List<Log> rawLogs;

	public int getAiPlayer() {
		return aiPlayer;
	}

	public int getCostOfCooperation() {
		return costOfCooperation;
	}
	public int getElapseTime() {
		return elapseTime;
	}
	public double getExchangeRate() {
		return exchangeRate;
	}
	public Date getGameStart() {
		return gameStart;
	}
	public String getGid() {
		return gid;
	}
	public int getGlobalTimeout() {
		return globalTimeout;
	}
	public int getHumanPlayer() {
		return humanPlayer;
	}
	public int getIdleTimeout() {
		return idleTimeout;
	}
	public int getIndTimeout() {
		return indTimeout;
	}
	public int getMinRoundA() {
		return minRoundA;
	}
	public int getMinRoundB() {
		return minRoundB;
	}
	public String getOrderA() {
		return orderA;
	}
	public String getOrderB() {
		return orderB;
	}
	public int getPayoff() {
		return payoff;
	}
	public List<Player> getPlayers() {
		return players;
	}
	public double getPoe() {
		return poe;
	}
	public List<Log> getRawLogs() {
		return rawLogs;
	}
	public int getSeedMoney() {
		return seedMoney;
	}
	public String getStatus() {
		return status;
	}
	public boolean isElicitation() {
		return elicitation;
	}
	public boolean isFixed() {
		return fixed;
	}
	public boolean isRegular() {
		return regular;
	}
	public void setAiPlayer(int aiPlayer) {
		this.aiPlayer = aiPlayer;
	}
	public void setCostOfCooperation(int costOfCooperation) {
		this.costOfCooperation = costOfCooperation;
	}
	public void setElapseTime(int elapseTime) {
		this.elapseTime = elapseTime;
	}
	public void setElicitation(boolean elicitation) {
		this.elicitation = elicitation;
	}
	public void setExchangeRate(double exchangeRate) {
		this.exchangeRate = exchangeRate;
	}
	public void setFixed(boolean fixed) {
		this.fixed = fixed;
	}
	public void setGameStart(Date gameStart) {
		this.gameStart = gameStart;
	}
	public void setGid(String gid) {
		this.gid = gid;
	}
	public void setGlobalTimeout(int globalTimeout) {
		this.globalTimeout = globalTimeout;
	}
	public void setHumanPlayer(int humanPlayer) {
		this.humanPlayer = humanPlayer;
	}
	public void setIdleTimeout(int idleTimeout) {
		this.idleTimeout = idleTimeout;
	}
	public void setIndTimeout(int indTimeout) {
		this.indTimeout = indTimeout;
	}
	public void setMinRoundA(int minRoundA) {
		this.minRoundA = minRoundA;
	}
	public void setMinRoundB(int minRoundB) {
		this.minRoundB = minRoundB;
	}
	public void setOrderA(String orderA) {
		this.orderA = orderA;
	}
	public void setOrderB(String orderB) {
		this.orderB = orderB;
	}
	public void setPayoff(int payoff) {
		this.payoff = payoff;
	}
	public void setPlayers(List<Player> players) {
		this.players = players;
	}
	public void setPoe(double poe) {
		this.poe = poe;
	}

	public void setRawLogs(List<Log> rawLogs) {
		this.rawLogs = rawLogs;
	}

	public void setRegular(boolean regular) {
		this.regular = regular;
	}

	public void setSeedMoney(int seedMoney) {
		this.seedMoney = seedMoney;
	}

	public void setStatus(String status) {
		this.status = status;
	}
}
