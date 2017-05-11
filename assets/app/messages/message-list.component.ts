import { Component, OnInit } from '@angular/core'
import { Message } from './message.model'
import { MessageService } from './message.service'
@Component({
	selector: 'app-message-list',
	template: `
		<div class="col-md-8 col-md-offset-2">
			<app-message *ngFor="let message of messages" [inputMessage] = "message"></app-message>	
		</div>
	`
})

export class MessageListComponent implements OnInit{
	messages:Message[];

	constructor(private messageService: MessageService){}
	
	ngOnInit(){
		if(localStorage.getItem('token') !== null){
			const userId = localStorage.getItem('userId');
			this.messageService.getMessages(userId)
				.subscribe(
					(messages: Message[]) => {
						this.messages = messages;
					}
				);
		}
	}
	
	/*Message[] = [
        new Message('Some Message', 'Allen'),
        new Message('Another Message', 'Allen')
    ];*/
}