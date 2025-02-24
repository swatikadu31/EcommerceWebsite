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
        }
      );
    }
  }

  logout(){
    //terminate the session with Okta and remove current tokens

    this.oktaAuth.signOut();
  }
}
