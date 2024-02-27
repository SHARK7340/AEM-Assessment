import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import ValidateForm from 'src/app/helpers/validateForm';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  type: string = "password"
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }  // inject private service

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      // password1: ['', Validators.required]
    })
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onLogin() {
    if (this.loginForm.valid) {
      // console.log("form value: " , this.loginForm.value);
      // send the obj to database
      this.auth.login(this.loginForm.value)
        .subscribe({
          next: (res) => {
            // console.log("success: ", res);
            this.loginForm.reset();
            this.auth.storeToken(res);
            this.toastr.success('Welcome!', 'Success', {
              timeOut: 3000
            });
            this.router.navigate(['dashboard'])
          },
          error: (err) => {
            // console.log("error: ", err);
            this.toastr.error(err.statusText, 'Error', {
              timeOut: 3000
            });
          }
        })
    }
    else {
      // throw error using toaster and with required fields
      ValidateForm.validateAllFormFields(this.loginForm);
    }
  }
}
