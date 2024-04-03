import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { IStudentDto } from 'src/app/models/StudentDto';
import { IUser, User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';

import { StudentService } from 'src/app/services/student.service';
import { pageSizeOptions } from 'src/app/utils/util';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent {
  public profile?: string | null = '';
  public students: IStudentDto[] = [];

  public user: IUser = new User();
  public isSerchingByStdName: boolean = false;
  public isSerchingByRefferedStdName: boolean = false;
  public page: number = 0;
  public size: number = 10;
  public totalPages: number = 0;
  public first: boolean = true;
  public last: boolean = false;
  public pageSizes: number[] = pageSizeOptions;
  private destroy$ = new Subject<void>();

  referName: string = '';
  studentName: string = '';

  constructor(
    private router: Router,
    private studentservice: StudentService,
    private authService: AuthService
  ) {

    this.getallstudents();
    this.referName;
    var e = authService.getUser();

    if (e) {
      console.log();
      this.user = JSON.parse(e);
    } else {
      console.error('User Not Found');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void { }

  editStudent(student: IStudentDto) {
    this.router.navigate(['dashboard/editStudent'], {
      state: { student: student },
    });
  }

  getallstudents() {
    this.studentservice
      .getAllStudentsPage(this.page, this.size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.students = resp.records;
          this.totalPages = resp.totalPages;
          this.first = resp.first;
          this.last = resp.last;
          this.page = 0;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  addStudent() {
    this.router.navigate(['dashboard/addStudent']);
  }

  removeStudent(studentsId: number) {
    this.studentservice
      .deleteStudent(studentsId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: any) => {
          console.log(resp);

          this.getallstudents();
        },
        error: (err: any) => {
          console.error(err);
          this.getallstudents();
        },
      });
  }
  getStudentsByReferName() {
    this.isSerchingByStdName = false;
    this.isSerchingByRefferedStdName = true;
    this.studentservice
      .getStudentByReferedName(this.referName, this.page, this.size)
      .subscribe(
        (resp: any) => {
          console.log(resp);
          this.students = resp.records;
          this.totalPages = resp.totalPages;
          this.first = resp.first;
          this.last = resp.last;
          this.page = 0;
        },
        (err: any) => {
          console.error(err);

          this.getallstudents();
        }
      );
  }

  getStudentsBystdName() {
    this.isSerchingByRefferedStdName = false;
    this.isSerchingByStdName = true;
    this.studentservice
      .getStudentsByStdName(this.studentName, this.page, this.size)
      .subscribe(
        (resp: any) => {
          console.log(resp);
          this.students = resp.records;
          this.totalPages = resp.totalPages;
          this.first = resp.first;
          this.last = resp.last;
          this.page = 0;
        },
        (err: any) => {
          console.error(err);
          this.getallstudents();
          //  //alert("dat not found")
        }
      );
  }

  printSize(event: any) {
    this.size = event.target.value;
    this.page = 0;
    if (this.isSerchingByStdName) {
      this.getStudentsBystdName();
    } else if (this.isSerchingByRefferedStdName) {
      this.getStudentsByReferName();
    } else {
      this.getallstudents();
    }
  }

  goToPage(pageNumber: number) {
    this.page = pageNumber;
    if (this.isSerchingByStdName) {
      this.getStudentsBystdName();
    } else if (this.isSerchingByRefferedStdName) {
      this.getStudentsByReferName();
    } else {
      this.getallstudents();
    }
  }

  goToNextOrPreviousr(direction: string) {
    this.page = direction === 'forward' ? this.page + 1 : this.page - 1;
    if (this.isSerchingByStdName) {
      this.getStudentsBystdName();
    } else if (this.isSerchingByRefferedStdName) {
      this.getStudentsByReferName();
    } else {
      this.getallstudents();
    }
    this.studentservice.getStudentsByStdName(this.studentName, 1, 10).subscribe(
      (resp: any) => {
        console.log(resp);
        this.students = resp;
      },
      (err: any) => {
        console.error(err);
        this.getallstudents();
        //  //alert("dat not found")
      }
    );
  }
}

function getStudentsBystdName() {
  throw new Error('Function not implemented.');
}
