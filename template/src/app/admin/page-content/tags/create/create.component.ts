import { Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/admin/auth/services/auth.service';
import { ApiPathService } from 'src/app/admin/services/api-path.service';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  createForm: FormGroup
  slug: string = ""
  cat_id: number = null
  submitted = false;
  checkSlug=false
  categories=[]
  value:any
  constructor(public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiPath: ApiPathService, private notifyService: NotificationService,   private auth:AuthService) {
      let user=JSON.parse(this.auth.getUserDetails())
      this.createForm = this.formBuilder.group({
      cat_id:['',Validators.required],
      name: ['',Validators.required],
      slug: ['',Validators.required],
      status: true,
      priority: false,
      user_id:user[0].id,
      user_name:user[0].name,
    })
  }
  ngOnInit(): void {
    this.apiPath.getTypeRequest('categories').subscribe((res: any) => {
      //console.log(JSON.stringify(res))
      if (res.status) {
        //this.tags = res.data;
        this.categories = res.data
      } else {
        console.log(res.message)
        this.notifyService.showError(res.message, "")
      }

    }, (err) => {
      console.log(err)
      this.notifyService.showError("Api not connected... Please try again ", "")
    });
  }
  onSubmit(): any {
    this.submitted = true;
    if (this.createForm.invalid) {
      return;
    }
    if (this.checkSlug) {
      return;
    }
    this.apiPath.postTypeRequest('tag-create', this.createForm.value).subscribe((res: any) => {
        if (res.status ){
          this.notifyService.showSuccess("Tag created successfully !!", "")
          this.ngZone.run(() => this.router.navigateByUrl('admin/tag'))
        }else{this.notifyService.showError(res.message, "")
      }
      }, (err) => {
        this.notifyService.showError(err,"")
      });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.createForm.controls;
  }
  getSlug(event: any) {

    this.value = event.target.value

     if( !isNaN(parseFloat(this.value)) && !isNaN(this.value - 0) ) {
      this.cat_id=this.value
      //console.log("print number")
     }else{
      this.slug = this.value.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
       //console.log("print string")
     }
    if (this.slug && this.cat_id){
      this.apiPath.getTypeRequest(`tag/check-slug/${this.cat_id}/${this.slug}`).subscribe((res: any) => {
       // console.log(res.status)
        if (res.status ){
          this.checkSlug=true
        }else{
          this.checkSlug=false
      }
      }, (err) => {
        this.checkSlug=false
      });
    }
  }


}
