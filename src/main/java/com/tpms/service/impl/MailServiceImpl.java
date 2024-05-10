package com.tpms.service.impl;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tpms.entity.CommunicationContent;
import com.tpms.entity.Mail;
import com.tpms.entity.ResourcePool;
import com.tpms.repository.ActivityAllocationDetailsRepository;
import com.tpms.repository.CommunicationContentRepository;
import com.tpms.repository.ResourcePoolRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;



@Service
public class MailServiceImpl {

    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    private CommunicationContentRepository communicationContentRepository;
    
  
    
    @Autowired
    private ResourcePoolRepository resourcePoolRepository;
    
    @Autowired
    private ActivityAllocationDetailsRepository activityAllocationDetailsRepository;
    
    @Value("spring.mail.username")
    private String senderEmail;


    public void sendMail(String[] to, String[] cc, String subject, String text, MultipartFile file) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom(senderEmail);
        helper.setTo(to);
        helper.setCc(cc);
        helper.setSubject(subject);
        helper.setText(text,true);
        
        if (file != null) {
            helper.addAttachment(file.getOriginalFilename(), new InputStreamSource() {
                @Override
                public java.io.InputStream getInputStream() throws IOException {
                    return file.getInputStream();
                }
            });
        }

        mailSender.send(message);
    }


	 public List<String> getMailIdsByPlatform(String platformName) {
		 
            List<ResourcePool> resourcePools = resourcePoolRepository.findByPlatform(platformName);
            List<String> mailIds = resourcePools.stream()
                    .map(ResourcePool::getEmail) 
                    .collect(Collectors.toList());
            return mailIds;
     
    }


	public JSONArray getallocationDataForMail(String fromDate, String toDate) {
		JSONArray data = new JSONArray();
		Integer resourceId = 0;
		JSONObject resource = new JSONObject();
		JSONArray activityAllocationDetails = new JSONArray();
		SimpleDateFormat inputFormat = new SimpleDateFormat("M/d/yyyy, h:mm:ss a");
		SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd");
		String formattedFromDate = null;
		String formattedToDate = null;
		try {
			if (fromDate != null && !fromDate.equals("undefined")) {
				Date date = inputFormat.parse(fromDate);
				formattedFromDate = outputFormat.format(date);
			}
			if (toDate != null && !toDate.equals("undefined")) {
				Date date = inputFormat.parse(toDate);
				formattedToDate = outputFormat.format(date);
			}
		} catch (ParseException e1) {

			e1.printStackTrace();
		}
		try{
		List<Map<String,Object>> details= activityAllocationDetailsRepository.getallocationDataForMail(formattedFromDate,formattedToDate);
		for (Map<String, Object> mapObject : details) {
			Integer mapResourceId =  (Integer) mapObject.get("resourceId");
			if (resourceId == 0) {
				resourceId = mapResourceId;
			} else if (resourceId != mapResourceId ) {
				resource.put("activityAllocationDetails", activityAllocationDetails);
				data.put(resource);
				resourceId = mapResourceId;
				resource = new JSONObject();
				activityAllocationDetails = new JSONArray();
			}
			if (resource.length() == 0) {
				resource.put("resourceName", mapObject.get("resourceName"));
				resource.put("resourceCode", mapObject.get("resourceCode"));
				resource.put("platform", mapObject.get("platform"));
				resource.put("designation", mapObject.get("designation"));
				resource.put("email", mapObject.get("email"));
			}
			JSONObject detailObject = new JSONObject();
			detailObject.put("activityName", mapObject.get("activityName"));
			detailObject.put("isActivity", "Yes");
			detailObject.put("fromHours", mapObject.get("fromHours"));
			detailObject.put("toHours", mapObject.get("toHours"));
			activityAllocationDetails.put(detailObject);
			
		}
		if(resource.length()!=0) {
		resource.put("activityAllocationDetails", activityAllocationDetails);
		data.put(resource);
		}
	} catch (Exception e) {
		e.printStackTrace();
	}
		
		return data;
	}


	public CommunicationContent fetchContentData(String inputType) {
		return communicationContentRepository.findByCommType(inputType);
	}
}
