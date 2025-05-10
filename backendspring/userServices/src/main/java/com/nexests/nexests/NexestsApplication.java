package com.nexests.nexests;

import com.nexests.nexests.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class NexestsApplication implements CommandLineRunner {

	@Autowired
	private AuthService authService;

	public static void main(String[] args) {
		SpringApplication.run(NexestsApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// Initialize admin user on application start
		authService.initializeAdmin();
	}

}
