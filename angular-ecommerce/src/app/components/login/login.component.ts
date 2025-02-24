// Updated LoginComponent.ts
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { isPlatformBrowser } from '@angular/common';
import myAppConfig from '../../config/my-app-config';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  oktaSignin: any;
  isBrowser: boolean;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth, @Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngOnInit(): Promise<void> {
    if (!this.isBrowser) return;

    const { default: OktaSignIn } = await import('@okta/okta-signin-widget');

    this.oktaSignin = new OktaSignIn({
      logo: 'assets/images/logo.png',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
    });

    setTimeout(() => {
      const widgetEl = document.getElementById('okta-signin-widget');
      if (widgetEl) {
        this.oktaSignin.renderEl(
          { el: '#okta-signin-widget' },
          (response: any) => {
            if (response.status === 'SUCCESS') {
              this.oktaAuth.signInWithRedirect();
            }
          },
          (error: any) => console.error('Okta Widget error:', error)
        );
      }
    }, 0);
  }
}


