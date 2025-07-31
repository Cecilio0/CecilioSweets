import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth';
import { User } from './models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-status">
      <div *ngIf="isAuthenticated; else notAuthenticated">
        <h3>Welcome, {{ currentUser?.username }}!</h3>
        <p>Email: {{ currentUser?.email }}</p>
        <button (click)="logout()" class="btn btn-secondary">Logout</button>
      </div>
      
      <ng-template #notAuthenticated>
        <div>
          <h3>Please sign in</h3>
          <button (click)="login()" class="btn btn-primary">Login with Cognito</button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .auth-status {
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin: 1rem 0;
    }
    
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin: 0.5rem 0;
    }
    
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    
    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }
    
    .btn:hover {
      opacity: 0.9;
    }
  `]
})
export class AuthStatusComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  currentUser: User | null = null;
  private subscription = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to authentication state
    this.subscription.add(
      this.authService.isAuthenticated$.subscribe(
        (isAuthenticated: boolean) => {
          this.isAuthenticated = isAuthenticated;
        }
      )
    );

    // Subscribe to user data
    this.subscription.add(
      this.authService.currentUser$.subscribe(
        (user: User | null) => {
          this.currentUser = user;
        }
      )
    );
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
