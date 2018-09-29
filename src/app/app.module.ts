import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import { RoomsListService } from './rooms-list.service';

const appRoutes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path : 'dashboard',
    component : DashboardComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    DashboardComponent
  ],

  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    AngularFontAwesomeModule,
    HttpClientModule
  ],
  providers: [ RoomsListService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
