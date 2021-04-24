import { EMAIL_PATTERN } from '@core/constants/regex';
import { Component, OnInit } from '@angular/core';
import { PasswordService } from '@core/services/password.service';
import { basicAlert } from '@shared/alert/toasts';
import { TYPE_ALERT } from '@shared/alert/values.config';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  emailValue: string;
  pattern = EMAIL_PATTERN;
  constructor(private passwordService: PasswordService) { }

  ngOnInit(): void {
  }
  reset(){
    // tslint:disable-next-line: deprecation
    this.passwordService.reset(this.emailValue).subscribe(result => {
      if (result.status) {
        basicAlert(TYPE_ALERT.SUCCESS, result.message);
        return;
      }
      basicAlert(TYPE_ALERT.WARNING, result.message);
    });
  }
}
