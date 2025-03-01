import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuth } from '@okta/okta-auth-js';
import {OKTA_AUTH, OktaAuthStateService} from '@okta/okta-angular';
@Component({
  selector: 'app-login-status',
  standalone: false,
  
  templateUrl: './login-status.component.html',
  styleUrl: './login-status.component.css'
})
export class LoginStatusComponent implements OnInit{

  isAuthenticated: boolean=false;
  userFullName: string='';

  storage: Storage = sessionStorage;

  constructor(private oktaAuthService:OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth){

  }
  ngOnInit(): void {
      //Subscribe to authentication state changes

      this.oktaAuthService.authState$.subscribe(
        (result) =>{
          this.isAuthenticated = result.isAuthenticated!;
          this.getUserDetails();
        }
      )
  }
  getUserDetails() {
   
    if(this.isAuthenticated){
      //fetch the logged user details (user claims)
      //
      // user full name is exposed as a property name

      this.oktaAuth.getUser().then(
        (res) =>{
          this.userFullName = res.name as string;

          // retrive the user's email from authentication response
          const theEmail=res.email;

          //now store the email in  brower storage
          this.storage.setItem('userEmail',JSON.stringify(theEmail));
        }
      );
    }
  }

  logout(){
    //terminate the session with Okta and remove current tokens

    this.oktaAuth.signOut();
  }
}
