import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { RoomsListService } from './rooms-list.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { BsDatepickerModule, TimepickerModule, AccordionModule } from 'ngx-bootstrap';
import { DashBoardDeactivateGuard } from './dashboard/dashboard.deactivate-guard';

const appRoutes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canDeactivate: [DashBoardDeactivateGuard]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    DashboardComponent,
    BookingFormComponent
  ],

  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    AngularFontAwesomeModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    AccordionModule.forRoot()
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule
  ],
  providers: [RoomsListService, DashBoardDeactivateGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
