import { Injectable, inject, OnDestroy } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private readonly oidcSecurityService = inject(OidcSecurityService);

  configuration$ = this.oidcSecurityService.getConfiguration();
  userData$ = this.oidcSecurityService.userData$;

  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  public readonly isAuthenticated$ = this._isAuthenticated.asObservable();
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private subscription = new Subscription();

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    this.subscription.add(
      this.oidcSecurityService.isAuthenticated$.subscribe(
        ({ isAuthenticated }) => {
          this._isAuthenticated.next(isAuthenticated);
          console.warn('authenticated: ', isAuthenticated);
          
          if (isAuthenticated) {
            this.loadUserFromCognito();
          } else {
            this.currentUserSubject.next(null);
          }
        }
      )
    );
  }

  private loadUserFromCognito(): void {
    this.userData$.subscribe(userData => {
      if (userData && userData.userData) {
        // Map Cognito user data to your User model
        const cognitoUser = userData.userData;
        const user: User = {
          id: cognitoUser['sub'] || cognitoUser['cognito:username'] || '',
          username: cognitoUser['preferred_username'] || cognitoUser['cognito:username'] || cognitoUser['email'] || '',
          email: cognitoUser['email'] || '',
          createdAt: new Date()
        };
        this.currentUserSubject.next(user);
      }
    });
  }

  login(): void {
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    this.oidcSecurityService.logoff();
  }

  isAuthenticated(): boolean {
    return this._isAuthenticated.getValue();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }

  getAccessToken(): Observable<string> {
    return this.oidcSecurityService.getAccessToken();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
