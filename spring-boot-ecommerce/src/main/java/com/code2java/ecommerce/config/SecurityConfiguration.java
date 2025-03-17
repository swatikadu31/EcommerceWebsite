package com.code2java.ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;

import com.okta.spring.boot.oauth.Okta;


@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    	 http
    	 .authorizeHttpRequests(auth -> auth
    			    .requestMatchers("/api/order/**").authenticated()
    			    .anyRequest().permitAll()
    			)
         .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults())) // Enforce JWT authentication
         .cors(Customizer.withDefaults()) // Enable CORS
         .csrf(AbstractHttpConfigurer::disable); // Disable CSRF (for APIs)

     // Set content negotiation strategy
     http.setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());

     // Return a 401 Unauthorized response if authentication fails
     Okta.configureResourceServer401ResponseBody(http);

    

     return http.build();

        
    }
    }
