import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CategoryService } from '../../core/service/category-service';
import { ICategory } from '../../core/models/category';

@Component({
  selector: 'app-dashboard-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './dashboard-category.html',
  styleUrls: ['./dashboard-category.css']
})
export class DashboardCategory {
  categories: ICategory[] = [];
  form!: FormGroup;
  editing = false;
  selectedId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchCategories();
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      slug: ['', [Validators.required]],
    });
  }

  get name() {
    return this.form.get('name');
  }

  get slug() {
    return this.form.get('slug');
  }

  // ✅ Fetch all categories
  fetchCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // ✅ Add or update category
  submit() {
    if (this.form.invalid) return;
    const data = this.form.value;

    if (this.editing && this.selectedId) {
      this.categoryService.updateCategory(this.selectedId, data).subscribe({
        next: () => {
          this.fetchCategories();
          this.form.reset();
          this.editing = false;
          this.cdr.detectChanges();
        },
        error: (err) => console.log(err)
      });
    } else {
      this.categoryService.createCategory(data).subscribe({
        next: () => {
          this.fetchCategories();
          this.form.reset();
          this.cdr.detectChanges();
        },
        error: (err) => console.log(err)
      });
    }
  }

  // ✅ Open edit mode
  openEdit(cat: ICategory) {
    this.editing = true;
    this.selectedId = cat._id;
    this.form.patchValue({
      name: cat.name,
      slug: cat.slug,
    });
  }

  cancelEdit() {
    this.editing = false;
    this.selectedId = null;
    this.form.reset();
  }

  removeCategory(cat: ICategory) {
    if (!confirm(`Delete category "${cat.name}"?`)) return;

    this.categoryService.deleteCategory(cat._id).subscribe({
      next: () => {
        this.fetchCategories();
        this.cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
  }
}
