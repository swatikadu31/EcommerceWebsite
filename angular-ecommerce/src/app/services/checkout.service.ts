import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Purchase } from '../common/purchase';
import { environment } from '../../environments/environment';
import { PaymentInfo } from '../common/payment-info';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
private purchaseUrl=environment.meet2shopApiUrl+'/checkout/purchase';

private paymentIntentUrl=environment.meet2shopApiUrl+'/checkout/payment-intent';
  constructor(private httpClient:HttpClient) { }

  placeOrder(purchase:Purchase):Observable<any>{
    return this.httpClient.post<Purchase>(this.purchaseUrl,purchase);
  }

  createPayment(paymentinfo:PaymentInfo):Observable<any> {

    return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl,paymentinfo);
  }

}
