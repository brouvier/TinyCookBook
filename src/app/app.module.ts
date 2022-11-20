import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import localeFr from '@angular/common/locales/fr';

import { RecipeService } from './services/recipe.service';
import { SecurityService } from './services/security.service';
import { SpinnerService } from './services/spinner.service';

import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

import { AppRoutingModule, HttpInterceptorForSpinner } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { RecipeEditComponent } from './components/recipe-edit/recipe-edit.component';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DataViewModule } from 'primeng/dataview';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { EditorModule } from 'primeng/editor';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    RecipeListComponent,
    RecipeEditComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,

    BrowserAnimationsModule,

    ButtonModule,
    InputTextModule,
    DataViewModule,
    MenuModule,
    ToastModule,
    EditorModule,
    DialogModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    PasswordModule,
    ProgressSpinnerModule,
    BlockUIModule,
  ],
  providers: [
    MessageService,
    DialogService,
    ConfirmationService,
    RecipeService,
    SecurityService,
    SpinnerService,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorForSpinner,
      multi: true,
      deps: [SpinnerService],
    },

    { provide: LOCALE_ID, useValue: 'fr' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
