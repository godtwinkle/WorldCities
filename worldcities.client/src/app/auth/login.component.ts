import { Component, OnInit } from '@angular/core';
import { LoginResult } from './login-result';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseFormComponent } from '../base-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseFormComponent implements OnInit {
  title?: string;
  loginResult?: LoginResult
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    super()
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }
}
