package edu.harvard.med.hcp.dao.hibernate;

import org.springframework.stereotype.Repository;

import edu.harvard.med.hcp.dao.EarningDao;
import edu.harvard.med.hcp.model.Earning;

@Repository
public class EarningDaoImpl extends GenericDaoImpl<Earning> implements EarningDao {

}