import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LoginComponent } from './components/login/login.component';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { SpinnerService } from './services/spinner.service';

const routes: Routes = [
  { path: 'list', component: RecipeListComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'list' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    relativeLinkResolution: 'legacy',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }


export class HttpInterceptorForSpinner implements HttpInterceptor {

  constructor(private spinnerServ: SpinnerService) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.headers.has('Background')) {
      return next.handle(req);
    }
    this.spinnerServ.addOneInPool();
    return next.handle(req).pipe(finalize(() => this.spinnerServ.releaseOneFromPool()),);
  }
}