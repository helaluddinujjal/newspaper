import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/notification.service';
import { ApiPathService } from '../../service/api-path.service';

@Component({
  selector: 'app-flash-news',
  templateUrl: './flash-news.component.html',
  styleUrls: ['./flash-news.component.css']
})
export class FlashNewsComponent implements OnInit {
  breakingNews:any=[]
  constructor(private apiPath: ApiPathService,
    private notifyService: NotificationService) { }

  ngOnInit(): void {
    this.apiPath.getTypeRequest(`frontend/get-breaking-news`).subscribe((res: any) => {
      //console.log(res.data)
      if (res.status) {
        this.breakingNews = res.data
        //console.log(this.breakingNews)
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
