import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CURRENCY_SELECT } from '@core/constants/config';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { CartService } from '@shop/core/services/cart.service.ts.service';
import { ICart } from './shopping-cart.interface';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  cart: ICart;
  products: Array<IProduct> = [];
  currencySelect = CURRENCY_SELECT;
  constructor(private cartService: CartService, private router: Router) {
    this.cartService.itemsVar$.subscribe((data: ICart) => {
      if (data !== undefined && data !== null) {
        this.cart = data;
      }
    });
  }

  ngOnInit(): void {
    this.cart = this.cartService.initialize();
  }
  clear(product: Array<IProduct>) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < product.length; i++) {
      product[i].qty = 0;
      this.manageProductUnitInfo(0, product[i]);
    }
  }
  clearItem(product: IProduct) {
    product.qty = 0;
    this.manageProductUnitInfo(0, product);
  }
  changeValue(qty: number, product: IProduct) {
    this.manageProductUnitInfo(qty, product);
  }
  manageProductUnitInfo(qty: number, product: IProduct) {
    product.qty = qty;
    this.cartService.manageProduct(product);
  }
  proccess() {
    console.log(this.cart);
    this.router.navigate(['/checkout']);
    this.closeNav();
  }
  closeNav() {
    this.cartService.close();
  }
}
