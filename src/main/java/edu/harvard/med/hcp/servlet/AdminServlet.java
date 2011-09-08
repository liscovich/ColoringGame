package edu.harvard.med.hcp.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.google.gson.Gson;

import edu.harvard.med.hcp.exception.GeneralException;
import edu.harvard.med.hcp.model.Amt;
import edu.harvard.med.hcp.service.AdminService;

@SuppressWarnings("serial")
public class AdminServlet extends HttpServlet {
	private static Logger logger = Logger.getLogger(AdminServlet.class);
	private ApplicationContext applicationContext;
	private AdminService adminService;

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String action = req.getParameter("a");
		if (action == null || action.isEmpty()) {
			return;
		}

		Map<String, Object> result = new HashMap<String, Object>();
		String responseString = "";
		try {
			if (action.equals("updateAmtInfo")) {
				adminService.updateAmtInfo(req);
			} else if (action.equals("getAmtInfo")) {
				Amt amt = adminService.getAmtInfo(req);
				responseString = new Gson().toJson(amt);
			}
		} catch (GeneralException e) {
			result.put("error", e.getMessage());
			responseString = new Gson().toJson(result);
		} catch (Exception e) {
			result.put("error", "Error happen! Please contact us liscovich@gmail.com!");
			responseString = new Gson().toJson(result);
			logger.error(e.getMessage(), e);
		}
		resp.setContentType("application/json");
		PrintWriter out = resp.getWriter();
		out.println(responseString);
	}

	@Override
	public void init() throws ServletException {
		super.init();
		applicationContext = WebApplicationContextUtils
			.getWebApplicationContext(getServletContext());
		adminService = (AdminService) applicationContext.getBean("adminService");
	}
}
