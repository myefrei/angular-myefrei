import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  selectedTab: 'student' | 'professor' = 'student';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Define the registration form with validation
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [this.selectedTab, Validators.required], // Automatically tied to the selectedTab
      class_name: [''], // Optional field for students
      subject_name: [''], // Optional field for professors
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  /**
   * Handles form submission.
   */
  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      return;
    }

    const params = { ...this.registerForm.value };
    params.role = this.selectedTab; // Set the role from the selected tab

    // Adjust metadata based on role
    if (this.selectedTab === 'student') {
      delete params.subject_name; // Students don't need subject_name
    } else {
      delete params.class_name; // Professors don't need class_name
    }

    try {
      // Step 1: Register the user
      await this.authService.register(params.email, params.password);

      // Step 2: Add user metadata (name, role, etc.) in Firestore
      await this.authService.createUser({
        name: params.name,
        role: params.role,
        class_name: params.class_name || null,
        subject_name: params.subject_name || null,
      });

      // Navigate to the login page after successful registration
      console.log('Registration successful');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Registration failed', error);
      this.errorMessage = 'Registration failed. Please try again.';
    }
  }
}
