import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-professor-dashboard',
  templateUrl: './professor-dashboard.component.html',
  styleUrls: ['./professor-dashboard.component.css'],
})
export class ProfessorDashboardComponent implements OnInit {
  classes: any[] = [];

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getClasses();
  }

  logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      this.authService.logout();
    }
  }

  getClasses() {
    this.firestore
      .collection('classes')
      .valueChanges({ idField: 'id' })
      .subscribe((classes) => {
        this.classes = classes;
      });
  }

  addClass() {
    const newClass = prompt('Nom de la nouvelle classe :');
    if (newClass) {
      this.firestore.collection('classes').add({ name: newClass });
    }
  }

  deleteClass(classId: string) {
    this.firestore.collection('classes').doc(classId).delete();
  }

  viewStudents(classId: string) {
    // Naviguer vers une page ou ouvrir une dialog pour voir les élèves
    console.log('Voir les élèves pour la classe', classId);
  }
}
