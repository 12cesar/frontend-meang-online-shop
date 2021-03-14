import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  Router,
} from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import jwtDecode from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Primero comprobar que existe sesión
    if (this.auth.getSession() !== null) {
      console.log('Estamos logeados');
      const dataDecode = this.decodeToken();
      console.log(dataDecode);
      const date = new Date();
      // Comprobar que no esta caducado el token
      if (dataDecode.exp < date.getTime() / 1000) {
        console.log('Sesion Caducada');
        return this.redirect();
      }
      // El role del usuario es admin
      if (dataDecode.user.role === 'ADMIN') {
        console.log('Somos administradores');
        return true;
      }
      console.log('No somos administradores');
    }
    console.log('Sesion no iniciada');
    return this.redirect();
  }
  redirect() {
    this.router.navigate(['/login']);
    return false;
  }
  decodeToken() {
    return jwtDecode(this.auth.getSession().token);
  }
}
