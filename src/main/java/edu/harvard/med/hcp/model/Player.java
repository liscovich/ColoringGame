package edu.harvard.med.hcp.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
public class Player extends AbstractIdentityEntity {
	private int pid;
	@NotEmpty
	private String name;
	private String robotName;
	@NotEmpty
	private String status;
	private boolean ai;
	@NotNull
	@ManyToOne
	private Pgg game;
	private String turkerId;
	private String note;
	@Temporal(TemporalType.TIMESTAMP)
	private Date startTime, stopTime, finishTutorialTime, finishElicitationTime;
	private int eliRule;
	private int eliFirstMove;
	private boolean svgSupportedBrowser;
	private String ip = ""; // IP address
	private String browserCode = "";
	private String browserName = "";
	@Column(length=1000)
	private String browserVersion = "";
	private String platform = "";
	private String cookieEnabled = "";
	@Column(length=1000)
	private String userAgent = "";
	private String longtitude = "";
	private String latitude = "";
	private String location = "";
	private String clientWidth = "";
	private String clientHeight = "";
	private String assignmentId = "";
	private String hitId = "";
	@Column(length=1000)
	private String turkSubmitTo = "";

	public String getAssignmentId() {
		return assignmentId;
	}

	public String getBrowserCode() {
		return browserCode;
	}

	public String getBrowserName() {
		return browserName;
	}

	public String getBrowserVersion() {
		return browserVersion;
	}

	public String getClientHeight() {
		return clientHeight;
	}

	public String getClientWidth() {
		return clientWidth;
	}

	public String getCookieEnabled() {
		return cookieEnabled;
	}

	public int getEliFirstMove() {
		return eliFirstMove;
	}

	public int getEliRule() {
		return eliRule;
	}

	public Date getFinishElicitationTime() {
		return finishElicitationTime;
	}
	public Date getFinishTutorialTime() {
		return finishTutorialTime;
	}
	public Pgg getGame() {
		return game;
	}
	public String getHitId() {
		return hitId;
	}
	public String getIp() {
		return ip;
	}
	public String getLatitude() {
		return latitude;
	}
	public String getLocation() {
		return location;
	}
	public String getLongtitude() {
		return longtitude;
	}
	public String getName() {
		return name;
	}
	public String getNote() {
		return note;
	}
	public int getPid() {
		return pid;
	}
	public String getPlatform() {
		return platform;
	}
	public String getRobotName() {
		return robotName;
	}
	public Date getStartTime() {
		return startTime;
	}

	public String getStatus() {
		return status;
	}

	public Date getStopTime() {
		return stopTime;
	}

	public String getTurkerId() {
		return turkerId;
	}

	public String getTurkSubmitTo() {
		return turkSubmitTo;
	}

	public String getUserAgent() {
		return userAgent;
	}

	public boolean isAi() {
		return ai;
	}

	public boolean isSvgSupportedBrowser() {
		return svgSupportedBrowser;
	}

	public void setAi(boolean ai) {
		this.ai = ai;
	}

	public void setAssignmentId(String assignmentId) {
		this.assignmentId = assignmentId;
	}

	public void setBrowserCode(String browserCode) {
		this.browserCode = browserCode;
	}

	public void setBrowserName(String browserName) {
		this.browserName = browserName;
	}

	public void setBrowserVersion(String browserVersion) {
		this.browserVersion = browserVersion;
	}

	public void setClientHeight(String clientHeight) {
		this.clientHeight = clientHeight;
	}

	public void setClientWidth(String clientWidth) {
		this.clientWidth = clientWidth;
	}

	public void setCookieEnabled(String cookieEnabled) {
		this.cookieEnabled = cookieEnabled;
	}

	public void setEliFirstMove(int eliFirstMove) {
		this.eliFirstMove = eliFirstMove;
	}

	public void setEliRule(int eliRule) {
		this.eliRule = eliRule;
	}

	public void setFinishElicitationTime(Date finishElicitationTime) {
		this.finishElicitationTime = finishElicitationTime;
	}

	public void setFinishTutorialTime(Date finishTutorialTime) {
		this.finishTutorialTime = finishTutorialTime;
	}

	public void setGame(Pgg game) {
		this.game = game;
	}

	public void setHitId(String hitId) {
		this.hitId = hitId;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public void setLongtitude(String longtitude) {
		this.longtitude = longtitude;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public void setPid(int pid) {
		this.pid = pid;
	}

	public void setPlatform(String platform) {
		this.platform = platform;
	}

	public void setRobotName(String robotName) {
		this.robotName = robotName;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public void setStopTime(Date stopTime) {
		this.stopTime = stopTime;
	}

	public void setSvgSupportedBrowser(boolean svgSupportedBrowser) {
		this.svgSupportedBrowser = svgSupportedBrowser;
	}

	public void setTurkerId(String turkerId) {
		this.turkerId = turkerId;
	}

	public void setTurkSubmitTo(String turkSubmitTo) {
		this.turkSubmitTo = turkSubmitTo;
	}

	public void setUserAgent(String userAgent) {
		this.userAgent = userAgent;
	}
}
