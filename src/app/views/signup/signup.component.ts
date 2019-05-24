import { Component, OnInit, ViewChild } from '@angular/core';
import { BtnLaddaComponent, BtnStates } from 'src/app/components/btn-ladda/btn-ladda.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { BackendService } from '../../services/backend-service/backend.service';
import { take, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  @ViewChild('btnSignUp') btnSignUp: BtnLaddaComponent;

  // Formgroup
  public formgroupRegister: FormGroup;

  public errorMessageAtSignup = '';

  constructor(private formBuilder: FormBuilder, private router: Router, private afAuth: AngularFireAuth, private backendService: BackendService) {
    // Make formgroup
    this.formgroupRegister = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  private async SignUp(email: string, password: string, firstname: string, lastname: string) {
    let userCredentials: firebase.auth.UserCredential;

    // Create FireBase user
    try {
      userCredentials = await this.afAuth
        .auth
        .createUserWithEmailAndPassword(email, password);
    } catch (err) {
      this.btnSignUp.Stop();
      this.btnSignUp.SetStateBeforeAndAfterWithDuration(BtnStates.danger, BtnStates.secondary, 1500);

      switch (err.code) {
        case 'auth/email-already-in-use':
          this.errorMessageAtSignup = 'Email already in use.';
          break;
        case 'auth/invalid-email':
          this.errorMessageAtSignup = 'Invalid email.';
          break;
        case 'auth/operation-not-allowed':
          this.errorMessageAtSignup = 'Something went wrong, please try again and if the error persist please contact support.';
          break;
        case 'auth/weak-password':
          this.errorMessageAtSignup = 'Password must have a minimum length of 6 characters.';
          break;
        default:
          this.errorMessageAtSignup = 'Something went wrong, please try again and if the error persist please contact support.';
          console.error('Login Error:', err);
          break;
      }
      throw err;
    }

    const userToken = await userCredentials.user.getIdToken();

    await this.SetupUser(userToken, firstname, lastname);
  }

  private SetupUser(userToken: string, firstName: string, lastName: string) {
    this.backendService
      .user
      .setup_user(userToken, firstName, lastName)
      .pipe(
        take(1),
        finalize(() => {
          this.btnSignUp.Stop();
          this.btnSignUp.SetState(BtnStates.success);
          this.router.navigate(['/']);
        })
      )
      .subscribe(
        () => {
        },
        err => {
          this.btnSignUp.Stop();
          this.btnSignUp.SetStateBeforeAndAfterWithDuration(BtnStates.danger, BtnStates.secondary, 1500);
          console.error('Backend Error', err);
        });
  }

  // #region Methods called by view
  public HTMLSignUp() {
    this.btnSignUp.Start();

    // Force re-validate on submit
    Object.keys(this.formgroupRegister.controls).forEach(field => {
      const control = this.formgroupRegister.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
        control.updateValueAndValidity();
      }
    });

    // Verify form validity
    if (this.formgroupRegister.invalid) {
      this.btnSignUp.Stop();
      this.btnSignUp.SetStateBeforeAndAfterWithDuration(BtnStates.danger, BtnStates.secondary, 1500);
      return;
    }

    // TODO: make into custom formgroup validator and show field validation errors
    const firstName: string = this.formgroupRegister.get('firstName').value;
    if (firstName.trim().length <= 0) {
      this.formgroupRegister.get('firstName').setErrors({ lengthTooShort: 'true' });
      return;
    }

    const lastName: string = this.formgroupRegister.get('lastName').value;
    if (lastName.trim().length <= 0) {
      this.formgroupRegister.get('lastName').setErrors({ lengthTooShort: 'true' });
      return;
    }

    const email: string = this.formgroupRegister.get('email').value;
    if (email.trim().length <= 0) {
      this.formgroupRegister.get('email').setErrors({ lengthTooShort: 'true' });
      return;
    }

    const password: string = this.formgroupRegister.get('password').value;
    if (password.trim().length <= 0) {
      this.formgroupRegister.get('password').setErrors({ lengthTooShort: 'true' });
      return;
    }

    this.SignUp(email, password, firstName, lastName);
  }

  public HTMLBack() {
    this.router.navigate(['/login']);
  }
  // #endregion
}
