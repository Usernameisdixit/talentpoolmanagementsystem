package com.tpms.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tpms.entity.Attendance;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {

  
    List<Attendance> findByActivityAllocateDetId(int activityAllocateDetId);
    
    //Previously used to check attendance data for fetched condition
    @Query(value = "SELECT * FROM tbl_attendance WHERE dtmAtendanceDate = :finaldate", nativeQuery = true)
	List<Attendance> findByAttendanceDate(Date finaldate);

	List<Attendance> findByActivityAllocateDetIdAndDtmAtendanceDate(Integer intActivityAllocateDetId, Date finaldate);
	
	 @Query(value = "SELECT * FROM tbl_attendance att " +
	           "INNER JOIN tbl_resource_pool resourcep ON resourcep.intResourceId = att.intResourceId " +
	           "WHERE att.dtmAtendanceDate = :finaldate AND resourcep.vchPlatform = :platformName",nativeQuery = true)
	List<Attendance> findByAttendanceDateAndPlatform(Date finaldate, String platformName);


}
