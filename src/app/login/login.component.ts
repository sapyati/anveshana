import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  loginUser(e) {
    e.preventDefault();
    console.log(e);
    const username = e.target.elements[0].value;
    const password = e.target.elements[1].value;
    localStorage.setItem('loggedInUser', username);
    if (username === 'admin' && password === 'password') {
      this.router.navigate(['dashboard']);
    }
  }

}
