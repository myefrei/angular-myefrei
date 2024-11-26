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
  selectedClass: any | null = null; // Classe sélectionnée pour afficher les élèves
  students: any[] = []; // Liste des élèves d'une classe

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

  // Récupérer toutes les classes
  getClasses() {
    this.firestore
      .collection('classes')
      .valueChanges({ idField: 'id' })
      .subscribe((classes) => {
        this.classes = classes;
      });
  }

  // Ajouter une nouvelle classe
  addClass() {
    const newClass = prompt('Nom de la nouvelle classe :');
    if (newClass) {
      this.firestore.collection('classes').add({ name: newClass, students: [] });
    }
  }

  // Supprimer une classe
  deleteClass(classId: string) {
    this.firestore.collection('classes').doc(classId).delete();
  }

  // Voir les élèves d'une classe
  viewStudents(classId: string) {
    this.selectedClass = this.classes.find((cls) => cls.id === classId); // Trouver la classe sélectionnée
    if (this.selectedClass) {
      this.firestore
        .collection('users')
        .valueChanges()
        .subscribe((students) => {
          console.log(students);
          this.students = students as any ;
        });
    }
  }

  // Ajouter un élève à une classe
  addStudentToClass(classId: string) {
    const studentId = prompt('ID de l’élève à ajouter :');
    if (studentId) {
      const selectedClassRef = this.firestore.collection('classes').doc(classId);
      selectedClassRef.get().subscribe((doc) => {
        if (doc.exists) {
          const result:any = doc.data();
          const currentStudents = result?.students || [];
          selectedClassRef.update({
            students: [...currentStudents, studentId],
          });
        }
      });
    }
  }
}
