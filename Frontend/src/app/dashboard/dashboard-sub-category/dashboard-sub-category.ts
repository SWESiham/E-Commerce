import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SubCategoryService } from '../../core/service/sub-category-service';
import { CategoryService } from '../../core/service/category-service';
import { ISubCategory } from '../../core/models/sub-category';
import { ICategory } from '../../core/models/category';

@Component({
  selector: 'app-dashboard-sub-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-sub-category.html',
  styleUrls: ['./dashboard-sub-category.css']
})
export class DashboardSubCategory implements OnInit {

  formGroup!: FormGroup;
  categories: ICategory[] = [];
  subcategories: ISubCategory[] = [];
  filteredSubcategories: ISubCategory[] = [];

  isEdit: boolean = false;
  id!: string;

  constructor(
    private fb: FormBuilder,
    private subCategoryService: SubCategoryService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getCategories();
    this.getSubCategories();
  }

  // ✅ Initialize form
  initForm() {
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      slug: new FormControl('', [Validators.required]),
      categoryId: new FormControl('', [Validators.required]),
    });
  }

  // ✅ Generate slug automatically
  generateSlug(name: string): string {
    return name.toLowerCase().trim().replace(/[\s\W-]+/g, '-');
  }

  // ✅ Get all categories
  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  // ✅ Get all subcategories
  getSubCategories() {
    this.subCategoryService.getSubCategories().subscribe({
      next: (res) => {
        this.subcategories = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  // ✅ Add or Update subcategory
  addOrUpdateSubCategory() {
    if (this.formGroup.invalid) return;

    const name = this.formGroup.value.name;
    const slug = this.generateSlug(name);

    const data = {
      name: name,
      slug: slug,
      categoryId: this.formGroup.value.categoryId
    };

    if (this.isEdit) {
      // 🧩 Update
      this.subCategoryService.updateSubCategory(this.id, data).subscribe({
        next: (res) => {
          console.log('Updated:', res);
          this.getSubCategories();
          this.formGroup.reset();
          this.isEdit = false;
        },
        error: (err) => console.error(err)
      });
    } else {
      // ➕ Create
      this.subCategoryService.createSubCategory(data).subscribe({
        next: (res) => {
          console.log('Created:', res);
          this.getSubCategories();
          this.formGroup.reset();
        },
        error: (err) => console.error(err)
      });
    }
  }

  // ✅ Edit subcategory
  editSubCategory(sub: ISubCategory) {
    this.isEdit = true;
    this.id = sub._id;
    this.formGroup.patchValue({
      name: sub.name,
      slug: sub.slug,
      categoryId: sub.categoryId
    });
  }

  // ✅ Cancel edit
  cancelEdit() {
    this.isEdit = false;
    this.formGroup.reset();
  }

  // ✅ Delete subcategory
  deleteSubCategory(id: string) {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;

    this.subCategoryService.deleteSubCategory(id).subscribe({
      next: (res) => {
        console.log('Deleted:', res);
        this.subcategories = this.subcategories.filter(sub => sub._id !== id);
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
  getCategoryName(sub: ISubCategory): string {
  if (typeof sub.categoryId === 'object' && sub.categoryId !== null) {
    return sub.categoryId.name;
  }
  return '—';
}

}
