import { Component, ViewChild } from '@angular/core';
import { BtnLaddaComponent, BtnStates } from 'src/app/components/btn-ladda/btn-ladda.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { BackendService } from '../../services/backend-service/backend.service';
import { validator_preventOnlySpaces } from 'src/app/formvalidators/formValidators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  @ViewChild('btnSignUp') btnSignUp: BtnLaddaComponent;

  // Formgroup
  public formgroupRegister: FormGroup;

  // Error msg
  public errorMessageAtSignup = '';

  constructor(private formBuilder: FormBuilder, private router: Router, private afAuth: AngularFireAuth, private backendService: BackendService) {
    // Make formgroup
    this.formgroupRegister = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(75), validator_preventOnlySpaces(1)]],
      lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), validator_preventOnlySpaces(1)]],
      email: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.email, validator_preventOnlySpaces(1)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100), validator_preventOnlySpaces(6)]],
    });
  }

  private CreateAccount(email: string, password: string) {
    // Create FireBase user
    return this.afAuth
      .auth
      .createUserWithEmailAndPassword(email, password);
  }

  private SetupUser(userToken: string, firstName: string, lastName: string) {
    return this.backendService
      .user
      .setup_user(userToken, firstName, lastName)
      .toPromise();
  }

  // #region Methods called by view
  public async HTMLSignUp() {
    this.formgroupRegister.disable();
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
      this.formgroupRegister.enable();
      this.btnSignUp.Stop();
      this.btnSignUp.SetStateBeforeAndAfterWithDuration(BtnStates.danger, BtnStates.secondary, 1000);
      return;
    }

    const firstName: string = this.formgroupRegister.get('firstName').value.trim();
    const lastName: string = this.formgroupRegister.get('lastName').value.trim();
    const email: string = this.formgroupRegister.get('email').value.trim();
    const password: string = this.formgroupRegister.get('password').value.trim();

    // Try sign up
    let userCredentials: firebase.auth.UserCredential;
    try {
      userCredentials = await this.CreateAccount(email, password);
    } catch (err) {
      console.error('Err at CreateAccount():', err);
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
          break;
      }

      this.btnSignUp.SetStateBeforeAndAfterWithDuration(BtnStates.danger, BtnStates.secondary, 1000);
      this.btnSignUp.Stop();
      setTimeout(() => {
        this.formgroupRegister.enable();
        this.formgroupRegister.reset();
      }, 1000);

      return;
    }

    const userToken = await userCredentials.user.getIdToken();
    try {
      await this.SetupUser(userToken, firstName, lastName);

      this.btnSignUp.SetState(BtnStates.success);
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1000);
    } catch (err) {
      this.btnSignUp.SetStateBeforeAndAfterWithDuration(BtnStates.danger, BtnStates.secondary, 1000);
      console.error('SetupUser Backend Error', err);
    }

    this.btnSignUp.Stop();
  }

  public HTMLBack() {
    this.router.navigate(['/login']);
  }
  // #endregion
}
