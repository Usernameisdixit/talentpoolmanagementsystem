package com.tpms.service.impl;

import java.io.IOException;
import java.time.LocalDate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
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
import com.tpms.repository.PlatformRepository;
import com.tpms.repository.ResourcePoolHistoryRepository;
import com.tpms.repository.ResourcePoolRepository;
import com.tpms.utils.DateUtils;
import com.tpms.utils.ExcelUtils;


@Service
public class ResourcePoolServiceImpl {

	@Autowired
	private ResourcePoolHistoryRepository resourcepoolRepositoryhistory;

	@Autowired
	private ResourcePoolRepository resourcepoolRepository;
	
	@Autowired
	private PlatformRepository platformRepository;

	public void save(MultipartFile file, LocalDate allocationDate) {

		try {
			List<ResourcePoolHistory> resourcePoolExcel = ExcelUtils.convertExceltoListofEmployee(file.getInputStream(),
					allocationDate);

			List<ResourcePool> resourcepool = resourcepoolRepository.findAll();

			List<ResourcePoolHistory> resourcepoolNotMatch = new ArrayList<>(resourcePoolExcel.size());

			List<ResourcePool> resourcepoolNotMatchOther = new ArrayList<>();

			List<ResourcePool> resourcepoolMatch = new ArrayList<>((resourcepool.size()));

			resourcepoolNotMatch.addAll(resourcePoolExcel);
			resourcepoolMatch.addAll(resourcepool);

			if (CollectionUtils.isNotEmpty(resourcepool)) {

				resourcePoolNotEmpty(resourcePoolExcel, resourcepool, resourcepoolMatch, resourcepoolNotMatch,
						allocationDate);

				/***************************************
				 * Updated Data that is not Present in Excel (Tagged Resources)
				 ***************************************/

				updatedDataNotPresentInExcel(resourcepoolMatch);

				/*******************************
				 * Excel Data Uploaded that is not Matched Current Data(New Resources)
				 *************************************/
				additionOfNewResources(resourcepoolNotMatch, resourcepoolNotMatchOther, allocationDate);

			} else {
				/*************
				 * For First Time Data is Uploaded in tbl_resource_pool
				 ***************/
				firstTimeDataUploadtblresourcepool(resourcePoolExcel, resourcepoolNotMatchOther, allocationDate);

			}

		} catch (IOException | IndexOutOfBoundsException e) {

			e.printStackTrace();
		} 

	}

	public void resourcePoolNotEmpty(List<ResourcePoolHistory> resourcePoolExcel, List<ResourcePool> resourcepool,
			List<ResourcePool> resourcepoolMatch, List<ResourcePoolHistory> resourcepoolNotMatch,
			LocalDate allocationDate) {

		for (int i = 0; i < resourcePoolExcel.size(); i++) {


			for (int j = 0; j < resourcepool.size(); j++) {

				if (resourcePoolExcel.get(i).getResourceCode() != null && resourcepool.get(j).getResourceCode() != null
						&& resourcePoolExcel.get(i).getResourceCode()
								.equalsIgnoreCase(resourcepool.get(j).getResourceCode())) {

					String resourceCodeExcel = resourcePoolExcel.get(i).getResourceCode();
					String resourceCodepool = resourcepool.get(j).getResourceCode();
					
					/***********Matched Record Both in Excel and Table are Updated in Table************/
					if (resourcepool.get(j).getResourceCode() != null)
					{
						resourcepool.get(j).setDesignation(resourcePoolExcel.get(i).getDesignation());
						resourcepool.get(j).setPlatform(resourcePoolExcel.get(i).getPlatform());
						resourcepool.get(j).setEmail(resourcePoolExcel.get(i).getEmail());
						resourcepool.get(j).setPhoneNo(resourcePoolExcel.get(i).getPhoneNo());
						resourcepool.get(j).setLocation(resourcePoolExcel.get(i).getLocation());
						resourcepool.get(j).setEngagementPlan(resourcePoolExcel.get(i).getEngagementPlan());
						resourcepool.get(j).setExperience(resourcePoolExcel.get(i).getExperience());
					if(resourcepool.get(j).getDeletedFlag()== 1) {
						resourcepool.get(j).setAllocationDate(allocationDate);
					}
					resourcepool.get(j).setDeletedFlag((byte) 0);
					
					
					}
					this.resourcepoolRepository.saveAll(resourcepool);
					
					/***************************************************************************************/

					/*************************
					 * Updated List Data that is not Present in Excel (Tagged Resources)
					 ******************/
					if (resourceCodepool != null) {
						for (ResourcePool obj : resourcepoolMatch) {
							String resourceCode = obj.getResourceCode();
							if (resourceCode != null && resourceCode.equalsIgnoreCase(resourceCodepool)) {

								if (obj.getDeletedFlag() == 1) {
									obj.setDeletedFlag((byte) 0);
									obj.setAllocationDate(allocationDate);
								}

								resourcepoolMatch.remove(obj);
								break;
							}
						}
					}

					/***************
					 * Excel Data Uploaded that is not Matched Current Data(New Resources)
					 ******************/
					if (resourceCodeExcel != null) {
						resourcepoolNotMatch.removeIf(obj -> {
							String resourceCode = obj.getResourceCode();
							return resourceCode != null && resourceCode.equalsIgnoreCase(resourceCodeExcel);
						});
					}

				}

			}

		}

	}

	public void updatedDataNotPresentInExcel(List<ResourcePool> resourcepoolMatch) {
		for (int j = 0; j < resourcepoolMatch.size(); j++) {
			resourcepoolMatch.get(j).setDeletedFlag((byte) 1);
			this.resourcepoolRepository.saveAll(resourcepoolMatch);
		}
	}

	public void additionOfNewResources(List<ResourcePoolHistory> resourcepoolNotMatch,
			List<ResourcePool> resourcepoolNotMatchOther, LocalDate allocationDate) {
		for (int j = 0; j < resourcepoolNotMatch.size(); j++) {
			ResourcePool resource = new ResourcePool();

			resource.setResourceName(resourcepoolNotMatch.get(j).getResourceName());
			resource.setDesignation(resourcepoolNotMatch.get(j).getDesignation()); // Newly added Coloumn
			resource.setResourceCode(resourcepoolNotMatch.get(j).getResourceCode());
			resource.setPlatform(resourcepoolNotMatch.get(j).getPlatform());
			resource.setEmail(resourcepoolNotMatch.get(j).getEmail());
			resource.setPhoneNo(resourcepoolNotMatch.get(j).getPhoneNo());
			resource.setLocation(resourcepoolNotMatch.get(j).getLocation());
			resource.setEngagementPlan(resourcepoolNotMatch.get(j).getEngagementPlan());
			resource.setExperience(resourcepoolNotMatch.get(j).getExperience());
			resource.setAllocationDate(allocationDate);
			resource.setDeletedFlag((byte) 0);
			if (resource.getResourceCode() != null)
				resourcepoolNotMatchOther.add(resource);

			this.resourcepoolRepository.saveAll(resourcepoolNotMatchOther);

		}
	}

	// else --------------- 1st time upload
	public void firstTimeDataUploadtblresourcepool(List<ResourcePoolHistory> resourcePoolExcel,
			List<ResourcePool> resourcepoolNotMatchOther, LocalDate allocationDate) {

		for (int j = 0; j < resourcePoolExcel.size(); j++) {
			ResourcePool resource = new ResourcePool();
			resource.setResourceName(resourcePoolExcel.get(j).getResourceName());
			resource.setDesignation(resourcePoolExcel.get(j).getDesignation()); // Newly added Coloumn
			resource.setResourceCode(resourcePoolExcel.get(j).getResourceCode());
			resource.setPlatform(resourcePoolExcel.get(j).getPlatform());
			resource.setEmail(resourcePoolExcel.get(j).getEmail());
			resource.setPhoneNo(resourcePoolExcel.get(j).getPhoneNo());
			resource.setLocation(resourcePoolExcel.get(j).getLocation());
			resource.setEngagementPlan(resourcePoolExcel.get(j).getEngagementPlan());
			resource.setExperience(resourcePoolExcel.get(j).getExperience());
			resource.setAllocationDate(allocationDate);
			resource.setDeletedFlag((byte) 0);
			if (resource.getResourceCode() != null)
				resourcepoolNotMatchOther.add(resource);
		}
		this.resourcepoolRepository.saveAll(resourcepoolNotMatchOther);

	}

	public PageResponse<ResourcePool> getAllEmploye(int pageNumber, int pageSize) {

		List<ResourcePool> resourcepool = new ArrayList<>();
		Pageable pageable=PageRequest.of(pageNumber-1, pageSize,Sort.by("resourceName"));
		Page<ResourcePool> page=resourcepoolRepository.findByDeletedFlagFalse(pageable);
		
		resourcepool =page.getContent(); 

		PageResponse<ResourcePool> pageResponse=new PageResponse<>();
		pageResponse.setContent(resourcepool);
		pageResponse.setPageSize(page.getSize());
		pageResponse.setTotalElements(page.getTotalElements());
		pageResponse.setTotalPages(page.getTotalPages());
		pageResponse.setLast(page.isLast());

		List<ResourcePoolHistoryDto> resourcepooldto = new ArrayList<>();
		List<Object[]> resourcepoolfindMinMax = resourcepoolRepositoryhistory.minMaxAllocationDate();

		for (Object[] ob : resourcepoolfindMinMax) {
			ResourcePoolHistoryDto rgdt = new ResourcePoolHistoryDto();
			rgdt.setResourceCode(ob[0].toString());
			rgdt.setResourceName(ob[1].toString());
			String duration = DateUtils.monthDayDifference(ob[2].toString(), ob[3].toString());
			rgdt.setDuration(duration);
			resourcepooldto.add(rgdt);
		}

		for (ResourcePool resource : resourcepool) {
			for (ResourcePoolHistoryDto resourcedto : resourcepooldto) {
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
			
	List<ResourcePoolHistory> resourcedata	=	resourcepoolRepositoryhistory.findByResourceName(emp.getResourceName());
	
	List<Integer> resid = new ArrayList<>();
	for(int k=0;k<resourcedata.size();k++) {
		resid.add(resourcedata.get(k).getResourceHistoryId());
	}
	
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
	
	resourcepoolRepositoryhistory.saveAll(resourcedata);
	
	resourcepoolRepository.save(emp);
			

		} catch (Exception e) {

			e.printStackTrace();
		}
		return "Record Updated";
	}

	// For Deleting Any Resource
	public String delete(Integer id) {
		resourcepoolRepository.deleteById(id);
		return "Resource Deleted";
	}

	@SuppressWarnings("deprecation")
	public ResourcePool getTalentById(Integer id) {
		return resourcepoolRepository.findById(id).get();

	}

	public void updateBitDeletedFlagById(Integer id) {
		resourcepoolRepository.updateBitDeletedFlagById(id);
	}

	public Byte getDeletedFlagByRoleId(Integer id) {
		return resourcepoolRepository.getDeletedFlagByRoleId(id);
	}

	public void updateBitDeletedFlagByFalse(Integer id) {
		resourcepoolRepository.updateBitDeletedFlagByFalse(id);
	}

	public List<Object[]> getResourceDetailsWithFileNameS() {

		return resourcepoolRepositoryhistory.getResourceDetailsWithFileNameR();
	}

	public List<ResourcePool> getAllResources() {
		List<ResourcePool> resourceList=resourcepoolRepository.findAll();
		
		List<ResourcePoolHistoryDto> resourcepooldto = new ArrayList<>();
		List<Object[]> resourcepoolfindMinMax = resourcepoolRepositoryhistory.minMaxAllocationDate();

		for (Object[] ob : resourcepoolfindMinMax) {
			ResourcePoolHistoryDto rgdt = new ResourcePoolHistoryDto();
			rgdt.setResourceCode(ob[0].toString());
			rgdt.setResourceName(ob[1].toString());
			String duration = DateUtils.monthDayDifference(ob[2].toString(), ob[3].toString());
			rgdt.setDuration(duration);
			resourcepooldto.add(rgdt);
		}

		for (ResourcePool resource : resourceList) {
			for (ResourcePoolHistoryDto resourcedto : resourcepooldto) {
				if (resource.getResourceCode().equalsIgnoreCase(resourcedto.getResourceCode())) {
					resource.setDuration(resourcedto.getDuration());
				}
			}
		}
		return resourceList;
	}

	public List<String> getDesignation() {
		List<String> getList=  new ArrayList<>();
		try {
			getList=resourcepoolRepository.findDesignationData();		
		} catch (Exception e) {
			e.printStackTrace();
		}
		return getList;
	}

	public List<String> getPlatform() {
		List<String> platformData= null;
		try {
			platformData=platformRepository.findData();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return platformData;
	}

	public List<String> getLocation() {
		List<String> getList=  new ArrayList<>();
		try {
			getList=resourcepoolRepository.findLocationData();		
		} catch (Exception e) {
			e.printStackTrace();
		}
		return getList;
	}

	public PageResponse<ResourcePool> getsearchFilterData(String designation, String location, String platform,
			Integer pageNumber, int pageSize) {
		Pageable pageable = PageRequest.of(pageNumber - 1, pageSize);
		Page<ResourcePool> page = null;
		PageResponse<ResourcePool> pageResponse = new PageResponse<>();
		try {
			page = resourcepoolRepository.getsearchFilterData(designation, location, platform, pageable);
			List<ResourcePool> getResouceList = page.getContent();
			List<ResourcePoolHistoryDto> resourcepooldto = new ArrayList<>();
			List<Object[]> resourcepoolfindMinMax = resourcepoolRepositoryhistory.minMaxAllocationDate();

			for (Object[] ob : resourcepoolfindMinMax) {
				ResourcePoolHistoryDto rgdt = new ResourcePoolHistoryDto();
				rgdt.setResourceCode(ob[0].toString());
				rgdt.setResourceName(ob[1].toString());
				String duration = DateUtils.monthDayDifference(ob[2].toString(), ob[3].toString());
				rgdt.setDuration(duration);
				resourcepooldto.add(rgdt);
			}

			for (ResourcePool resource : getResouceList) {
				for (ResourcePoolHistoryDto resourcedto : resourcepooldto) {
					if (resource.getResourceCode().equalsIgnoreCase(resourcedto.getResourceCode())) {
						resource.setDuration(resourcedto.getDuration());
					}
				}
			}
			pageResponse.setContent(getResouceList);
			pageResponse.setPageSize(page.getSize());
			pageResponse.setTotalElements(page.getTotalElements());

			return pageResponse;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return pageResponse;
	}
	
}
