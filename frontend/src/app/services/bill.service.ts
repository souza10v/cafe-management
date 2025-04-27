import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  url = environment.apiUrl;
  
  constructor(private httpClient: HttpClient) { }

  generateReport(data: any) {
    return this.httpClient.post(this.url + '/bills/generateReport', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getPDF(data: any): Observable<Blob> {
    return this.httpClient.post(this.url + '/bills/getPDF', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'blob' as 'blob'  
    });
  }

  getBills(){
    return this.httpClient.get(this.url + '/bills/getBills');
  }

  delete(id :any){
    return this.httpClient.delete(this.url + '/bills/delete/' + id , {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }
  
}
