import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-subject-details',
  templateUrl: './subject-details.component.html',
  styleUrls: ['./subject-details.component.scss'],
})
export class SubjectDetailsComponent {
  @Input() gradeList: any;
  @Output() subjectDeleted = new EventEmitter<any>();
  @Output() subjectEdit = new EventEmitter<any>();

  deleteSubject() {
    // this.subjectDeleted.emit(this.subject.id);
  }
  editGrade(grade: any) {
    this.subjectEdit.emit(grade);
  }
  deleteGrade(grade: any) {
    this.subjectDeleted.emit(grade);
  }
}
