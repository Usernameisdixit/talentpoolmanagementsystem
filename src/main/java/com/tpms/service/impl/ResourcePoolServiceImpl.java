package com.tpms.service.impl;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;

import java.util.Date;
import java.util.List;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tpms.entity.ResourcePool;
import com.tpms.entity.ResourcePoolHistory;
import com.tpms.entity.Role;
import com.tpms.repository.ResourcePoolRepository;
import com.tpms.utils.ExcelUtils;



@Service
public class ResourcePoolServiceImpl {


	
	@Autowired
	private ResourcePoolRepository tbl_resource_pool_Repository;
	
	public void save(MultipartFile file, LocalDate allocationDate) {
		
		try {
			List<ResourcePoolHistory> ExcelEmp=ExcelUtils.convertExceltoListofEmployee(file.getInputStream(),allocationDate);
			
			List<ResourcePool> tbl_resource_pool= tbl_resource_pool_Repository.findAll();
			
			List<ResourcePoolHistory> tbl_resource_poolNotMatch=new ArrayList<>(ExcelEmp.size());
			
			List<ResourcePool> tbl_resource_poolNotMatch1=new ArrayList<>();
			
			List<ResourcePool> tbl_resource_poolMatch=new ArrayList<>((tbl_resource_pool.size()));
			
			tbl_resource_poolNotMatch.addAll(ExcelEmp);
			tbl_resource_poolMatch.addAll(tbl_resource_pool);
			
			if(CollectionUtils.isNotEmpty(tbl_resource_pool)) {
				
				for(int i=0;i<ExcelEmp.size();i++)
			   {
				
				//tbl_resource_pool NotMatch=new tbl_resource_pool();
				
				for(int j=0;j<tbl_resource_pool.size();j++) {
				
					
					if (ExcelEmp.get(i).getResourceCode() != null && tbl_resource_pool.get(j).getResourceCode() != null &&
					            ExcelEmp.get(i).getResourceCode().equalsIgnoreCase(tbl_resource_pool.get(j).getResourceCode())) {
					

					
						String ResourceCodeExcel = ExcelEmp.get(i).getResourceCode();
						String ResourceCodepool = tbl_resource_pool.get(j).getResourceCode();

						/*************************Updated Data that is not Present in Excel (Tagged Resources)******************/
						if (ResourceCodepool != null) {
						    tbl_resource_poolMatch.removeIf(obj -> {
						        String resourceCode = obj.getResourceCode();
						        return resourceCode != null && resourceCode.equalsIgnoreCase(ResourceCodepool);
						    });
						}

						/***************Excel Data Uploaded that is not Matched Current Data(New Resources)******************/				
						if (ResourceCodeExcel != null) {
						    tbl_resource_poolNotMatch.removeIf(obj -> {
						        String resourceCode = obj.getResourceCode();
						        return resourceCode != null && resourceCode.equalsIgnoreCase(ResourceCodeExcel);
						    });
						}

					
						} 
				
					}
			
				
				}
				
				
				/***************************************Updated Data that is not Present in Excel (Tagged Resources)***************************************/
				
				   for(int j=0;j<tbl_resource_poolMatch.size();j++) {
				   		
					SimpleDateFormat formatter =new SimpleDateFormat();
					Date date =new Date();
					
					tbl_resource_poolMatch.get(j).setStatus("D");
					tbl_resource_poolMatch.get(j).setDeletedFlag((byte) 1);
					
					
				
				
			     this.tbl_resource_pool_Repository.saveAll(tbl_resource_poolMatch);
				}
			
				
				/*******************************Excel Data Uploaded that is not Matched Current Data(New Resources)*************************************/
				
				for(int j=0;j<tbl_resource_poolNotMatch.size();j++) {
					ResourcePool Emp=new ResourcePool();	
					
					Emp.setResourceName(tbl_resource_poolNotMatch.get(j).getResourceName()); 
					Emp.setResourceCode(tbl_resource_poolNotMatch.get(j).getResourceCode());
					Emp.setPlatform(tbl_resource_poolNotMatch.get(j).getPlatform());
					Emp.setEmail(tbl_resource_poolNotMatch.get(j).getEmail());
					Emp.setPhoneNo(tbl_resource_poolNotMatch.get(j).getPhoneNo());
					Emp.setLocation(tbl_resource_poolNotMatch.get(j).getLocation());
					Emp.setEngagementPlan(tbl_resource_poolNotMatch.get(j).getEngagementPlan());
					Emp.setExperience(tbl_resource_poolNotMatch.get(j).getExperience());
					Emp.setAllocationDate(allocationDate);
					Emp.setDeletedFlag((byte) 0);
					Emp.setStatus("A");
					tbl_resource_poolNotMatch1.add(Emp);
				
				
			this.tbl_resource_pool_Repository.saveAll(tbl_resource_poolNotMatch1);
			
			}
			
			}else{
				
				/*************For First Time Data is Uploaded in tbl_resource_pool***************/
				
				for(int j=0;j<ExcelEmp.size();j++) {
					ResourcePool Emp=new ResourcePool();	
					
					Emp.setResourceName(ExcelEmp.get(j).getResourceName()); 
					Emp.setResourceCode(ExcelEmp.get(j).getResourceCode());
					Emp.setPlatform(ExcelEmp.get(j).getPlatform());
					Emp.setEmail(ExcelEmp.get(j).getEmail());
					Emp.setPhoneNo(ExcelEmp.get(j).getPhoneNo());
					Emp.setLocation(ExcelEmp.get(j).getLocation());
					Emp.setEngagementPlan(ExcelEmp.get(j).getEngagementPlan());
					Emp.setExperience(ExcelEmp.get(j).getExperience());
					Emp.setAllocationDate(allocationDate);
					Emp.setDeletedFlag((byte) 0);
					Emp.setStatus("A");
					tbl_resource_poolNotMatch1.add(Emp);
				}
				
				this.tbl_resource_pool_Repository.saveAll(tbl_resource_poolNotMatch1);	
				
			}
			
		
		
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		catch (IndexOutOfBoundsException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	public List<ResourcePool> getAllEmploye(){
		return this.tbl_resource_pool_Repository.findAll();
		
	}
	
	//For Updating Any Resource
	public String addorUpdateEmployee(ResourcePool emp) {
		
		Integer empid=emp.getResourceId();
		System.out.println(emp);
		
		
		tbl_resource_pool_Repository.save(emp);
		System.out.println(emp);
		if (empid==null)
		{
		
		return "Record Inserted";}
		else{
		return "Record Updated";	
		}
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
	
	

}
