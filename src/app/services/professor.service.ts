import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { combineLatest, from, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfessorService {
  constructor(private firestore: AngularFirestore) {}

  getProfessorData() {
    return [
      { id: 1, subject: 'Math', class: '10th Grade', students: 30 },
      { id: 2, subject: 'Science', class: '9th Grade', students: 25 },
    ];
  }

  addstudent(formObj: any, id: string): Observable<any> {
    if (id) {
      return from(this.firestore.collection('grades').doc(id).update(formObj));
    } else {
      return from(this.firestore.collection('grades').add(formObj));
    }
  }

  addCourse(formObj: any, id: string): Observable<any> {
    if (id) {
      return from(this.firestore.collection('courses').doc(id).update(formObj));
    } else {
      return from(this.firestore.collection('courses').add(formObj));
    }
  }

  getCourseList(): Observable<any[]> {
    return this.firestore
      .collection('courses')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            data.date = data?.date?.toDate();
            const _id = a.payload.doc.id;
            return { _id, ...data }; // Combine the ID with the document data
          })
        )
      );
  }

  getClassList(professorId: string): Observable<any[]> {
    return this.firestore
      .collection('classes', (ref) =>
        ref.where('professorId', '==', professorId)
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            const _id = a.payload.doc.id;
            return { _id, ...data }; // Combine the ID with the document data
          })
        )
      );
  }

  getGradeList(loginUserId: string, role: string): Observable<any[]> {
    const gradesQuery =
      role === 'professor'
        ? this.firestore.collection('grades', (ref) =>
            ref.where('professorId', '==', loginUserId)
          )
        : this.firestore.collection('grades', (ref) =>
            ref.where('studentId', '==', loginUserId)
          );

    return gradesQuery.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as any;
          const _id = a.payload.doc.id;
          return { _id, ...data }; // Combine ID with the grade data
        })
      ),

      switchMap((grades) => {
        // Fetch student details for each grade
        let userFetches: Observable<any>[] = [];
        if (role === 'professor') {
          userFetches = grades.map((grade) =>
            this.firestore
              .collection('users')
              .doc(grade.studentId)
              .valueChanges()
              .pipe(
                map((userDetails) => ({
                  ...grade,
                  studentDetails: userDetails, // Merge user details with grade
                }))
              )
          );
        }
        if (role === 'student') {
          userFetches = grades.map((grade) =>
            this.firestore
              .collection('users')
              .doc(grade.professorId)
              .valueChanges()
              .pipe(
                map((userDetails) => ({
                  ...grade,
                  professorDetails: userDetails, // Merge user details with grade
                }))
              )
          );
        }

        // Combine all observables into a single stream
        return combineLatest(userFetches);
      })
    );
  }

  deleteCourse(courseId: string): Observable<void> {
    return from(this.firestore.collection('courses').doc(courseId).delete());
  }
  deleteGrade(gradeId: string): Observable<void> {
    return from(this.firestore.collection('grades').doc(gradeId).delete());
  }
}
