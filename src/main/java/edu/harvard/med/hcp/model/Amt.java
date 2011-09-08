package edu.harvard.med.hcp.model;

import javax.persistence.Entity;

@Entity
public class Amt extends AbstractIdentityEntity {
	private String title;
	private String description;
	private String info;
	private String blackList;
	private int lifeTime; // seconds
	private int gameDuration; // seconds
	private int approvalDelay; // seconds
	private int frameHeight; // pixels
	private int maxWorkers;
	private int minWorkers;
	private double reward;
	private String awsAccessKey;
	private String awsSecretKey;
	private String authSecret;
	private boolean handleSubmit;
	private boolean alwaysPay;
	private boolean sandbox;
	public int getApprovalDelay() {
		return approvalDelay;
	}
	public String getAuthSecret() {
		return authSecret;
	}
	public String getAwsAccessKey() {
		return awsAccessKey;
	}
	public String getAwsSecretKey() {
		return awsSecretKey;
	}
	public String getBlackList() {
		return blackList;
	}
	public String getDescription() {
		return description;
	}
	public int getFrameHeight() {
		return frameHeight;
	}
	public int getGameDuration() {
		return gameDuration;
	}
	public String getInfo() {
		return info;
	}
	public int getLifeTime() {
		return lifeTime;
	}
	public int getMaxWorkers() {
		return maxWorkers;
	}
	public int getMinWorkers() {
		return minWorkers;
	}
	public double getReward() {
		return reward;
	}
	public String getTitle() {
		return title;
	}
	public boolean isAlwaysPay() {
		return alwaysPay;
	}
	public boolean isHandleSubmit() {
		return handleSubmit;
	}
	public boolean isSandbox() {
		return sandbox;
	}
	public void setAlwaysPay(boolean alwaysPay) {
		this.alwaysPay = alwaysPay;
	}
	public void setApprovalDelay(int approvalDelay) {
		this.approvalDelay = approvalDelay;
	}
	public void setAuthSecret(String authSecret) {
		this.authSecret = authSecret;
	}
	public void setAwsAccessKey(String awsAccessKey) {
		this.awsAccessKey = awsAccessKey;
	}
	public void setAwsSecretKey(String awsSecretKey) {
		this.awsSecretKey = awsSecretKey;
	}
	public void setBlackList(String blackList) {
		this.blackList = blackList;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public void setFrameHeight(int frameHeight) {
		this.frameHeight = frameHeight;
	}
	public void setGameDuration(int gameDuration) {
		this.gameDuration = gameDuration;
	}
	public void setHandleSubmit(boolean handleSubmit) {
		this.handleSubmit = handleSubmit;
	}
	public void setInfo(String info) {
		this.info = info;
	}
	public void setLifeTime(int lifeTime) {
		this.lifeTime = lifeTime;
	}
	public void setMaxWorkers(int maxWorkers) {
		this.maxWorkers = maxWorkers;
	}
	public void setMinWorkers(int minWorkers) {
		this.minWorkers = minWorkers;
	}
	public void setReward(double reward) {
		this.reward = reward;
	}
	public void setSandbox(boolean sandbox) {
		this.sandbox = sandbox;
	}
	public void setTitle(String title) {
		this.title = title;
	}
}
