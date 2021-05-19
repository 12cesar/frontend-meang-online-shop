import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CURRENCY_SELECT } from '@core/constants/config';
import { ProductsService } from '@core/services/products.service';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { closeAlert, loadData } from '@shared/alert/alerts';
import { ICart } from '@shop/core/components/shopping-cart/shopping-cart.interface';
import { CartService } from '@shop/core/services/cart.service.ts.service';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  product: IProduct;
  // products[Math.floor(Math.random() * products.length)];
  selectImage: string;
  currencySelect = CURRENCY_SELECT;
  randomItems: Array<IProduct> = [];
  screens = [];
  relationalProducts: Array<object> = [];
  loading: boolean;
  constructor(private productService: ProductsService, private activateRoute: ActivatedRoute, private cartService: CartService) { }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.activateRoute.params.subscribe(params => {
      console.log('Parametros detalles', +params.id);
      this.loading = true;
      loadData('Cargando datos', 'Espera mientras carga la informacion');
      this.loadDataValue(+params.id);
      this.updateListener(+params.id);
    });
    this.cartService.itemsVar$.subscribe((data: ICart) => {
      console.log(data);
      if (data.subtotal === 0) {
        this.product.qty = 1;
        return;
      }
      this.product.qty = this.findProduct(+this.product.id).qty;
    });
  }
  updateListener(id: number){
    console.log('escuchando', id);
    this.productService.stockUpdateListener(id).subscribe(
      (result) => {
        console.log('Actualizacion', result);
        this.product.stock = result.stock;

        // Comprobar que la cantidad es mayor que stock
        // Si se da esta situacion, el tope parasa al valor de stock
        if (this.product.qty > this.product.stock) {
          this.product.qty = this.product.stock;
        }
        if (this.product.stock === 0) {
          this.product.qty = 1;
        }
      }
    );
  }
  findProduct(id: number){
    return this.cartService.cart.products.find( item => +item.id === id);
  }
  loadDataValue(id: number){
    // tslint:disable-next-line: deprecation
    this.productService.getItem(id).subscribe(
      result => {
        console.log(result);
        this.product = result.product;
        const saveProductInCart = this.findProduct(+this.product.id);
        this.product.qty = (saveProductInCart !== undefined) ? saveProductInCart.qty : this.product.qty;
        this.selectImage = this.product.img;
        this.screens = result.screens;
        this.relationalProducts = result.relational;
        this.randomItems = result.random;
        this.loading = false;
        closeAlert();
      }
    );
  }
  changeValue(qty: number){
    console.log(qty);
    this.product.qty = qty;
  }
  selectImgMain(i){
    this.selectImage = this.screens[i];
  }
  selectOtherPlatform($event){
    console.log($event.target.value);
    const id = +$event.target.value;
    this.loadDataValue(id);
    this.updateListener(id);
    window.history.replaceState({}, '', `/#/games/details/${id}`);
  }
  addToCart(){
    this.cartService.manageProduct(this.product);
  }
}
