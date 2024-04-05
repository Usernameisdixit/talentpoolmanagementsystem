package com.tpms.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tpms.entity.Activity;

import jakarta.transaction.Transactional;

public interface ActivityRepository extends JpaRepository<Activity, Integer> {

	
	@Modifying
    @Transactional
    @Query("UPDATE Activity a SET a.deletedFlag = :deletedFlag WHERE a.activityId = :activityId")
    void updateDeletedFlag(@Param("activityId") Integer activityId, @Param("deletedFlag") boolean deletedFlag);
	
//	@Query(value="SELECT distinct a.* FROM activity a " +
//	           "INNER JOIN activity_allocation_details aloDetails ON a.activityId = allocation.activityId " +
//	           "INNER JOIN activity_allocation allocation ON allocation.activityAllocateId = aloDetails.activityAllocateId " +
//	           "WHERE :selectedDate BETWEEN allocation.activityFromDate AND allocation.activityToDate",nativeQuery = true)
//	List<Activity> getActvitiesByDate(String selectedDate);
	
	
	@Query(value="SELECT distinct a.* FROM activity a " +
	           "INNER JOIN activity_allocation allocation ON a.activityId = allocation.activityId  " +
	           "WHERE :selectedDate BETWEEN allocation.activityFromDate AND allocation.activityToDate",nativeQuery = true)
	List<Activity> getActvitiesByDate(String selectedDate);
	
	
	@Query(value="SELECT a.activityId, a.activityName, a.activityRefNo, " +
	           "COUNT(*) AS total, " +
	           "SUM(CASE WHEN atn.isPresent = 1 THEN 1 ELSE 0 END) AS presentCount, " +
	           "SUM(CASE WHEN atn.isPresent = 0 THEN 1 ELSE 0 END) AS absentCount " +
	           "FROM activity_allocation aa " +
	           "JOIN activity a ON aa.activityId = a.activityId " +
	           "LEFT JOIN attendance atn ON aa.activityAllocateId = atn.activityAllocateId " +
	           "AND aa.activityAllocateId = atn.activityAllocateId " +
	           "where atn.atendanceDate=:atendanceDate "+
	           "GROUP BY a.activityName, a.activityRefNo,a.activityId", nativeQuery = true)

	List<Map<String,String>> getActivityAttendanceSummary(String atendanceDate);
	
	@Query(value = "SELECT DISTINCT act.* " + "FROM activity act "
			+ "INNER JOIN activity_allocation alo ON alo.activityId = act.activityId "
			+ "INNER JOIN attendance att ON att.activityAllocateId = alo.activityAllocateId "
			+ "WHERE att.atendanceDate >= :formattedFromDate "
			+ "AND att.atendanceDate = :formattedToDate", nativeQuery = true)
	List<Activity> getActvitiesByDateRange(String formattedFromDate, String formattedToDate);
	
}