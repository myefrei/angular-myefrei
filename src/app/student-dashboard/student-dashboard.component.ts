import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
})
export class StudentDashboardComponent implements OnInit {
  notes: any[] = [];
  filteredNotes: any[] = [];
  searchTerm: string = '';

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    try {
      const currentUser: firebase.User | null =
        await this.authService.getCurrentUser();
      if (currentUser) {
        this.firestore
          .collection('notes', (ref) =>
            ref.where('studentId', '==', currentUser.uid)
          )
          .valueChanges()
          .subscribe((notes) => {
            this.notes = notes;
            this.filteredNotes = notes;
          });
      } else {
        console.error('Aucun utilisateur connecté.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des notes :', error);
    }
  }

  logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      this.authService.logout();
    }
  }

  filterNotes() {
    this.filteredNotes = this.notes.filter((note) =>
      note.subject.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
