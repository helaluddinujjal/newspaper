import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashNewsComponent } from './flash-news.component';

describe('FlashNewsComponent', () => {
  let component: FlashNewsComponent;
  let fixture: ComponentFixture<FlashNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlashNewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlashNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
