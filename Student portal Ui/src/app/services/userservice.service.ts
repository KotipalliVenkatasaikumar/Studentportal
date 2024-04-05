import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILogin, ILoginResponse, IUser } from '../models/User';
import { AuthApi, UserApis } from '../api/api-paths';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Userservice {
  authHeaders = new HttpHeaders({ 'No-Auth': 'True' });
  constructor(private http: HttpClient) {}

  login(userLogin: ILogin): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(
      `${environment.baseUrl}${AuthApi.AUTHENTICATE}`,
      userLogin,
      {
        headers: this.authHeaders,
      }
    );
  }

  getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${environment.baseUrl}${UserApis.ALL}`);
  }

  registerUser(user: IUser): Observable<any> {
    return this.http.post<any>(
      `${environment.baseUrl}${UserApis.SAVE}`,
      user,

      {
        headers: this.authHeaders,
      }
    );
  }

  saveUser(user: IUser): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}${UserApis.SAVE}`, user);
  }

  updateUser(user: IUser): Observable<string> {
    return this.http.put<string>(
      `${environment.baseUrl}${UserApis.UPDATE}`,
      user
    );
  }
  removeUser(userId: number): Observable<string> {
    return this.http.delete<string>(
      `${environment.baseUrl}${UserApis.DELETE}/${userId}`
    );
  }

  confirmPassword(email: string, newPassword: string): Observable<any> {
    return this.http.get<any>(
      `${environment.baseUrl}${UserApis.UPDATEPASSWORD}${email}/${newPassword}`,
      {
        headers: this.authHeaders,
      }
    );
  }
  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.get<any>(
      `${environment.baseUrl}${UserApis.VERIFYOTP}${email}/${otp}`,

      {
        headers: this.authHeaders,
      }
    );
  }
  forgotPassword(forgotPasswordEmail: string): Observable<any> {
    return this.http.get<any>(
      `${environment.baseUrl}${UserApis.FORGOTPASSWORD}${forgotPasswordEmail}`,
      {
        headers: this.authHeaders,
      }
    );
  }

  searchByUserName(userName: string): Observable<any> {
    return this.http.get<any>(
      `${environment.baseUrl}${UserApis.SEARCHBYNAME}${userName}`,
      {
        headers: this.authHeaders,
      }
    );
  }
}
