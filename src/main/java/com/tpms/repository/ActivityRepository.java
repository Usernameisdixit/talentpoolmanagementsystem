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

	@Query(value = """
            select distinct aa.activityName, case when aal.activityFor=1 then '1st Half'
            when aal.activityFor=2 then '2nd Half'
            when aal.activityFor=3 then 'Full Day'
            end as activityFor,
            aal.fromHours, aal.toHours, aal.activityFromDate, aal.activitytoDate
            from activity_allocation aal inner join activity aa
            on aal.activityId=aa.activityId
            WHERE aal.activitytoDate between :activityFromDate and :activityToDate
            order by aal.activityFromDate, aal.activitytoDate
         """, nativeQuery = true)

	List<Map<String, String>> getactivitydata(String activityFromDate, String activityToDate);

	@Query(value = """
			select distinct count(*) from activity_allocation aal 
			inner join activity aa on aal.activityId=aa.activityId
			WHERE aal.activitytoDate between :activityFromDate and :activityToDate
			order by  aal.activityFromDate, aal.activitytoDate
			""", nativeQuery = true)
	Integer findAllActivityFromtodate(String activityFromDate, String activityToDate);

	List<Activity> findByDeletedFlagFalse();

	Activity findByActivityNameAndDeletedFlagFalse(String activityName);

	Activity findByResponsPerson1AndActivityName(String responsPerson1, String activityName);

	@Query(value = """
			select exists(select * from activity_allocation alo
			inner join activity act on act.activityId=alo.activityId
			where alo.activityId=:activityId)""", nativeQuery = true)
	Integer checkForExistActivity(Integer activityId);

	@Query(value = """
			SELECT DISTINCT act.* FROM activity act
			INNER JOIN activity_allocation alo ON alo.activityId = act.activityId
			WHERE alo.activityFromDate >= :formattedFromDate
			AND alo.activityToDate <= :formattedToDate
			order by act.activityName
			""", nativeQuery = true)
	List<Activity> getActvitiesReportByDateRange(String formattedFromDate, String formattedToDate);

	@Query(value = """
			select res.resourceId,res.resourceName,allDetails.activityAllocateDetId,
			allocation.activityFor,allocation.fromHours ,allocation.toHours ,
			activity.activityName, activity.activityName,
			res.platform,res.designation, res.resourceCode,
			allocation.activityAllocateId, allDetails.activityAllocateDetId,
			DATE_FORMAT(allocation.activityFromDate, '%d %b %Y') as activityFromDate,
			DATE_FORMAT(allocation.activityToDate, '%d %b %Y') as activityToDate
			from activity_allocation allocation
			inner join activity_allocation_details  allDetails  on allocation.activityAllocateId=allDetails.activityAllocateId
			inner join activity activity on activity.activityId=allocation.activityId
			inner join  resource_pool res on res.resourceId=allDetails.resourceId
			where  allocation.activityFromDate >= :formattedFromDate and allocation.activityToDate<= :formattedToDate and allocation.activityId= :activityId
			order by allocation.activityFromDate, allocation.activityFor, res.resourceName
			""", nativeQuery = true)

	List<Object[]> getactivitypdfdata(String formattedFromDate, String formattedToDate, String activityId);

	@Query(value = """
			SELECT DATE_FORMAT(alo.activityFromDate, '%d %b %Y') as activityFromDate,
			   DATE_FORMAT(alo.activityToDate, '%d %b %Y') as activityToDate,
			   alo.activityId,res.resourceName,res.resourceCode,res.designation,pla.platform,alo.fromHours,
			   alo.activityFor,alo.toHours,act.activityName,res.resourceId
			   FROM  activity_allocation alo
			   inner join activity_allocation_details dt  on alo.activityAllocateId=dt.activityAllocateId
			   inner join resource_pool res on res.resourceId=dt.resourceId
			   inner join platforms pla on pla.platform=res.platform
			   inner join activity act on act.activityId=alo.activityId
			   WHERE alo.activityFromDate >= :formattedFromDate
			   AND alo.activityToDate <= :formattedToDate AND (
			   ( CONCAT(res.resourceName, '(', res.resourceCode, ')') = :resourceValue))
			   order by alo.activityFromDate,res.resourceName
			""", nativeQuery = true)
	List<Object[]> getactivitydataaccordingtoresource(String formattedFromDate, String formattedToDate,
			String resourceValue);

	@Query(value = """
			SELECT distinct act.*
			FROM assessment ass
			inner join  activity act on act.activityId=ass.activityId
			WHERE ass.asesmentDate BETWEEN :formattedFromDate AND :formattedToDate
			""", nativeQuery = true)
	List<Activity> getActvitiesByDateRangeForAssement(String formattedFromDate, String formattedToDate);
	
	
	@Query(value = """
			SELECT res.resourceCode,act.activityName
			FROM  activity_allocation alo
			inner join activity_allocation_details dt  on alo.activityAllocateId=dt.activityAllocateId
			inner join resource_pool res on res.resourceId=dt.resourceId
			inner join platforms pla on pla.platform=res.platform
			inner join activity act on act.activityId=alo.activityId
			WHERE  res.resourceCode = :resourceCode
			order by alo.activityFromDate,res.resourceName
			""", nativeQuery = true)
     List<Object[]> getAllResourceByCode(@Param("resourceCode") String resourceCode);

     @Query(value="""
                select * from activity
                where activityId=if(:activityId=0,activityId,:activityId)
                and (responsPerson1 like if(:activityPerson='',responsPerson1 ,CONCAT('%', :activityPerson, '%'))
                or responsPerson2 like if(:activityPerson='',responsPerson2 ,CONCAT('%', :activityPerson, '%')))
               """, nativeQuery = true)
     Page<Activity> findByActivityNameAndActivityPerson(Integer activityId, String activityPerson,Pageable pageable);

     
     @Query(value="""
             select count(aa.activityId) as isActvityPlanned from activity_allocation aa
             join activity a on a.activityId=aa.activityId
             where a.activityName=:activityName
            """, nativeQuery = true)
	Integer countByActivityId(String activityName);
	
	

}