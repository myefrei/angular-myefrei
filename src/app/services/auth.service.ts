import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  login(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const role = 'prof';
        const redirectPath =
          role === 'prof' ? '/prof-dashboard' : '/student-dashboard';
        this.router.navigate([redirectPath]);
      })
      .catch((error) => {
        console.error('Erreur de connexion', error);
        alert('Erreur : ' + error.message);
      });
  }

  logout() {
    return this.afAuth.signOut().then(() => this.router.navigate(['/login']));
  }
}
