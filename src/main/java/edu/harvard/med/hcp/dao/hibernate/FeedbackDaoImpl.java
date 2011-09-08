package edu.harvard.med.hcp.dao.hibernate;

import org.springframework.stereotype.Repository;

import edu.harvard.med.hcp.dao.FeedbackDao;
import edu.harvard.med.hcp.model.Feedback;

@Repository
public class FeedbackDaoImpl extends GenericDaoImpl<Feedback> implements FeedbackDao {

}