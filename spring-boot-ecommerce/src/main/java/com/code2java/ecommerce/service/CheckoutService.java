package com.code2java.ecommerce.service;

import com.code2java.ecommerce.dto.Purchase;
import com.code2java.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

	PurchaseResponse placeOrder(Purchase purchase);
}
