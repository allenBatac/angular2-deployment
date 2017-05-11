import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { User } from "./user.model";
import { ErrorService } from "../errors/error.service";

@Injectable()
export class AuthService{
	currentUser: User;
	constructor(private http: Http, private errorService: ErrorService){}

	signup(user: User){
		const body = JSON.stringify(user);
		const headers = new Headers({'Content-Type' : 'application/json'})
		return this.http.post('https://angular2-deployment-allen.herokuapp.com/auth', body, {headers: headers})
			.map((response: Response) => response.json())
			.catch((error:Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
	}

	signin(user: User){
		const body = JSON.stringify(user);
		const headers = new Headers({'Content-Type' : 'application/json'});
		return this.http.post('https://angular2-deployment-allen.herokuapp.com/auth/signin', body, {headers: headers})
			.map((response: Response) => response.json())
			.catch((error:Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
	}

	logout(){
		localStorage.clear();
	}

	isLoggedIn(){
		return localStorage.getItem('token') !== null;
	}
}