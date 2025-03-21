package com.code2java.ecommerce.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MyAppConfig implements WebMvcConfigurer {
	 @Value("${allowed.origins}")
	    private String[] theAllowedOrigins;

	    @Value("${server.servlet.context-path}")
	    private String basePath;

	    @Override
	    public void addCorsMappings(CorsRegistry cors) {
	        cors.addMapping(basePath + "/**")
	            .allowedOriginPatterns(theAllowedOrigins) // Use this for Spring Boot 3.x+
	            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
	            .allowedHeaders("*");
	    }
	

}
