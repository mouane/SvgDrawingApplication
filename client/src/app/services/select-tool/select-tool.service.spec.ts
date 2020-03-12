import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule, MatSelectModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrushProperties } from 'src/app/classes/brushProperties/brush-properties';
import { ColorToolProperties } from 'src/app/classes/colorToolProperties/color-tool-properties';
import { EraserProperties } from 'src/app/classes/eraserProperties/eraser-properties';
import { LineProperties } from 'src/app/classes/lineProperties/line-properties';
import { PencilProperties } from 'src/app/classes/pencilProperties/pencil-properties';
import { PipetteProperties } from 'src/app/classes/pipetteProperties/pipette-properties';
import { ShapeProperties } from 'src/app/classes/shapeProperties/shape-properties';
import { StampSelectorProperties } from 'src/app/classes/stampProperties/stamp-properties';
import { SvgSelectorProperties } from 'src/app/classes/svgSelectorProperties/svg-properties';
import { AirBrushParamsComponent } from 'src/app/components/airbrush-params/airBrush-params.component';
import { MaterialModule } from 'src/app/components/app/material';
import { BrushParamsComponent } from 'src/app/components/brush-params/brush-params.component';
import { EraserComponent } from 'src/app/components/eraser/eraser.component';
import { GridParamsComponent } from 'src/app/components/grid-params/grid-params.component';
import { LineParamsComponent } from 'src/app/components/line-params/line-params.component';
import { PaintBucketParamsComponent } from 'src/app/components/paint-bucket-params/paint-bucket-params.component';
import { PenToolParamsComponent } from 'src/app/components/pen-tool-params/pen-tool-params.component';
import { PencilParamsComponent } from 'src/app/components/pencil-params/pencil-params.component';
import { PipetteParamsComponent } from 'src/app/components/pipette-params/pipette-params.component';
import { QuillParamsComponent } from 'src/app/components/quill-params/quill-params/quill-params.component';
import { SelectionParamsComponent } from 'src/app/components/selection-params/selection-params.component';
import { ShapeParamsComponent } from 'src/app/components/shape-params/shape-params.component';
import { StampParamsComponent } from 'src/app/components/stamp-params/stamp-params.component';
import { TextParamsComponent } from 'src/app/components/text-params/text-params.component';
import { MouseControlService } from '../mouse-control/mouse-control.service';
import { SelectToolService } from './select-tool.service';

describe('SelectToolService', () => {
  let service: SelectToolService;
  let mouseControl: MouseControlService;
  let mockRenderer: jasmine.SpyObj<Renderer2>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EraserComponent,
                    StampParamsComponent,
                    PipetteParamsComponent,
                    GridParamsComponent,
                    LineParamsComponent,
                    BrushParamsComponent,
                    PencilParamsComponent,
                    PenToolParamsComponent,
                    ShapeParamsComponent,
                    SelectionParamsComponent,
                    TextParamsComponent,
                    PaintBucketParamsComponent,
                    AirBrushParamsComponent,
                    QuillParamsComponent],
      imports: [MaterialModule, MatCheckboxModule, FormsModule, MatSelectModule],
      providers: [SelectToolService, MouseControlService, ShapeProperties, BrushProperties,
                  PencilProperties, PipetteProperties, LineProperties, ColorToolProperties,
                  StampSelectorProperties, SvgSelectorProperties, EraserProperties],
    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [EraserComponent, StampParamsComponent, PipetteParamsComponent, GridParamsComponent,
                            LineParamsComponent, BrushParamsComponent, PencilParamsComponent, ShapeParamsComponent,
                            SelectionParamsComponent, TextParamsComponent, PenToolParamsComponent, PaintBucketParamsComponent,
                            AirBrushParamsComponent, QuillParamsComponent],
        },
      });
    service = TestBed.get(SelectToolService);
    mouseControl = TestBed.get(MouseControlService);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['appendChild']);
  });

  it('#selectToolService and #mouseControlService should be created', () => {
    expect(service).toBeTruthy();
    expect(mouseControl).toBeTruthy();
  });

  it('#pencil should call #setChoice', () => {
    service['renderer'] = mockRenderer;
    spyOn(service, 'clearParams');
    spyOn(service, 'makeSelection');
    spyOn(mouseControl, 'setChoice');
    service.pencil();
    expect(mouseControl.setChoice).toHaveBeenCalledWith('pencil');
  });

  it('#brush should call #setChoice', () => {
    service['renderer'] = mockRenderer;
    spyOn(service, 'clearParams');
    spyOn(service, 'makeSelection');
    spyOn(mouseControl, 'setChoice');
    service.brush();
    expect(mouseControl.setChoice).toHaveBeenCalledWith('brush');
  });

  it('#colorApplicator should call #setChoice', () => {
    service['renderer'] = mockRenderer;
    spyOn(service, 'clearParams');
    spyOn(service, 'makeSelection');
    spyOn(mouseControl, 'setChoice');
    service.colorApplicator();
    expect(mouseControl.setChoice).toHaveBeenCalledWith('colorApplicator');
  });
  it('#rectangle should call #setChoice', () => {
    service['renderer'] = mockRenderer;
    spyOn(service, 'clearParams');
    spyOn(service, 'makeSelection');
    const shape = 'rectangle';
    spyOn(mouseControl, 'setChoice');
    service.rectangle();
    expect(mouseControl.setChoice).toHaveBeenCalledWith(shape);
  });

  it('#grid should call #setChoice', () => {
    service['renderer'] = mockRenderer;
    spyOn(service, 'clearParams');
    spyOn(service, 'makeSelection');
    spyOn(mouseControl, 'setChoice');
    service.grid();
    expect(mouseControl.setChoice).toHaveBeenCalledWith('grid');
  });

  it('#select should call #setChoice', () => {
    service['renderer'] = mockRenderer;
    spyOn(service, 'clearParams');
    spyOn(service, 'makeSelection');
    spyOn(mouseControl, 'setChoice');
    service.select();
    expect(mouseControl.setChoice).toHaveBeenCalledWith('select');
  });

  it('#line should call #setChoice', () => {
    service['renderer'] = mockRenderer;
    spyOn(service, 'clearParams');
    spyOn(service, 'makeSelection');
    spyOn(mouseControl, 'setChoice');
    service.line();
    expect(mouseControl.setChoice).toHaveBeenCalledWith('line');
  });

  it('#pipette should call #setChoice', () => {
    service['renderer'] = mockRenderer;
    spyOn(service, 'clearParams');
    spyOn(service, 'makeSelection');
    spyOn(mouseControl, 'setChoice');
    service.pipette();
    expect(mouseControl.setChoice).toHaveBeenCalledWith('pipette');
  });

  it('#stamp should call #setChoice', () => {
    service['renderer'] = mockRenderer;
    spyOn(service, 'clearParams');
    spyOn(service, 'makeSelection');
    spyOn(mouseControl, 'setChoice');
    service.stamp();
    expect(mouseControl.setChoice).toHaveBeenCalledWith('stamp');
  });

  it('#nothing should call #setChoice', () => {
    service['renderer'] = mockRenderer;
    spyOn(service, 'clearParams');
    spyOn(service, 'makeSelection');
    spyOn(mouseControl, 'setChoice');
    service.nothing();
    expect(mouseControl.setChoice).toHaveBeenCalledWith('');
  });

});
