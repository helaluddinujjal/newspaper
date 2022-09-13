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
    private auth:AuthService
    ) {
    let user=JSON.parse(this.auth.getUserDetails())
    this.createForm = this.formBuilder.group({
      cat_id: ['', Validators.required],
      tag_id: ['', Validators.required],
      title: ['', Validators.required],
      slug: ['', Validators.required],
      content: ['', Validators.required],
      image: [''],
      featured: false,
      user_id:user[0].id,
      user_name:user[0].name,
      breaking_news: false,
      status: true,
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
  CreateBase64String(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const imgBase64Path = e.target.result;
          this.cardImageBase64 = imgBase64Path;
          this.isImageSaved = true;
          //console.log(imgBase64Path);
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }
  onSubmit(): any {
    this.submitted = true;
    if (this.createForm.invalid) {
      return;
    }
    if (this.checkSlug) {
      return;
    }
    this.apiPath.postTypeRequest('post-create', this.createForm.value).subscribe((res: any) => {
      if (res.status) {
        this.notifyService.showSuccess("Post created successfully !!", "")
        this.ngZone.run(() => this.router.navigateByUrl('admin/post'))
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
  getTags(event: any) {
    this.value = event.target.value
//console.log(this.value)
    if (!isNaN(parseFloat(this.value)) && !isNaN(this.value - 0)) {
      this.cat_id=this.value
      this.apiPath.getTypeRequest(`get-tags-by-cat-id/${this.cat_id}`).subscribe((res: any) => {
        //console.log(JSON.stringify(res))
        if (res.status) {
          //this.tags = res.data;
          this.tags = res.data
        } else {
          console.log(res.message)
          this.notifyService.showError(res.message, "")
        }

      }, (err) => {
        console.log(err)
        this.notifyService.showError("Api not connected... Please try again ", "")
      });
    }
  }
  getSlug(event: any) {

    this.value = event.target.value

    if (!isNaN(parseFloat(this.value)) && !isNaN(this.value - 0)) {
      this.tag_id = this.value
      //console.log("print number")
    } else {
      this.slug = this.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      //console.log("print string")
    }
    if (this.slug && this.cat_id) {
      this.apiPath.getTypeRequest(`post/check-slug/${this.cat_id}/${this.tag_id}/${this.slug}`).subscribe((res: any) => {
        // console.log(res.status)
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
