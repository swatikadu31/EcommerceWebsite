package com.code2java.ecommerce.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import com.code2java.ecommerce.entity.Order;

@RepositoryRestResource(path = "orders")
public interface OrderRepository extends JpaRepository<Order, Long> {
	
	Page<Order> findByCustomerEmailOrderByDateCreateDesc(@Param("email") String email, Pageable page);

	
}
