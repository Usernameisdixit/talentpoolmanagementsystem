package com.tpms.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.time.LocalDate;

import java.util.ArrayList;

import java.util.Date;
import java.util.List;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
			List<ResourcePoolHistory> excelEmp = processExcelData(file.getInputStream(), allocationDate);

			List<ResourcePool> resourcePool = tbl_resource_pool_Repository.findAll();

			List<ResourcePoolHistory> resourcePoolNotMatch = new ArrayList<>(excelEmp.size());

			List<ResourcePool> resourcePoolNotMatch1 = new ArrayList<>();

			List<ResourcePool> resourcePoolMatch = new ArrayList<>(resourcePool.size());

			matchData(excelEmp, resourcePool, resourcePoolNotMatch, resourcePoolMatch);

			handleTaggedResources(resourcePoolMatch, allocationDate);

			handleNewResources(resourcePoolNotMatch, resourcePoolNotMatch1, allocationDate);

			saveDataToRepository(resourcePoolNotMatch1);
		} catch (IOException e) {
			e.printStackTrace();
		} catch (IndexOutOfBoundsException e) {
			e.printStackTrace();
		}
	}

	private List<ResourcePoolHistory> processExcelData(InputStream inputStream, LocalDate allocationDate)
			throws IOException {
		return ExcelUtils.convertExceltoListofEmployee(inputStream, allocationDate);
	}

	private void matchData(List<ResourcePoolHistory> excelEmp, List<ResourcePool> resourcePool,
			List<ResourcePoolHistory> resourcePoolNotMatch, List<ResourcePool> resourcePoolMatch) {
		for (int i = 0; i < excelEmp.size(); i++) {
			for (int j = 0; j < resourcePool.size(); j++) {
				if (excelEmp.get(i).getResourceCode() != null && resourcePool.get(j).getResourceCode() != null
						&& excelEmp.get(i).getResourceCode().equalsIgnoreCase(resourcePool.get(j).getResourceCode())) {
					resourcePoolMatch.add(resourcePool.get(j));
					resourcePoolNotMatch.remove(excelEmp.get(i));
					break;
				}
			}
		}
	}

	private void handleTaggedResources(List<ResourcePool> resourcePoolMatch, LocalDate allocationDate) {
		for (ResourcePool obj : resourcePoolMatch) {
			if (obj.getDeletedFlag() == 1) {
				obj.setDeletedFlag((byte) 0);
				obj.setAllocationDate(allocationDate);
			}
		}
		tbl_resource_pool_Repository.saveAll(resourcePoolMatch);
	}

	private void handleNewResources(List<ResourcePoolHistory> resourcePoolNotMatch,
			List<ResourcePool> resourcePoolNotMatch1, LocalDate allocationDate) {
		for (ResourcePoolHistory history : resourcePoolNotMatch) {
			ResourcePool emp = new ResourcePool();
			emp.setResourceName(history.getResourceName());
			emp.setDesignation(history.getDesignation()); // Newly added Column
			emp.setResourceCode(history.getResourceCode());
			emp.setPlatform(history.getPlatform());
			emp.setEmail(history.getEmail());
			emp.setPhoneNo(history.getPhoneNo());
			emp.setLocation(history.getLocation());
			emp.setEngagementPlan(history.getEngagementPlan());
			emp.setExperience(history.getExperience());
			emp.setAllocationDate(allocationDate);
			emp.setDeletedFlag((byte) 0);
			resourcePoolNotMatch1.add(emp);
		}
	}

	private void saveDataToRepository(List<ResourcePool> resourcePoolNotMatch1) {
		tbl_resource_pool_Repository.saveAll(resourcePoolNotMatch1);
	}

//	@Autowired
//	private ResourcePoolHistoryRepository tbl_resource_pool_Repository_history;
//
//	@Autowired
//	private ResourcePoolRepository tbl_resource_pool_Repository;
//
//	public void save(MultipartFile file, LocalDate allocationDate) {
//
//		try {
//			List<ResourcePoolHistory> ExcelEmp = ExcelUtils.convertExceltoListofEmployee(file.getInputStream(),
//					allocationDate);
//
//			List<ResourcePool> tbl_resource_pool = tbl_resource_pool_Repository.findAll();
//
//			List<ResourcePoolHistory> tbl_resource_poolNotMatch = new ArrayList<>(ExcelEmp.size());
//
//			List<ResourcePool> tbl_resource_poolNotMatch1 = new ArrayList<>();
//
//			List<ResourcePool> tbl_resource_poolMatch = new ArrayList<>((tbl_resource_pool.size()));
//
//			tbl_resource_poolNotMatch.addAll(ExcelEmp);
//			tbl_resource_poolMatch.addAll(tbl_resource_pool);
//
//			if (CollectionUtils.isNotEmpty(tbl_resource_pool)) {
//
//				for (int i = 0; i < ExcelEmp.size(); i++) {
//
//					// tbl_resource_pool NotMatch=new tbl_resource_pool();
//
//					for (int j = 0; j < tbl_resource_pool.size(); j++) {
//
//						if (ExcelEmp.get(i).getResourceCode() != null
//								&& tbl_resource_pool.get(j).getResourceCode() != null
//								&& ExcelEmp.get(i).getResourceCode()
//										.equalsIgnoreCase(tbl_resource_pool.get(j).getResourceCode())) {
//
//							String ResourceCodeExcel = ExcelEmp.get(i).getResourceCode();
//							String ResourceCodepool = tbl_resource_pool.get(j).getResourceCode();
//
//							/*************************
//							 * Updated Data that is not Present in Excel (Tagged Resources)
//							 ******************/
//							if (ResourceCodepool != null) {
//								for (ResourcePool obj : tbl_resource_poolMatch) {
//									String resourceCode = obj.getResourceCode();
//									if (resourceCode != null && resourceCode.equalsIgnoreCase(ResourceCodepool)) {
//
//										if (obj.getDeletedFlag() == 1) {
//											obj.setDeletedFlag((byte) 0);
//											obj.setAllocationDate(allocationDate);
//										}
//										
//										tbl_resource_poolMatch.remove(obj);
//										break;
//									}
//								}
//							}
//
//							/***************
//							 * Excel Data Uploaded that is not Matched Current Data(New Resources)
//							 ******************/
//							if (ResourceCodeExcel != null) {
//								tbl_resource_poolNotMatch.removeIf(obj -> {
//									String resourceCode = obj.getResourceCode();
//									return resourceCode != null && resourceCode.equalsIgnoreCase(ResourceCodeExcel);
//								});
//							}
//
//						}
//
//					}
//
//				}
//
//				/***************************************
//				 * Updated Data that is not Present in Excel (Tagged Resources)
//				 ***************************************/
//
//				for (int j = 0; j < tbl_resource_poolMatch.size(); j++) {
//
//					SimpleDateFormat formatter = new SimpleDateFormat();
//					Date date = new Date();
//
//					// tbl_resource_poolMatch.get(j).setStatus("D");
//					tbl_resource_poolMatch.get(j).setDeletedFlag((byte) 1);
//
//					this.tbl_resource_pool_Repository.saveAll(tbl_resource_poolMatch);
//				}
//
//				/*******************************
//				 * Excel Data Uploaded that is not Matched Current Data(New Resources)
//				 *************************************/
//
//				for (int j = 0; j < tbl_resource_poolNotMatch.size(); j++) {
//					ResourcePool Emp = new ResourcePool();
//
//					Emp.setResourceName(tbl_resource_poolNotMatch.get(j).getResourceName());
//					Emp.setDesignation(tbl_resource_poolNotMatch.get(j).getDesignation()); // Newly added Coloumn
//					Emp.setResourceCode(tbl_resource_poolNotMatch.get(j).getResourceCode());
//					Emp.setPlatform(tbl_resource_poolNotMatch.get(j).getPlatform());
//					Emp.setEmail(tbl_resource_poolNotMatch.get(j).getEmail());
//					Emp.setPhoneNo(tbl_resource_poolNotMatch.get(j).getPhoneNo());
//					Emp.setLocation(tbl_resource_poolNotMatch.get(j).getLocation());
//					Emp.setEngagementPlan(tbl_resource_poolNotMatch.get(j).getEngagementPlan());
//					Emp.setExperience(tbl_resource_poolNotMatch.get(j).getExperience());
//					Emp.setAllocationDate(allocationDate);
//					Emp.setDeletedFlag((byte) 0);
//					// Emp.setStatus("A");
//					if (Emp.getResourceCode() != null)
//						tbl_resource_poolNotMatch1.add(Emp);
//
//					this.tbl_resource_pool_Repository.saveAll(tbl_resource_poolNotMatch1);
//
//				}
//
//			} else {
//
//				/*************
//				 * For First Time Data is Uploaded in tbl_resource_pool
//				 ***************/
//
//				for (int j = 0; j < ExcelEmp.size(); j++) {
//					ResourcePool Emp = new ResourcePool();
//
//					Emp.setResourceName(ExcelEmp.get(j).getResourceName());
//					Emp.setDesignation(ExcelEmp.get(j).getDesignation()); // Newly added Coloumn
//					Emp.setResourceCode(ExcelEmp.get(j).getResourceCode());
//					Emp.setPlatform(ExcelEmp.get(j).getPlatform());
//					Emp.setEmail(ExcelEmp.get(j).getEmail());
//					Emp.setPhoneNo(ExcelEmp.get(j).getPhoneNo());
//					Emp.setLocation(ExcelEmp.get(j).getLocation());
//					Emp.setEngagementPlan(ExcelEmp.get(j).getEngagementPlan());
//					Emp.setExperience(ExcelEmp.get(j).getExperience());
//					Emp.setAllocationDate(allocationDate);
//					Emp.setDeletedFlag((byte) 0);
//					// Emp.setStatus("A");
//					if (Emp.getResourceCode() != null)
//						tbl_resource_poolNotMatch1.add(Emp);
//
//				}
//
//				this.tbl_resource_pool_Repository.saveAll(tbl_resource_poolNotMatch1);
//
//			}
//
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		} catch (IndexOutOfBoundsException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//
//	}

	public List<ResourcePool> getAllEmploye() {

		List<ResourcePool> tbl_resource_pool = new ArrayList<>();
		tbl_resource_pool = tbl_resource_pool_Repository.findAllByDeletedFlag();
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
		return tbl_resource_pool;

	}

	// For Updating Any Resource
	public String addorUpdateEmployee(ResourcePool emp) {

		try {
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

}
