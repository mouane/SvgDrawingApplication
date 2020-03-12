import {  TestBed } from '@angular/core/testing';
import { ColorToolProperties } from 'src/app/classes/colorToolProperties/color-tool-properties';
import { ShapeProperties } from 'src/app/classes/shapeProperties/shape-properties';
import { SvgShapeElements } from 'src/app/classes/svgShapeElements/svg-shape-elements';
import { ColorToolService } from '../color-tool/color-tool.service';
import { ShapeToolService } from './shape-tool.service';

describe('ShapeToolService', () => {
  let service: ShapeToolService;
  let colorService: ColorToolService;
  let mockRect: jasmine.SpyObj<SVGElement>;
  let mockSVG: jasmine.SpyObj<SVGElement>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShapeToolService, ColorToolService, ShapeProperties, ColorToolProperties, SvgShapeElements],
    });
    service = TestBed.get(ShapeToolService);
    colorService = TestBed.get(ColorToolService);
    mockSVG = jasmine.createSpyObj('SVGElement', ['setAttribute']);
    mockSVG.setAttribute.and.callThrough();
    mockRect = jasmine.createSpyObj('SVGElement', ['setAttribute']);
    mockRect.setAttribute.and.callThrough();
  });

  it('#shapeToolService, #ColorToolService should be created', () => {
    expect(service).toBeTruthy();
    expect(colorService).toBeTruthy();
  });

  it('#thickness should return strokethickness', () => {
    const thickness: number = (12);
    service.thickness(thickness);
    expect(service['properties'].strokethickness).toBe(thickness);
  });

  it('#traceType should switch the color with type=stroke', () => {
    const isClicked = true;
    const type = 'stroke';
    service.traceType(type, isClicked);
    expect(service['properties'].stroke).toBe(service['properties'].secondaryColor);
    expect(service['properties'].fill).toBe('transparent');
  });

  it('#traceType should switch the fill with type=fill', () => {
    const isClicked = true;
    const type = 'fill';
    service.traceType(type, isClicked);
    expect(service['properties'].stroke).toBe('none');
    expect(service['properties'].fill).toBe(service['properties'].primaryColor);
  });
  it('#traceType should switch the fill and color with type=fillStroke', () => {
    const isClicked = true;
    const type = 'fillStroke';
    service.traceType(type, isClicked);
    expect(service['properties'].stroke).toBe(service['properties'].secondaryColor);
    expect(service['properties'].fill).toBe(service['properties'].primaryColor);
  });

  it('#traceType should not switch if clicked is false', () => {
    const isClicked = false;
    const type = 'fillStroke';
    service.traceType(type, isClicked);
    expect(service['properties'].stroke).toBeDefined();
    expect(service['properties'].fill).toBeDefined();
  });

  it('#end should set drag to false', () => {
    const eventDown = new MouseEvent('mousedown', {clientX: 50, clientY: 50});
    service['properties'].drag = true;
    service.mouseUp(eventDown);
    expect(service['properties'].drag).toBe(false);
  });

  it('#plotShape should setAttribute if drag, click and shiftKey are true and the if inside is true', () => {
    const eventDown = new MouseEvent('mousedown', {clientX: 50, clientY: 50, shiftKey: true});
    service['properties'].drag = true;
    service['properties'].click = true;
    service['properties'].x1 = 5;
    service['properties'].y1 = 55;
    service['svgShape'].rectangle = mockRect;
    service.plotShape(eventDown);
    expect(mockRect.setAttribute).toHaveBeenCalledTimes(14);
  });

  it('#plotShape should setAttribute if drag, click and shiftKey are true and the if inside is false', () => {
    const eventDown = new MouseEvent('mousedown', {clientX: 50, clientY: 50, shiftKey: true});
    service['properties'].drag = true;
    service['properties'].click = true;
    service['properties'].x1 = 55;
    service['properties'].y1 = 55;
    service['svgShape'].rectangle = mockRect;
    service.plotShape(eventDown);
    expect(mockRect.setAttribute).toHaveBeenCalledTimes(14);
  });

  it('#plotShape should setAttribute if drag and click are true, shiftKey is false', () => {
    const eventDown = new MouseEvent('mousedown', {clientX: -5, clientY: 50, shiftKey: false});
    service['properties'].drag = true;
    service['properties'].click = true;
    service['svgShape'].rectangle = mockRect;
    service.plotShape(eventDown);
    expect(mockRect.setAttribute).toHaveBeenCalledTimes(7);
  });

  it('#plotShape should setAttribute if drag is true, click and shiftKey are false', () => {
    const eventDown = new MouseEvent('mousedown', {clientX: -5, clientY: 50, shiftKey: false});
    service['properties'].drag = true;
    service['properties'].click = false;
    service['svgShape'].rectangle = mockRect;
    service.plotShape(eventDown);
    expect(mockRect.setAttribute).toHaveBeenCalledTimes(7);
  });

  it('#plotShape should not setAttribute if drag is false', () => {
    const eventDown = new MouseEvent('mousedown', {clientX: -5, clientY: 50, shiftKey: false});
    service['properties'].drag = false;
    service['svgShape'].rectangle = mockRect;
    service.plotShape(eventDown);
    expect(mockRect.setAttribute).not.toHaveBeenCalled();
  });

  it('#plotShape should setAttribute if drag, shiftKey are true(fakeW>0, fakeH>0))', () => {
    const eventDown = new MouseEvent('mousedown', {clientX: 50, clientY: 50, shiftKey: true});
    service['properties'].drag = true;
    service['properties'].click = true;
    service['properties'].x1 = 45;
    service['properties'].y1 = 45;
    service['svgShape'].rectangle = mockRect;
    service.plotShape(eventDown);
    expect(mockRect.setAttribute).toHaveBeenCalledTimes(14);
  });

  it('#plotShape should setAttribute if drag, shiftKey are true(fakeW<0, fakeH<0))', () => {
    const eventDown = new MouseEvent('mousedown', {clientX: 50, clientY: 50, shiftKey: true});
    service['properties'].drag = true;
    service['properties'].click = true;
    service['properties'].x1 = 55;
    service['properties'].y1 = 5;
    service['svgShape'].rectangle = mockRect;
    service.plotShape(eventDown);
    expect(mockRect.setAttribute).toHaveBeenCalledTimes(14);
  });

  it('constructor should set primaryColor and secondaryColor', () => {
    expect(service['properties'].primaryColor).toBe(colorService.Fill);
    expect(service['properties'].secondaryColor).toBe(colorService.Outline);
  });
});
