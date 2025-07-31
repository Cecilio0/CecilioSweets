import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
  loading = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      console.log('LoginComponent: isAuthenticated', isAuthenticated);
      if (isAuthenticated) {
        this.router.navigate(['/recipes']);
      }
    });
  }

  login(): void {
    this.loading = true;
    this.authService.login();
  }
}
