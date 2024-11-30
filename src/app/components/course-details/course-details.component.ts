import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
})
export class CourseDetailsComponent {
  @Input() courseList: any;
  @Output() courseDeleted = new EventEmitter<any>();
  @Output() courseEdit = new EventEmitter<any>();

  ngOnInit(): void {
    console?.log('Course List:', this.courseList);
  }

  deleteSubject() {
    // this.subjectDeleted.emit(this.subject.id);
  }
  editCourse(course: any) {
    this.courseEdit.emit(course);
  }
  deleteCourse(course: any) {
    this.courseDeleted.emit(course);
  }
}
