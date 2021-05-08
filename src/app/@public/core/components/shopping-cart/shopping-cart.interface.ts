import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
export interface ICart {
    total: number; // Almacenamos el total de lo que tendriamos que pagar
    subtotal: number; // Añadimos el numero de unidades totales
    products: Array<IProduct>; // Productos Almacenados
}
