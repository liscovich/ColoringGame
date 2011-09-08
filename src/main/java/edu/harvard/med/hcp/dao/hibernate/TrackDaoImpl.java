package edu.harvard.med.hcp.dao.hibernate;

import org.springframework.stereotype.Repository;

import edu.harvard.med.hcp.dao.TrackDao;
import edu.harvard.med.hcp.model.Track;

@Repository
public class TrackDaoImpl extends GenericDaoImpl<Track> implements TrackDao {

}