package com.tpms.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tpms.entity.Attendance;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {


	List<Attendance> findByActivityAllocateDetIdAndAtendanceDate(Integer intActivityAllocateDetId, Date finaldate);


	@Query(value = "SELECT att.* FROM attendance att "
			+ "INNER JOIN activity_allocation alocation ON alocation.activityAllocateId = att.activityAllocateId "
			+ "INNER JOIN activity_allocation_details dtls ON dtls.activityAllocateDetId = att.activityAllocateDetId "
			+ "INNER JOIN activity activity ON activity.activityId = alocation.activityId "
			+ "WHERE att.atendanceDate=:finalDate AND att.activityAllocateId = :selectedActivity", nativeQuery = true)
	List<Attendance> findByAttendanceDateAndActivity(Date finalDate, Integer selectedActivity);

	Integer countByActivityAllocateId(Long id);

}
