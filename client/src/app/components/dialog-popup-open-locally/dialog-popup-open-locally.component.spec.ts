import { HttpClient, HttpHandler } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrushProperties } from 'src/app/classes/brushProperties/brush-properties';
import { ColorToolProperties } from 'src/app/classes/colorToolProperties/color-tool-properties';
import { EraserProperties } from 'src/app/classes/eraserProperties/eraser-properties';
import { LineProperties } from 'src/app/classes/lineProperties/line-properties';
import { OpenDrawingProperties } from 'src/app/classes/openDrawingProperties/open-drawing-properties';
import { PencilProperties } from 'src/app/classes/pencilProperties/pencil-properties';
import { PenToolProperties } from 'src/app/classes/penProperties/pen-properties';
import { PipetteProperties } from 'src/app/classes/pipetteProperties/pipette-properties';
import { ShapeProperties } from 'src/app/classes/shapeProperties/shape-properties';
import { StampSelectorProperties } from 'src/app/classes/stampProperties/stamp-properties';
import { SvgSelectorProperties } from 'src/app/classes/svgSelectorProperties/svg-properties';
import { SvgShapeElements } from 'src/app/classes/svgShapeElements/svg-shape-elements';
import { TextProperties } from 'src/app/classes/textProperties/textProperties';
import { SelectionParamsComponent } from '../selection-params/selection-params.component';
import { DialogPopupOpenLocallyComponent } from './dialog-popup-open-locally.component';

describe('DialogPopupOpenLocallyComponent', () => {
  let component: DialogPopupOpenLocallyComponent;
  let fixture: ComponentFixture<DialogPopupOpenLocallyComponent>;
  let debugElement: DebugElement;
  const mockDialogRef = {
    close: jasmine.createSpy('close'),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPopupOpenLocallyComponent ],
      providers: [HttpClient, HttpHandler, ColorToolProperties, ShapeProperties, SvgShapeElements,
        PenToolProperties, PipetteProperties, LineProperties, StampSelectorProperties, SvgSelectorProperties, PencilProperties,
        LineProperties, TextProperties, BrushProperties, OpenDrawingProperties, SelectionParamsComponent, EraserProperties,
        { provide: MatDialogRef, useValue: mockDialogRef, }],
      imports: [MatDialogModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPopupOpenLocallyComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#readUrl should be called when chosen an input file', () => {
    spyOn(component, 'readUrl').and.callThrough();

    const changeEvent = new Event('change');

    const input = debugElement.query(By.css('#input'));
    const inputElement = input.nativeElement;
    inputElement.dispatchEvent(changeEvent);

    expect(component.readUrl).toHaveBeenCalledWith(changeEvent);
  });

  it('#loadCallback should call formatContent when content file is not null', () => {
    spyOn(component, 'formatContent').and.callThrough();
    const result = jasmine.createSpyObj('result', ['readAsText']);
    const reader = { result } as FileReader;
    const mockFile = new File(['908,1340,rgb(255, 255, 255),<rect _ngcontent-ese-c3="" height="100%" width="100%" fill="url(#grid)" id="grid" style="pointer-events: none;"></rect>'], 'filename', { type: 'text/' });

    const callback: () => void = component.loadCallback(reader, mockFile.name);
    callback();

    expect(reader.result).not.toBeNull();
    expect(component.formatContent).toHaveBeenCalled();
  });

  it('#readUrl should only target files', () => {
    spyOn(component, 'loadCallback').and.callThrough();

    const changeEvent = new Event('change');
    const input = debugElement.query(By.css('#input'));
    const inputElement = input.nativeElement;
    inputElement.dispatchEvent(changeEvent);

    component.readUrl(changeEvent);
    expect(inputElement.files).toBeTruthy();
  });

  it('#readUrl should always call loadCallback', () => {
    spyOn(component, 'loadCallback').and.callThrough();
    const mockFile = new File([''], 'filename', { type: 'text/' });
    const mockEventTarget = { target: { files: [mockFile] } };
    const mockReader: FileReader = jasmine.createSpyObj('FileReader', ['readAsText', 'onload']);

    spyOn(window as any, 'FileReader').and.returnValue(mockReader);

    component.readUrl(mockEventTarget);

    expect(component.loadCallback).toHaveBeenCalledWith(mockReader, mockFile.name);
  });

  it('#formatContent should call createDrawingObject with the correct parameters', () => {
    spyOn(component, 'createDrawingObject').and.callThrough();

    const mockfileContent = '908,1340,rgb(255, 255, 255),<rect _ngcontent-ese-c3="" height="100%" width="100%" fill="url(#grid)" id="grid" style="pointer-events: none;"></rect>';
    const mockfileName = 'drawing1';
    const mockMainSvgAttr = ['908', '1340', 'rgb(255, 255, 255)'];
    const mockSvgChildAttr = ['<rect _ngcontent-ese-c3="" height="100%" width="100%" fill="url(#grid)" id="grid" style="pointer-events: none;"></rect>'];

    component.formatContent(mockfileContent, mockfileName);
    expect(component.createDrawingObject).toHaveBeenCalledWith(mockMainSvgAttr, mockSvgChildAttr, mockfileName);
  });

  it('#loadDrawing should close dialog if a valid file was chosen', () => {
    spyOn(component, 'dialogClose').and.callThrough();

    component['openDrawingService'].errorFound(false);

    component.loadDrawing();
    expect(component.dialogClose).toHaveBeenCalled();
  });

  it('#loadDrawing should set drawingExist to true if a valid file was chosen because a drawing is displayed', () => {
    spyOn(component, 'dialogClose').and.callThrough();

    component['openDrawingService'].errorFound(false);

    component.loadDrawing();
    expect(component['toolBoxProperties'].drawingExist).toBe(true);
  });

  it('#loadDrawing should not close dialog if an invalid file was chosen', () => {
    spyOn(component, 'dialogClose').and.callThrough();

    component['openDrawingService'].errorFound(true);

    component.loadDrawing();
    expect(component.dialogClose).not.toHaveBeenCalled();
  });

  it('#loadDrawing, if drawingExist was initally false, should not set drawingExist to true if an invalid file was chosen', () => {
    spyOn(component, 'dialogClose').and.callThrough();

    component['toolBoxProperties'].drawingExist = false;
    component['openDrawingService'].errorFound(true);

    component.loadDrawing();
    expect(component['toolBoxProperties'].drawingExist).toBe(false);
  });

});
