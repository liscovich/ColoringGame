package edu.harvard.med.hcp.dao.hibernate;

import org.springframework.stereotype.Repository;

import edu.harvard.med.hcp.dao.PlayerDao;
import edu.harvard.med.hcp.model.Player;

@Repository
public class PlayerDaoImpl extends GenericDaoImpl<Player> implements PlayerDao {

}