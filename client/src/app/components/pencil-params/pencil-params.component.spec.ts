import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSliderModule } from '@angular/material';
import { PencilParamsComponent } from './pencil-params.component';

describe('PencilParamsComponent', () => {
  let component: PencilParamsComponent;
  let fixture: ComponentFixture<PencilParamsComponent>;
  let event: MouseEvent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PencilParamsComponent ],
      imports: [MatSliderModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PencilParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    event = new MouseEvent('mousedown', {});
    Object.defineProperty(event, 'value', {value: 10});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onSliderChange should set tip to sliderValue', () => {
    component.onSliderchange(event);
    expect(component['pencil']['properties'].tip).toBe(component.sliderValue);
  });
});
