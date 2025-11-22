import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../core/service/product-service';
import { CategoryService } from '../../core/service/category-service';
import { CommonModule } from '@angular/common';
import { Iproduct, IProductsResponse } from '../../core/models/product';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard-products',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dashboard-products.html',
  styleUrl: './dashboard-products.css'
})
export class DashboardProducts implements OnInit {
  constructor(private _prodSer: ProductService, private _categoryService: CategoryService, private cdr: ChangeDetectorRef) { };

  formGroup: FormGroup = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    price: new FormControl(''),
    stock: new FormControl(''),
    category: new FormControl(''),
    subCategory: new FormControl(''),

  })
  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
    this.updateSubCategory();
  }
  categoriesWithSubs!: any[];
  filteredSubcategories!: any[];
  products!: Iproduct[];
  static = environment.staticURL;
  generateSlug(name: string): string {
    return name.toLowerCase().trim().replace(/[\s\W-]+/g, '-')
  }
   imageFile = "" ;
  onChange(event: any) {
  var file = event.target.files?.[0];
  if (file) {
    console.log('Selected filevbvbv:', file);
    this.imageFile = file;
    this.formGroup.patchValue({ image: file });
  }else{
    console.log("lalalalalala");
    
  }
  }
  
  addProduct() {
    const formData = new FormData();

    const title = this.formGroup.value.title;
    const autoSlug = this.generateSlug(title);

    formData.append('title', title);
    formData.append('description', this.formGroup.value.description);
    formData.append('price', this.formGroup.value.price);
    formData.append('stock', this.formGroup.value.stock);
    formData.append('categoryId', this.formGroup.value.category);
    formData.append('subCategoryId', this.formGroup.value.subCategory);
    formData.append('slug', autoSlug);

    if (this.imageFile)
      formData.append("image", this.imageFile);
     else {
      console.warn('No file selected');
    }

    this._prodSer.addProduct(formData).subscribe({
      next: (res) => {
        console.log('Product added:', res);
        this.getProducts();
        this.formGroup.reset();
      },
      error: (err) => {
        console.error('Error adding product:', err);
      }
    });
  }

  getCategories() {
    this._categoryService.getCategories().subscribe({
      next: (res) => {
        this.categoriesWithSubs = res.data
        console.log('Categories with subs:', this.categoriesWithSubs);
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  updateSubCategory() {
    this.formGroup.get('category')?.valueChanges.subscribe((id) => {
      const selectedCat = this.categoriesWithSubs.find(c => c._id === id);
      this.filteredSubcategories = selectedCat ? selectedCat.subcategories : [];
      this.formGroup.patchValue({ subCategory: '' });
    });
  }

  getProducts() {
    this._prodSer.getProduct().subscribe({
      next: (res) => {
        this.products = res.data
        console.log(this.products);
        
      this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  isEdit: boolean = false;
  id!: string;
  editProduct(product:Iproduct){
    this.isEdit = true;
    this.id = product._id;
    this.formGroup.patchValue({
      'title': product.title,
      'description': product.description,
      'slug': product.slug,
      'price': product.price,
      'stock': product.stock,
      'categoryId': product.categoryId?.name,
      'subCategoryId': product.subCategoryId?.name,
     
    });
  }

  updateProduct() {
    let formData = new FormData();
    const title = this.formGroup.value.title;
    const autoSlug = this.generateSlug(title);
    formData.append('title', title);
    formData.append('description', this.formGroup.value.description);
    formData.append('price', this.formGroup.value.price);
    formData.append('stock', this.formGroup.value.stock);
    formData.append('categoryId', this.formGroup.value.category);
    formData.append('subCategoryId', this.formGroup.value.subCategory);
    formData.append('slug', autoSlug);
     if (this.imageFile)
      formData.append("image", this.imageFile);
     else {
      console.warn('No file selected');
    }
    this._prodSer.updateProduct(formData,this.id).subscribe({
         next: (res) => {
          console.log(res);
          this.isEdit = false;
          this.products = this.products.map(p => (p._id === this.id) ? res.data : p);
          this.getProducts();
          this.formGroup.reset();
        }, error: (err) => {
          console.log(err);
        }, complete: () => {
          console.log("product updated.");
        }
      });
      


  }


  deleteProduct(id:string) {
    this._prodSer.deleteProduct(id).subscribe({
      next: (res) => {
        console.log(res);
        this.products = this.products.filter(p => p._id !== id);
        this.getProducts();
        this.formGroup.reset();
      },
      error: (err) => {
        console.error(err)
      }, complete: () => {
        console.log("product deleted.");
        
      }
      });
  }
  

}
