package com.code2java.ecommerce.service;


import java.util.Set;
import java.util.UUID;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.code2java.ecommerce.dao.CustomerRepository;
import com.code2java.ecommerce.dto.PaymentInfo;
import com.code2java.ecommerce.dto.Purchase;
import com.code2java.ecommerce.dto.PurchaseResponse;
import com.code2java.ecommerce.entity.OrderItem;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.code2java.ecommerce.entity.Customer;
import com.code2java.ecommerce.entity.Order;

import jakarta.transaction.Transactional;


@Service
public class CheckoutServiceImpl implements CheckoutService{
	private CustomerRepository customerRepository;
	  private RazorpayClient razorpayClient;

    public CheckoutServiceImpl(CustomerRepository customerRepository,
    		 @Value("${razorpay.key_id}") String keyId, 
    		 @Value("${razorpay.key_secret}") String keySecret) {
        this.customerRepository = customerRepository;
        
        //initialize Razorpay API with secret key
        

        try {
            // Initialize Razorpay API
            this.razorpayClient = new RazorpayClient(keyId, keySecret);
        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to initialize Razorpay API", e);
        }
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

	@Override
	public String createPayment(PaymentInfo paymentInfo) throws RazorpayException {
		// TODO Auto-generated method stub
		
		List<String> paymentMethodTypes=new ArrayList<>();	
		paymentMethodTypes.add("card");
		
		Map<String, Object> params=new HashMap<>();
		params.put("amount", paymentInfo.getAmount());
		params.put("currency", paymentInfo.getCurrency());
		params.put("method","card");
		params.put("receipt", "txn_" + UUID.randomUUID());
		params.put("payment_capture", 1); // Auto-capture payment
		

	    // Create order using Razorpay API
	    com.razorpay.Order order = razorpayClient.orders.create(new JSONObject(params));

	    // Return the order ID to the frontend
	    return order.get("id"); // Razorpay order ID
	}

}
