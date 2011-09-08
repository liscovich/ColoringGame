package edu.harvard.med.hcp.service.impl;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.harvard.med.hcp.dao.AmtDao;
import edu.harvard.med.hcp.exception.GeneralException;
import edu.harvard.med.hcp.model.Amt;
import edu.harvard.med.hcp.service.AdminService;

@Service
public class AdminServiceImpl implements AdminService {
	@Autowired AmtDao amtDao;

	@Override
	public Amt getAmtInfo(HttpServletRequest req) throws GeneralException {
		String idStr = req.getParameter("id");
		Integer id = null;
		if (StringUtils.isNumeric(idStr)) {
			id = Integer.parseInt(idStr);
			return amtDao.getById(id);
		}
		return null;
	}

	public void setHksGameDao(AmtDao amtDao) {
		this.amtDao = amtDao;
	}

	@Override
	public void updateAmtInfo(HttpServletRequest req) throws GeneralException {
		String idStr = req.getParameter("id");
		Integer id = null;
		if (StringUtils.isNumeric(idStr)) {
			id = Integer.parseInt(idStr);
		} else {
			return;
		}

		Amt amt;
		if (id == 1) {
			// check if the default AMT info exists. If not, create it.
			amt = amtDao.getById(id);
			if (amt == null) {
				amt = new Amt();
				amtDao.addObject(amt);
			}
		}

		amt = amtDao.getById(id);
		if (amt != null) {
			amt.setAlwaysPay("true".equals(req.getParameter("always_pay")));
			if (StringUtils.isNumeric(req.getParameter("approval_delay"))) {
				amt.setApprovalDelay(Integer.parseInt(req.getParameter("approval_delay")));
			}
			if (!StringUtils.isEmpty(req.getParameter("auth_secret"))) {
				amt.setAuthSecret(req.getParameter("auth_secret"));
			}
			if (!StringUtils.isEmpty(req.getParameter("aws_access_key"))) {
				amt.setAwsAccessKey(req.getParameter("aws_access_key"));
			}
			if (!StringUtils.isEmpty(req.getParameter("aws_secret_key"))) {
				amt.setAwsSecretKey(req.getParameter("aws_secret_key"));
			}
			if (!StringUtils.isEmpty(req.getParameter("blacklist"))) {
				amt.setBlackList(req.getParameter("blacklist"));
			}
			if (!StringUtils.isEmpty(req.getParameter("description"))) {
				amt.setDescription(req.getParameter("description"));
			}
			if (StringUtils.isNumeric(req.getParameter("duration"))) {
				amt.setGameDuration(Integer.parseInt(req.getParameter("duration")));
			}
			if (StringUtils.isNumeric(req.getParameter("frame_height"))) {
				amt.setFrameHeight(Integer.parseInt(req.getParameter("frame_height")));
			}
			amt.setHandleSubmit("true".equals(req.getParameter("handle_submit")));
			if (!StringUtils.isEmpty(req.getParameter("info"))) {
				amt.setInfo(req.getParameter("info"));
			}
			if (StringUtils.isNumeric(req.getParameter("lifetime"))) {
				amt.setLifeTime(Integer.parseInt(req.getParameter("lifetime")));
			}
			if (StringUtils.isNumeric(req.getParameter("max_workers"))) {
				amt.setMaxWorkers(Integer.parseInt(req.getParameter("max_workers")));
			}
			if (StringUtils.isNumeric(req.getParameter("min_workers"))) {
				amt.setMinWorkers(Integer.parseInt(req.getParameter("min_workers")));
			}
			if (StringUtils.isNumeric(req.getParameter("reward"))) {
				amt.setReward(Double.parseDouble(req.getParameter("reward")));
			}
			amt.setSandbox("true".equals(req.getParameter("sandbox")));
			if (!StringUtils.isEmpty(req.getParameter("title"))) {
				amt.setTitle(req.getParameter("title"));
			}
			amtDao.update(amt);
		}
	}
}
