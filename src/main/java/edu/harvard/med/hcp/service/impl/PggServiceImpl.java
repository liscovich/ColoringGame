package edu.harvard.med.hcp.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.harvard.med.hcp.dao.DecisionDao;
import edu.harvard.med.hcp.dao.EarningDao;
import edu.harvard.med.hcp.dao.FeedbackDao;
import edu.harvard.med.hcp.dao.LogDao;
import edu.harvard.med.hcp.dao.PartDao;
import edu.harvard.med.hcp.dao.PggDao;
import edu.harvard.med.hcp.dao.PlayerDao;
import edu.harvard.med.hcp.dao.TrackDao;
import edu.harvard.med.hcp.exception.GeneralException;
import edu.harvard.med.hcp.mcknight.game.LiscovichGame;
import edu.harvard.med.hcp.mcknight.game.Player;
import edu.harvard.med.hcp.model.Decision;
import edu.harvard.med.hcp.model.Earning;
import edu.harvard.med.hcp.model.Feedback;
import edu.harvard.med.hcp.model.Log;
import edu.harvard.med.hcp.model.Part;
import edu.harvard.med.hcp.model.Track;
import edu.harvard.med.hcp.service.PggService;

@Service
public class PggServiceImpl implements PggService {
	@SuppressWarnings("unused")
	private static Logger logger = Logger.getLogger(PggServiceImpl.class);
	@Autowired private PlayerDao playerDao;
	@Autowired private PggDao pggDao;
	@Autowired private LogDao logDao;
	@Autowired private PartDao partDao;
	@Autowired private DecisionDao decisionDao;
	@Autowired private FeedbackDao feedbackDao;
	@Autowired private EarningDao earningDao;
	@Autowired private TrackDao trackDao;

	@Override
	public void addFeedback(String gid, int pid, String instr, String inter,
			String speed, String strat, String think) throws GeneralException {
		edu.harvard.med.hcp.model.Pgg game = pggDao.getByProperty(
				"gid", gid).get(0);
		edu.harvard.med.hcp.model.Player p = playerDao.getByProperty(
				"pid", pid).get(0);
		if (StringUtils.isNumeric(instr)
				&& StringUtils.isNumeric(inter)
				&& StringUtils.isNumeric(speed)) {
			Feedback feedback = new Feedback();
			feedback.setGame(game);
			feedback.setInstruction(Integer.parseInt(instr));
			feedback.setInteresting(Integer.parseInt(inter));
			feedback.setSpeed(Integer.parseInt(speed));
			feedback.setPlayer(p);
			feedback.setStrategy(strat);
			feedback.setThoughts(think);
			feedbackDao.addObject(feedback);
		}
	}

	@Override
	public boolean checkDuplicateServerId(String serverid) {
		List<edu.harvard.med.hcp.model.Pgg> games = pggDao.getByProperty(
				"gid", serverid);
		return games.isEmpty();
	}

	@Override
	public void createGame(LiscovichGame pgg) throws GeneralException {
		edu.harvard.med.hcp.model.Pgg game =
			new edu.harvard.med.hcp.model.Pgg();
		game.setAiPlayer(pgg.getNumAiPlayers());
		game.setCostOfCooperation(pgg.getCostOfCooperation());
		game.setElicitation(pgg.getEli().equals("Yes"));
		game.setExchangeRate(pgg.getExchangeRate());
		game.setPoe(pgg.getPoe());
		game.setFixed(pgg.isFixed());
		game.setGid(pgg.getGid());
		game.setGlobalTimeout(pgg.getGlobalTimeout());
		game.setHumanPlayer(pgg.getNumPlayers()
				- pgg.getNumAiPlayers());
		game.setIdleTimeout(pgg.getIdleTimeout());
		game.setIndTimeout(pgg.getPlayerTimeout());
		game.setMinRoundA(pgg.getRoundsA());
		game.setMinRoundB(pgg.getRoundsB());
		game.setOrderA(pgg.getOrderA());
		game.setOrderB(pgg.getOrderB());
		game.setPayoff(pgg.getPayoff());
		game.setPoe(pgg.getPoe());
		game.setRegular(pgg.isRegular());
		game.setSeedMoney(pgg.getSeedMoney());
		game.setStatus(pgg.getStatus().toString());
		pggDao.addObject(game);

		List<Player> players = pgg.getPlayers();
		for (Player player : players) {
			edu.harvard.med.hcp.model.Player model =
				new edu.harvard.med.hcp.model.Player();
			model.setAi(player.getAi() == 1);
			model.setGame(game);
			model.setName(player.getName());
			model.setPid(player.getId());
			model.setStatus(player.getStatus().toString());
			playerDao.addObject(model);
		}
	}

	@Override
	public void saveGame(LiscovichGame pgg) throws GeneralException {
		edu.harvard.med.hcp.model.Pgg game = pggDao.getByProperty(
				"gid", pgg.getGid()).get(0);
		game.setElapseTime(pgg.getElapseTime());
		game.setGameStart(new Date(pgg.getGameStart()));
		game.setStatus(pgg.getStatus().toString());
		pggDao.update(game);

		List<Player> players = pgg.getPlayers();
		for (Player player : players) {
			Map<String, Object> rect = new HashMap<String, Object>();
			rect.put("game", game);
			rect.put("pid", player.getId());
			edu.harvard.med.hcp.model.Player model = playerDao.getByProperties(
					rect).get(0);
			model.setAssignmentId(player.getAssignmentId());
			model.setBrowserCode(player.getBrowserCode());
			model.setBrowserName(player.getBrowserName());
			model.setBrowserVersion(player.getBrowserVersion());
			model.setClientHeight(player.getClientHeight());
			model.setClientWidth(player.getClientWidth());
			model.setCookieEnabled(player.getCookieEnabled());
			model.setEliFirstMove(player.getEliFirstMove());
			model.setEliRule(player.getRule());
			model.setFinishElicitationTime(player.getfElicitationTime());
			model.setFinishTutorialTime(player.getfTutorialTime());
			model.setHitId(player.getHitId());
			model.setIp(player.getIp());
			model.setLatitude(player.getLatitude());
			model.setLongtitude(player.getLongtitude());
			model.setLocation(player.getLocation());
			model.setNote(player.getNote());
			model.setPlatform(player.getPlatform());
			model.setRobotName(player.getRobotName());
			model.setStartTime(player.getStartTime());
			model.setStopTime(player.getStopTime());
			model.setStatus(player.getStatus().toString());
			model.setSvgSupportedBrowser(player.getSvgSupported().equalsIgnoreCase("true"));
			model.setTurkerId(player.getTurkerId());
			model.setTurkSubmitTo(player.getTurkSubmitTo());
			model.setUserAgent(player.getUserAgent());
			playerDao.update(model);
		}

		List<String> logs = pgg.getLog();
		for (String string : logs) {
			Log rawLog = new Log();
			rawLog.setContent(string);
			rawLog.setGame(game);
			logDao.addObject(rawLog);
		}
	}

	@Override
	public void savePart(LiscovichGame pgg, String name, int numberOfCooperation,
			String partOrder, String playerOrder, List<Player> players,
			List<int[]> choices, int[] order, boolean simulate)
			throws GeneralException {
		edu.harvard.med.hcp.model.Pgg game = pggDao.getByProperty(
				"gid", pgg.getGid()).get(0);
		Part part = new Part();
		part.setGame(game);
		part.setNumberOfCooperation(numberOfCooperation);
		part.setPartName(name);
		part.setPartOrder(partOrder);
		part.setPlayerOrder(playerOrder);
		List<edu.harvard.med.hcp.model.Player> playerModels =
			new ArrayList<edu.harvard.med.hcp.model.Player>();
		for (Player player : players) {
			edu.harvard.med.hcp.model.Player p = playerDao.getByProperty(
					"pid", player.getId()).get(0);
			playerModels.add(p);
		}
		part.setPlayers(playerModels);
		partDao.addObject(part);

		for (int j = 0; j < choices.size(); j++) {
			int[] is = choices.get(j);
			int round = j + 1;
			for (int i = 0; i < is.length; i++) {
				Decision d = new Decision();
				d.setCooperation(is[i]);
				Player p = players.get(order[i]);
				if (p.getAi() == 0 && !simulate) {
					if (p.getDecisionMaker().get(round).startsWith("cnt")) {
						d.setDecisionMaker("Admin");
					} else if (!p.getDecisionMaker().get(round).equals(p.getTurkerId())) {
						d.setDecisionMaker(p.getDecisionMaker().get(round));
					}
				}
				int earned = 0;
				earned += is[(i - 1 + order.length) % order.length] == 1 ? pgg.getPayoff() : 0;
				earned += is[(i + 1) % order.length] == 1 ? pgg.getPayoff() : 0;
				if (is[i] == 1) {
					earned += pgg.getPayoff();
					earned -= pgg.getCostOfCooperation();
				}
				d.setEarned(earned);
				d.setLeftNeighbor_id(players.get(order[(i - 1 + order.length) % order.length]).getId());
				d.setPart(part);
				d.setPlayer_id(p.getId());
				d.setRightNeighbor_id(players.get(order[(i+1) % order.length]).getId());
				d.setRound(round);
				d.setGame(game);
				decisionDao.addObject(d);
			}
		}
	}

	@Override
	public void savePlayerEarning(List<Player> validPlayers, String gid,
			double exchangeRate, boolean eli) throws GeneralException {
		edu.harvard.med.hcp.model.Pgg game = pggDao.getByProperty(
				"gid", gid).get(0);
		for (Player player : validPlayers) {
			Earning earn = new Earning();
			earn.setExchangeRate(exchangeRate);
			earn.setGame(game);
			earn.setIp(player.getIp());
			earn.setPart1(player.getFirstSetCents());
			earn.setPart2(player.getSecondSetCents());
			edu.harvard.med.hcp.model.Player p = playerDao.getByProperty(
					"pid", player.getId()).get(0);
			earn.setPlayer(p);
			int total = player.getFirstSetCents() + player.getSecondSetCents();
			if (eli) {
				earn.setRandomSimulationPart(player.getThirdAllocationCents());
				total += player.getThirdAllocationCents();
			}
			earn.setMoney(total * exchangeRate);
			earn.setTotal(total);
			earn.setTurkerId(player.getTurkerId());
			earningDao.addObject(earn);
		}

	}

	@Override
	public void saveTracks(String gid, List<Player> players, Set<String> trackers,
			Map<String, Integer> trackersWeight) throws GeneralException {
		edu.harvard.med.hcp.model.Pgg game = pggDao.getByProperty(
				"gid", gid).get(0);
		for (Player player : players) {
			edu.harvard.med.hcp.model.Player p = playerDao.getByProperty(
					"pid", player.getId()).get(0);
			for (String content : trackers) {
				Track t = new Track();
				t.setContent(content);
				t.setGame(game);
				t.setPlayer(p);
				t.setTrackTime(new Date(player.getClickLog(content)));
				t.setWeight(trackersWeight.get(content));
				trackDao.addObject(t);
			}
		}

	}

	public void setDecisionDao(DecisionDao decisionDao) {
		this.decisionDao = decisionDao;
	}

	public void setEarningDao(EarningDao earningDao) {
		this.earningDao = earningDao;
	}

	public void setFeedbackDao(FeedbackDao feedbackDao) {
		this.feedbackDao = feedbackDao;
	}

	public void setLogDao(LogDao logDao) {
		this.logDao = logDao;
	}

	public void setPartDao(PartDao partDao) {
		this.partDao = partDao;
	}

	public void setpggDao(PggDao pggDao) {
		this.pggDao = pggDao;
	}

	public void setPlayerDao(PlayerDao playerDao) {
		this.playerDao = playerDao;
	}

	public void setTrackDao(TrackDao trackDao) {
		this.trackDao = trackDao;
	}
}
