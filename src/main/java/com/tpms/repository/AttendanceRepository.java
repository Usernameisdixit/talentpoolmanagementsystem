package com.tpms.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tpms.entity.Attendance;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {

//	List<Attendance> findByActivityAllocateDetId(int activityAllocateDetId);

//	// Previously used to check attendance data for fetched condition
//	@Query(value = "SELECT * FROM attendance WHERE atendanceDate = :finaldate", nativeQuery = true)
//	List<Attendance> findByAttendanceDate(Date finaldate);

	List<Attendance> findByActivityAllocateDetIdAndAtendanceDate(Integer intActivityAllocateDetId, Date finaldate);

//	// Used for when attendance comes as platform and date basis
//	@Query(value = "SELECT att.* FROM attendance att "
//			+ "INNER JOIN resource_pool resourcep ON resourcep.resourceId = att.resourceId "
//			+ "WHERE att.atendanceDate = :finaldate AND resourcep.platform = :platformName", nativeQuery = true)
//	List<Attendance> findByAttendanceDateAndPlatform(Date finaldate, String platformName);

//	// Used for when attendance comes as date basis as accordian
//	@Query(value = "SELECT att.* FROM attendance att "
//			+ "INNER JOIN resource_pool resourcep ON resourcep.resourceId = att.resourceId "
//			+ "WHERE att.atendanceDate = :finaldate", nativeQuery = true)
//	List<Attendance> findByAttendanceDateAndPlatformNew(Date finaldate);


	@Query(value = "SELECT att.* FROM attendance att "
			+ "INNER JOIN activity_allocation alocation ON alocation.activityAllocateId = att.activityAllocateId "
			+ "INNER JOIN activity_allocation_details dtls ON dtls.activityAllocateDetId = att.activityAllocateDetId "
			+ "INNER JOIN activity activity ON activity.activityId = alocation.activityId "
			+ "WHERE att.atendanceDate=:finalDate AND att.activityAllocateId = :selectedActivity", nativeQuery = true)
	List<Attendance> findByAttendanceDateAndActivity(Date finalDate, Integer selectedActivity);

	Integer countByActivityAllocateId(Long id);

}
