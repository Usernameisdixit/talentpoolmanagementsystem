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
    @Query(value = "SELECT * FROM attendance WHERE atendanceDate = :finaldate", nativeQuery = true)
	List<Attendance> findByAttendanceDate(Date finaldate);

	List<Attendance> findByActivityAllocateDetIdAndAtendanceDate(Integer intActivityAllocateDetId, Date finaldate);
	
	 @Query(value = "SELECT att.* FROM attendance att " +
	           "INNER JOIN resource_pool resourcep ON resourcep.resourceId = att.resourceId " +
	           "WHERE att.atendanceDate = :finaldate AND resourcep.platform = :platformName",nativeQuery = true)
	List<Attendance> findByAttendanceDateAndPlatform(Date finaldate, String platformName);
	 
	 @Query(value = "SELECT att.* FROM attendance att " +
	           "INNER JOIN resource_pool resourcep ON resourcep.resourceId = att.resourceId " +
	           "WHERE att.atendanceDate = :finaldate",nativeQuery = true)
	List<Attendance> findByAttendanceDateAndPlatformNew(Date finaldate);


}