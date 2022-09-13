import { Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiPathService } from 'src/app/admin/services/api-path.service';
import { NotificationService } from 'src/app/notification.service';
import 'quill-emoji/dist/quill-emoji.js'
import Quill from 'quill'
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter';
import { AuthService } from 'src/app/admin/auth/services/auth.service';

Quill.register('modules/blotFormatter', BlotFormatter);

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  getId: any;
  oldSlug: string = ""
  slug: string = ""
  cat_id: number = null
  value: any;
  updateForm: FormGroup;
  tag_id: number = null
  submitted = false;
  checkSlug = false
  modules = {}
  activities:any[] = [];
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private apiPath: ApiPathService,
    private notifyService: NotificationService,
    private auth:AuthService,
    ) {
      this.getId = this.activatedRoute.snapshot.paramMap.get('id');
    this.updateForm = this.formBuilder.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      content: ['', Validators.required],
      priority: [null],
      status: true,
      show_on:['',Validators.required],
      user_id:[''],
      user_name:[''],
    })
    let user=JSON.parse(this.auth.getUserDetails())
    this.apiPath.getTypeRequest(`page/${this.getId}`).subscribe((res: any) => {
      console.log(res)
      this.updateForm.setValue({
        title: res['data']['title'],
        slug: res['data']['slug'],
        content: res['data']['content'],
        priority: res['data']['priority'],
        status: res['data']['status'],
        show_on: res['data']['show_on'],

        user_id:user[0].id,
        user_name:user[0].name,
      });
      this.oldSlug = res['data']['slug']
    });
    this.modules = {
      'emoji-shortname': true,
      'emoji-textarea': false,
      'emoji-toolbar': true,
      blotFormatter: {
        // empty object for default behaviour.
      },
      'toolbar': {
        container: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],

          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
          [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
          [{ 'direction': 'rtl' }],                         // text direction

          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          [{ 'font': [] }],
          [{ 'align': [] }],

          ['clean'],                                         // remove formatting button

          ['link', 'image', 'video'],                         // link and image, video
          ['emoji'],
        ],
        handlers: { 'emoji': function () { } },

      }
    }
  }
  ngOnInit(): void {
    this.apiPath.getTypeRequest(`get-activity-by-id/${this.getId}/${'Page'}`).subscribe((res: any) => {
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
  }

  onUpdate(): any {
    this.submitted = true;
    if (this.updateForm.invalid) {
      return;
    }
    if (this.checkSlug) {
      return;
    }
    this.apiPath.putTypeRequest(`update-page/${this.getId}`, this.updateForm.value).subscribe((res: any) => {

      if (res.status) {
        this.notifyService.showSuccess("News updated successfully !!", "")
        this.ngZone.run(() => this.router.navigateByUrl('admin/page'))
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

    if (this.value) {
      this.slug = this.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      this.apiPath.getTypeRequest(`page/check-slug/${this.slug}`).subscribe((res: any) => {
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
