import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { IUser } from 'src/app/models/User';
import { Userservice } from 'src/app/services/userservice.service';
import { pageSizeOptions } from 'src/app/utils/util';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  public users: IUser[] = [];
  public name:string='';

  public page: number = 0;
  public size: number = 10;
  public totalPages: number = 0;
  public first: boolean = true;
  public last: boolean = false;
  public pageSizes: number[] = pageSizeOptions;

  private destroy$ = new Subject<void>();
  // isSerchingByUserName: boolean;

  constructor(private router: Router, private userService: Userservice) {}
  ngOnInit(): void {
    this.getallUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  editUser(user: IUser) {
    this.router.navigate(['dashboard/edituser'], {
      state: { user: user },
    });
  }

  getallUsers() {
    this.userService
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          console.log(JSON.stringify(resp));
          this.users = resp;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  addUser() {
    this.router.navigate(['dashboard/adduser']);
  }

  removeUser(userId: number) {
    this.userService
      .removeUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          console.log(JSON.stringify(resp));

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'User Deleted Successfully...',
            showConfirmButton: false,
            timer: 1000,
          });
          setTimeout(() => {
            this.getallUsers();
          },500)
        },
        error: (err) => {
          console.error(err);
          this.getallUsers();
        },
      });
  }

  

  getUsersBystdName() {
    // this.isSerchingByRefferedStdName = false;
    // this.isSerchingByUserName = true;
    this.userService
      .searchByUserName(this.name)
      .subscribe(
        (resp: any) => {
          console.log(resp);
          this.users = resp;
          console.log(resp);
          
          // this.totalPages = resp.totalPages;
          // this.first = resp.first;
          // this.last = resp.last;
          // this.page = 0;
        },
        (err: any) => {
          console.error(err);
          // this.getallstudents();
          //  //alert("dat not found")
        }
      );
  }
  userName(userName: any, page: number, size: number) {
    throw new Error('Method not implemented.');
  }

  printSize(event: any) {
    this.size = event.target.value;
    this.page = 0;
    this.getallUsers();
  }
  goToPage(pageNumber: number) {
    this.page = pageNumber;
    this.getallUsers();
  }
  goToNextOrPreviousr(direction: string) {
    this.page = direction === 'forward' ? this.page + 1 : this.page - 1;
    this.getallUsers();
  }
}
