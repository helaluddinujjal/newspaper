import { Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/admin/auth/services/auth.service';
import { ApiPathService } from 'src/app/admin/services/api-path.service';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  value: any;
  updateForm: FormGroup;
  submitted = false;
  activities = []
  categories = []
  isImageSaved: boolean = false;
  cardImageBase64: string = '';
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private apiPath: ApiPathService,
    private notifyService: NotificationService,
    private auth: AuthService,
  ) {
    //console.log(this.getId)
    let user = JSON.parse(this.auth.getUserDetails())
    this.apiPath.getTypeRequest(`get-site-settings`).subscribe((res: any) => {
        this.updateForm.setValue({
          id:res['data'][0]['id'],
          logo: res['data'][0]['logo'],
          footer_reserved_text: res['data'][0]['footer_reserved_text'],
          user_id: user[0].id,
          user_name: user[0].name,
          instagram: res['data'][0]['instagram'],
          facebook: res['data'][0]['facebook'],
          youtube: res['data'][0]['youtube'],
          linkedin: res['data'][0]['linkedin'],
          twitter: res['data'][0]['twitter'],
        });
    });
    this.updateForm = this.formBuilder.group({
      id:null,
      logo: ['', Validators.required],
      footer_reserved_text: ['', Validators.required],
      user_id: null,
      user_name: "",
      instagram: null,
      facebook: null,
      youtube: null,
      linkedin: null,
      twitter: null,
    })
  }
  ngOnInit(): void {
    this.apiPath.getTypeRequest(`get-activity-by-id/${1}/${'Settings'}`).subscribe((res: any) => {
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

    this.apiPath.putTypeRequest(`update-site-settings`, this.updateForm.value).subscribe((res: any) => {

      if (res.status) {
        this.notifyService.showSuccess("Settings saved successfully !!", "")
         this.ngZone.run(() => this.router.navigateByUrl('admin/settings'))
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
}
