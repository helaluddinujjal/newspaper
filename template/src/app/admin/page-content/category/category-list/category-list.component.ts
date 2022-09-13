import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from 'src/app/notification.service';
import { Category } from '../category';
import { CategoryService } from '../category.service';
declare const $: any;

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: any = [];
  datas: Category[] = [];
  constructor(private categoryService: CategoryService,
    private notifyService: NotificationService,
    ) {
  }
  ngOnInit(): void {

    this.categoryService.getCategories().subscribe((res: any) => {
      //console.log(JSON.stringify(res))
      if (res.status) {
        this.categories = res;
        this.datas = this.categories.data
      } else {
        console.log(res.message)
        this.notifyService.showError(res.message, "")
      }

    }, (err) => {
      console.log(err)
      this.notifyService.showError("Api not connected... Please try again ", "")
    });
    // this.data = this.categories.data;


  }

  delete(id: any, i: any,title:any) {
    if (window.confirm('Do you want to go ahead?')) {
      this.categoryService.deleteCategory(id,title).subscribe((res: any) => {
        if (res.status) {
          this.notifyService.showSuccess("Data delete successfully !!", "")
          this.categories.data.splice(i, 1);
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
