import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLogin: boolean = false
  errorMessage: any
  constructor(
    private _api: ApiService,
    private _auth: AuthService,
    private _router:Router,
    private notifyService : NotificationService
  ) { }
  ngOnInit() {
    this.isUserLogin();
  }

  onSubmit(form: NgForm) {
    //console.log('Your form data : ', form.value);
    this._api.postTypeRequest('admin/login', form.value).subscribe((res: any) => {
      console.log(res);
      if (res.status) {

        this._auth.setDataInLocalStorage('userData', JSON.stringify(res.data));
        this._auth.setDataInLocalStorage('token', res.token);
        this._router.navigate(['admin']);
      }else{
        this.notifyService.showError(res.message, "")
      }
    }, (err) => {
      this.notifyService.showError("Api not connected... Please try again ", "")
    })
  }
  isUserLogin(){
    if(this._auth.getUserDetails() != null){
        this.isLogin = true;
    }
  }
  logout(){
    this._auth.clearStorage()
    this._router.navigate(['admin/login']);
  }
}
