import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorToolProperties } from 'src/app/classes/colorToolProperties/color-tool-properties';
import { PipetteProperties } from 'src/app/classes/pipetteProperties/pipette-properties';
import { MaterialModule } from '../app/material';
import { PipetteParamsComponent } from './pipette-params.component';

describe('PipetteParamsComponent', () => {
  let component: PipetteParamsComponent;
  let fixture: ComponentFixture<PipetteParamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipetteParamsComponent ],
      imports: [MaterialModule],
      providers: [PipetteProperties, ColorToolProperties],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipetteParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#setPipetteColor should set the fill and outline of colorToolService', () => {
    component.setPipetteColor();
    expect(component['colorToolService'].Fill).toBe(component.fill);
    expect(component['colorToolService'].Outline).toBe(component.outline);
  });

  it('#getFill should return fill', () => {
    const value = component.getFill();
    expect(value).toBe(component['pipetteService'].getPrimaryColor());
  });

  it('#getOutline should return outline', () => {
    const value = component.getOutline();
    expect(value).toBe(component['pipetteService'].getSecondaryColor());
  });
});
