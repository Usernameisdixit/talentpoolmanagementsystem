package com.tpms.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.time.LocalDate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tpms.dto.PageResponse;
import com.tpms.dto.ResourcePoolHistoryDto;
import com.tpms.entity.ResourcePool;
import com.tpms.entity.ResourcePoolHistory;

import com.tpms.repository.ResourcePoolHistoryRepository;
import com.tpms.repository.ResourcePoolRepository;
import com.tpms.utils.DateUtils;
import com.tpms.utils.ExcelUtils;

@Service
public class ResourcePoolServiceImpl {

	@Autowired
	private ResourcePoolHistoryRepository tbl_resource_pool_Repository_history;

	@Autowired
	private ResourcePoolRepository tbl_resource_pool_Repository;

	public void save(MultipartFile file, LocalDate allocationDate) {

		try {
			List<ResourcePoolHistory> ExcelEmp = ExcelUtils.convertExceltoListofEmployee(file.getInputStream(),
					allocationDate);

			List<ResourcePool> tbl_resource_pool = tbl_resource_pool_Repository.findAll();

			List<ResourcePoolHistory> tbl_resource_poolNotMatch = new ArrayList<>(ExcelEmp.size());

			List<ResourcePool> tbl_resource_poolNotMatch1 = new ArrayList<>();
			
			List<ResourcePool> tbl_resource_poolMatch = new ArrayList<>((tbl_resource_pool.size()));

			tbl_resource_poolNotMatch.addAll(ExcelEmp);
			tbl_resource_poolMatch.addAll(tbl_resource_pool);

			if (CollectionUtils.isNotEmpty(tbl_resource_pool)) {

				tblResourcePoolNotEmpty(ExcelEmp, tbl_resource_pool, tbl_resource_poolMatch, tbl_resource_poolNotMatch,
						allocationDate);

				/***************************************
				 * Updated Data that is not Present in Excel (Tagged Resources)
				 ***************************************/

				updatedDataNotPresentInExcel(tbl_resource_poolMatch);

				/*******************************
				 * Excel Data Uploaded that is not Matched Current Data(New Resources)
				 *************************************/
				additionOfNewResources(tbl_resource_poolNotMatch, tbl_resource_poolNotMatch1, allocationDate);

			} else {
				/*************
				 * For First Time Data is Uploaded in tbl_resource_pool
				 ***************/
				firstTimeDataUpload_tbl_resource_pool(ExcelEmp, tbl_resource_poolNotMatch1, allocationDate);

			}

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IndexOutOfBoundsException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	public void tblResourcePoolNotEmpty(List<ResourcePoolHistory> ExcelEmp, List<ResourcePool> tbl_resource_pool,
			List<ResourcePool> tbl_resource_poolMatch, List<ResourcePoolHistory> tbl_resource_poolNotMatch,
			LocalDate allocationDate) {

		for (int i = 0; i < ExcelEmp.size(); i++) {

			// tbl_resource_pool NotMatch=new tbl_resource_pool();

			for (int j = 0; j < tbl_resource_pool.size(); j++) {

				if (ExcelEmp.get(i).getResourceCode() != null && tbl_resource_pool.get(j).getResourceCode() != null
						&& ExcelEmp.get(i).getResourceCode()
								.equalsIgnoreCase(tbl_resource_pool.get(j).getResourceCode())) {

					String ResourceCodeExcel = ExcelEmp.get(i).getResourceCode();
					String ResourceCodepool = tbl_resource_pool.get(j).getResourceCode();
					
					/***********Matched Record Both in Excel and Table are Updated in Table************/
					if (tbl_resource_pool.get(j).getResourceCode() != null)
					{
					tbl_resource_pool.get(j).setDesignation(ExcelEmp.get(i).getDesignation());
					tbl_resource_pool.get(j).setPlatform(ExcelEmp.get(i).getPlatform());
					tbl_resource_pool.get(j).setEmail(ExcelEmp.get(i).getEmail());
					tbl_resource_pool.get(j).setPhoneNo(ExcelEmp.get(i).getPhoneNo());
					tbl_resource_pool.get(j).setLocation(ExcelEmp.get(i).getLocation());
					tbl_resource_pool.get(j).setEngagementPlan(ExcelEmp.get(i).getEngagementPlan());
					tbl_resource_pool.get(j).setExperience(ExcelEmp.get(i).getExperience());
					//tbl_resource_pool.get(j).setAllocationDate(allocationDate);
					if(tbl_resource_pool.get(j).getDeletedFlag()== 1) {
					  tbl_resource_pool.get(j).setAllocationDate(allocationDate);
					}
					tbl_resource_pool.get(j).setDeletedFlag((byte) 0);
					
					
					}
					this.tbl_resource_pool_Repository.saveAll(tbl_resource_pool);
					
					/***************************************************************************************/

					/*************************
					 * Updated List Data that is not Present in Excel (Tagged Resources)
					 ******************/
					if (ResourceCodepool != null) {
						for (ResourcePool obj : tbl_resource_poolMatch) {
							String resourceCode = obj.getResourceCode();
							if (resourceCode != null && resourceCode.equalsIgnoreCase(ResourceCodepool)) {

								if (obj.getDeletedFlag() == 1) {
									obj.setDeletedFlag((byte) 0);
									obj.setAllocationDate(allocationDate);
								}

								tbl_resource_poolMatch.remove(obj);
								break;
							}
						}
					}

					/***************
					 * Excel Data Uploaded that is not Matched Current Data(New Resources)
					 ******************/
					if (ResourceCodeExcel != null) {
						tbl_resource_poolNotMatch.removeIf(obj -> {
							String resourceCode = obj.getResourceCode();
							return resourceCode != null && resourceCode.equalsIgnoreCase(ResourceCodeExcel);
						});
					}

				}

			}

		}

	}

	public void updatedDataNotPresentInExcel(List<ResourcePool> tbl_resource_poolMatch) {
		for (int j = 0; j < tbl_resource_poolMatch.size(); j++) {

			SimpleDateFormat formatter = new SimpleDateFormat();
			Date date = new Date();

			// tbl_resource_poolMatch.get(j).setStatus("D");
			tbl_resource_poolMatch.get(j).setDeletedFlag((byte) 1);

			this.tbl_resource_pool_Repository.saveAll(tbl_resource_poolMatch);
		}
	}

	public void additionOfNewResources(List<ResourcePoolHistory> tbl_resource_poolNotMatch,
			List<ResourcePool> tbl_resource_poolNotMatch1, LocalDate allocationDate) {
		for (int j = 0; j < tbl_resource_poolNotMatch.size(); j++) {
			ResourcePool Emp = new ResourcePool();

			Emp.setResourceName(tbl_resource_poolNotMatch.get(j).getResourceName());
			Emp.setDesignation(tbl_resource_poolNotMatch.get(j).getDesignation()); // Newly added Coloumn
			Emp.setResourceCode(tbl_resource_poolNotMatch.get(j).getResourceCode());
			Emp.setPlatform(tbl_resource_poolNotMatch.get(j).getPlatform());
			Emp.setEmail(tbl_resource_poolNotMatch.get(j).getEmail());
			Emp.setPhoneNo(tbl_resource_poolNotMatch.get(j).getPhoneNo());
			Emp.setLocation(tbl_resource_poolNotMatch.get(j).getLocation());
			Emp.setEngagementPlan(tbl_resource_poolNotMatch.get(j).getEngagementPlan());
			Emp.setExperience(tbl_resource_poolNotMatch.get(j).getExperience());
			Emp.setAllocationDate(allocationDate);
			Emp.setDeletedFlag((byte) 0);
			// Emp.setStatus("A");
			if (Emp.getResourceCode() != null)
				tbl_resource_poolNotMatch1.add(Emp);

			this.tbl_resource_pool_Repository.saveAll(tbl_resource_poolNotMatch1);

		}
	}

	// else --------------- 1st time upload
	public void firstTimeDataUpload_tbl_resource_pool(List<ResourcePoolHistory> ExcelEmp,
			List<ResourcePool> tbl_resource_poolNotMatch1, LocalDate allocationDate) {

		for (int j = 0; j < ExcelEmp.size(); j++) {
			ResourcePool Emp = new ResourcePool();

			Emp.setResourceName(ExcelEmp.get(j).getResourceName());
			Emp.setDesignation(ExcelEmp.get(j).getDesignation()); // Newly added Coloumn
			Emp.setResourceCode(ExcelEmp.get(j).getResourceCode());
			Emp.setPlatform(ExcelEmp.get(j).getPlatform());
			Emp.setEmail(ExcelEmp.get(j).getEmail());
			Emp.setPhoneNo(ExcelEmp.get(j).getPhoneNo());
			Emp.setLocation(ExcelEmp.get(j).getLocation());
			Emp.setEngagementPlan(ExcelEmp.get(j).getEngagementPlan());
			Emp.setExperience(ExcelEmp.get(j).getExperience());
			Emp.setAllocationDate(allocationDate);
			Emp.setDeletedFlag((byte) 0);
			// Emp.setStatus("A");
			if (Emp.getResourceCode() != null)
				tbl_resource_poolNotMatch1.add(Emp);

		}

		this.tbl_resource_pool_Repository.saveAll(tbl_resource_poolNotMatch1);

	}

	public PageResponse<ResourcePool> getAllEmploye(int pageNumber, int pageSize) {

		List<ResourcePool> tbl_resource_pool = new ArrayList<>();
		Pageable pageable=PageRequest.of(pageNumber-1, pageSize,Sort.by("resourceName"));
		Page<ResourcePool> page=tbl_resource_pool_Repository.findAllByDeletedFlag(pageable);
		
		tbl_resource_pool =page.getContent(); 
//		List<ResourcePool> sortedList=tbl_resource_pool.stream().sorted((a,b)->a.getResourceName()
//				.compareTo(b.getResourceName())).collect(Collectors.toList());
		PageResponse<ResourcePool> pageResponse=new PageResponse<ResourcePool>();
		pageResponse.setContent(tbl_resource_pool);
		pageResponse.setPageSize(page.getSize());
		pageResponse.setTotalElements(page.getTotalElements());
		pageResponse.setTotalPages(page.getTotalPages());
		pageResponse.setLast(page.isLast());

		List<ResourcePoolHistoryDto> tbl_resource_pooldto = new ArrayList<>();
		List<Object[]> tbl_resource_poolfindMinMax = tbl_resource_pool_Repository_history.MinMaxAllocationDate();

		for (Object[] ob : tbl_resource_poolfindMinMax) {
			ResourcePoolHistoryDto rgdt = new ResourcePoolHistoryDto();
			rgdt.setResourceCode(ob[0].toString());
			rgdt.setResourceName(ob[1].toString());
			String Dur = DateUtils.monthDayDifference(ob[2].toString(), ob[3].toString());
			rgdt.setDuration(Dur);
			tbl_resource_pooldto.add(rgdt);
		}

		for (ResourcePool resource : tbl_resource_pool) {
			for (ResourcePoolHistoryDto resourcedto : tbl_resource_pooldto) {
				if (resource.getResourceCode().equalsIgnoreCase(resourcedto.getResourceCode())) {
					resource.setDuration(resourcedto.getDuration());
				}
			}
		}
		return pageResponse;

	}

	// For Updating Any Resource
	public String addorUpdateEmployee(ResourcePool emp) {

		try {
			
	List<ResourcePoolHistory> resourcedata	=	tbl_resource_pool_Repository_history.findByResourceName(emp.getResourceName());
	
	List<Integer> resid = new ArrayList<Integer>();
	for(int k=0;k<resourcedata.size();k++) {
		resid.add(resourcedata.get(k).getResourceHistoryId());
	}
	
	System.out.println(resourcedata);
	Integer i=Collections.max(resid);
	
	for(int j=0;j<resourcedata.size();j++) {
		if(resourcedata.get(j).getResourceHistoryId()==i) {
			resourcedata.get(j).setPhoneNo(emp.getPhoneNo());
			resourcedata.get(j).setDesignation(emp.getDesignation());                 
			resourcedata.get(j).setExperience(emp.getExperience());
			resourcedata.get(j).setPlatform(emp.getPlatform());
			resourcedata.get(j).setEngagementPlan(emp.getEngagementPlan());
			resourcedata.get(j).setLocation(emp.getLocation());
			resourcedata.get(j).setEmail(emp.getEmail());
					
		}
	}
	
	tbl_resource_pool_Repository_history.saveAll(resourcedata);
	
	tbl_resource_pool_Repository.save(emp);
			

		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		return "Record Updated";
	}

	// For Deleting Any Resource
	public String delete(Integer id) {
		// TODO Auto-generated method stub
		tbl_resource_pool_Repository.deleteById(id);
		return "Resource Deleted";
	}

	@SuppressWarnings("deprecation")
	public ResourcePool getTalentById(Integer id) {
		// TODO Auto-generated method stub
		return tbl_resource_pool_Repository.findById(id).get();

	}

	public void updateBitDeletedFlagById(Integer id) {
		tbl_resource_pool_Repository.updateBitDeletedFlagById(id);
	}

	public Byte getDeletedFlagByRoleId(Integer id) {
		return tbl_resource_pool_Repository.getDeletedFlagByRoleId(id);
	}

	public void updateBitDeletedFlagByFalse(Integer id) {
		tbl_resource_pool_Repository.updateBitDeletedFlagByFalse(id);
	}

	public List<Object[]> getResourceDetailsWithFileNameS() {

		return tbl_resource_pool_Repository_history.getResourceDetailsWithFileNameR();
	}

	public List<ResourcePool> getAllResources() {
		List<ResourcePool> resourceList=tbl_resource_pool_Repository.findAll();
		
		List<ResourcePoolHistoryDto> tbl_resource_pooldto = new ArrayList<>();
		List<Object[]> tbl_resource_poolfindMinMax = tbl_resource_pool_Repository_history.MinMaxAllocationDate();

		for (Object[] ob : tbl_resource_poolfindMinMax) {
			ResourcePoolHistoryDto rgdt = new ResourcePoolHistoryDto();
			rgdt.setResourceCode(ob[0].toString());
			rgdt.setResourceName(ob[1].toString());
			String Dur = DateUtils.monthDayDifference(ob[2].toString(), ob[3].toString());
			rgdt.setDuration(Dur);
			tbl_resource_pooldto.add(rgdt);
		}

		for (ResourcePool resource : resourceList) {
			for (ResourcePoolHistoryDto resourcedto : tbl_resource_pooldto) {
				if (resource.getResourceCode().equalsIgnoreCase(resourcedto.getResourceCode())) {
					resource.setDuration(resourcedto.getDuration());
				}
			}
		}
		return resourceList;
	}

}
