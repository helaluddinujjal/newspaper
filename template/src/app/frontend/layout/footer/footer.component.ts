import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/notification.service';
import { ApiPathService } from '../../service/api-path.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
settings:any=[]
  pages:any = [];
  menues:any = [];
  constructor(private apiPath: ApiPathService,
    private notifyService: NotificationService,) { }

  ngOnInit(): void {
    this.apiPath.getTypeRequest(`frontend/page/${'Footer Menu'}`).subscribe((res: any) => {
      //console.log(res.data)
      if (res.status) {
        //this.tags = res.data;
        this.pages = res.data
        //console.log(res.data[0].category)
      } else {
        console.log(res.message)
        this.notifyService.showError(res.message, "")
      }

    }, (err) => {
      console.log(err)
      this.notifyService.showError("Api not connected... Please try again ", "")
    });

    this.apiPath.getTypeRequest(`frontend/menu/${0}`).subscribe((res: any) => {
      //console.log(res.data)
      if (res.status) {
        //this.tags = res.data;
        this.menues = res.data
        //console.log(res.data[0].category)
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
