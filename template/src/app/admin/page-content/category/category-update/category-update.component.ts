import { Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/admin/auth/services/auth.service';
import { NotificationService } from 'src/app/notification.service';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-update',
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.css']
})
export class CategoryUpdateComponent implements OnInit {
  getId: any;
  slug: string = ""
  oldSlug: string = ""
  updateForm: FormGroup;
  submitted = false;
  checkSlug=false
  activities:any[] = [];
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private notifyService : NotificationService,
    private auth:AuthService
  ) {

    this.getId = this.activatedRoute.snapshot.paramMap.get('id');
    //console.log(this.getId)
    this.categoryService.getCategory(this.getId).subscribe(res => {
      this.updateForm.setValue({
        name: res['data']['name'],
        slug: res['data']['slug'],
        show_nav: res['data']['show_nav'],
        status: res['data']['status'],
        priority:res['data']['priority'],
        user_id:user[0].id,
      user_name:user[0].name,
      });
      this.oldSlug=res['data']['slug']
    });
    //console.log(this.oldSlug)
    let user=JSON.parse(this.auth.getUserDetails())
    this.updateForm = this.formBuilder.group({
      name: ['',Validators.required],
      slug: ['',Validators.required],
      show_nav: [''],
      status: [''],
      priority:[''],
      user_id:user[0].id,
      user_name:user[0].name,
    })
    setTimeout(() => {
      this.getActivity();
    }, 1000);
  }

  ngOnInit(): void {

  }
  getActivity(){
    this.categoryService.getActivityByID(this.getId,"Category").subscribe((res:any[]) => {
      // console.log(Array.from(Object.values(res['data'])))

       this.activities=Array.from(Object.values(res['data']))
     });
  }
  onUpdate(): any {
    this.submitted = true;
    if (this.updateForm.invalid) {
      return;
    }
    this.categoryService.updateCategory(this.getId, this.updateForm.value)
      .subscribe((res:any) => {
        if (res.status){
          this.notifyService.showSuccess("Category updated successfully !!","")
          this.ngZone.run(() => this.router.navigateByUrl('admin/category'))
        }else{
          this.notifyService.showError(res.message,"")
        }

      }, (err) => {
        this.notifyService.showError("Api not connected... Please try again ", "")
      });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.updateForm.controls;
  }
  getSlug(event: any) {

    this.slug = event.target.value
    this.slug = this.slug.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
    if (this.oldSlug!==this.slug){
      this.categoryService.checkSlug(this.slug)
      .subscribe((res:any) => {
        //console.log(res.status)
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
