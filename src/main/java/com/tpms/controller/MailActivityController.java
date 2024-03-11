package com.tpms.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tpms.entity.ResourcePool;
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
}


