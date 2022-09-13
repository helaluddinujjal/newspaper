import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/admin/auth/services/auth.service';
import { ApiPathService } from 'src/app/admin/services/api-path.service';
import { NotificationService } from 'src/app/notification.service';
import { Tags } from '../tags';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit{

  tags: any = [];
  datas:any = [];
  constructor(private apiPath: ApiPathService, private notifyService: NotificationService,
    private auth:AuthService) {
  }
  ngOnInit(): void {

    this.apiPath.getTypeRequest('tag-category').subscribe((res: any) => {
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
    if (window.confirm('Do you want to go ahead?')) {
      this.apiPath.deleteTypeRequest(`delete-tag/${id}/${title}/${user[0].id}/${user[0].name}`).subscribe((res: any) => {
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

}
