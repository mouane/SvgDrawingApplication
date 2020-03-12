import { TestBed } from '@angular/core/testing';

import { Renderer2 } from '@angular/core';
import { ColorToolProperties } from 'src/app/classes/colorToolProperties/color-tool-properties';
import { ContainerProperties } from 'src/app/classes/containerProperties/container-properties';
import { QuillProperties } from 'src/app/classes/quillProperties/quill-properties';
import { LINE_ATTRIBUTES } from 'src/app/enum';
import { QuillToolService } from './quill-tool.service';

describe('QuillToolService', () => {
  let service: QuillToolService;
  let mockRenderer: jasmine.SpyObj<Renderer2>;
  let mockSvgEl: jasmine.SpyObj<SVGElement>;
  let mockSvg: jasmine.SpyObj<SVGElement>;
  let eventMd: MouseEvent;
  let eventMw: WheelEvent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColorToolProperties, QuillProperties, ContainerProperties],
    });
    service = TestBed.get(QuillToolService);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['setAttribute', 'insertBefore', 'createElement']);
    mockSvg = jasmine.createSpyObj('Renderer2', ['setAttribute', 'contains']);
    mockSvgEl = jasmine.createSpyObj('Renderer2', ['setAttribute']);
    mockRenderer.setAttribute.and.callThrough();
    mockRenderer.createElement.and.returnValue(mockSvgEl);
    mockRenderer.insertBefore.and.callThrough();
    mockSvg.contains.and.callThrough();
    mockSvg.setAttribute.and.callThrough();
    mockSvgEl.setAttribute.and.callThrough();
    service['renderer'] = mockRenderer;
    eventMd = new MouseEvent('mousedown', {clientX: 50, clientY: 50});
    eventMw = new WheelEvent('mouseWheel');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#setAttrubutePath should set the attributes of the lines', () => {
    service['properties'].lines = mockSvgEl;
    service.setAttributesPath();
    expect(service['properties'].lines.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.STROKE, service['properties'].color);
    expect(service['properties'].lines.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.FILL, service['properties'].color);
    expect(service['properties'].lines.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.STROKE_WIDTH, LINE_ATTRIBUTES.NULL + 1);
  });

  it('#mouseUp should set hasStarted to false and tipSizeWithPreviousSpeed to tipMax', () => {
    service.mouseUp(eventMd);
    expect(service.isPath).toBeFalsy();
  });

  it('#mouseDown should create a subSvg and a path', () => {
    Object.defineProperty(eventMd, 'target', {value: mockSvg});
    Object.defineProperty(mockSvg, 'parentNode', {value: mockSvgEl});
    Object.defineProperty(mockSvgEl, 'nodeName', {value: ''});
    service.mouseDown(eventMd);
    expect(service['properties'].subSvg).not.toBeNull();
    expect(service['properties'].lines).not.toBeNull();
  });

  it('#mouseDown should call createContainer, findPoints, setPoints ans createLine', () => {
    spyOn(service['container'], 'createContainer');
    spyOn(service, 'findPoints');
    spyOn(service, 'createLine');
    spyOn(service, 'setPoints');
    service.mouseDown(eventMd);
    expect(service.createLine).toHaveBeenCalled();
    expect(service.setPoints).toHaveBeenCalled();
    expect(service.findPoints).toHaveBeenCalledWith(service.toRadian(service.angle));
    expect(service['container'].createContainer).toHaveBeenCalled();
  });

  it('#mouseDown should set x, y and isPath to true', () => {
    Object.defineProperty(eventMd, 'target', {value: mockSvg});
    Object.defineProperty(mockSvg, 'parentNode', {value: mockSvgEl});
    Object.defineProperty(mockSvgEl, 'nodeName', {value: ''});
    service['scrollDrawing']._ScrollX = 270;
    service['scrollDrawing']._ScrollY = 50;
    service.mouseDown(eventMd);
    expect(service['properties'].x).toBe(0);
    expect(service['properties'].y).toBe(100);
    expect(service.isPath).toBeTruthy();
  });

  it('#mouseMove should set x and y', () => {
    Object.defineProperty(eventMd, 'target', {value: mockSvg});
    service['scrollDrawing']._ScrollX = 270;
    service['scrollDrawing']._ScrollY = 50;
    service.isPath = true;
    service['properties'].subSvg = mockSvg;
    service.mouseMove(eventMd);
    expect(service['properties'].x).toBe(0);
    expect(service['properties'].y).toBe(100);
  });

  it('#mouseMove should call createContainer, findPoints, setPoints and appendLine', () => {
    spyOn(service['container'], 'appendLine');
    spyOn(service, 'findPoints');
    spyOn(service, 'createLine');
    spyOn(service, 'setPoints');
    service['properties'].subSvg = mockSvg;
    service.isPath = true;
    service.mouseMove(eventMd);
    expect(service.createLine).toHaveBeenCalled();
    expect(service.setPoints).toHaveBeenCalled();
    expect(service.findPoints).toHaveBeenCalledWith(service.toRadian(service.angle));
    expect(service['container'].appendLine).toHaveBeenCalledWith(mockSvg, mockSvgEl, service['renderer']);
  });

  it('#mouseMove should not call anything if isPath is false', () => {
    spyOn(service['container'], 'appendLine');
    spyOn(service, 'findPoints');
    spyOn(service, 'createLine');
    spyOn(service, 'setPoints');
    service['properties'].subSvg = mockSvg;
    service.isPath = false;
    service.mouseMove(eventMd);
    expect(service.createLine).not.toHaveBeenCalled();
    expect(service.setPoints).not.toHaveBeenCalled();
    expect(service.findPoints).not.toHaveBeenCalledWith(service.toRadian(service.angle));
    expect(service['container'].appendLine).not.toHaveBeenCalledWith(mockSvg, mockSvgEl, service['renderer']);
  });

  it('#mouseMove should create a new path', () => {
    service.isPath = true;
    service['properties'].subSvg = mockSvg;
    service.mouseMove(eventMd);
    expect(service['properties'].lines).not.toBeNull();
  });

  it('#toRadian should return angle in rad', () => {
    service.angle = 135;
    const newAngle = service.toRadian(service.angle);
    expect(newAngle).toBe(2.356194490192345);
  });

  it('#createLine should set line', () => {
    service['properties'].startLeftX = 1;
    service['properties'].startLeftY = 2;
    service['properties'].leftX = 1;
    service['properties'].leftY = 2;
    service['properties'].startRightX = 1;
    service['properties'].startRightY = 2;
    service['properties'].rightX = 1;
    service['properties'].rightY = 2;
    service.createLine();
    expect(service['properties'].line).toBe('1,2 1,2 1,2 1,2');
  });

  it('#setPoints should set startLeftX, startLeftY, startRightX and startRightY', () => {
    service['properties'].leftX = 1;
    service['properties'].leftY = 2;
    service['properties'].rightX = 1;
    service['properties'].rightY = 2;
    service.setPoints();
    expect(service['properties'].startLeftX).toBe(1);
    expect(service['properties'].startLeftY).toBe(2);
    expect(service['properties'].startRightX).toBe(1);
    expect(service['properties'].startRightY).toBe(2);
  });

  it('#incrementAngle should increment by 1 angle if altKey is pressed', () => {
    Object.defineProperty(eventMw, 'altKey', {value: true});
    service.angle = 0;
    service.incrementAngle(eventMw);
    expect(service.angle).toBe(1);
  });

  it('#incrementAngle should increment by 15 angle if altKey is not pressed', () => {
    Object.defineProperty(eventMw, 'altKey', {value: false});
    service.angle = 0;
    service.incrementAngle(eventMw);
    expect(service.angle).toBe(15);
  });

  it('#incrementAngle should emit angle', (done) => {
    service.angle = 0;
    service.rotation.subscribe((g: number) => {
      expect(g).toEqual(15);
      done();
   });
    service.incrementAngle(eventMw);
  });

  it('#decrementAngle should decrement by 1 angle if altKey is pressed', () => {
    Object.defineProperty(eventMw, 'altKey', {value: true});
    service.angle = 0;
    service.decrementAngle(eventMw);
    expect(service.angle).toBe(-1);
  });

  it('#decrementAngle should decrement by 15 angle if altKey is not pressed', () => {
    Object.defineProperty(eventMw, 'altKey', {value: false});
    service.angle = 0;
    service.decrementAngle(eventMw);
    expect(service.angle).toBe(-15);
  });

  it('#decrementAngle should emit angle', (done) => {
    service.angle = 0;
    service.rotation.subscribe((g: number) => {
      expect(g).toEqual(-15);
      done();
   });
    service.decrementAngle(eventMw);
  });

  it('#findPoints should set leftX, leftY, rightX and rightY if angle is 90', () => {
    service.angle = 90;
    service['properties'].x = 50;
    service['properties'].y = 50;
    service.findPoints(service.angle);
    expect(service['properties'].leftX).toBe(50);
    expect(service['properties'].leftY).toBe(35);
    expect(service['properties'].rightX).toBe(50);
    expect(service['properties'].rightY).toBe(65);
  });

  it('#findPoints should set leftX, leftY, rightX and rightY if angle is 90', () => {
    service.angle = 15;
    service['properties'].x = 50;
    service['properties'].y = 50;
    const opposite = (service.tip / 2) * Math.cos(service.angle);
    const adjacent = (service.tip / 2) * Math.sin(service.angle);
    service.findPoints(service.angle);
    expect(service['properties'].leftX).toBe(50 + opposite);
    expect(service['properties'].leftY).toBe(50 - adjacent);
    expect(service['properties'].rightX).toBe(50 - opposite);
    expect(service['properties'].rightY).toBe(50 + adjacent);
  });
});
