import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Testimonial } from '../../core/service/testimonial';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonal',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './testimonal.html',
  styleUrl: './testimonal.css'
})
export class Testimonal {
  testimonialForm: FormGroup;
  successMessage !: Testimonial;
  errorMessage = '';

  constructor(private fb: FormBuilder, private testimonialService: Testimonial) {
    this.testimonialForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  submitTestimonial() {
    if (this.testimonialForm.invalid) return;

    this.testimonialService.createTestimonial(this.testimonialForm.value).subscribe({
      next: (res: any) => {
        this.successMessage = res.message;
        this.testimonialForm.reset();
      },
      error: (err) => {
      console.log(err);
      }
    });
  }
}  

