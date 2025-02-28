package com.code2java.ecommerce.config;

import com.code2java.ecommerce.entity.Country;
import com.code2java.ecommerce.entity.Product;
import com.code2java.ecommerce.entity.ProductCategory;
import com.code2java.ecommerce.entity.State;

import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.VirtualThreadTaskExecutor;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.util.pattern.PathPattern;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
	@Value("${allowed.origins}")
	private String[] theAllowedOrigins;

	private EntityManager entityManager;
	
	@Autowired
	public MyDataRestConfig(EntityManager theEntityManager) {
		entityManager=theEntityManager;
	}
	
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] unsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH};

        // Disable HTTP methods for Product
       /* config.getExposureConfiguration()
            .forDomainType(Product.class)
            .withItemExposure((metadata, httpMethods) -> httpMethods.disable(unsupportedActions))
            .withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(unsupportedActions));*/

        // Disable HTTP methods for product,ProductCategory,country and state
        disableHttpMethods(Product.class,config, unsupportedActions);
        disableHttpMethods(ProductCategory.class,config, unsupportedActions);
        disableHttpMethods(Country.class,config, unsupportedActions);
        disableHttpMethods(State.class,config, unsupportedActions);

        // Configure CORS mapping
        cors.addMapping(config.getBasePath()+"/**")
            .allowedOrigins("http://localhost:4200"); // Adjust as per frontend
        
        exposeIds(config);
    }

	private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] unsupportedActions) {
		config.getExposureConfiguration()
            .forDomainType(theClass)
            .withItemExposure((metadata, httpMethods) -> httpMethods.disable(unsupportedActions))
            .withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(unsupportedActions));
	}
    private void exposeIds(RepositoryRestConfiguration config) {
    	//expose entity ids
    	
    	// -get a list of all entity classes from the entity Manager
    	Set<EntityType<?>> entities=entityManager.getMetamodel().getEntities();
    	
    	//create an array of the entity types
    	List<Class> entityClasses=new ArrayList<>();
    	
    	// -get the entity types for the entities
    	for(EntityType tempEntityType:entities) {
    		entityClasses.add(tempEntityType.getJavaType());
    	}
    	
    	//-expose the entity ids for the array of entity/domain type
    	Class[] domainTypes = entityClasses.toArray(new Class[0]);
    	config.exposeIdsFor(domainTypes);
    	
    	
    }
}
