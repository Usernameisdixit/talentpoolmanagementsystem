package com.tpms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tpms.entity.Mail;
import com.tpms.entity.Platform;





public interface MailRepository extends JpaRepository<Mail, Long> {
    List<Mail> findByPlatform(Platform platform);
}

