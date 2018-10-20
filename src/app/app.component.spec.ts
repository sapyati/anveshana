import { TestBed, async, inject } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

class MockRouter { public navigate() { } }

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        AppComponent,
        { provide: Router, useClass: MockRouter }
      ],
    }).compileComponents();
  }));

  it('should create the app', inject([AppComponent], (app: AppComponent) => {
    expect(app).toBeTruthy();
  }));

  it('should have a title = app', inject([AppComponent], (app: AppComponent) => {
    expect(app.title).toEqual('app');
  }));

});
