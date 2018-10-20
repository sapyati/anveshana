import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { BookingFormComponent } from '../booking-form/booking-form.component';
import { Router } from '@angular/router';
import { BsDatepickerModule, TimepickerModule, AccordionModule } from 'ngx-bootstrap';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter;

  beforeEach(async(() => {
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    TestBed.configureTestingModule({
      imports: [FormsModule, BsDatepickerModule, TimepickerModule, ReactiveFormsModule, RouterTestingModule.withRoutes([
        { path: 'dashboard', component: DashboardComponent }
      ])],
      declarations: [LoginComponent, DashboardComponent, BookingFormComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.rForm.valid).toBeFalsy();
  });

  it('username field validity', () => {
    let errors = {};
    const employeeId = component.rForm.controls['employeeId'];
    errors = employeeId.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('password field validity', () => {
    let errors = {};
    const password = component.rForm.controls['password'];
    errors = password.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('submitting a form emits a user', () => {
    expect(component.rForm.valid).toBeFalsy();
    component.rForm.controls['employeeId'].setValue('admin');
    component.rForm.controls['password'].setValue('password');
    expect(component.rForm.valid).toBeTruthy();
    component.loginUser(component.rForm.value);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['dashboard']);
  });

});
