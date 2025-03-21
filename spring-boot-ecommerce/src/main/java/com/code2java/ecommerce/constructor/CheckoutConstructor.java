package com.code2java.ecommerce.constructor;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.code2java.ecommerce.dto.PaymentInfo;
import com.code2java.ecommerce.dto.Purchase;
import com.code2java.ecommerce.dto.PurchaseResponse;
import com.code2java.ecommerce.service.CheckoutService;
import com.razorpay.Order;
import com.razorpay.RazorpayException;

@CrossOrigin("https://localhost:4200")
@RestController
@RequestMapping("/checkout")
public class CheckoutConstructor {
	  private CheckoutService checkoutService;
	  
	 
	public CheckoutConstructor(CheckoutService checkoutService) {
		this.checkoutService=checkoutService;
	}
	@PostMapping("/purchase")   
	public PurchaseResponse placeHolder(@RequestBody Purchase purchase) {
		PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);
	
	    return purchaseResponse;
	}
	@PostMapping("/payment-intent")
	public ResponseEntity<Map<String, String>> createPayment(@RequestBody PaymentInfo paymentInfo) {
	    try {
	        // Directly use amount from frontend (already in paise)
	        String orderId = checkoutService.createPayment(paymentInfo);

	        // Prepare response
	        Map<String, String> response = new HashMap<>();
	        response.put("orderId", orderId);
	        response.put("amount", String.valueOf(paymentInfo.getAmount())); // No conversion
	        response.put("currency", paymentInfo.getCurrency());

	        return ResponseEntity.ok(response);
	    } catch (RazorpayException e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(Collections.singletonMap("error", "Payment creation failed: " + e.getMessage()));
	    }
	}
}
