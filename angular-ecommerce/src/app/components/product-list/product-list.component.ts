import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { error } from 'console';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: false,
  
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{
  products:Product[]=[];
  currentCategoryId!:number;

constructor(private productService:ProductService,
  private route:ActivatedRoute){

}
ngOnInit(): void {
  this.route.paramMap.subscribe(()=>{
    this.listProducts();
  });
    

}
listProducts() {
  // check if "id"parameter is available
  const hasCategoryId:boolean= this.route.snapshot.paramMap.has('id');
if(hasCategoryId){
  //get the "id" param string. convert string to a number using the "+" symbol 
  this.currentCategoryId=+this.route.snapshot.paramMap.get('id')!;
}
else{
  //not category id available---- default to current category id is 1
  this.currentCategoryId=1;
}

  this.productService.getProductList(this.currentCategoryId).subscribe({
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