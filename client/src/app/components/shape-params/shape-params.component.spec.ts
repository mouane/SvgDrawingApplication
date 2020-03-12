import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonToggleModule, MatFormFieldModule, MatRadioModule, MatSelectModule, MatSliderModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShapeParamsComponent } from './shape-params.component';

describe('ShapeParamsComponent', () => {
  let component: ShapeParamsComponent;
  let fixture: ComponentFixture<ShapeParamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapeParamsComponent ],
      imports: [MatFormFieldModule, MatRadioModule, MatSelectModule, MatSliderModule, MatButtonToggleModule, BrowserAnimationsModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapeParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
