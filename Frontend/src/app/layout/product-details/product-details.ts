import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/service/product-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Iproduct } from '../../core/models/product';
import { environment } from '../../../environments/environment';
import { Product } from "../productslist/product/product";
import { CartService } from '../../core/service/cart-service';
@Component({
  selector: 'app-product-details',
  imports: [Product,RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
  constructor(private _productSer: ProductService, private _activateRoute: ActivatedRoute, private cdr: ChangeDetectorRef, private _router: Router,private _CartSer:CartService) { };
  quantity: number = 1;
  slug!: string | null;
  product!: Iproduct;
  relatedProducts!: Iproduct[];
  staticImage = environment.staticURL;
  ngOnInit(): void {
    this.productDetails();
  }

  increaseQuantity() {
    this.quantity += 1;
  }
  decreaseQuantity() {
    if(this.quantity>=1)
    this.quantity -= 1;
  }

  addToCart() {
    console.log("angularrrr"+ this.product._id);
    this._CartSer.addtoCart(this.product._id, this.quantity).subscribe({
      next: (res)=>{
        console.log(res);
        // this._router.navigate(['/cart'])
      },error:(err)=>{
        console.log(err);
      }, complete: () => {
        console.log("product added to cart successfully!");
      }
    })
  }
  BuyNow() {
    console.log("angularrrr"+ this.product._id);
    this._CartSer.addtoCart(this.product._id, this.quantity).subscribe({
      next: (res)=>{
        console.log(res);
        this._router.navigate(['/cart'])
      },error:(err)=>{
        console.log(err);
      }, complete: () => {
        console.log("product added to cart successfully!");
      }
    })
  }
  productDetails() {
     this._activateRoute.paramMap.subscribe(params => {
      this.slug = params.get('slug');
      if (this.slug) {
        this._productSer.getProductBySlug(this.slug).subscribe({
          next: (res) => {
            this.product = res.data;
            console.log(this.product);
            this.cdr.detectChanges();
            this._productSer.getRelatedProduct(this.product._id).subscribe({
              next: (res) => {
                this.relatedProducts = res.data;
                console.log(this.relatedProducts);
                this.cdr.detectChanges();

              }, error: (err) => {
                console.log(err);

              }, complete: () => {
                console.log('related products done');
              }
            })
          }, error: (err) => {
            console.log(err);
          }, complete: () => {
            console.log("Product Details feteched successfully");
          }
        })


      }
      else {
        this._router.navigate(['/product']);
      }
    })
  }
}
