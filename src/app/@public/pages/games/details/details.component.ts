import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CURRENCY_SELECT } from '@core/constants/config';
import { ProductsService } from '@core/services/products.service';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { closeAlert, loadData } from '@shared/alert/alerts';
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
  constructor(private productService: ProductsService, private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.activateRoute.params.subscribe(params => {
      console.log('Parametros detalles', +params.id);
      this.loading = true;
      loadData('Cargando datos', 'Espera mientras carga la informacion');
      this.loadDataValue(+params.id);
    });
  }
  loadDataValue(id: number){
    // tslint:disable-next-line: deprecation
    this.productService.getItem(id).subscribe(
      result => {
        console.log(result);
        this.product = result.product;
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
  }
  selectImgMain(i){
    this.selectImage = this.screens[i];
  }
  selectOtherPlatform($event){
    console.log($event.target.value);
    this.loadDataValue(+$event.target.value);
  }
}
