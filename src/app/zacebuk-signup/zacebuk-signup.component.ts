import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService, UserService, AlertService } from '../_services';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-zacebuk-signup',
  templateUrl: './zacebuk-signup.component.html',
  styleUrls: ['./zacebuk-signup.component.css']
})
export class ZacebukSignupComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private userService: UserService,
    private authenticationService: AuthenticationService) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  get fieldValues() {
    return this.employeeForm.controls;
  }
  employeeForm: FormGroup;
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  formRequest;
  newFormReques;
  ngOnInit() {
    this.employeeForm = this.fb.group({
      // second arguements are sync validations, async are passed as third arguement(returns promises/observables)
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(10), Validators.maxLength(80),
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      password: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]],
      gender: ['', Validators.required]
    });
    window.addEventListener('online', (event) => {
      //location.reload();
      this.newFormReques = JSON.parse(localStorage.getItem('newUserData'));
      this.onSubmit();
      localStorage.removeItem('newUserData');
    });
  }
  onSubmit(): void {
    this.submitted = true;
    // stop here if form is invalid
    if (this.employeeForm.invalid) {
      return;
    }
    this.loading = true;
    let {fullName, email, password, phone, gender, token} = this.employeeForm.value;
    const passwordHash = btoa(password);
    password = passwordHash;
    this.formRequest = {fullName, email, password, phone, gender, token}
    if (navigator.onLine) {
      this.userService.register(this.formRequest || this.newFormReques)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Registration successful', true);
          this.router.navigate(['/app-zacebuk-login']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
      });
    } else {
      console.log('User offline');
      localStorage.setItem('newUserData', JSON.stringify(this.formRequest));
    }
  }
}
