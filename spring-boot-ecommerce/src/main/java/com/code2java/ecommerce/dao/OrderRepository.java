package com.code2java.ecommerce.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;

import com.code2java.ecommerce.entity.Order;

@RepositoryRestResource(collectionResourceRel = "orders", path = "orders")
public interface OrderRepository extends JpaRepository<Order, Long> {
	 @Override
	    @PreAuthorize("isAuthenticated()")  // 👈 Ensures only authenticated users can access
	    List<Order> findAll();
	    
	    @Override
	    @PreAuthorize("isAuthenticated()")
	    Optional<Order> findById(Long id);
	    
	Page<Order> findByCustomerEmailOrderByDateCreateDesc(@Param("email") String email, Pageable page);

	
}
