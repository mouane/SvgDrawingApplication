import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ExportDrawingProperties } from 'src/app/classes/exportDrawingProperties/exportDrawingProperties';
import { GridParamsComponent } from 'src/app/components/grid-params/grid-params.component';
import { GridConfigService } from 'src/app/services/grid-config/grid-config.service';
import { ExportDrawingFormatService } from './export-drawing-format.service';

describe('ExportDrawingFormatService', () => {
let service: ExportDrawingFormatService;
let mockSvg: jasmine.SpyObj<SVGElement>;
let mockRenderer: jasmine.SpyObj<Renderer2>;
beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [ExportDrawingProperties, ExportDrawingFormatService, GridParamsComponent, GridConfigService, {provide: Renderer2}],
  });
    mockSvg = jasmine.createSpyObj('SVGElement', ['getBoundingClientRect']);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['appendChild', 'setAttribute', 'createElement', 'removeChild']);
    mockRenderer.setAttribute.and.callThrough();
    service = TestBed.get(ExportDrawingFormatService);
});

it('should have svgBase64', () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  service['properties'].svg = svg;
  const begin = 'data:image/svg+xml;base64,';
  const expected = begin + btoa(new XMLSerializer().serializeToString(svg as Node));
  expect(service.svgBase64()).toEqual(expected);
});

it('should have attributes undefined', () => {
  expect(service['properties'].renderer).toBeUndefined();
  expect(service['properties'].svg).toBeUndefined();
  expect(service['properties'].drawingImage).toBeUndefined();
  expect(service['properties'].canvas).toBeUndefined();
  expect(service['properties'].context).toBeUndefined();
  expect(service['properties'].drawingFormat).toBeUndefined();
});

it('#loadImage should check image format', () => {
  const drawSpy = spyOn(service, 'drawingImageOnCanvas');
  const fakeFormat = 'bmp';
  service.loadImage(fakeFormat);
  expect(service['properties'].drawingFormat).toEqual(fakeFormat);
  expect(drawSpy).toHaveBeenCalled();
  });

it('#setCurrentRendererAndSVG should verify if received a renderer and an svg element as params', () => {
  service.setCurrentRendererAndSVG(mockRenderer, mockSvg);
  expect(service['properties'].renderer).toBe(mockRenderer);
  expect(service['properties'].svg).toBe(mockSvg);
});

it('#encodeDrawingImage should have encoded the image', () => {
    const drawingImage = document.createElement('img');
    const ref = new ElementRef(drawingImage);
    service['properties'].drawingImage = ref.nativeElement;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['properties'].svg = svg;
    spyOn(svg, 'getBoundingClientRect').and.returnValue({width: 0, height: 0, bottom: 0, left: 0, right: 0, top: 0});
    spyOn(service, 'svgBase64');
    service.encodeDrawingImage();
    expect(svg.getBoundingClientRect).toHaveBeenCalledTimes(2);
  });

it('should have drawingImageOnCanvas', () => {
  service['properties'].drawingImage = new Image();
  service['properties'].drawingImage.height = 30;
  service['properties'].drawingImage.width = 15;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  service['properties'].svg = svg;
  const begin = 'data:image/svg+xml;base64,';
  const source = begin + btoa(new XMLSerializer().serializeToString(svg as Node));
  service['properties'].drawingImage.src = source;
  service['properties'].renderer = mockRenderer;
  spyOn(service, 'encodeDrawingImage');
  spyOn(service, 'downloadDrawingImage');
  const canvas = document.createElement('canvas');
  mockRenderer.createElement.and.returnValue(canvas);
  spyOn(svg, 'getBoundingClientRect').and.returnValue({width: 0, height: 0, bottom: 0, left: 0, right: 0, top: 0});
  const context  = canvas.getContext('2d');
  spyOn(canvas, 'getContext').and.returnValue(context);
  service.drawingImageOnCanvas();
  expect(canvas.getContext).toHaveBeenCalled();
  expect(service.encodeDrawingImage).toHaveBeenCalled();
  expect(service['properties'].renderer.createElement).toHaveBeenCalled();
  expect(svg.getBoundingClientRect).toHaveBeenCalledTimes(2);
});

it('should have downloadDrawingImage svg format', () => {
  service['properties'].renderer = mockRenderer;
  const canvas = document.createElement('canvas');
  service['properties'].canvas = canvas;
  mockRenderer.createElement.and.returnValue(canvas);
  spyOn(service, 'svgBase64');
  const imageFormat = 'svg';
  const gridService = TestBed.get(GridConfigService);
  const updateSpyService = spyOn(gridService, 'updateGrid');
  service['properties'].drawingFormat = imageFormat;
  const download = 'document.' + imageFormat;
  const anchorElement = document.createElement('a');
  anchorElement.href = canvas.toDataURL('image/' + imageFormat);
  mockRenderer.createElement.and.returnValue(anchorElement);
  spyOn(anchorElement, 'click');
  service.downloadDrawingImage();
  expect(updateSpyService).toHaveBeenCalled();
  expect(mockRenderer.createElement).toHaveBeenCalled();
  expect(service['properties']['renderer'].appendChild).toHaveBeenCalledTimes(1);
  expect(service.svgBase64).toHaveBeenCalled();
  expect(anchorElement.download).toEqual(download);
  expect(anchorElement.click).toHaveBeenCalled();
  expect(mockRenderer.removeChild).toHaveBeenCalled();
});

it('should have downloadDrawingImage svg format', () => {
  service['properties'].renderer = mockRenderer;
  const canvas = document.createElement('canvas');
  service['properties'].canvas = canvas;
  mockRenderer.createElement.and.returnValue(canvas);
  spyOn(service, 'svgBase64');
  const imageFormat = 'svg';
  const gridService = TestBed.get(GridConfigService);
  const updateSpyService = spyOn(gridService, 'updateGrid');
  gridService.gridActivated = true;
  const gridComponent = TestBed.get(GridParamsComponent);
  const updateSpyComponent = spyOn(gridComponent, 'updateGrid');
  service['properties'].drawingFormat = imageFormat;
  const download = 'document.' + imageFormat;
  const anchorElement = document.createElement('a');
  anchorElement.href = canvas.toDataURL('image/' + imageFormat);
  mockRenderer.createElement.and.returnValue(anchorElement);
  spyOn(anchorElement, 'click');
  service.downloadDrawingImage();
  expect(updateSpyService).toHaveBeenCalled();
  expect(updateSpyComponent).toHaveBeenCalled();
  expect(mockRenderer.createElement).toHaveBeenCalled();
  expect(service['properties']['renderer'].appendChild).toHaveBeenCalledTimes(1);
  expect(service.svgBase64).toHaveBeenCalled();
  expect(anchorElement.download).toEqual(download);
  expect(anchorElement.click).toHaveBeenCalled();
  expect(mockRenderer.removeChild).toHaveBeenCalled();
});

it('should have downloadDrawingImage other formats', () => {
  service['properties'].renderer = mockRenderer;
  const canvas = document.createElement('canvas');
  service['properties'].canvas = canvas;
  mockRenderer.createElement.and.returnValue(canvas);
  const imageFormat = 'png';
  service['properties'].drawingFormat = imageFormat;
  const download = 'image.' + imageFormat;
  const anchorElement = document.createElement('a');
  anchorElement.href = canvas.toDataURL('image/' + imageFormat);
  mockRenderer.createElement.and.returnValue(anchorElement);
  spyOn(anchorElement, 'click');
  service.downloadDrawingImage();
  expect(mockRenderer.createElement).toHaveBeenCalled();
  expect(service['properties']['renderer'].appendChild).toHaveBeenCalledTimes(1);
  expect(anchorElement.download).toEqual(download);
  expect(anchorElement.click).toHaveBeenCalled();
  expect(mockRenderer.removeChild).toHaveBeenCalled();
});
 });
