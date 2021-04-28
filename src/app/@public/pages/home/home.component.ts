import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { Component, OnInit } from '@angular/core';
import { ICarouselItem } from '@mugan86/ng-shop-ui/lib/interfaces/carousel-item.interface';
import carouselItems from '@data/carousel.json';
import { ProductsService } from '@core/services/products.service';
import { ACTIVE_FILTERS } from '@core/constants/filter';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  items: ICarouselItem[] = [];
  productsList;
  listOne;
  listTwo;
  listThree;
  constructor(private products: ProductsService) {}

  ngOnInit(): void {
    this.products.getByPlatform(
      1, 4, ACTIVE_FILTERS.ACTIVE, true, '18'
    // tslint:disable-next-line: deprecation
    ).subscribe(result => {
      console.log('Productos PS4', result);
      this.listOne = result;
    });
    this.products.getByPlatform(
      1, 4, ACTIVE_FILTERS.ACTIVE, true, '4'
    // tslint:disable-next-line: deprecation
    ).subscribe(result => {
      console.log('Productos PC', result);
      this.listThree = result;
    });
    this.products.getByLastUnitsOffers(
      1, 4, ACTIVE_FILTERS.ACTIVE, true, 35, 40
    // tslint:disable-next-line: deprecation
    ).subscribe(result => {
      console.log('Productos a menos de 40', result);
      this.listTwo = result;
    });
    this.products.getByLastUnitsOffers(
      1,6, ACTIVE_FILTERS.ACTIVE, true, -1,100
    // tslint:disable-next-line: deprecation
    ).subscribe(
      (result: IProduct[]) => {
        result.map((item: IProduct) => {
          this.items.push({
            id: item.id,
            title: item.name,
            description: item.description,
            background: item.img,
            url: ''
          });
        });
      }
    );
    // this.items = carouselItems;
  }
}
