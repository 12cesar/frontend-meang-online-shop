import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { REDIRECTS_ROUTES } from '@core/constants/config';
import { IMenuItem } from '@core/interfaces/menu-item.interface';
import { IMedata } from '@core/interfaces/session.interface';
import { AuthService } from '@core/services/auth.service';
import shopMenuItems from '@data/menus/shop.json';
import { CartService } from '@shop/core/services/cart.service.ts.service';
import { ICart } from '../shopping-cart/shopping-cart.interface';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  cartsItemsTotal: number;
  menuItems: Array<IMenuItem> = shopMenuItems;
session: IMedata = {
  status: false,
};
access = false;
role: string;
userLabel = '';
  constructor(private authService: AuthService, private cartService: CartService, private router: Router) {
    // tslint:disable-next-line: deprecation
    this.authService.accessVar$.subscribe((result) => {
      console.log(result.status);
      this.session = result;
      this.access = this.session.status;
      this.role = this.session.user?.role;
      this.userLabel = `${this.session.user?.name} ${this.session.user?.lastname}`;
    });
    this.cartService.itemsVar$.subscribe((data: ICart) => {
      if (data !== undefined && data !== null) {
        this.cartsItemsTotal = data.subtotal;
      }
    });
  }

  ngOnInit(): void {
    // tslint:disable-next-line: no-unused-expression
    this.cartsItemsTotal = this.cartService.initialize().subtotal;
  }
  logout(){
    // rutas que usaremos para rediceccionar
    if (REDIRECTS_ROUTES.includes(this.router.url)) {
      // En el caso de encontrarla marcamos para redireccionar
      localStorage.setItem('route_after_login', this.router.url);
    }
    this.authService.resetSession();
  }
  open(){
    this.cartService.open();
  }

}
