import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaqService } from '../../core/service/faq-service';

@Component({
  selector: 'app-dashboard-faq',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-faq.html',
  styleUrls: ['./dashboard-faq.css']
})

export class DashboardFaq implements OnInit {
  faqs: any[] = [];
  newFaq = { question: '', answer: '', category: '' };
  editingFaq: any = null;
  categories = ['General','Shipping','Payments','Returns','Account','Orders'];

  constructor(private faqService: FaqService) {}

  ngOnInit(): void {
    this.loadFaqs();
  }

  loadFaqs() {
    this.faqService.getAll().subscribe({
      next: (res:any) => (this.faqs = res.data),
      error: (err) => console.log(err)
    });
  }

  addFaq() {
    if (!this.newFaq.question || !this.newFaq.answer) return;
    this.faqService.create(this.newFaq).subscribe({
      next: () => {
        this.newFaq = { question: '', answer: '', category: '' };
        this.loadFaqs();
      },
      error: (err) => console.log(err)
    });
  }

  editFaq(faq: any) {
    this.editingFaq = { ...faq };
  }

  saveFaq() {
    if (!this.editingFaq) return;
    this.faqService.update(this.editingFaq._id, this.editingFaq).subscribe({
      next: () => {
        this.editingFaq = null;
        this.loadFaqs();
      },
      error: (err) => console.log(err)
    });
  }

  deleteFaq(id: string) {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      this.faqService.delete(id).subscribe({
        next: () => this.loadFaqs(),
        error: (err) => console.log(err)
      });
    }
  }
}
