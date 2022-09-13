import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { ApiPathService } from '../../service/api-path.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  mostViews:any = [];
  latestNews:any = [];
  posts:any = [];
  featured:any = [];
  getSlug:any;
    constructor(private apiPath: ApiPathService,
      private notifyService: NotificationService,
      private activatedRoute: ActivatedRoute,) {
      }

  ngOnInit(): void {
    this.getPosts()
    // this.getLatestPosts()
    // this.getViewPosts()
  }

  getPosts(){
    this.apiPath.getTypeRequest(`frontend/get-posts`).subscribe((res: any) => {
      //console.log(res.data)
      if (res.status) {
        //this.tags = res.data;
        this.posts = res.data.results
        this.featured = res.data.featured
        this.latestNews = res.data.latestPosts
        this.mostViews = res.data.viewNews
       // console.log(this.posts)
        console.log(this.featured)
      } else {
        console.log(res.message)
        this.notifyService.showError(res.message, "")
      }

    }, (err) => {
      console.log(err)
      this.notifyService.showError("Api not connected... Please try again ", "")
    });
  }
  getLatestPosts(){
    this.apiPath.getTypeRequest(`frontend/get-latest-posts`).subscribe((res: any) => {
      //console.log(res.data)
      if (res.status) {
        this.latestNews = res.data.results
        console.log(this.posts)
        console.log(this.featured)
      } else {
        console.log(res.message)
        this.notifyService.showError(res.message, "")
      }

    }, (err) => {
      console.log(err)
      this.notifyService.showError("Api not connected... Please try again ", "")
    });
  }
  getViewPosts(){
    this.apiPath.getTypeRequest(`frontend/get-view-posts`).subscribe((res: any) => {
      //console.log(res.data)
      if (res.status) {
        //this.tags = res.data;
        this.mostViews = res.data.results
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
