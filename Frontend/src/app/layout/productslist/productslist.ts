import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/service/product-service';
import { Iproduct } from '../../core/models/product';
import { Product } from './product/product';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../core/service/category-service';
@Component({
  selector: 'app-productslist',
  imports: [Product, CommonModule],
  templateUrl: './productslist.html',
  styleUrl: './productslist.css'
})
export class Productslist implements OnInit {
  products: Iproduct[] = [];
  categoriesWithSubs: any[] = [];
  selectedCategory: string | null = null;
  selectedSubCategory: string | null = null;

  constructor(
    private _productService: ProductService,
    private _categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getProducts();
    this.getCategories();
  }

  getProducts() {
    this._productService.getProduct().subscribe({
      next: (res) => {
        this.products = res.data
      this.cdr.detectChanges();
      
      },
      error: (err) => console.error(err)
    });
  }

  getCategories() {
    this._categoryService.getCategories().subscribe({
      next: (res) => {
        this.categoriesWithSubs = res.data
         this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
  filterByCategory(catId: string) {
    this.selectedCategory = catId;
    this.selectedSubCategory = null;
    this._productService.getByCategory(catId).subscribe({
      next: (res) => {
        this.products = res.data
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  filterBySubCategory(subId: string) {
    this.selectedSubCategory = subId;
    this._productService.getBySubCategory(subId).subscribe({
      next: (res) => {
        this.products = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
}