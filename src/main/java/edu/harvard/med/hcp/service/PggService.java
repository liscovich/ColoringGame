package edu.harvard.med.hcp.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

import edu.harvard.med.hcp.exception.GeneralException;
import edu.harvard.med.hcp.mcknight.game.LiscovichGame;
import edu.harvard.med.hcp.mcknight.game.Player;


public interface PggService {
	void addFeedback(String gid, int id, String instr, String inter,
			String speed, String strat, String think) throws GeneralException;

	boolean checkDuplicateServerId(String serverid);

	void createGame(LiscovichGame liscovichGame) throws GeneralException;

	void saveGame(LiscovichGame lgGame) throws GeneralException;

	void savePart(LiscovichGame pgg, String name, int numberOfCooperation,
			String partOrder, String playerOrder, List<Player> players,
			List<int[]> choices, int[] order, boolean simulate)
			throws GeneralException;

	void savePlayerEarning(List<Player> validPlayers, String gid,
			double exchangeRate, boolean eli) throws GeneralException;

	void saveTracks(String gid, List<Player> players, Set<String> trackers,
			Map<String, Integer> trackersWeight) throws GeneralException;
}
