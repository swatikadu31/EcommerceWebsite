package com.code2java.ecommerce.service;

import com.code2java.ecommerce.dto.PaymentInfo;
import com.code2java.ecommerce.dto.Purchase;

import com.code2java.ecommerce.dto.PurchaseResponse;
import com.razorpay.Order;

import com.razorpay.RazorpayException;

public interface CheckoutService {

	PurchaseResponse placeOrder(Purchase purchase);
	
	String createPayment(PaymentInfo paymentInfo) throws RazorpayException;
}
