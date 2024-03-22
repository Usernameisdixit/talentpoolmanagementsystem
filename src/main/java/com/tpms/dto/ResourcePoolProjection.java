package com.tpms.dto;

import java.time.LocalDate;

public interface ResourcePoolProjection {

	public Integer getResourceId();
	public String getResourceName();
	public String getResourceCode();
	public String getDesignation();
	public String getPlatform();
	public String getLocation();
	public String getEngagementPlan();
	public String getExperience();
	public LocalDate getAllocationDate();
	public String getPhoneNo();
	public String getEmail();
	public Byte getDeletedFlag();
}
