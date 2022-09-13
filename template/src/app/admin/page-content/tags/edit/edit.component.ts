import { Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/admin/auth/services/auth.service';
import { ApiPathService } from 'src/app/admin/services/api-path.service';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {


  getId: any;
  slug: string = ""
  oldSlug: string = ""
  cat_id: number = null
  value: any;
  updateForm: FormGroup;
  submitted = false;
  checkSlug = false
  activities=[]
  categories = []

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private apiPath: ApiPathService,
    private notifyService: NotificationService,
    private auth:AuthService
  ) {

    this.getId = this.activatedRoute.snapshot.paramMap.get('id');
    //console.log(this.getId)
    let user=JSON.parse(this.auth.getUserDetails())
    this.apiPath.getTypeRequest(`tag/${this.getId}`).subscribe((res: any) => {
      this.updateForm.setValue({
        cat_id: res['data']['cat_id'],
        name: res['data']['name'],
        slug: res['data']['slug'],
        status: res['data']['status'],
        priority: res['data']['priority'],
        user_id:user[0].id,
        user_name:user[0].name,
      });
      this.oldSlug = res['data']['slug']
      this.cat_id = res['data']['cat_id']
    });
    this.updateForm = this.formBuilder.group({
      cat_id: ['', Validators.required],
      name: ['', Validators.required],
      slug: ['', Validators.required],
      status: [''],
      priority: [''],
      user_id:null,
      user_name:"",
    })


  }

  ngOnInit(): void {
    this.apiPath.getTypeRequest(`get-activity-by-id/${this.getId}/${'Tag'}`).subscribe((res: any) => {
      //console.log(JSON.stringify(res))
      if (res.status) {
        //this.tags = res.data;

        this.activities = res.data
      } else {
        console.log(res.message)
        this.notifyService.showError(res.message, "")
      }

    }, (err) => {
      console.log(err)
      this.notifyService.showError("Api not connected... Please try again ", "")
    });
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


    console.log(this.activities)
  }
  onUpdate(): any {
    this.submitted = true;
    if (this.updateForm.invalid) {
      return;
    }
    if (this.checkSlug) {
      return;
    }
    this.apiPath.putTypeRequest(`update-tag/${this.getId}`, this.updateForm.value).subscribe((res: any) => {

      if (res.status) {
        this.notifyService.showSuccess("Category updated successfully !!", "")
        this.ngZone.run(() => this.router.navigateByUrl('admin/tag'))
      } else {
        this.notifyService.showError(res.message, "")
      }

    }, (err) => {
      this.notifyService.showError("Api not connected... Please try again ", "")
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.updateForm.controls;
  }

  getSlug(event: any) {
    this.value = event.target.value
//console.log(this.oldSlug)
    if (!isNaN(parseFloat(this.value)) && !isNaN(this.value - 0)) {
      this.cat_id = this.value
      console.log("print number")
    } else {
      this.slug = this.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      console.log("print string")
    }
    if (this.slug && this.cat_id) {
      if (this.oldSlug != this.slug) {
        console.log("not")

        this.apiPath.getTypeRequest(`tag/check-slug/${this.cat_id}/${this.slug}`).subscribe((res: any) => {
          console.log(res.status)
          if (res.status) {
            this.checkSlug = true
          } else {
            this.checkSlug = false
          }
        }, (err) => {
          this.checkSlug = false
        });
      }
    }
  }

}
