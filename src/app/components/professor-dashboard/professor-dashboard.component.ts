import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ProfessorService } from '../../services/professor.service';
import { StudentService } from '../../services/student.service'; // Import Firestore service

interface StudentAttendance {
  _id: string;
  name: string;
  attendance: string; // Present/Absent
}

@Component({
  selector: 'app-professor-dashboard',
  templateUrl: './professor-dashboard.component.html',
  styleUrls: ['./professor-dashboard.component.scss'],
})
export class ProfessorDashboardComponent implements OnInit {
  loginUser: any;
  studendList: any = [];
  gradeList: any = [];
  classList: any = [];
  courseList: any = [];
  formData = {
    studentId: '',
    grade: '',
  };
  formIsEdit = '';

  // New course form data
  selectedStudentId: string = ''; // Track the selected student
  attendanceStatus: string = '';
  courseFormData = {
    classId: '',
    courseName: '',
    date: null,
    startTime: '',
    endTime: '',
    className: '',
    students: [] as StudentAttendance[],
    professorId: '', // Add professorId property
    subjectName: '', // Add subjectName property
  };
  formIsEditCourse = '';

  constructor(
    private authService: AuthService,
    private professorService: ProfessorService,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginUser = this.authService.getLoginUser().subscribe({
      next: (userData) => {
        const { user, id } = userData;
        this.loginUser.user = { ...user, _id: id };

        this.getStudendList();
        this.getClassList();
        this.getGradeList();
        this.getCourseList();
      },
      error: (error) => {
        console.error('Error fetching login user:', error);
      },
    });
  }

  // Submit course creation
  onSubmitCourse() {
    // Add the professorId and subjectName
    let params = { ...this.courseFormData };
    params.className = this.classList.find(
      (classItem: { _id: string }) =>
        classItem._id === this.courseFormData.classId
    )?.name;
    params.professorId = this.loginUser?.user._id;
    params.subjectName = this.loginUser?.user?.subject_name;

    if (this.formIsEditCourse && this.attendanceStatus) {
      params.students = this.courseFormData.students.map((student) => {
        if (student._id === this.selectedStudentId) {
          student.attendance = this.attendanceStatus;
        }
        return student;
      });
    }

    // Call Firestore service to add the course
    this.professorService.addCourse(params, this.formIsEditCourse).subscribe({
      next: (response: any) => {
        // Reset form data
        this.courseFormData = {
          className: '',
          classId: '',
          courseName: '',
          date: null,
          startTime: '',
          endTime: '',
          students: [],
          professorId: '',
          subjectName: '',
        };
        this.getCourseList();
      },
      error: (error: any) => {
        console.error('Error creating course:', error);
        // Handle error here
      },
    });
  }
  onSubmit() {
    let params: any = this.formData;
    params.subjectName = this.loginUser?.user?.subject_name;
    params.professorId = this.loginUser?.user._id;

    // Logic to handle form submission (e.g., add a new entry to the table)
    this.professorService.addstudent(params, this.formIsEdit).subscribe({
      next: () => {
        this.formIsEdit = '';
        this.formData = {
          studentId: '',
          grade: '',
        };
        this.getGradeList();
      },
      error: (error: any) => {
        console.error('Login failed', error);
        // Handle login error here
      },
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getCourseList() {
    this.professorService.getCourseList().subscribe({
      next: (response: any) => {
        this.courseList = response;
      },
      error: (error: any) => {
        console.error('Login failed', error);
        // Handle login error here
      },
    });
  }

  getStudendList() {
    this.studentService.getList().subscribe({
      next: (response: any) => {
        this.studendList = response;
      },
      error: (error: any) => {
        console.error('Login failed', error);
        // Handle login error here
      },
    });
  }

  getClassList() {
    this.professorService.getClassList(this.loginUser?.user._id).subscribe({
      next: (response: any) => {
        this.classList = response; // Store the class list
      },
      error: (error: any) => {
        console.error('Error fetching classes:', error);
      },
    });
  }

  onClassSelect() {
    // Get students of the selected class
    const selectedClass = this.classList.find(
      (c: { _id: string }) => c._id === this.courseFormData.classId
    );
    this.courseFormData.students = selectedClass ? selectedClass.students : [];
  }

  getGradeList() {
    this.professorService
      .getGradeList(this.loginUser?.user._id, this.loginUser?.user.role)
      .subscribe({
        next: (response: any) => {
          this.gradeList = response;
        },
        error: (error: any) => {
          console.error('Login failed', error);
          // Handle login error here
        },
      });
  }

  editGrade(grade: any) {
    this.formData.studentId = grade.studentId;
    this.formData.grade = grade.grade;
    this.formIsEdit = grade?._id;
  }

  editCourse(course: any) {
    this.courseFormData.classId = course.classId;
    this.courseFormData.courseName = course.courseName;
    this.courseFormData.date = course.date.toDate();
    this.courseFormData.startTime = course.startTime;
    this.courseFormData.endTime = course.endTime;
    this.courseFormData.students = course.students;
    this.formIsEditCourse = course?._id;
  }

  deleteCourse(grade: any) {
    this.professorService.deleteCourse(grade?._id).subscribe({
      next: () => {
        this.getGradeList(); // Refresh the list
      },
      error: (error: any) => {
        console.error('Error deleting grade:', error);
        // Handle error here
      },
    });
  }

  deleteGrade(grade: any) {
    this.professorService.deleteGrade(grade?._id).subscribe({
      next: () => {
        this.getGradeList(); // Refresh the list
      },
      error: (error: any) => {
        console.error('Error deleting grade:', error);
        // Handle error here
      },
    });
  }
}
