import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { error } from 'console';

@Component({
  selector: 'app-product-list',
  standalone: false,
  
  //templateUrl: './product-list.component.html',
  templateUrl: './product-list-table.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{
  products:Product[]=[];
constructor(private productService:ProductService){

}
ngOnInit(): void {
    this.listProducts();

}
listProducts() {
  this.productService.getProductList().subscribe({
    next: (data) => {
      console.log(data);
      this.products = data;
    },
    error: (err) => {
      console.log(err);
    }
  });
}
}