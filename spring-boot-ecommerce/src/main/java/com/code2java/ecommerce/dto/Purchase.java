package com.code2java.ecommerce.dto;

import java.util.Set;

import com.code2java.ecommerce.entity.Address;
import com.code2java.ecommerce.entity.Customer;
import com.code2java.ecommerce.entity.Order;
import com.code2java.ecommerce.entity.OrderItem;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class Purchase {

	private Customer customer;
	
	private Address shippingAddress;
	
	private Address billingAddress;
	
	private Order order;
	
	private Set<OrderItem> orderItems;
}
