import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const currentRole = this.authService.getUserRole();
    
    if (currentRole === expectedRole) {
      return true;
    } else {
      // Redirect based on user role
      if (currentRole === 'student') {
        this.router.navigate(['/student-dashboard']);
      } else if (currentRole === 'professor') {
        this.router.navigate(['/professor-dashboard']);
      }
      return false;
    }
  }
}
