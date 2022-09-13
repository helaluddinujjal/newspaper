import { Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiPathService } from 'src/app/admin/services/api-path.service';
import { NotificationService } from 'src/app/notification.service';
import 'quill-emoji/dist/quill-emoji.js'
import Quill from 'quill'
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter';
import { AuthService } from 'src/app/admin/auth/services/auth.service';

Quill.register('modules/blotFormatter', BlotFormatter);
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {


  createForm: FormGroup;
  slug: string = ""
  cat_id: number = null
  tag_id: number = null
  submitted = false;
  checkSlug = false
  categories = []
  tags = []
  value: any
  modules = {}
  isImageSaved: boolean = false;
  cardImageBase64: string = '';
  constructor(public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiPath: ApiPathService,
    private notifyService: NotificationService,
    private auth:AuthService,
    ) {
      let user=JSON.parse(this.auth.getUserDetails())
    this.createForm = this.formBuilder.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      content: ['', Validators.required],
      user_id:user[0].id,
        user_name:user[0].name,
      priority: [null],
      status: true,
      show_on:['',Validators.required]
    })

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
  }

  onSubmit(): any {
    this.submitted = true;
    if (this.createForm.invalid) {
      return;
    }
    if (this.checkSlug) {
      return;
    }
    this.apiPath.postTypeRequest('page-create', this.createForm.value).subscribe((res: any) => {
      if (res.status) {
        this.notifyService.showSuccess("Page created successfully !!", "")
        this.ngZone.run(() => this.router.navigateByUrl('admin/page'))
      } else {
        this.notifyService.showError(res.message, "")
      }
    }, (err) => {
      this.notifyService.showError(err, "")
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.createForm.controls;
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
