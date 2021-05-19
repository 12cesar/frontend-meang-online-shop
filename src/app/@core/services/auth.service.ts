import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LOGIN_QUERY, ME_DATA_QUERY } from '@graphql/operations/query/user';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { IMedata, ISession } from '@core/interfaces/session.interface';
import { Subject } from 'rxjs';
import { optionsWithDetails } from '@shared/alert/alerts';
import { REDIRECTS_ROUTES } from '@core/constants/config';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiService {
  accessVar = new Subject<IMedata>();
  accessVar$ = this.accessVar.asObservable();
  constructor(apollo: Apollo) {
    super(apollo);
  }
  updateSession(newValue: IMedata) {
    this.accessVar.next(newValue);
  }
  start() {
    if (this.getSession() !== null) {
      // tslint:disable-next-line: deprecation
      this.getMe().subscribe((result: IMedata) => {
        if (!result.status) {
          this.resetSession();
          return;
        }
        this.updateSession(result);
      });
      console.log('Sesion iniciada');
      return;
    }
    this.updateSession({
      status: false,
    });
    console.log('Sesion no iniciada');
  }

  // Añadir metodos para consumir la api
  login(email: string, password: string) {
    return this.get(LOGIN_QUERY, { email, password, include: false }).pipe(
      map((result: any) => {
        return result.login;
      })
    );
  }

  getMe() {
    return this.get(
      ME_DATA_QUERY,
      { include: false },
      {
        headers: new HttpHeaders({
          Authorization: (this.getSession() as ISession).token,
        }),
      }
    ).pipe(
      map((result: any) => {
        return result.me;
      })
    );
  }

  setSession(token: string, expiresTimeInHours = 24) {
    const date = new Date();
    date.setHours(date.getHours() + expiresTimeInHours);
    const session: ISession = {
      expiresIn: new Date(date).toISOString(),
      token,
    };
    localStorage.setItem('session', JSON.stringify(session));
  }
  getSession(): ISession {
    return JSON.parse(localStorage.getItem('session'));
  }
  async resetSession(routesUrl: string = '') {
    const result = await optionsWithDetails(
      'Cerrar sesión',
      `¿Estas seguro que quieres cerrar la sesion?`,
      450,
      'Si, cerrar', // true
      'No'
    );
    if (!result) {
      return;
    }
    // rutas que usaremos para rediceccionar
    if (REDIRECTS_ROUTES.includes(routesUrl)) {
      // En el caso de encontrarla marcamos para redireccionar
      localStorage.setItem('route_after_login', routesUrl);
    }
    localStorage.removeItem('session');
    this.updateSession({
      status: false,
    });
  }
}

