import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ITask } from 'src/app/models/task/ITask';
import { IUser } from 'src/app/models/user/IUser';


@Injectable({
  providedIn: 'root'
})
export class BackendService {
  public user: User;

  constructor(private httpClient: HttpClient) {
    this.user = new User(this.httpClient);
  }
}

abstract class AbstractBackendService {
  constructor() { }

  protected createAuthorizationHeader(userToken: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken
    });
  }
}

class Tasks extends AbstractBackendService {
  constructor(private httpClient: HttpClient) {
    super();
  }

  list(userToken: string): Observable<ITask[]> {
    const headers: HttpHeaders = this.createAuthorizationHeader(userToken);
    return this
      .httpClient
      .get<ITask[]>(
        `${environment.apiUrlDev}tasks/`,
        {
          headers: headers,
          observe: 'response'
        })
      .pipe(
        map(value => {
          if (value.status === 200) {
            return value.body;
          } else {
            throw value.body;
          }
        }),
        share()
      );
  }

  create(userToken: string, name: string, description: string): Observable<ITask> {
    const headers: HttpHeaders = this.createAuthorizationHeader(userToken);
    return this
      .httpClient
      .post<ITask>(
        `${environment.apiUrlDev}tasks/`,
        {
          name: name,
          description: description
        },
        {
          headers: headers,
          observe: 'response'
        })
      .pipe(
        map(value => {
          if (value.status === 201) {
            return value.body;
          } else {
            throw value.body;
          }
        }),
        share()
      );
  }

  delete(userToken: string, taskId: string): Observable<null> {
    const headers: HttpHeaders = this.createAuthorizationHeader(userToken);
    return this
      .httpClient
      .delete<any>(
        `${environment.apiUrlDev}tasks/${taskId}`,
        {
          headers: headers,
          observe: 'response'
        })
      .pipe(
        map(value => {
          if (value.status === 204) {
            return null;
          } else {
            throw value.body;
          }
        }),
        share()
      );
  }
}

class User extends AbstractBackendService {
  public tasks: Tasks;

  constructor(private httpClient: HttpClient) {
    super();
    this.tasks = new Tasks(httpClient);
  }

  setup_user(userToken: string, firstName: string, lastName: string): Observable<null> {
    const headers: HttpHeaders = this.createAuthorizationHeader(userToken);

    return this
      .httpClient
      .post<any>(
        environment.apiUrlDev + 'users/' + userToken,
        {
          firstName: firstName,
          lastName: lastName
        },
        {
          headers: headers,
          observe: 'response'
        })
      .pipe(
        map(value => {
          if (value.status === 204) {
            return null;
          } else {
            throw value.body;
          }
        }),
        share()
      );
  }

  retrieve(userToken: string): Observable<IUser> {
    const headers: HttpHeaders = this.createAuthorizationHeader(userToken);
    return this
      .httpClient
      .get<IUser>(
        environment.apiUrlDev + 'users',
        {
          headers: headers,
          observe: 'response'
        })
      .pipe(
        map(value => {
          if (value.status === 200) {
            return value.body;
          } else {
            throw value.body;
          }
        }),
        share()
      );
  }
}
