package edu.harvard.med.hcp.dao.hibernate;

import org.springframework.stereotype.Repository;

import edu.harvard.med.hcp.dao.PggDao;
import edu.harvard.med.hcp.model.Pgg;

@Repository
public class PggDaoImpl extends GenericDaoImpl<Pgg>
	implements PggDao {

}