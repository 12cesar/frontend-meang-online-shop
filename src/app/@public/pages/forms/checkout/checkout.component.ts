import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CURRENCY_CODE } from '@core/constants/config';
import { IMail } from '@core/interfaces/mail.interface';
import { IMedata } from '@core/interfaces/session.interface';
import { ICharge } from '@core/interfaces/stripe/charge.interface';
import { IPayment } from '@core/interfaces/stripe/payment.interface';
import { AuthService } from '@core/services/auth.service';
import { MailService } from '@core/services/mail.service';
import { StripePaymentService } from '@mugan86/stripe-payment-form';
import { infoEventAlert, loadData } from '@shared/alert/alerts';
import { TYPE_ALERT } from '@shared/alert/values.config';
import { ICart } from '@shop/core/components/shopping-cart/shopping-cart.interface';
import { CartService } from '@shop/core/services/cart.service.ts.service';
import { ChargeService } from '@shop/core/services/stripe/charge.service';
import { CustomerService } from '@shop/core/services/stripe/customer.service';
import { take } from 'rxjs/internal/operators/take';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  meData: IMedata;
  key = environment.stripePublicKey;
  token: string;
  address = '';
  available = false;
  block = false;
  // tslint:disable-next-line: max-line-length
  constructor(
    private auth: AuthService,
    private router: Router,
    private stripePayment: StripePaymentService,
    private cartService: CartService,
    private customerService: CustomerService,
    private chargeService: ChargeService,
    private mailService: MailService
  ) {
    this.auth.accessVar$.subscribe((data: IMedata) => {
      if (!data.status) {
        // Ir al login
        this.router.navigate(['/login']);
        return;
      }
      this.meData = data;
    });
    this.cartService.itemsVar$.pipe(take(1)).subscribe(() => {
      if (this.cartService.cart.total === 0 && this.available === false) {
        this.available = false;
        this.notAvailableProduct();
      }
    });
    this.stripePayment.cardTokenVar$
      .pipe(take(1))
      .subscribe((token: string) => {
        if (
          token.indexOf('tok_') > -1 &&
          this.meData.status &&
          this.address !== ''
        ) {
          if (this.cartService.cart.total === 0) {
            this.available = false;
            this.notAvailableProduct();
          }
          const payment: IPayment = {
            token,
            amount: this.cartService.cart.total.toString(),
            description: this.cartService.orderDescription(),
            customer: this.meData.user.stripeCustomer,
            currency: CURRENCY_CODE
          };
          this.block = true;
          loadData('Realizando el pago', 'Espera mientras se procesa la informacion de pago');
          // Enviar la informacion y procesar el pago
          this.chargeService.pay(payment).pipe(take(1)).subscribe(async  (result: {
            status: boolean,
            message: string,
            charge: ICharge
          }) => {
            if (result.status) {
              console.log('OK');
              console.log(result.charge);
              await infoEventAlert(
                'Pedido realizado correctamente',
                'Has efectuado correctamente el pedido. ¡¡Muchas gracias!!',
                TYPE_ALERT.SUCCESS
              );
              this.sendEmail(result.charge);
              this.router.navigate(['/orders']);
              this.cartService.clear();
              return;
            }else{
              console.log(result.message);
              await infoEventAlert(
                'Pedido no se ha realizado',
                'El pedido no se ha completado. Intentalo de nuevo por favor',
                TYPE_ALERT.WARNING
              );
            }
            this.block = false;
          });
        }
      });
  }
  sendEmail(charge: ICharge){
    const mail: IMail = {
      to: charge.receiptEmail,
      subject: 'Confirmacion del pedido',
      html: `
      El pedido se ha realizado correctamente,
      Puedes consultarlo en <a href="${charge.receiptUrl}" target="_blank"> Esta URL</a>
      `
    };
    this.mailService.send(mail).pipe(take(1)).subscribe();
  }
  async notAvailableProduct(){
    this.cartService.close();
    this.available = false;
    await infoEventAlert('Accion no disponible', 'No puedes realizar el pago sin productos en el carrito de compra');
    this.router.navigate(['/']);
  }
  ngOnInit(): void {
    this.auth.start();
    if (localStorage.getItem('address')) {
      this.address = localStorage.getItem('address');
      localStorage.removeItem('address');
    }
    this.cartService.initialize();
    localStorage.removeItem('route_after_login');
    this.block = false;
    if (this.cartService.cart.total === 0) {
      this.available = false;
      this.notAvailableProduct();
    }else{
      this.available = true;
    }
  }
  async takeToken() {
    if (this.meData.user.stripeCustomer === undefined) {
      // Alerta para mostrar info
      await infoEventAlert(
        'Cliente no existe',
        'Necesitamos un cliente para realizar el pago'
      );
      const StripeName = `${this.meData.user.name} ${this.meData.user.lastname}`;
      loadData('Procesando la informacion', 'Creando el cliente.....');
      this.customerService
        .add(StripeName, this.meData.user.email)
        .pipe(take(1))
        .subscribe(async (result: { status: boolean; message: string }) => {
          if (result.status) {
            await infoEventAlert(
              'Cliente añadido al usuario',
              'Reiniciar la sesíon',
              TYPE_ALERT.SUCCESS
            );
            localStorage.setItem('address', this.address);
            localStorage.setItem('route_after_login', this.router.url);
            this.auth.resetSession();
          } else {
            await infoEventAlert(
              'Cliente no añadido al usuario',
              result.message,
              TYPE_ALERT.WARNING
            );
          }
        });
      return;
    }
    this.stripePayment.takeCardToken(true);
  }
}
