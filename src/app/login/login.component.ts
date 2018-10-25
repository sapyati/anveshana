import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  rForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, public cd: ChangeDetectorRef) {
    this.rForm = fb.group({
      'employeeId': [null, Validators.compose(
        [ Validators.required ]
      )],
      'password': [null, Validators.compose(
        [Validators.required]
      )]
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  loginUser(post) {
    const username = post.employeeId;
    const password = post.password;
    localStorage.setItem('loggedInUser', username);
    if (username === 'admin' && password === 'password') {
      this.router.navigate(['dashboard']);
    }
  }

}
