import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSliderModule } from '@angular/material';
import { ColorToolProperties } from 'src/app/classes/colorToolProperties/color-tool-properties';
import { QuillProperties } from 'src/app/classes/quillProperties/quill-properties';
import { QuillParamsComponent } from './quill-params.component';

describe('QuillParamsComponent', () => {
  let component: QuillParamsComponent;
  let fixture: ComponentFixture<QuillParamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuillParamsComponent],
      providers: [ColorToolProperties, QuillProperties],
      imports: [MatSliderModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuillParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
