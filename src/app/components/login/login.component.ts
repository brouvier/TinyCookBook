import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/services/security.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  public loginForm = { password: "" };
  public production = environment.production;

  constructor(private security: SecurityService) {
    this.security.checkIsLock(true);
  }

  ngOnInit(): void {
  }

  sendForm() {
    this.security.unlock(this.loginForm.password);
  }

}