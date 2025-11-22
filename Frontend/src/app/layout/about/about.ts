import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Testimonial } from '../../core/service/testimonial';
import { CommonModule } from '@angular/common';
import { FaqService } from '../../core/service/faq-service';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About implements OnInit {
  constructor(private testimonialService: Testimonial, private cdr: ChangeDetectorRef,private faqService: FaqService) { };
  testimonials: any[] = [];
  ngOnInit(): void {
    this.loadTestimonials();
      this.cdr.detectChanges();
     this.faqService.getAll().subscribe({
       next: (res: any) => {
         this.faqs = res.data
        this.cdr.detectChanges();
       },
      error: (err) => console.log(err)
    });
  }
  loadTestimonials() {
    this.testimonialService.getTestimonials().subscribe({
      next: (res: any) => {
        this.testimonials = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  faqs: any[] = [];
  openIndex: number | null = null;

  
  

  toggleFAQ(index: number) {
    this.openIndex = this.openIndex === index ? null : index;
  }


}
