import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Meet2ShopFormService } from '../../services/meet2-shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { Meet2shopValidators } from '../../validators/meet2shop-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';

@Component({
  selector: 'app-checkout',
  standalone: false,

  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {


  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  
  storage :Storage = sessionStorage;


  constructor(private formBuilder: FormBuilder,
    private meet2ShopFormService: Meet2ShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router) {

  }

  ngOnInit(): void {

    this.reviewCartDetails();

    //read the users email address from browser storage

    const theEmail= JSON.parse(this.storage.getItem('userEmail')|| '""');

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Meet2shopValidators.notOnlyWhitespace]),
        lastName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Meet2shopValidators.notOnlyWhitespace]),
          email: new FormControl(theEmail,
            [Validators.required,
            Validators.pattern('^[a-z0-9.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'),
            Meet2shopValidators.notOnlyWhitespace])
          
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2),
        Meet2shopValidators.notOnlyWhitespace]),

        city: new FormControl('', [Validators.required, Validators.minLength(2),
        Meet2shopValidators.notOnlyWhitespace]),

        state: new FormControl('', [Validators.required]),

        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(6),
        Meet2shopValidators.notOnlyWhitespace])

      }),
      billingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required, Validators.minLength(2),
        Meet2shopValidators.notOnlyWhitespace]),

        city: new FormControl('', [Validators.required, Validators.minLength(2),
        Meet2shopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(6),
        Meet2shopValidators.notOnlyWhitespace])

      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), Meet2shopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}'),
        Meet2shopValidators.notOnlyWhitespace]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}'),
        Meet2shopValidators.notOnlyWhitespace]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    //populated credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth:" + startMonth);

    this.meet2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("retrieved Credit card Month:" + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    //polpulated credit card years
    this.meet2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieve credit card years:" + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );
    this.meet2ShopFormService.getCountries().subscribe(
      data => {
        console.log("retrived countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );

  }
  reviewCartDetails() {
    //subscribe to cartService.totalQuantity

    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );


    //subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }


  copyShippingAddressToBillingAddress(event: Event) {

    console.log('Shipping Address:', this.checkoutFormGroup.get('shippingAddress')?.value);
    console.log('Billing Address (Before):', this.checkoutFormGroup.get('billingAddress')?.value);
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      //bug fix code for state

      this.billingAddressStates = [...this.shippingAddressStates];

    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      //bug fix for state


      this.billingAddressStates = [];
    }
  }

  onSubmit() {
    console.log("Handling the submit button");
    console.log("Is form valid?", this.checkoutFormGroup.valid);
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    console.log("Handling the order details");
    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    // - long way
    /*
    let orderItems: OrderItem[] = [];
    for (let i=0; i < cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    }
    */

    // - short way of doing the same thingy
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via the CheckoutService
    console.log("Final Purchase Object:", JSON.stringify(purchase))
    this.checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        console.log("Order placed successfully:", response);

        alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

        // reset cart
        this.resetCart();

      },
      error: err => {
        console.error("Error placing order:", err);
        alert(`There was an error: ${err.message}`);
      }
    }
    );
    console.log('Purchase Data:', JSON.stringify(purchase));
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The Email Address is: " + this.checkoutFormGroup.get('customer')?.value.email);
    console.log("The shipping Address country is: " + this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("The shipping Address state is: " + this.checkoutFormGroup.get('shippingAddress')?.value.state.name);

  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products");
  }
  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    //if the current year equals the selected year, then start with the current month

    let startMonth: number;
    if (currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1;

    }
    else {
      startMonth = 1;
    }
    this.meet2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("retrived credit card months:" + JSON.stringify(data));
        this.creditCardMonths = data;

      }
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);
    this.meet2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;

        }
        else {
          this.billingAddressStates = data;

        }
        // select first item by default
        formGroup?.get('state')?.setValue(data[0]);
      }
    );

  }
}
