import { TestBed } from '@angular/core/testing';

import { Renderer2 } from '@angular/core';
import { ColorToolProperties } from 'src/app/classes/colorToolProperties/color-tool-properties';
import { PipetteProperties } from 'src/app/classes/pipetteProperties/pipette-properties';
import { PipetteService } from '../pipette/pipette.service';

describe('PipetteService', () => {
  let service: PipetteService;
  let event: MouseEvent;
  let mockRenderer: jasmine.SpyObj<Renderer2>;
  let mockTarget: jasmine.SpyObj<HTMLElement>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [PipetteProperties, ColorToolProperties, Renderer2],
  });
    service = TestBed.get(PipetteService);
    event = new MouseEvent('mousedown', {clientX: 50, clientY: 50});
    mockRenderer = jasmine.createSpyObj('Renderer2', ['setAttribute']);
    mockTarget = jasmine.createSpyObj('HTMLElement', ['getAttribute', 'setAttribute']);
    mockRenderer.setAttribute.and.callThrough();
    mockTarget.getAttribute.and.callThrough();
    mockTarget.setAttribute.and.callThrough();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getSvgColor should set color if event.target.nodName === svg', () => {
    const valueStyle = 'backgroundColor: none';
    Object.defineProperty(event, 'target', {value: mockTarget});
    Object.defineProperty(mockTarget, 'nodeName', {value: 'svg'});
    Object.defineProperty(mockTarget, 'style', {value: valueStyle});
    service['renderer'] = mockRenderer;
    service.getSvgColor(event);
    expect(service['properties'].color).toBe('');
  });

  it('#getSvgColor should set color if event.target.nodName === path', () => {
    const valueStyle = 'stroke: none';
    Object.defineProperty(event, 'target', {value: mockTarget});
    Object.defineProperty(mockTarget, 'nodeName', {value: 'path'});
    Object.defineProperty(mockTarget, 'style', {value: valueStyle});
    service['renderer'] = mockRenderer;
    service.getSvgColor(event);
    expect(service['properties'].color).toBe('');
    expect(mockTarget.getAttribute).toHaveBeenCalled();
  });

  it('#getSvgColor should set xpos, ypos if event.target.nodName === rect', () => {
    Object.defineProperty(event, 'target', {value: mockTarget});
    Object.defineProperty(mockTarget, 'nodeName', {value: 'rect'});
    service['scrollDrawing']._ScrollX = 0;
    service['scrollDrawing']._ScrollY = 0;
    service['renderer'] = mockRenderer;
    spyOn(service, 'rangeRectangle');
    service.getSvgColor(event);
    expect(service['properties'].xPos).toBe(-270);
    expect(service['properties'].yPos).toBe(50);
    expect(service.rangeRectangle).toHaveBeenCalled();
  });

  it('#getSvgColor should set xpos, ypos if event.target.nodName === ellipse', () => {
    Object.defineProperty(event, 'target', {value: mockTarget});
    Object.defineProperty(mockTarget, 'nodeName', {value: 'ellipse'});
    service['scrollDrawing']._ScrollX = 0;
    service['scrollDrawing']._ScrollY = 0;
    service['renderer'] = mockRenderer;
    spyOn(service, 'rangeEllipse');
    service.getSvgColor(event);
    expect(service['properties'].xPos).toBe(-270);
    expect(service['properties'].yPos).toBe(50);
    expect(service.rangeEllipse).toHaveBeenCalled();
  });

  it('#getSvgColor should set xpos, ypos if event.target.nodName === polygon', () => {
    Object.defineProperty(event, 'target', {value: mockTarget});
    Object.defineProperty(mockTarget, 'nodeName', {value: 'polygon'});
    service['scrollDrawing']._ScrollX = 0;
    service['scrollDrawing']._ScrollY = 0;
    service['renderer'] = mockRenderer;
    spyOn(service, 'rangePolygon');
    service.getSvgColor(event);
    expect(service['properties'].xPos).toBe(-270);
    expect(service['properties'].yPos).toBe(50);
    expect(service.rangePolygon).toHaveBeenCalled();
  });

  it('#getSvgColor should change color if event.which === 1', () => {
    Object.defineProperty(event, 'target', {value: mockTarget});
    Object.defineProperty(event, 'which', {value: 1});
    Object.defineProperty(mockTarget, 'nodeName', {value: 'polygon'});
    service['renderer'] = mockRenderer;
    service.getSvgColor(event);
    expect(service.primaryColor).toEqual(service['properties'].color);
  });

  it('#getSvgColor should change color if event.which === 3 and call preventDefault', () => {
    Object.defineProperty(event, 'target', {value: mockTarget});
    Object.defineProperty(event, 'which', {value: 3});
    Object.defineProperty(mockTarget, 'nodeName', {value: 'polygon'});
    service['renderer'] = mockRenderer;
    spyOn(event, 'preventDefault');
    service.getSvgColor(event);
    expect(service.secondaryColor).toEqual(service['properties'].color);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('#rangeEllipse should change color if ellipseRange < 1', () => {
    mockTarget.getAttribute.and.returnValue('2');
    service['properties'].xPos = 2;
    service['properties'].yPos = 2;
    service.rangeEllipse(mockTarget);
    expect(service['properties'].color).toBe('2');
    expect(mockTarget.getAttribute).toHaveBeenCalledWith('fill');
  });

  it('#rangeRectangle should change color if ellipseRange < 1', () => {
    mockTarget.getAttribute.and.returnValue('2');
    service['properties'].xPos = 2;
    service['properties'].yPos = 2;
    service.rangeRectangle(mockTarget);
    expect(service['properties'].color).toBe('2');
    expect(mockTarget.getAttribute).toHaveBeenCalledWith('stroke');
  });

  it('#rangeEllipse should change color if ellipseRange > 1', () => {
    mockTarget.getAttribute.and.callThrough();
    service.rangeEllipse(mockTarget);
    expect(service['properties'].color).toBe('');
    expect(mockTarget.getAttribute).toHaveBeenCalledWith('stroke');
  });

  it('#rangeRectangle should change color', () => {
    service.rangeRectangle(mockTarget);
    expect(service['properties'].color).toBe('');
    expect(mockTarget.getAttribute).toHaveBeenCalledWith('fill');
  });

  it('#hitSides should return false', () => {
    const value = service.hitSides();
    expect(value).toBeFalsy();
  });

  it('#polygonCenter should rset centerX and centerY', () => {
    let mockPointsX: number[];
    let mockPointsY: number[];
    mockPointsX = [1, 2, 3];
    mockPointsY = [1, 2, 3];
    service.polygonCenter(mockPointsX, mockPointsY);
    expect(service['properties'].centerX).toBe(2);
    expect(service['properties'].centerY).toBe(2);
  });
});
