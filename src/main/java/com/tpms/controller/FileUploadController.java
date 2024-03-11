package com.tpms.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;

@RestController
@CrossOrigin
public class FileUploadController {

    @Value("${upload-dir}")
    private String uploadDir;

    @PostMapping("/addFile")
    public ResponseEntity<String> uploadFileForMail(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload");
        }

        try {
            String fileName = System.currentTimeMillis() + "-" + file.getOriginalFilename();
            String filePath = uploadDir + File.separator + fileName;
            file.transferTo(new File(filePath));
            String fileUrl = "D:/Files/" + fileName; // Adjust the file path as per your requirement
            return ResponseEntity.ok().body(fileUrl);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to upload file");
        }
    }
}

