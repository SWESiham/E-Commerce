import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Testimonial {
  private apiUrl = environment.apiURL + 'testimonial';

  constructor(private http: HttpClient) {}

  createTestimonial(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  getTestimonials() {
    return this.http.get(this.apiUrl);
  }
  getAllTestimonials() {
    return this.http.get(this.apiUrl + '/all');
  }

  approveTestimonial(id: string) {
    return this.http.patch(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectTestimonial(id: string, reason: string){
    return this.http.patch(`${this.apiUrl}/${id}/reject`, { reason });
  }
  

}
