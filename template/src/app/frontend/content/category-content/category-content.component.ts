import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { ApiPathService } from '../../service/api-path.service';

@Component({
  selector: 'app-category-content',
  templateUrl: './category-content.component.html',
  styleUrls: ['./category-content.component.css']
})
export class CategoryContentComponent implements OnInit {

  posts:any = [];
  tags:any = [];
  getSlug:any;
    constructor(private apiPath: ApiPathService,
      private notifyService: NotificationService,
      private activatedRoute: ActivatedRoute,) {
        this.getSlug = this.activatedRoute.snapshot.paramMap.get('category');
      }

  ngOnInit(): void {
    this.apiPath.getTypeRequest(`frontend/get-tag-by-cat/${this.getSlug}`).subscribe((res: any) => {
      //console.log(res.data)
      if (res.status) {
        //this.tags = res.data;
        this.tags = res.data
       // console.log(this.tags)
      } else {
        console.log(res.message)
        this.notifyService.showError(res.message, "")
      }

    }, (err) => {
      console.log(err)
      this.notifyService.showError("Api not connected... Please try again ", "")
    });
    setTimeout(() => {
      this.apiPath.getTypeRequest(`frontend/get-post-by-cat/${this.getSlug}`).subscribe((res: any) => {
        //console.log(res.data)
        if (res.status) {
          //this.tags = res.data;
          this.posts = res.data
          //console.log(this.posts)
        } else {
          console.log(res.message)
          this.notifyService.showError(res.message, "")
        }

      }, (err) => {
        console.log(err)
        this.notifyService.showError("Api not connected... Please try again ", "")
      });
    }, 1000);

  }

}
