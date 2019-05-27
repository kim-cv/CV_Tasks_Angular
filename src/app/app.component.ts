import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public authStateListener: Subscription = undefined;
  public isLoggedIn = false;

  // FontAwesome Icons
  public faArrowLeft = faArrowLeft;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
  }

  ngOnInit(): void {
    this.authStateListener = this.afAuth
      .authState
      .subscribe((user: firebase.User) => {
        if (typeof user !== 'undefined' && user !== null) {
          // Logged in
          this.isLoggedIn = true;
        } else {
          // Logged out
          this.isLoggedIn = false;
          this.router.navigate(['login']);
        }
      });
  }

  ngOnDestroy() {
    if (typeof this.authStateListener !== 'undefined' && this.authStateListener.closed === false) {
      this.authStateListener.unsubscribe();
    }
  }

  private async SignOut() {
    await this.afAuth.auth.signOut();
  }

  // #region Methods called by view
  public HTMLSignOut() {
    this.SignOut();
  }
  // #endregion
}
