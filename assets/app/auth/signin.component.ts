import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { FormGroup, FormControl, Validators } from '@angular/forms'

import { AuthService } from './user.service'
import { User } from './user.model'

@Component({
	selector: 'app-signin',
	templateUrl: './signin.component.html'
})

export class SigninComponent{
	myForm: FormGroup;

	constructor(private authService: AuthService, private router: Router){}

	ngOnInit(){
		this.myForm = new FormGroup({
			email: new FormControl(null, Validators.required),
			password: new FormControl(null, Validators.required),
		});
	}

	onSubmit(){
		console.log(this.myForm);
		const user = new User(this.myForm.value.email, this.myForm.value.password);
		this.authService.signin(user).subscribe(
			data => {
				console.log(data);
				localStorage.setItem('token', data.token);
				localStorage.setItem('userId', data.userId);
				this.router.navigateByUrl('/');
			},
            error => console.error(error)
		);
		this.myForm.reset();
	}
}