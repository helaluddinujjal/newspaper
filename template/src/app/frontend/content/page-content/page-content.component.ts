import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { ApiPathService } from '../../service/api-path.service';

@Component({
  selector: 'app-page-content',
  templateUrl: './page-content.component.html',
  styleUrls: ['./page-content.component.css']
})
export class PageContentComponent implements OnInit {
  datas:any = [];
getSlug:any;
  constructor(private apiPath: ApiPathService,
    private notifyService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,) {
      this.getSlug = this.activatedRoute.snapshot.paramMap.get('slug');
    }

  ngOnInit(): void {

    this.apiPath.getTypeRequest(`frontend/page/content/${this.getSlug}`).subscribe((res: any) => {
      //console.log(res.data)
      if (res.status) {
        //this.tags = res.data;
        this.datas = res.data
        //console.log(res.data)
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
