import { ChangeDetectorRef, Component } from '@angular/core';
import { Testimonial } from '../../core/service/testimonial';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-testimonal',
  imports: [CommonModule],
  templateUrl: './dashboard-testimonal.html',
  styleUrl: './dashboard-testimonal.css'
})
export class DashboardTestimonal {
  testimonials: any[] = [];
  errorMessage = '';
  loading = false;

  constructor(private testimonialService: Testimonial, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadTestimonials();
    this.cdr.detectChanges();
  }

  loadTestimonials() {
    this.loading = true;
    this.testimonialService.getAllTestimonials().subscribe({
      next: (res: any) => {
        this.testimonials = res.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
console.log(err);
      }
    });
  }

  approve(id: string) {
    this.testimonialService.approveTestimonial(id).subscribe({
      next: () => this.loadTestimonials(),
      error: (err) => console.log(err)
    });
  }

  reject(id: string) {
    const reason = prompt('Enter rejection reason (optional):');
    this.testimonialService.rejectTestimonial(id, reason || '').subscribe({
      next: () => this.loadTestimonials(),
      error: (err) => console.log(err)
    });
  }

}
