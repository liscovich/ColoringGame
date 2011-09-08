package edu.harvard.med.hcp.dao.hibernate;

import org.springframework.stereotype.Repository;

import edu.harvard.med.hcp.dao.LogDao;
import edu.harvard.med.hcp.model.Log;

@Repository
public class LogDaoImpl extends GenericDaoImpl<Log>
	implements LogDao {

}