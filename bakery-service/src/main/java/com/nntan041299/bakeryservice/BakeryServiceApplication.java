package com.nntan041299.bakeryservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication(scanBasePackages = {"com.nntan041299"})
@EnableTransactionManagement
@EnableScheduling
@EnableFeignClients
public class BakeryServiceApplication {

	static void main(String[] args) {
		SpringApplication.run(BakeryServiceApplication.class, args);
	}
}
