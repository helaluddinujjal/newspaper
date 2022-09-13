import { Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/admin/auth/services/auth.service';
import { NotificationService } from 'src/app/notification.service';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css']
})

export class CategoryCreateComponent implements OnInit {
  createForm: FormGroup
  slug: string = ""
  submitted = false;
  checkSlug=false
  constructor(public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private createService: CategoryService, private notifyService: NotificationService,private auth:AuthService) {
      let user=JSON.parse(this.auth.getUserDetails())
    this.createForm = this.formBuilder.group({
      name: ['',Validators.required],
      slug: ['',Validators.required],
      show_nav: false,
      status: true,
      priority:null,
      user_id:user[0].id,
      user_name:user[0].name,
    })
  }
  test=""
  ngOnInit(): void {
  }
  onSubmit(): any {
    this.submitted = true;
    if (this.createForm.invalid) {
      return;
    }
    this.createService.addCategory(this.createForm.value)
      .subscribe((res:any) => {
        if (res.status ){
          this.notifyService.showSuccess("Category created successfully !!", "")
          this.ngZone.run(() => this.router.navigateByUrl('admin/category'))
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
    this.slug = event.target.value
    this.slug = this.slug.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
    this.createService.checkSlug(this.slug)
    .subscribe((res:any) => {
      console.log(res.status)
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
