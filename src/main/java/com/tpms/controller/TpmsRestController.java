package com.tpms.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TpmsRestController {
	
	@RequestMapping("/")
	public String getRestHome() {
		return "Welcome TPMS...";
	}
}
