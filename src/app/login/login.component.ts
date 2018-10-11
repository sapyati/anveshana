import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  rForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {
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

  loginUser(post) {
    const username = post.employeeId;
    const password = post.password;
    localStorage.setItem('loggedInUser', username);
    if (username === 'admin' && password === 'password') {
      this.router.navigate(['dashboard']);
    }
  }

}
