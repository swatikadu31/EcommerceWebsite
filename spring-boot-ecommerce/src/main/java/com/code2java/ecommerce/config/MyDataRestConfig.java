package com.code2java.ecommerce.config;

import com.code2java.ecommerce.entity.Product;
import com.code2java.ecommerce.entity.ProductCategory;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] unsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH};

        // Disable HTTP methods for Product
        config.getExposureConfiguration()
            .forDomainType(Product.class)
            .withItemExposure((metadata, httpMethods) -> httpMethods.disable(unsupportedActions))
            .withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(unsupportedActions));

        // Disable HTTP methods for ProductCategory
        config.getExposureConfiguration()
            .forDomainType(ProductCategory.class)
            .withItemExposure((metadata, httpMethods) -> httpMethods.disable(unsupportedActions))
            .withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(unsupportedActions));

        // Configure CORS mapping
        cors.addMapping("/api/**")
            .allowedOrigins("http://localhost:4200"); // Adjust as per frontend
    }
}
