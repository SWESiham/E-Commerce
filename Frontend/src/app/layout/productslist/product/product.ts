import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Iproduct } from '../../../core/models/product';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product',
  imports: [CommonModule,RouterLink],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class Product implements OnInit{
  @Input() prod!: Iproduct;
  staticURL = environment.staticURL;
  ngOnInit(): void {
    console.log(this.staticURL + this.prod.image);
  }
  

}
