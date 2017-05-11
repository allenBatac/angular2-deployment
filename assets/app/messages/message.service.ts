import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { Message } from "./message.model";
import { ErrorService } from "../errors/error.service";

@Injectable()
export class MessageService{
	private messages: Message[] = [];
	messageIsEdit = new EventEmitter<Message>();

	constructor(private http: Http, private errorService: ErrorService){}

	addMessage(message: Message){
		const body = JSON.stringify(message);
		const headers = new Headers({'Content-Type' : 'application/json'});
        const token = localStorage.getItem('token') ? '?token='  + localStorage.getItem('token') : '';
		return this.http.post('http://angular2-deployment-allen.herokuapp.com/message' + token, body, {headers: headers})
			.map((response: Response) =>  {
                const result = response.json().obj;
                const message = new Message(result.content, result.user.firstName, result._id, result.user._id);
                this.messages.push(message);
                return message;
            })
			.catch((error:Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
	}

	getMessages(userId: String) {
        return this.http.get('http://angular2-deployment-allen.herokuapp.com/message/' + userId)
            .map((response: Response) => {
                console.log('RESPONSE ', response);
                const messages = response.json().obj;
                let transformedMessages: Message[] = [];
                for (let message of messages) {
                    transformedMessages.push(new Message(message.content, message.user.firstName, message._id, message.user._id));
                }
                this.messages = transformedMessages;
                return transformedMessages;
            })
            .catch((error:Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    editMessage(message: Message){
    	this.messageIsEdit.emit(message);
    }

    updateMessage(message: Message) {
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token') ? '?token='  + localStorage.getItem('token') : '';
        return this.http.patch('http://angular2-deployment-allen.herokuapp.com/message/' + message.messageId + token, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error:Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

	deleteMessage(message: Message){
        const token = localStorage.getItem('token') ? '?token='  + localStorage.getItem('token') : '';
        return this.http.delete('http://angular2-deployment-allen.herokuapp.com/message/' + message.messageId + token)
            .map((response: Response) => {
                const result = response.json();
                this.messages.splice(this.messages.indexOf(message), 1);;
                return result;
            })
            .catch((error:Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
	}
}