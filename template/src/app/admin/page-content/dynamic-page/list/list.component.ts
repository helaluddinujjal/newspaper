import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from 'src/app/admin/auth/services/auth.service';
import { ApiPathService } from 'src/app/admin/services/api-path.service';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

   //tags: any = [];
   datas:any = [];
   constructor(private apiPath: ApiPathService,
    private notifyService: NotificationService,
    private sanitizer: DomSanitizer,
    private auth:AuthService
    ) {
   }
   ngOnInit(): void {

     this.apiPath.getTypeRequest('page').subscribe((res: any) => {
       //console.log(JSON.stringify(res))
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
     // this.data = this.tags.data;


   }

   delete(id: any, i: any,title:any) {
    let user=JSON.parse(this.auth.getUserDetails())
  //console.log(user)
     if (window.confirm('Do you want to go ahead?')) {
       this.apiPath.deleteTypeRequest(`delete-page/${id}/${title}/${user[0].id}/${user[0].name}`).subscribe((res: any) => {
         if (res.status) {
           this.notifyService.showSuccess("Data delete successfully !!", "")
           //this.tags.data.splice(i, 1);
           this.datas.splice(i, 1);
         } else {
           this.notifyService.showError(res.message, "")
         }

       }, (err) => {
         this.notifyService.showError("Api not connected... Please try again ", "")
       })
     } else {
       this.notifyService.showSuccess("Data has been safe !!", "")
     }
   }

   transformHtml(htmlTextWithStyle): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(htmlTextWithStyle);
}

}
