import { UsersService } from '@core/services/users.service';
import { basicAlert } from '@shared/alert/toasts';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TYPE_ALERT } from '@shared/alert/values.config';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.scss']
})
export class ActiveComponent implements OnInit {
  token: string;
  values: any = {
    password: '',
    passwordTwo: '',
    birthday: ''
  };
  constructor(private route: ActivatedRoute, private userService: UsersService, private router: Router) {
    // tslint:disable-next-line: deprecation
    this.route.params.subscribe(params => {
      this.token = params.token;
      console.log(this.token);
    });
   }

   ngOnInit(): void {
    const data = new Date();
    data.setFullYear(data.getFullYear() - 18);
    this.values.birthday = data.toISOString().substring(0, 10);
    console.log(this.values);
  }
  private formatNumber(num: number | string) {
    return +num < 10 ? `0${num}` : num;
  }
  dataAsing($event) {
    console.log('Activar cogiendo dato', $event);
    const fecha = `${$event.year}-${this.formatNumber(
      $event.month
    )}-${this.formatNumber($event.day)}`;
    console.log(fecha);
    this.values.birthday = fecha;
  }
  add(){
    if (this.values.password !== this.values.passwordTwo) {
      basicAlert(TYPE_ALERT.WARNING, 'Las contraseñas no coinciden y no es valido para activar el usuario, Procura asegurarte que las contraseñas sean iguales');
      return;
    }
    // Todo validad, vamos a enviarlo a la api de graphql
    // tslint:disable-next-line: deprecation
    this.userService.active(this.token, this.values.birthday, this.values.password).subscribe(
      result => {
        if (result.status) {
          basicAlert(TYPE_ALERT.SUCCESS, result.message);
          // redireccionar al login
          this.router.navigate(['login']);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, result.message);
      }
    );

  }

}
