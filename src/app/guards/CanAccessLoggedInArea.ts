import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';


@Injectable()
export class CanAccessLoggedInArea implements CanActivate, CanActivateChild {
    constructor(private router: Router, private afAuth: AngularFireAuth) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {
        return this.afAuth
            .authState
            .pipe(
                take(1),
                map((user: firebase.User): boolean => {
                    if (typeof user !== 'undefined' && user !== null) {
                        return true;
                    } else {
                        this.router.navigate(['login']);
                        return false;
                    }
                })
            );

    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.canActivate(route, state);
    }
}
