import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  url = environment.apiUrl;
  
  constructor(private httClient: HttpClient) { }

  generateReport(data: any) {
    return this.httClient.post(this.url + '/bills/generateReport', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getPDF(data: any): Observable<Blob> {
    return this.httClient.post(this.url + '/bills/getPDF', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'blob' as 'blob'  
    });
  }
  
}
