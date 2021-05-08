
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { CartService } from '@shop/core/services/cart.service.ts.service';

@Component({
  selector: 'app-product-category-list',
  templateUrl: './product-category-list.component.html',
  styleUrls: ['./product-category-list.component.scss']
})
export class ProductCategoryListComponent {
  @Input() title = 'Titulo de la categoria';
  @Input() productsList: Array<IProduct> = [];
  @Input() description = '';
  @Input() showDesc: boolean;
  constructor(private router: Router, private cartService: CartService) { }

  addToCart($event: IProduct){
    console.log('Add to cart ', $event);
    this.cartService.manageProduct($event);
  }
  showProductDetails($event: IProduct){
    console.log('Show details ', $event);
    this.router.navigate(['/games/details', +$event.id]);
  }
}
