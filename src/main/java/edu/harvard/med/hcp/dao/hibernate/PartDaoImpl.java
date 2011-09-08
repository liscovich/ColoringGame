package edu.harvard.med.hcp.dao.hibernate;

import org.springframework.stereotype.Repository;

import edu.harvard.med.hcp.dao.PartDao;
import edu.harvard.med.hcp.model.Part;

@Repository
public class PartDaoImpl extends GenericDaoImpl<Part>
	implements PartDao {

}