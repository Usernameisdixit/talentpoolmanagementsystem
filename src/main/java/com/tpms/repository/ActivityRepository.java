package com.tpms.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

	@Query(value = "SELECT a.*,allocation.activityFor,allocation.activityAllocateId FROM activity a "
			+ "INNER JOIN activity_allocation allocation ON a.activityId = allocation.activityId  "
			+ "WHERE :selectedDate BETWEEN allocation.activityFromDate AND allocation.activityToDate", nativeQuery = true)
	List<Map<String, Object>> getActvitiesByDate(String selectedDate);

//	@Query(value="SELECT distinct a.* FROM activity a " +
//	           "INNER JOIN activity_allocation allocation ON a.activityId = allocation.activityId  " +
//	           "WHERE :selectedDate BETWEEN allocation.activityFromDate AND allocation.activityToDate",nativeQuery = true)
//	List<Activity> getActvitiesByDate(String selectedDate);

	@Query(value = "SELECT a.activityId, a.activityName," + "COUNT(*) AS total, "
			+ "SUM(CASE WHEN atn.isPresent = 1 THEN 1 ELSE 0 END) AS presentCount, "
			+ "SUM(CASE WHEN atn.isPresent = 0 THEN 1 ELSE 0 END) AS absentCount " + "FROM activity_allocation aa "
			+ "JOIN activity a ON aa.activityId = a.activityId "
			+ "LEFT JOIN attendance atn ON aa.activityAllocateId = atn.activityAllocateId "
			+ "AND aa.activityAllocateId = atn.activityAllocateId " + "where atn.atendanceDate=:atendanceDate "
			+ "GROUP BY a.activityName,a.activityId", nativeQuery = true)

	List<Map<String, String>> getActivityAttendanceSummary(String atendanceDate);

	@Query(value = "SELECT DISTINCT act.* " + "FROM activity act "
			+ "INNER JOIN activity_allocation alo ON alo.activityId = act.activityId "
			+ "INNER JOIN attendance att ON att.activityAllocateId = alo.activityAllocateId "
			+ "WHERE att.atendanceDate >= :formattedFromDate " + "AND att.atendanceDate <= :formattedToDate "
			+ "order by act.activityName", nativeQuery = true)
	List<Activity> getActvitiesByDateRange(String formattedFromDate, String formattedToDate);

	@Query(value = "select distinct aa.activityName,\r\n" + "case when aal.activityFor=1 then '1st Half' \r\n"
			+ "when aal.activityFor=2 then '2nd Half' "
			+ "when aal.activityFor=3 then 'Full Day' "
			+ "end as activityFor, \r\n"
			+ "aal.fromHours, aal.toHours ,aal.activityFromDate,aal.activitytoDate\r\n"
			+ " from activity_allocation aal \r\n" + " inner join activity aa \r\n"
			+ " on aal.activityId=aa.activityId\r\n"
			+ "WHERE aal.activitytoDate between :activityFromDate and :activityToDate\r\n"
			+ "order by aal.activityFromDate, aal.activitytoDate", nativeQuery = true)

	List<Map<String, String>> getactivitydata(String activityFromDate, String activityToDate);

	@Query(value = "select distinct count(*)\r\n" + " from activity_allocation aal \r\n"
			+ " inner join activity aa \r\n" + " on aal.activityId=aa.activityId\r\n"
			+ "WHERE aal.activitytoDate between :activityFromDate and :activityToDate\r\n"
			+ "order by  aal.activityFromDate, aal.activitytoDate", nativeQuery = true)
	Integer findAllActivityFromtodate(String activityFromDate, String activityToDate);

	List<Activity> findByDeletedFlagFalse();

	Activity findByActivityNameAndDeletedFlagFalse(String activityName);

	Activity findByResponsPerson1AndActivityName(String responsPerson1, String activityName);

	@Query(value = """
			select exists(select * from activity_allocation alo
			inner join activity act on act.activityId=alo.activityId
			where alo.activityId=:activityId)""", nativeQuery = true)
	Integer checkForExistActivity(Integer activityId);

	@Query(value = "SELECT DISTINCT act.* FROM activity act \r\n"
			+ "			INNER JOIN activity_allocation alo ON alo.activityId = act.activityId \r\n"
			+ "			WHERE alo.activityFromDate >= :formattedFromDate\r\n"
			+ "			AND alo.activityToDate <= :formattedToDate\r\n"
			+ "			order by act.activityName", nativeQuery = true)
	List<Activity> getActvitiesReportByDateRange(String formattedFromDate, String formattedToDate);

	@Query(value = "select res.resourceId,res.resourceName,allDetails.activityAllocateDetId,\r\n"
			+ "allocation.activityFor  ,\r\n" + "allocation.fromHours ,\r\n" + "allocation.toHours ,\r\n"
			+ "        activity.activityName,\r\n" + "         activity.activityName,\r\n"
			+ "         res.platform,\r\n" + "         res.designation,\r\n" + "         res.resourceCode,\r\n"
			+ "         allocation.activityAllocateId,\r\n" + "         allDetails.activityAllocateDetId,\r\n"
			+ "		DATE_FORMAT(allocation.activityFromDate, '%d %b %Y') as activityFromDate,\r\n"
			+ "		DATE_FORMAT(allocation.activityToDate, '%d %b %Y') as activityToDate\r\n"
			+ "from activity_allocation allocation\r\n"
			+ "inner join activity_allocation_details  allDetails  on allocation.activityAllocateId=allDetails.activityAllocateId\r\n"
			+ "inner join activity activity on activity.activityId=allocation.activityId\r\n"
			+ "inner join  resource_pool res on res.resourceId=allDetails.resourceId\r\n"
			+ "where  allocation.activityFromDate >= :formattedFromDate and allocation.activityToDate<= :formattedToDate and allocation.activityId= :activityId\r\n"
			+ "order by allocation.activityFromDate, allocation.activityFor, res.resourceName", nativeQuery = true)

	List<Object[]> getactivitypdfdata(String formattedFromDate, String formattedToDate, String activityId);

	@Query(value = "SELECT \r\n" + "    DATE_FORMAT(alo.activityFromDate, '%d %b %Y') as activityFromDate,\r\n"
			+ "    DATE_FORMAT(alo.activityToDate, '%d %b %Y') as activityToDate,\r\n"
			+ "    alo.activityId,res.resourceName,res.resourceCode,res.designation,pla.platform,alo.fromHours,\r\n"
			+ "    alo.activityFor,alo.toHours,act.activityName,res.resourceId\r\n"
			+ "FROM  activity_allocation alo \r\n"
			+ "inner join activity_allocation_details dt  on alo.activityAllocateId=dt.activityAllocateId\r\n"
			+ "inner join resource_pool res on res.resourceId=dt.resourceId\r\n"
			+ "inner join platforms pla on pla.platform=res.platform\r\n"
			+ "inner join activity act on act.activityId=alo.activityId\r\n"
			+ "WHERE alo.activityFromDate >= :formattedFromDate \r\n"
			+ "AND alo.activityToDate <= :formattedToDate    \r\n" + "     AND (\r\n"
			+ "    ( CONCAT(res.resourceName, '(', res.resourceCode, ')') = :resourceValue))\r\n"
			+ "    order by alo.activityFromDate,res.resourceName", nativeQuery = true)
	List<Object[]> getactivitydataaccordingtoresource(String formattedFromDate, String formattedToDate,
			String resourceValue);

	@Query(value = """
			    		SELECT distinct act.*
			FROM assessment ass
			inner join  activity act on act.activityId=ass.activityId
			WHERE ass.asesmentDate BETWEEN :formattedFromDate AND :formattedToDate
			    		""", nativeQuery = true)
	List<Activity> getActvitiesByDateRangeForAssement(String formattedFromDate, String formattedToDate);
	
	
	@Query(value = "SELECT   res.resourceCode,act.activityName\r\n"
			+ "			FROM  activity_allocation alo \r\n"
			+ "			inner join activity_allocation_details dt  on alo.activityAllocateId=dt.activityAllocateId\r\n"
			+ "			inner join resource_pool res on res.resourceId=dt.resourceId\r\n"
			+ "			inner join platforms pla on pla.platform=res.platform\r\n"
			+ "			inner join activity act on act.activityId=alo.activityId\r\n"
			+ "			WHERE  res.resourceCode = :resourceCode\r\n"
			+ "			    order by alo.activityFromDate,res.resourceName", nativeQuery = true)
     List<Object[]> getAllResourceByCode(@Param("resourceCode") String resourceCode);

     @Query(value="""
		      select * from activity
             where activityId=if(:activityId=0,activityId,:activityId)
            and (responsPerson1 like if(:activityPerson='',responsPerson1 ,CONCAT('%', :activityPerson, '%'))
            or responsPerson2 like if(:activityPerson='',responsPerson2 ,CONCAT('%', :activityPerson, '%')));
		""", nativeQuery = true)
Page<Activity> findByActivityNameAndActivityPerson(Integer activityId, String activityPerson,Pageable pageable);
	
	

}