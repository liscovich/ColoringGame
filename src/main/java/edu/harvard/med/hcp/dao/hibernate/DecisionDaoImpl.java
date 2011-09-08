package edu.harvard.med.hcp.dao.hibernate;

import org.springframework.stereotype.Repository;

import edu.harvard.med.hcp.dao.DecisionDao;
import edu.harvard.med.hcp.model.Decision;

@Repository
public class DecisionDaoImpl extends GenericDaoImpl<Decision>
	implements DecisionDao {

}