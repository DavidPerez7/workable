package com.workable_sb.workable.service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.workable_sb.workable")
@EnableJpaRepositories(basePackages = "com.workable_sb.workable.repository")
@EntityScan(basePackages = "com.workable_sb.workable.models")
public class WorkableApplication {

	public static void main(String[] args) {
		SpringApplication.run(WorkableApplication.class, args);
	}

}
