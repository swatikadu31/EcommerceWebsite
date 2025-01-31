import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Meet2ShopFormService } from '../../services/meet2-shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';

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
creditCardYears: number[]=[];
creditCardMonths: number[]=[];
countries:Country[]=[];
shippingAddressStates:State[]=[];
billingAddressStates:State[]=[];

constructor(private formBuilder:FormBuilder,
  private meet2ShopFormService:Meet2ShopFormService){

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

      //populated credit card months
const startMonth: number=new Date().getMonth()+1;
console.log("startMonth:" + startMonth);

this.meet2ShopFormService.getCreditCardMonths(startMonth).subscribe(
  data => {
    console.log("retrieved Credit card Month:" + JSON.stringify(data));
    this.creditCardMonths=data;
  }
);

      //polpulated credit card years
this.meet2ShopFormService.getCreditCardYears().subscribe(
  data=>{
    console.log("Retrieve credit card years:"+ JSON. stringify(data));
    this.creditCardYears=data;
  }
);
this.meet2ShopFormService.getCountries().subscribe(
  data => {
    console.log("retrived countries: "+JSON.stringify(data));
    this.countries=data;
  }
);

  }
  copyShippingAddressToBillingAddress(event: Event) {

    console.log('Shipping Address:', this.checkoutFormGroup.get('shippingAddress')?.value);
console.log('Billing Address (Before):', this.checkoutFormGroup.get('billingAddress')?.value);
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

        //bug fix code for state

        this.billingAddressStates=this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      //bug fix for state


      this.billingAddressStates=[];
    }
  }

  onSubmit(){
    console.log("Handle the Submit Button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The Email Address is: "+this.checkoutFormGroup.get('customer')?.value.email);
    console.log("The shipping Address country is: "+this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("The shipping Address state is: "+this.checkoutFormGroup.get('shippingAddress')?.value.state.name);

  }
  handleMonthsAndYears(){
    const creditCardFormGroup=this.checkoutFormGroup.get('creditCard');

    const currentYear: number =new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    //if the current year equals the selected year, then start with the current month

    let startMonth:number;
    if(currentYear == selectedYear){
      startMonth = new Date().getMonth()+1;

    }
    else{
      startMonth=1;
    }
    this.meet2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("retrived credit card months:" + JSON.stringify(data));
        this.creditCardMonths=data;
      
      }
    );
  }

  getStates(formGroupName:string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode= formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);
    this.meet2ShopFormService.getStates(countryCode).subscribe(
data => {
  if(formGroupName === 'shippingAddress'){
    this.shippingAddressStates = data;

  }
  else{
    this.billingAddressStates = data;

  }
  // select first item by default
  formGroup?.get('state')?.setValue(data[0]);
}
    );

  }
}
