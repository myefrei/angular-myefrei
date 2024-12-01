import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private firestore: AngularFirestore) {}

  getList(): Observable<any> {
    return this.firestore
      .collection('users', (ref) => ref.where('role', '==', 'student'))
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

  getCourseList(loginUserId: string): Observable<any[]> {
    return this.firestore
      .collection('courses')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            const { students } = data;
            const newData = {
              ...data,
              students,
            };

            newData.date = newData.date.toDate('dd/MM/yyyy');

            newData.attendance = students.find(
              (student: any) => student._id === loginUserId
            )?.attendance;

            const _id = a.payload.doc.id;
            return { _id, ...newData }; // Combine the ID with the document data
          })
        )
      );
  }
}
