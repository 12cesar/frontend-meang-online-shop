import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ACTIVE_FILTERS } from '@core/constants/filter';
import { IInfoPage } from '@core/interfaces/result-data.interface';
import { ProductsService } from '@core/services/products.service';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';
import { closeAlert, loadData } from '@shared/alert/alerts';
import { GAMES_PAGES_INFO, TYPE_OPERATION } from './game.constants';
import { IGamePageInfo } from './games-pages-info.interface';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
  selectPage;
  infoPage: IInfoPage = {
    page: 1,
    pages: 8,
    total: 160,
    itemsPage: 20
  };
  typeData: TYPE_OPERATION;
  gamesPageInfo: IGamePageInfo;
  productsList: Array<IProduct> = [];
  loading: boolean;
  constructor(private products: ProductsService, private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // tslint:disable-next-line: deprecation
    this.activateRoute.params.subscribe(params => {
      this.loading = true;
      loadData('Cargando datos', 'Espera mientras carga la informacion');
      this.gamesPageInfo = GAMES_PAGES_INFO[`${params.type}/${params.filter}`];
      this.typeData = params.type;
      this.selectPage = 1;
      this.loadData();
    });
  }
  loadData(){
    if (this.typeData === TYPE_OPERATION.PLATFORMS) {
      this.products.getByPlatform(
        this.selectPage, this.infoPage.itemsPage, ACTIVE_FILTERS.ACTIVE, false, this.gamesPageInfo.platformsIds, true, true
      // tslint:disable-next-line: deprecation
      ).subscribe(data => {
        this.asingResult(data);
      });
      return;
    }
    this.products.getByLastUnitsOffers(
      // tslint:disable-next-line: max-line-length
      this.selectPage, this.infoPage.itemsPage, ACTIVE_FILTERS.ACTIVE, false, this.gamesPageInfo.topPrice, this.gamesPageInfo.stock, true, true
    // tslint:disable-next-line: deprecation
    ).subscribe(data => {
      this.asingResult(data);
    });
  }
  private asingResult(data){
    this.productsList = data.result;
    this.infoPage = data.info;
    closeAlert();
    this.loading = false;
  }

}
