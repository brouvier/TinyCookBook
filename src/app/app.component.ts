import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SecurityService } from './services/security.service';
import { SpinnerService } from './services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

  spinner$: Observable<boolean> = new Observable();

  constructor(private security: SecurityService, private spinnerServ: SpinnerService) { }

  ngOnInit(): void {
    this.spinner$ = this.spinnerServ.getSpinner();
  }
  ;

  lock() {
    this.security.lock();
  }

  isUnlock(): boolean {
    return !this.security.checkIsLock(false);
    //return true;
  }

}
