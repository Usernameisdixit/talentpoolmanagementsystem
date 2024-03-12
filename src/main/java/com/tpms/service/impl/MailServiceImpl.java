package com.tpms.service.impl;

import java.io.IOException;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tpms.entity.Mail;
import com.tpms.entity.ResourcePool;
import com.tpms.repository.ResourcePoolRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;



@Service
public class MailServiceImpl {

    @Autowired
    private JavaMailSender mailSender;
    
  
    
    @Autowired
    private ResourcePoolRepository resourcePoolRepository;
    
  


    public void sendMail(String[] to, String[] cc, String subject, String text, MultipartFile file) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setCc(cc);
        helper.setSubject(subject);
        helper.setText(text);

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
}
