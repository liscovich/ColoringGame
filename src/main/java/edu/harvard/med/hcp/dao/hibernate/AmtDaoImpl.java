package edu.harvard.med.hcp.dao.hibernate;

import org.springframework.stereotype.Repository;

import edu.harvard.med.hcp.dao.AmtDao;
import edu.harvard.med.hcp.model.Amt;

@Repository
public class AmtDaoImpl extends GenericDaoImpl<Amt> implements AmtDao {

}