import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    // Call login method from AuthService
    this.authService
      .login(email, password)
      .then((userCredential) => {
        const user = userCredential.user; // Get the user object directly from the UserCredential

        if (user) {
          // Access the user role directly from the user object or custom claims
          this.firestore
            .collection('users')
            .doc(user.uid)
            .get()
            .subscribe({
              next: (doc: any) => {
                const currentUser = doc.data();
                const role = currentUser.role;

                if (role === 'professor') {
                  this.router.navigate(['/prof-dashboard']);
                } else if (role === 'student') {
                  this.router.navigate(['/student-dashboard']);
                } else {
                  this.router.navigate(['/']);
                }
              },
              error: (error: any) => {
                console.error('Error fetching role:', error);
                this.router.navigate(['/']); // Default redirection if there's an error
              },
            });
        }
      })
      .catch((error) => {
        console.error('Login failed', error);
      });
  }

  logout(): void {
    this.authService
      .logout()
      .then(() => {
        console.log('Logged out successfully');
        this.router.navigate(['/login']); // Redirect to login page after logout
      })
      .catch((error) => {
        console.error('Error during logout', error);
      });
  }
}
