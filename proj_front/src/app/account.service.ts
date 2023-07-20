import { EventEmitter, Injectable, inject } from '@angular/core';
import { User, AuthenticateUser } from './models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, catchError, map, of, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })

export class AccountService {

    http = inject(HttpClient)

    private email: string | null = null;

    isLoggedInSubject: Subject<boolean> = new Subject<boolean>();

    user: User | null = null;

    userUpdated: EventEmitter<User> = new EventEmitter<User>();

    emitUserUpdated(user: User) {
        this.userUpdated.emit(user);
    }

    createAccount(user: User) {
        return this.http.post<any>('/api/createUser', user)
    }

    addOrder(user: User, total: number, plan: string){
      const data = { user, total, plan };
      return this.http.post<any>('/api/addOrder', data);
    }

    getUser(email: string): Observable<User> {
        if (!!this.user) {
          // If user information is already available, return it as an observable
          console.info(">>>> getusercall", this.user)
          if(this.user.email==null){
            return this.http.get<User>(`/api/summary/${email}`).pipe(
              tap(user => {
                this.user = user; // Store the user information in the user property
              }),
              catchError(error => {
                console.error(error);
                return throwError(error);
              }))
          }else{
            return of(this.user);
          }
  
          
        } else {
          // Otherwise, make the HTTP request to retrieve the user data
          return this.http.get<User>(`/api/summary/${email}`).pipe(
            tap(user => {
              this.user = user; // Store the user information in the user property
            }),
            catchError(error => {
              console.error(error);
              return throwError(error);
            })
          );
        }
      }

      getItems(email: string): Observable<any[]> {
        return this.http.get<any[]>('/api/history', { params: { email } });
      }

    authenticateUser(email: string, password: string): Observable<boolean> {
        const user = { email, password }; 
        return this.http.post<boolean>('/api/login', user);
    }

    login(email: string, password: string): Observable<boolean> {
        const params = new HttpParams().set('email', email).set('password', password);
        const options = { params: params, responseType: 'text' as 'json' };
      
        return this.http.post('/api/login', {}, options).pipe(
            map((response: any) => {
              // Parse the response as JSON
              const parsedResponse = JSON.parse(response);
          
              // Extract the success value
              const success = parsedResponse.success === true;
              console.info(success);
          
              // Return the success value as a boolean
              return success;
            }),
            catchError(error => {
              // Handle error
              console.error(error);
              throw error; // Rethrow the error to propagate it
            })
          );
    }

    setEmail(email: string) {
        this.email = email;
    }

    getEmail(): string | null {
        return this.email;
    }

    setLoggedInStatus(isLoggedIn: boolean) {
        this.isLoggedInSubject.next(isLoggedIn);
    }

    checkEmail(email: string): Observable<boolean> {
        return this.http.get<boolean>(`/api/checkEmail/${email}`);
    }


    clearUser() {
        this.user = null;

    }

    getUserData(): Promise<User | null> {
        if (this.email) {
          return this.getUser(this.email).toPromise().then(user => {
            this.user = user || null; // Assign user to this.user, or null if it is undefined
            return user || null; // Return user if it exists, otherwise return null
          }).catch(error => {
            console.error(error);
            return null;
          });
        } else {
          
          return Promise.resolve(null);
        }
      }
      
    editAccount(user: User) {
        return this.http.post<any>('/api/editAccount', user)
    }

}