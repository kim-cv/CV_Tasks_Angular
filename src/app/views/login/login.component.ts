import { Component, ViewChild } from '@angular/core';
import { BtnLaddaComponent, BtnStates } from 'src/app/components/btn-ladda/btn-ladda.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { faKey, faAt } from '@fortawesome/free-solid-svg-icons';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

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

  constructor(private formBuilder: FormBuilder, private afAuth: AngularFireAuth) {
    // Make formgroup
    this.formgroupLogin = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
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
      this.btnLogin.SetStateBeforeAndAfterWithDuration(BtnStates.danger, BtnStates.secondary, 1500);
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
      this.btnLogin.Stop();
      this.btnLogin.SetStateBeforeAndAfterWithDuration(BtnStates.danger, BtnStates.secondary, 1500);

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
          console.error('Login Error:', err);
          break;
      }
      return;
    }

    this.btnLogin.Stop();
    this.btnLogin.SetStateBeforeAndAfterWithDuration(BtnStates.success, BtnStates.secondary, 1500);
    return;
  }

  // #region Methods called by view
  public HTMLLogIn() {
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
      this.btnLogin.Stop();
      this.btnLogin.SetStateBeforeAndAfterWithDuration(BtnStates.danger, BtnStates.secondary, 1500);
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

    this.LogIn(email, password);
  }
  // #endregion
}
