import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorToolProperties } from 'src/app/classes/colorToolProperties/color-tool-properties';
import { LineProperties } from 'src/app/classes/lineProperties/line-properties';
import { MaterialModule } from '../app/material';
import { LineParamsComponent } from './line-params.component';

describe('LineParamsComponent', () => {
  let component: LineParamsComponent;
  let fixture: ComponentFixture<LineParamsComponent>;
  let event: MouseEvent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineParamsComponent ],
      imports: [MaterialModule ],
      providers: [LineProperties, ColorToolProperties],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    event = new MouseEvent('mousedown', {});
    Object.defineProperty(event, 'value', {value: 10});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onSliderChange should set tip to sliderValue', () => {
    component.onSliderChange(event);
    expect(component['lineTool']['properties'].tip).toBe(component.sliderValue);
  });

  it('#lineSliderChange should set dotSize to lineSliderValue', () => {
    component.lineSliderChange(event);
    expect(component['lineTool']['properties'].dotSize).toBe(component.lineSliderValue);
  });

  it('#setDottedLine should call lineTool.setDottedLine', () => {
    spyOn(component['lineTool'], 'setDottedLine');
    component.setDottedLine();
    expect(component['lineTool'].setDottedLine).toHaveBeenCalled();
  });

  it('#setDashedLine should call lineTool.setDashLine', () => {
    spyOn(component['lineTool'], 'setDashLine');
    component.setDashedLine();
    expect(component['lineTool'].setDashLine).toHaveBeenCalled();
  });

  it('#setContinuedLine should call lineTool.setContinuedLine', () => {
    spyOn(component['lineTool'], 'setContinuedLine');
    component.setContinuedLine();
    expect(component['lineTool'].setContinuedLine).toHaveBeenCalled();
  });

  it('#setRoundJunction should call lineTool.setJunctionRound', () => {
    spyOn(component['lineTool'], 'setJunctionRound');
    component.setRoundJunction();
    expect(component['lineTool'].setJunctionRound).toHaveBeenCalled();
  });

  it('#setAngledJunction should call lineTool.setJunctionAngle', () => {
    spyOn(component['lineTool'], 'setJunctionAngle');
    component.setAngledJunction();
    expect(component['lineTool'].setJunctionAngle).toHaveBeenCalled();
  });

  it('#setDottedJunction should call lineTool.setJunctionDot', () => {
    spyOn(component['lineTool'], 'setJunctionDot');
    component.setDottedJunction();
    expect(component['lineTool'].setJunctionDot).toHaveBeenCalled();
  });
});
