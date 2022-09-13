import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/notification.service';
import { ApiPathService } from '../../service/api-path.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  datas:any = [];
  menues:any = [];
  settings:any = [];
  constructor(private apiPath: ApiPathService,
    private notifyService: NotificationService,) { }

  ngOnInit(): void {
    this.apiPath.getTypeRequest(`frontend/page/${'Header Menu'}`).subscribe((res: any) => {
      //console.log(res.data)
      if (res.status) {
        //this.tags = res.data;
        this.datas = res.data
        //console.log(res.data[0].category)
      } else {
        console.log(res.message)
        this.notifyService.showError(res.message, "")
      }

    }, (err) => {
      console.log(err)
      this.notifyService.showError("Api not connected... Please try again ", "")
    });

    this.apiPath.getTypeRequest(`frontend/menu/${1}`).subscribe((res: any) => {
      //console.log(res.data)
      if (res.status) {
        //this.tags = res.data;
        this.menues = res.data
       // console.log(this.menues)
      } else {
        console.log(res.message)
        this.notifyService.showError(res.message, "")
      }

    }, (err) => {
      console.log(err)
      this.notifyService.showError("Api not connected... Please try again ", "")
    });

    this.apiPath.getTypeRequest('frontend/get-site-settings').subscribe((res: any) => {
      //console.log(res.data)
      if (res.status) {
        //this.tags = res.data;
        this.settings = res['data'][0]
        console.log(this.settings)
      } else {
        console.log(res.message)
        this.notifyService.showError(res.message, "")
      }

    }, (err) => {
      console.log(err)
      this.notifyService.showError("Api not connected... Please try again ", "")
    });
  }

}
