import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorToolProperties } from 'src/app/classes/colorToolProperties/color-tool-properties';
import { PenToolProperties } from 'src/app/classes/penProperties/pen-properties';
import { MaterialModule } from '../app/material';
import { PenToolParamsComponent } from './pen-tool-params.component';

describe('PenToolParamsComponent', () => {
  let component: PenToolParamsComponent;
  let fixture: ComponentFixture<PenToolParamsComponent>;
  let event: MouseEvent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenToolParamsComponent ],
      imports: [MaterialModule],
      providers: [PenToolProperties, ColorToolProperties],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenToolParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    event = new MouseEvent('mousedown', {});
    Object.defineProperty(event, 'value', {value: 10});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#sliderTipMax should set sliderMax to tipMax', () => {
    component.sliderTipMax(event);
    expect(component['penToolService']['properties'].tipMax).toBe(component.sliderMax);
  });

  it('#sliderTipMin should set sliderMin to tipMin', () => {
    component.sliderMax = 4;
    component.sliderTipMin(event);
    expect(component['penToolService']['properties'].tipMin).toBe(10);
    expect(component.sliderMin).toBe(component.sliderMax - 1);
  });

  it('#sliderTipMin should set sliderMin to tipMin', () => {
    component.sliderMax = 14;
    component.sliderTipMin(event);
    expect(component['penToolService']['properties'].tipMin).toBe(component.sliderMin);
  });
});
