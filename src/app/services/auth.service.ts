import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'; // Import `firebase/compat`
import { Router } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  getCurrentUser(): Promise<firebase.User | null> {
    return this.afAuth.currentUser;
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
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

  isLoggedIn(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.afAuth.authState.subscribe((user) => {
        if (user) {
          observer.next(true); // User is logged in
        } else {
          observer.next(false); // No user logged in
        }
      });
    });
  }

  getLoginUser(): Observable<any> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          // Fetch user document from Firestore
          const userf = this.firestore.collection('users').doc(user.uid).get();
          return userf;
        } else {
          return of(null); // Return null if no user
        }
      }),
      map((userDoc) =>
        userDoc ? { user: userDoc.data(), id: userDoc.id } : null
      ) // Map Firestore document to its data
    );
  }

  async getUserRole(): Promise<any> {
    const user = await this.getCurrentUser();
    if (user) {
      const userRole = this.firestore
        .collection('users')
        .doc(user.uid)
        .valueChanges()
        .pipe(
          map((userData: any) => userData.role) // Assuming the role is stored as 'role'
        );

      return userRole;
    }
  }

  logout() {
    return this.afAuth.signOut();
  }
}
