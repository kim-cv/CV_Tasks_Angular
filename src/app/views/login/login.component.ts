import { Component, ViewChild } from '@angular/core';
import { BtnLaddaComponent, BtnStates } from 'src/app/components/btn-ladda/btn-ladda.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { faKey, faAt } from '@fortawesome/free-solid-svg-icons';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @ViewChild('btnLogin') btnLogin: BtnLaddaComponent;

  // Formgroup
  public formgroupLogin: FormGroup;

  public errorMessageAtSignIn = '';

  // FontAwesome Icons
  public faKey = faKey;
  public faAt = faAt;

  constructor(private formBuilder: FormBuilder, private afAuth: AngularFireAuth, private router: Router) {
    // Make formgroup
    this.formgroupLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(75), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    });
  }

  private async LogIn(email: string, password: string) {
    // Session persistence
    try {
      await this.afAuth
        .auth
        .setPersistence(firebase.auth.Auth.Persistence.SESSION);
    } catch (err) {
      // Log Persistence Error
      console.error('SetPersistence Error:', err);
      this.btnLogin.Stop();
      this.btnLogin.SetStateBeforeAndAfterWithDuration(BtnStates.danger, BtnStates.secondary, 1000);
      return;
    }

    // Sign In with Firebase
    try {
      await this.afAuth
        .auth
        .signInWithEmailAndPassword(email, password);
    } catch (err) {
      // Log SignIn Error
      console.error('signInWithEmailAndPassword Error:', err);
      throw err;
    }
  }

  // #region Methods called by view
  public async HTMLLogIn() {
    this.formgroupLogin.disable();
    this.btnLogin.Start();

    // Force re-validate on submit
    Object.keys(this.formgroupLogin.controls).forEach(field => {
      const control = this.formgroupLogin.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
        control.updateValueAndValidity();
      }
    });

    // Verify form validity
    if (this.formgroupLogin.invalid) {
      this.formgroupLogin.enable();
      this.btnLogin.Stop();
      this.btnLogin.SetStateBeforeAndAfterWithDuration(BtnStates.danger, BtnStates.secondary, 1000);
      return;
    }

    // TODO: make into custom formgroup validator and show field validation errors
    const email: string = this.formgroupLogin.get('email').value;
    if (email.trim().length <= 0) {
      this.formgroupLogin.get('email').setErrors({ lengthTooShort: 'true' });
      return;
    }

    const password: string = this.formgroupLogin.get('password').value;
    if (password.trim().length <= 0) {
      this.formgroupLogin.get('password').setErrors({ lengthTooShort: 'true' });
      return;
    }

    // Try log in
    try {
      await this.LogIn(email, password);

      this.btnLogin.SetStateBeforeAndAfterWithDuration(BtnStates.success, BtnStates.secondary, 1000);
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1000);
    } catch (err) {
      this.btnLogin.SetStateBeforeAndAfterWithDuration(BtnStates.danger, BtnStates.secondary, 1000);

      switch (err.code) {
        case 'auth/invalid-email':
          this.errorMessageAtSignIn = 'Invalid Email';
          break;
        case 'auth/user-disabled':
          this.errorMessageAtSignIn = 'Account disabled, if you believe this is an error please contact support.';
          break;
        case 'auth/user-not-found':
          this.errorMessageAtSignIn = 'Account not found.';
          break;
        case 'auth/wrong-password':
          this.errorMessageAtSignIn = 'Wrong password.';
          break;
        default:
          this.errorMessageAtSignIn = 'Something went wrong, please try again and if you encounter the same error please contact support.';
          break;
      }
    }

    this.btnLogin.Stop();
    setTimeout(() => {
      this.formgroupLogin.enable();
      this.formgroupLogin.reset();
    }, 1000);
  }
  // #endregion
}
