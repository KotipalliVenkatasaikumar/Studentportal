import { Component } from '@angular/core';
import 'bootstrap';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'student-appl';
  constructor() {
    console.log(environment.baseUrl);
  }
}
