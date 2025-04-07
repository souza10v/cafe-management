import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModels } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  signup(data: UserModels.SignupRequest) {
    return this.httpClient.post<UserModels.SignupResponse>(this.url + '/user/signup', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  forgotPassword(data: UserModels.ResetPasswordRequest) {
    return this.httpClient.post<UserModels.ForgotPasswordResponse>(this.url + '/user/forgotPassword', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  login(data: UserModels.LoginRequest) {
    return this.httpClient.post<UserModels.LoginResponse>(this.url + '/user/login', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  checkToken() {
    return this.httpClient.get(this.url + '/user/checkToken');
  }
}
