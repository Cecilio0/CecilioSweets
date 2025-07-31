import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAuth } from 'angular-auth-oidc-client';

import { routes } from './app.routes';
import { authInterceptor } from './auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAuth({
      config: {
        authority: 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_9xY2HuYrE',
        redirectUrl: 'http://localhost:4200/recipes',
        clientId: '7krq3b8kkjfr2r6efuvlooa7qf',
        scope: 'email openid phone',
        responseType: 'code',
        // postLogoutRedirectUri: 'http://localhost:4200/auth/login',
        // silentRenew: true,
        // useRefreshToken: true,
        // renewTimeBeforeTokenExpiresInSeconds: 30
      }
    })
  ]
};
