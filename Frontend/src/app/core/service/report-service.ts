import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISalesSummaryResponse } from '../models/report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiURL = environment.apiURL + 'analytics';

  constructor(private http: HttpClient) {};
  
  getSalesSummary(startDate?: string, endDate?: string): Observable<ISalesSummaryResponse> {
    let params = new HttpParams();
    if (startDate && endDate) {
      params = params.set('startDate', startDate);
      params = params.set('endDate', endDate);
    }
    const url = `${this.apiURL}/sales-summary`;
    return this.http.get<ISalesSummaryResponse>(url, { params });
  }
}