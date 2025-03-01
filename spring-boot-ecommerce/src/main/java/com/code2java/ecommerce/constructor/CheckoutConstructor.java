package com.code2java.ecommerce.constructor;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.code2java.ecommerce.dto.Purchase;
import com.code2java.ecommerce.dto.PurchaseResponse;
import com.code2java.ecommerce.service.CheckoutService;

@CrossOrigin("http://localhost:4200")
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
	    

}
