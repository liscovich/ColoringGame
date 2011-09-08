package edu.harvard.med.hcp.service;

import javax.servlet.http.HttpServletRequest;

import edu.harvard.med.hcp.exception.GeneralException;
import edu.harvard.med.hcp.model.Amt;



public interface AdminService {

	Amt getAmtInfo(HttpServletRequest req) throws GeneralException;

	void updateAmtInfo(HttpServletRequest req) throws GeneralException;
}
