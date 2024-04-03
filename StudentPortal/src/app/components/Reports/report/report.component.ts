import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IStudentDto } from 'src/app/models/StudentDto';
import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent {
  public isRecordsShown: boolean = true;
  constructor(
    private studentservice: StudentService,
    private formBuilder: FormBuilder
  ) {
    this.searchForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: [''],
    });
  }
  public students: IStudentDto[] = [];
  public startDate = null;
  public endDate = null;
  public records: any[] = [];

  searchForm!: FormGroup;

  filterData() {
    console.log('hai:' + this.startDate);
    console.log(this.endDate);

    if (this.startDate == null || this.endDate == null) {
      //alert('Both date fields are mandatory!');
    } else {
      this.studentservice
        .getStudentsByDates(this.startDate, this.endDate)
        .subscribe((data) => {
          console.log(data);
          this.students = data;
          this.isRecordsShown = false;
        });
    }
    // else if(this.startDate)
    // {
    //   this.studentservice.getStudentsByStartDate(this.startDate).subscribe(data=>{
    //     console.log(data);

    //     this.students=data;
    //    })
    // }
    // else if(this.endDate)
    // {
    //   this.studentservice.getStudentsByEndDate(this.startDate).subscribe(data=>{
    //     console.log(data);

    //     this.students=data;
    //    })

    // }
  }
  downloadFile(filePath: string) {
    // const link = document.createElement('a');
    // link.href = filePath;
    // link.download = 'your_file_name.xlsx';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    const link = document.createElement('a');
    link.href = filePath;
    link.target = '_blank'; // Open in a new tab/window
    link.download = 'Training Curriculum.xlsx'; // Set a default filename

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onClickGenerateExcel() {
    if (this.startDate == null || this.endDate == null) {
      //alert('Both date fields are mandatory!');
    } else {
      this.studentservice
        .generateExcel(this.startDate, this.endDate)
        .subscribe({
          next: (data) => {
            console.log(data);
            console.log(data.msg);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Report Created Successfully...',
              showConfirmButton: false,
              timer: 1500,
            });

            // this.downloadFile(data.msg); 
          },
          error: (err) => {
            console.error(err);
          },
        });
    }
  }
}
