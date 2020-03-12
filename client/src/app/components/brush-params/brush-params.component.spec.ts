import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrushProperties } from 'src/app/classes/brushProperties/brush-properties';
import { ColorToolProperties } from 'src/app/classes/colorToolProperties/color-tool-properties';
import { MaterialModule } from '../app/material';
import { BrushParamsComponent } from './brush-params.component';

describe('BrushParamsComponent', () => {
  let component: BrushParamsComponent;
  let fixture: ComponentFixture<BrushParamsComponent>;
  let event: MouseEvent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrushParamsComponent],
      imports: [MaterialModule],
      providers: [ColorToolProperties, BrushProperties],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrushParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    event = new MouseEvent('mousedown', {clientX: 50, clientY: 50});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onSliderChange should set tip to event.value', () => {
    Object.defineProperty(event, 'value', {value: 40});
    component.onSliderchange(event);
    expect(component['brushTool']['properties'].tip).toBe(component.sliderValue);
  });

  it('#setTextureBase should set textureBase in a brushTool', () => {
    component.setTextureBase();
    expect(component['brushTool']['properties'].filterBase).toBe(component['brushTool']['properties'].currentFilter);
  });

  it('#setTextureNoise should set textureBase in a brushTool', () => {
    component.setTextureNoise();
    expect(component['brushTool']['properties'].filterNoise).toBe(component['brushTool']['properties'].currentFilter);
  });

  it('#setTextureBlurry should set textureBase in a brushTool', () => {
    component.setTextureBlurry();
    expect(component['brushTool']['properties'].filterBlurry).toBe(component['brushTool']['properties'].currentFilter);
  });

  it('#setTextureSquigly should set textureBase in a brushTool', () => {
    component.setTextureSquigly();
    expect(component['brushTool']['properties'].filterSquigly).toBe(component['brushTool']['properties'].currentFilter);
  });

  it('#setTextureTurbulence should set textureBase in a brushTool', () => {
    component.setTextureTurbulence();
    expect(component['brushTool']['properties'].filterTurbulence).toBe(component['brushTool']['properties'].currentFilter);
  });
});
