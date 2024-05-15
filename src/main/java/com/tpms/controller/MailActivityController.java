package com.tpms.controller;

import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.tpms.entity.CommunicationContent;
import com.tpms.service.impl.MailServiceImpl;

import jakarta.mail.MessagingException;


@RestController
@CrossOrigin
public class MailActivityController {

    @Autowired
    private MailServiceImpl mailService;

  
    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> sendMail(@RequestParam("to") String[] to,
                                           @RequestParam("cc") String[] cc,
                                           @RequestParam("subject") String subject,
                                           @RequestParam("text") String text,
                                           @RequestPart(value = "attachment", required = false) MultipartFile attachment) {
        try {
            mailService.sendMail(to, cc, subject, text, attachment);
            return ResponseEntity.ok().body(Map.of("message", "Mail sent successfully"));
          
        } catch (MessagingException e) {
        	 return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                     .body(Map.of("error", "Error sending mail", "details", e.getMessage()));
        }
    
    }
    
    @GetMapping("platform/{platform}/mailIds")
    public ResponseEntity<List<String>> getMailIdsByPlatform(@PathVariable String platform) {
        List<String> mailIds = mailService.getMailIdsByPlatform(platform);
        return ResponseEntity.ok(mailIds);
    }
    
	@PostMapping("allocationDataForMail")
	public String getallocationDataForMail(@RequestBody Map<String, String> params) throws JsonProcessingException {
	    String fromDate = params.get("fromDate");
	    String toDate = params.get("toDate");
		
		    JSONArray allDetails = mailService.getallocationDataForMail(fromDate,toDate);
	    	return allDetails.toString();
	
	}
	
	@GetMapping("mailContent")
	public CommunicationContent fetchContentData(@RequestParam String inputType) {
	    CommunicationContent activityListOnDateRange = mailService.fetchContentData(inputType);
	    return activityListOnDateRange;
	}
}


