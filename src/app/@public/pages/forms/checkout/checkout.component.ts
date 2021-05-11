import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMedata } from '@core/interfaces/session.interface';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  meData: IMedata;
  constructor(private auth: AuthService, private router: Router) {
    this.auth.accessVar$.subscribe((data: IMedata) => {
      if (!data.status) {
        // Ir al login
        this.router.navigate(['/login']);
        return;
      }
      this.meData = data;
      console.log(this.meData);
    });
  }

  ngOnInit(): void {
    this.auth.start();
  }

}
