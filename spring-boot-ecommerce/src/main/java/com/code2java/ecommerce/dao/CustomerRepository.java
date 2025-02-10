package com.code2java.ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.code2java.ecommerce.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

}
