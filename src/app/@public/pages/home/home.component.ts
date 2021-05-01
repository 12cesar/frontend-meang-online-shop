import { Component, OnInit } from '@angular/core';
import { ICarouselItem } from '@mugan86/ng-shop-ui/lib/interfaces/carousel-item.interface';
import { ProductsService } from '@core/services/products.service';
import { loadData, closeAlert } from '@shared/alert/alerts';
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
  loading: boolean;
  constructor(private products: ProductsService) {}

  ngOnInit(): void {
    this.loading = true;
    loadData('Cargando datos', 'Espera mientras carga la informacion');
    // tslint:disable-next-line: deprecation
    this.products.getHomePage().subscribe((data) => {
      this.listOne = data.ps4;
      this.listTwo = data.topPrice;
      this.listThree = data.pc;
      this.items = this.manageCarouel(data.carousel);
      closeAlert();
      this.loading = false;
    });
  }
  private manageCarouel(list) {
    const itemsValues: Array<ICarouselItem> = [];
    list.shopProducts.map((item) => {
      itemsValues.push({
        id: item.id,
        title: item.product.name,
        description: item.platform.name,
        background: item.product.img,
        url: '',
      });
    });
    return itemsValues;
  }
}
