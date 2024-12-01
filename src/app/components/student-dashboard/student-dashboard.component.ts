import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { AuthService } from '../../services/auth.service';
import { ProfessorService } from '../../services/professor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
})
export class StudentDashboardComponent implements OnInit {
  loginUser: any;
  studendList: any = [];
  gradeList: any = [];
  courseList: any = [];
  formData = {
    studentId: '',
    grade: '',
  };
  formIsEdit = '';

  constructor(
    private authService: AuthService,
    private professorService: ProfessorService,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginUser = this.loginUser = this.authService
      .getLoginUser()
      .subscribe({
        next: (userData) => {
          const { user, id } = userData;
          this.loginUser.user = { ...user, _id: id };

          this.getStudendList();
          this.getGradeList();
          this.getCourseList();
        },
        error: (error) => {
          console.error('Error fetching login user:', error);
        },
      });
  }

  onSubmit() {
    const params: any = {
      ...this.formData,
      subjectName: this.loginUser?.user?.subject_name,
      professorId: this.loginUser?.user._id,
    };

    // Call `addstudent` and handle the observable result
    this.professorService.addstudent(params, this.formIsEdit).subscribe({
      next: () => {
        // Reset the form after successful operation
        this.formIsEdit = '';
        this.formData = {
          studentId: '',
          grade: '',
        };

        // Refresh the grade list
        this.getGradeList();
      },
      error: (error) => {
        console.error('Submission failed:', error);
        // Handle error here
      },
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getStudendList() {
    this.studentService.getList().subscribe({
      next: (response: any) => {
        this.studendList = response;
      },
      error: (error) => {
        console.error('Login failed', error);
        // Handle login error here
      },
    });
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

  getCourseList() {
    this.studentService.getCourseList(this.loginUser?.user._id).subscribe({
      next: (response: any) => {
        this.courseList = response;
      },
      error: (error: any) => {
        console.error('Login failed', error);
        // Handle login error here
      },
    });
  }

  editGrade(grade: any) {
    this.formData.studentId = grade.studentId._id;
    this.formData.grade = grade.grade;
    this.formIsEdit = grade?._id;
  }
  deleteGrade(grade: any) {
    this.professorService.deleteGrade(grade?._id).subscribe({
      next: () => {
        this.getGradeList();
      },
      error: (error) => {
        console.error('Login failed', error);
        // Handle login error here
      },
    });
  }
}
