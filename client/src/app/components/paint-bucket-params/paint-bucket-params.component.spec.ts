import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material';
import { EraserProperties } from 'src/app/classes/eraserProperties/eraser-properties';
import { PaintBucketParamsComponent } from './paint-bucket-params.component';

describe('PaintBucketParamsComponent', () => {
  let component: PaintBucketParamsComponent;
  let fixture: ComponentFixture<PaintBucketParamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaintBucketParamsComponent],
      providers: [FormsModule, EraserProperties],
      imports: [MatSliderModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintBucketParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
