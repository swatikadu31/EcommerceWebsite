import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: false,
  
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {


  checkoutFormGroup!: FormGroup;
  totalPrice:number=0;
  totalQuantity:number=0;
constructor(private formBuilder:FormBuilder){

}

  ngOnInit(): void {
      this.checkoutFormGroup=this.formBuilder.group({
        customer:this.formBuilder.group({
          firstName:[''],
          lastName:[''],
          email:['']
        }),
        shippingAddress: this.formBuilder.group({
          street:[''],
          city:[''],
          state:[''],
          country:[''],
          zipCode:['']
        }),
        billingAddress: this.formBuilder.group({
          country:[''],
          street:[''],
          city:[''],
          state:[''],
          zipCode:['']
        }),
       creditCard: this.formBuilder.group({
          cardType:[''],
          nameOnCard:[''],
          cardNumber:[''],
         securityCode:[''],
          expirationMonth:[''],
          expirationYear:['']
        })
      });
  }
  copyShippingAddressToBillingAddress(event: Event) {

    console.log('Shipping Address:', this.checkoutFormGroup.get('shippingAddress')?.value);
console.log('Billing Address (Before):', this.checkoutFormGroup.get('billingAddress')?.value);
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  onSubmit(){
    console.log("Handle the Submit Button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The Email Address is: "+this.checkoutFormGroup.get('customer')?.value.email);
  }

}
