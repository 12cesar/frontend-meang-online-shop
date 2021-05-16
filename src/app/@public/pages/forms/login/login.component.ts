import { Component} from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { ILoginForm, IResultLogin } from '@core/interfaces/login.interface';
import { basicAlert } from '@shared/alert/toasts';
import { TYPE_ALERT } from '@shared/alert/values.config';
import { IMedata } from '@core/interfaces/session.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  login: ILoginForm = {
    email: '',
    password: '',
  };
  constructor(private auth: AuthService, private router: Router) {}

  init() {
    this.auth
      .login(this.login.email, this.login.password)
      // tslint:disable-next-line: deprecation
      .subscribe((result: IResultLogin) => {
        if (result.status) {
          if (result.token !== null) {
            // Guardamos la sesion
            this.auth.setSession(result.token);
            this.auth.updateSession(result);
            if (localStorage.getItem('route_after_login')) {
              const ir = localStorage.getItem('route_after_login');
              this.router.navigate([`${ir}`]);
              console.log([localStorage.getItem('route_after_login')]);
              localStorage.removeItem('route_after_login');
              return;
            }
            this.router.navigate(['/home']);
            return;
          }
          basicAlert(TYPE_ALERT.WARNING, result.message);
          return;
        }
        basicAlert(TYPE_ALERT.INFO, result.message);
      });
  }
}
