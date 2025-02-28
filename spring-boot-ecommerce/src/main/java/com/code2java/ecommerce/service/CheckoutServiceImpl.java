package com.code2java.ecommerce.service;


import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.code2java.ecommerce.dao.CustomerRepository;
import com.code2java.ecommerce.dto.Purchase;
import com.code2java.ecommerce.dto.PurchaseResponse;
import com.code2java.ecommerce.entity.OrderItem;
import com.code2java.ecommerce.entity.Customer;
import com.code2java.ecommerce.entity.Order;

import jakarta.transaction.Transactional;

@Service
public class CheckoutServiceImpl implements CheckoutService{
	private CustomerRepository customerRepository;

    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        // retrieve the order info from dto
        Order order = purchase.getOrder();

        // generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        // populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        // populate order with billingAddress and shippingAddress
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        // populate customer with order
        Customer customer = purchase.getCustomer();
        
        //check if this customer is a existing customer
        String theEmail = customer.getEmail();
        
        Customer customerFromDB= customerRepository.findByEmail(theEmail);
        
        if(customerFromDB != null) {
        	//we found them --lets assign them accordingly
        	customer=customerFromDB;
        }
        
        
        customer.add(order);

        // save to the database
        customerRepository.save(customer);

        // return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {

        // generate a random UUID number (UUID version-4)
        // For details see: https://en.wikipedia.org/wiki/Universally_unique_identifier
        //
        return UUID.randomUUID().toString();
    }

}
