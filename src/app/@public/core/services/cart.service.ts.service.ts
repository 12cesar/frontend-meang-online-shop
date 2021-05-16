import { Injectable } from '@angular/core';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { Subject } from 'rxjs/internal/Subject';
import { ICart } from '../components/shopping-cart/shopping-cart.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  products: Array<IProduct> = [];
  cart: ICart = {
    total: 0,
    subtotal: 0,
    products: this.products,
  };
  // Para gestionar los productors con las notificaciones cuando se realizan las notificaciones como borrar
  public itemsVar = new Subject<ICart>();
  public itemsVar$ = this.itemsVar.asObservable();
  constructor() {}

  /**
   * Inicializar el carrito de compra para tener informacion almacenada
   */
  initialize() {
    const storeData = JSON.parse(localStorage.getItem('cart'));
    if (storeData !== null) {
      this.cart = storeData;
    }
    return this.cart;
  }
  orderDescription(){
    let description = '';
    this.cart.products.map((product: IProduct) => {
      description += `${product.name} (${product.description}) x ${product.qty}\n`;
    });
    return description;
  }
  public updateItemsInCart(newValue: ICart){
    this.itemsVar.next(newValue);
  }
  manageProduct(product: IProduct) {
    // Obtenemos cantidad de producto en el carrito
    const productTotal = this.cart.products.length;
    // Comprobamos si tiene producto
    if (productTotal === 0) {
      this.cart.products.push(product);
    } else {
      let actionUpdateOk = false;
      // Si tenemos productos hacer lo siguiente
      for (let i = 0; i < productTotal; i++) {
        // Comprobar que coincide el producto con alguno de la lista
        if (product.id === this.cart.products[i].id) {
          if (product.qty === 0) {
            // Quitar elemento
            this.cart.products.splice(i, 1);
          } else {
            // Actualizar con la nueva informacion
            this.cart.products[i] = product;
          }
          actionUpdateOk = true;
          i = productTotal;
        }
      }
      if (!actionUpdateOk) {
        this.cart.products.push(product);
      }
    }
    this.checkoutTotal();
  }
  /**
   * Añadir la informacion final antes de hacer el pedido
   */
  checkoutTotal() {
    let subtotal = 0;
    let total = 0;
    this.cart.products.map((product: IProduct) => {
      subtotal += product.qty; // subtotal = subtotal + product.qyt
      total += product.qty * product.price;
    });

    this.cart.total = total;
    this.cart.subtotal = subtotal;
    this.setInfo();
  }
  clear() {
    this.products = [];
    this.cart = {
      total: 0,
      subtotal: 0,
      products: [],
    };
    this.setInfo();
    return this.cart;
  }
  private setInfo() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.updateItemsInCart(this.cart);
  }
  open() {
    document.getElementById('mySidenav').style.width = '600px';
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('app').style.overflow = 'hidden';
  }
  close() {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('app').style.overflow = 'auto';
  }
}
