import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'; // Import `firebase/compat`
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  getCurrentUser(): Promise<firebase.User | null> {
    return this.afAuth.currentUser;
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
    // .then((userCredential) => {
    //   const role = 'prof';
    //   const redirectPath =
    //     role === 'prof' ? '/prof-dashboard' : '/student-dashboard';
    //   this.router.navigate([redirectPath]);
    // })
    // .catch((error) => {
    //   console.error('Erreur de connexion', error);
    //   alert('Erreur : ' + error.message);
    // });
  }

  register(email: string, password: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  async createUser(metadata: any): Promise<void> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new Error('No authenticated user found.');
    }

    const userId = currentUser.uid;

    // Access the Firestore database via Firebase SDK
    const firestore = firebase.firestore();
    await firestore
      .collection('users')
      .doc(userId)
      .set({
        email: currentUser.email,
        ...metadata, // Add additional metadata (e.g., role)
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  }

  logout() {
    return this.afAuth.signOut();
    // .then(() => {
    //   this.router.navigate(['/login']); // Redirige vers la page de connexion après déconnexion
    // })
    // .catch((error) => {
    //   console.error('Erreur lors de la déconnexion', error);
    // });
  }
}
