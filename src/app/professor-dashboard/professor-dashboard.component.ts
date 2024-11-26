import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-professor-dashboard',
  templateUrl: './professor-dashboard.component.html',
  styleUrls: ['./professor-dashboard.component.css'],
})
export class ProfessorDashboardComponent implements OnInit {
  classes: any[] = [];

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.getClasses();
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
