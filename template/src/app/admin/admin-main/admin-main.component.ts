import { Component, OnInit, ɵAPP_ID_RANDOM_PROVIDER } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
// import '../../../assets/js/adminlte.min.js';
//import "../../../assets/js/bootstrap-switch.min.js";
@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.css']
})
export class AdminMainComponent implements OnInit {

  constructor(private _auth: AuthService,
    private _router:Router) { }

  ngOnInit(): void {
  }
  logout(){
    this._auth.clearStorage()
    this._router.navigate(['admin/login']);
  }
}
