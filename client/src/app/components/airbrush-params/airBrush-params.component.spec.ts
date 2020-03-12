import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '../app/material';
import { AirBrushParamsComponent } from './airBrush-params.component';

describe('AirBrushParamsComponent', () => {
  let component: AirBrushParamsComponent;
  let fixture: ComponentFixture<AirBrushParamsComponent>;
  let event: MouseEvent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AirBrushParamsComponent],
      imports: [MaterialModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirBrushParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    event = new MouseEvent('mousedown', {});
    Object.defineProperty(event, 'value', { value: 10 });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onSliderchangeSize should set sliderValueSize to tip', () => {
    component.onSliderchangeSize(event);
    expect(component['airBrushService'].tip).toBe(component.sliderValueSize);
  });

  it('#onSliderchangeSparks should set sliderValueSparks to sparksPerSec to set the speed of airBrush', () => {
    component.onSliderchangeSparks(event);
    expect(component['airBrushService'].sparksPerSec).toBe(component.sliderValueSparks);
  });
});
