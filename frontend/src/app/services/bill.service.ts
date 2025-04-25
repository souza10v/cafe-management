import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  url = environment.apiUrl;
  
  constructor(private httClient: HttpClient) { }

  generateReport(data: any) {
    return this.httClient.post(this.url + '/bill/generateReport', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getPDF(data: any) {
    return this.httClient.get(this.url + '/bill/getPDF/' + data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }
}
