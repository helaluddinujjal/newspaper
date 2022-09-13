import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { ApiPathService } from '../../service/api-path.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  posts: any = [];
  postSlug: any;
  constructor(
    private apiPath: ApiPathService,
    private notifyService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,) {
    this.postSlug = this.activatedRoute.snapshot.paramMap.get('post');
    }

    ngOnInit(): void {
      this.apiPath.getTypeRequest(`frontend/get-post-details-by-post-title/${this.postSlug}`).subscribe((res: any) => {
        //console.log(res.data)
        if (res.status) {
          //this.tags = res.data;
          this.posts = res.data[0]
          console.log(this.posts.title)
        } else {
          console.log(res.message)
          this.notifyService.showError(res.message, "")
        }

      }, (err) => {
        console.log(err)
        this.notifyService.showError("Api not connected... Please try again ", "")
      });
    }
    transformHtml(htmlTextWithStyle): SafeHtml {
      return this.sanitizer.bypassSecurityTrustHtml(htmlTextWithStyle);
    }
  }
