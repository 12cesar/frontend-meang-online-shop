import { Component, OnInit } from '@angular/core';
import { CURRENCY_SELECT } from '@core/constants/config';
import { IMedata } from '@core/interfaces/session.interface';
import { ICharge } from '@core/interfaces/stripe/charge.interface';
import { AuthService } from '@core/services/auth.service';
import { closeAlert, loadData } from '@shared/alert/alerts';
import { ChargeService } from '@shop/core/services/stripe/charge.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  currencySymbol = CURRENCY_SELECT;
  meData: IMedata;
  startingAfter = '';
  hasMore = false;
  charges: Array<ICharge> = [];
  loading = true;
  loadMoreBtn = false;
  constructor(private auth: AuthService, private chargeService: ChargeService) {
    this.auth.accessVar$.pipe(take(1)).subscribe((meData: IMedata) => {
      this.meData = meData;
      // Si tenemos informacion cargar con el cliente
      if (this.meData.user.stripeCustomer !== '') {
        console.log(this.meData);
        this.loadDataCharge();
      }
    });
   }

  ngOnInit(): void {
    this.auth.start();
  }
  loadDataCharge(){
    loadData('Cargando....', 'Espera mientras carga los pedidos.....');
    console.log('cargando datos...');
    this.chargeService.listByCustomer(
      this.meData.user.stripeCustomer,
      10,
      this.startingAfter, ''
    ).pipe(take(1)).subscribe((data: {hasMore: boolean, charges: Array<ICharge>}) => {
      /* console.log(data);
      this.charges = data.charges; */
      data.charges.map((item: ICharge) => this.charges.push(item));
      this.hasMore = data.hasMore;
      if (this.hasMore) {
        this.startingAfter = data.charges[data.charges.length - 1].id;
        this.loadMoreBtn = true;
      }else{
        this.loadMoreBtn = false;
        this.startingAfter = '';
      }
      closeAlert();
      this.loading = false;
    });
  }
}
