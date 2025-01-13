package com.code2java.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@SpringBootApplication
@ComponentScan(basePackages = "com.code2java.ecommerce")
@EnableJpaRepositories(basePackages = "com.code2java.ecommerce.dao")
public class SpringBootEcommerceApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringBootEcommerceApplication.class, args);
	}

}
