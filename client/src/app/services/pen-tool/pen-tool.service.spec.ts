import { TestBed } from '@angular/core/testing';

import { Renderer2 } from '@angular/core';
import { ColorToolProperties } from 'src/app/classes/colorToolProperties/color-tool-properties';
import { EraserProperties } from 'src/app/classes/eraserProperties/eraser-properties';
import { PenToolProperties } from 'src/app/classes/penProperties/pen-properties';
import { LINE_ATTRIBUTES, LINE_TYPE } from 'src/app/enum';
import { PenToolService } from './pen-tool.service';

describe('PenToolService', () => {
  let service: PenToolService;
  let mockRenderer: jasmine.SpyObj<Renderer2>;
  let mockSvgEl: jasmine.SpyObj<SVGElement>;
  let mockPath: jasmine.SpyObj<SVGElement>;
  let mockSvg: jasmine.SpyObj<SVGElement>;
  let eventMd: MouseEvent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColorToolProperties, PenToolProperties, EraserProperties],
    });
    service = TestBed.get(PenToolService);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['setAttribute', 'createElement', 'insertBefore']);
    mockSvgEl = jasmine.createSpyObj('SVGElement', ['setAttribute', 'contains']);
    mockPath = jasmine.createSpyObj('SVGElement', ['setAttribute']);
    mockSvg = jasmine.createSpyObj('SVGElement', ['setAttribute']);
    mockRenderer.setAttribute.and.callThrough();
    mockRenderer.createElement.and.returnValue(mockPath);
    mockRenderer.insertBefore.and.callThrough();
    mockSvgEl.setAttribute.and.callThrough();
    mockSvgEl.contains.and.callThrough();
    mockPath.setAttribute.and.callThrough();
    mockSvg.setAttribute.and.callThrough();
    eventMd = new MouseEvent('mousedown', {clientX: 50, clientY: 50});
    service['renderer'] = mockRenderer;
});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#_TipMax should set value to service.tipMax', () => {
    const value = 5;
    service._TipMax = value;
    expect(service['properties'].tipMax).toBe(value);
  });

  it('#_TipMin should set value to service.tipMin', () => {
    const value = 5;
    service._TipMin = value;
    expect(service['properties'].tipMin).toBe(value);
  });

  it('#smoothLine should multiply tipWithSpeedCurrent with 0.90', () => {
    const current = 5;
    const previous = 10;
    service['properties'].tipSizeWithSpeedCurrent = current;
    service['properties'].tipSizeWithSpeedPrevious = previous;
    service.smoothLine();
    expect(service['properties'].tipSizeWithSpeedCurrent).toBe(service['properties'].tipSizeWithSpeedPrevious * 0.90);
  });

  it('#createPath should create a path and set the coordinate for pathX/pathY', () => {
    service['renderer'] = mockRenderer;
    service['scrollDrawing']._ScrollX = 270;
    service['scrollDrawing']._ScrollY = 50;
    service.createPath(eventMd);
    expect(service['properties'].pathX).toBe(0);
    expect(service['properties'].pathY).toBe(100);
    expect(service['properties'].lines).toBe(mockPath);
  });

  it('#createPath should set the attribute of the linePath', () => {
    service['renderer'] = mockRenderer;
    service['scrollDrawing']._ScrollX = 270;
    service['scrollDrawing']._ScrollY = 50;
    service.createPath(eventMd);
    expect(service['properties'].linePath).toBe(LINE_ATTRIBUTES.M + service['properties'].pathX +
      LINE_ATTRIBUTES.COMMA + service['properties'].pathY);
    expect(service['properties'].lines.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.D, service['properties'].linePath);
  });

  it('#findCursorSpeed should set timeStamp equal to timePresent', () => {
    service['scrollDrawing']._ScrollX = 270;
    service['scrollDrawing']._ScrollY = 50;
    service.findCursorSpeed(eventMd);
    expect(service['properties'].timeStamp).toEqual(service['properties'].timePresent);
    expect(service['properties'].differenceX).toBe(0);
    expect(service['properties'].differenceY).toBe(0);
  });

  it('#findCursorSpeed should set differenceX/Y with designated last position', () => {
    service['properties'].timeStamp = 1;
    service['properties'].lastMouseX = 0;
    service['properties'].lastMouseY = 0;
    service['scrollDrawing']._ScrollX = 320;
    service['scrollDrawing']._ScrollY = 50;
    service.findCursorSpeed(eventMd);
    expect(service['properties'].differenceX).toBe(50);
    expect(service['properties'].differenceY).toBe(100);
    expect(service['properties'].speedX).toBeCloseTo(0);
    expect(service['properties'].speedY).toBeCloseTo(0);
  });

  it('#setAttrubutePath should set the attributes of the lines', () => {
    service['properties'].lines = mockSvgEl;
    service.setAttributesPath();
    expect(service['properties'].lines.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.STROKE, service['properties'].color);
    expect(service['properties'].lines.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.FILL, LINE_ATTRIBUTES.NONE);
    expect(service['properties'].lines.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.STROKE_WIDTH, LINE_ATTRIBUTES.NULL + service['properties'].tipMax);
    expect(service['properties'].lines.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.STROKE_LINECAP, LINE_TYPE.ROUND);
    expect(service['properties'].lines.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.STROKE_LINEJOIN, LINE_TYPE.ROUND);
  });

  it('#setAttributeCircle should set the attributes of circle', () => {
    service['properties'].circle = mockSvgEl;
    service.setAttributesCircle();
    expect(service['properties'].circle.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.CX,
      LINE_ATTRIBUTES.NULL + service['properties'].circleX);
    expect(service['properties'].circle.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.CY,
      LINE_ATTRIBUTES.NULL + service['properties'].circleY);
    expect(service['properties'].circle.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.FILL, service['properties'].color);
    expect(service['properties'].circle.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.R,
      LINE_ATTRIBUTES.NULL + service['properties'].tipMax / 2);
  });

  it('#mouseUp should set hasStarted to false and tipSizeWithPreviousSpeed to tipMax', () => {
    service.mouseUp(eventMd);
    expect(service['properties'].hasStarted).toBeFalsy();
    expect(service['properties'].tipSizeWithSpeedPrevious).toEqual(service['properties'].tipMax);
  });

  it('#mouseDown should create a subSvg, a circle and a path', () => {
    Object.defineProperty(eventMd, 'target', {value: mockSvg});
    Object.defineProperty(mockSvg, 'parentNode', {value: mockSvgEl});
    Object.defineProperty(mockSvgEl, 'nodeName', {value: ''});
    service.mouseDown(eventMd);
    expect(service['properties'].subSvg).not.toBeNull();
    expect(service['properties'].lines).not.toBeNull();
    expect(service['properties'].circle).not.toBeNull();
  });

  it('#mouseDown should set coordinates of start and circle to pathX/Y and call setAttributesCircle', () => {
    Object.defineProperty(eventMd, 'target', {value: mockSvg});
    Object.defineProperty(mockSvg, 'parentNode', {value: mockSvgEl});
    Object.defineProperty(mockSvgEl, 'nodeName', {value: ''});
    spyOn(service, 'setAttributesCircle');
    service.mouseDown(eventMd);
    expect(service['properties'].startX).toBe(service['properties'].pathX);
    expect(service['properties'].startY).toBe(service['properties'].pathY);
    expect(service['properties'].circleX).toBe(service['properties'].pathX);
    expect(service['properties'].circleY).toBe(service['properties'].pathY);
    expect(service.setAttributesCircle).toHaveBeenCalled();
  });

  describe('PenToolService', () => {
    beforeEach(() => {
      service['properties'].hasStarted = true;
      service['properties'].circle = mockSvgEl;
      service['properties'].lines = mockSvgEl;
      service['properties'].subSvg = mockSvg;
      service['properties'].timeStamp = 1;
      service['properties'].lastMouseX = 0;
      service['properties'].lastMouseY = 0;
      service['scrollDrawing']._ScrollX = 320;
      service['scrollDrawing']._ScrollY = 50;
      });
    it('#mouseMove should set tipSizeWithSpeedCurrent and create a lines', () => {
      service.mouseMove(eventMd);
      expect(service['properties'].lines).not.toBeNull();
      expect(service['properties'].tipSizeWithSpeedCurrent).toBe(service['properties'].tipMax -
        (Math.max(Math.abs(service['properties'].speedX), Math.abs(service['properties'].speedY)) / 12));
    });

    it('#mouseMove should set the attributes of lines and set tipSizeWithSpeedPrevious to tipSizeWithSpeedCurrent', () => {
      service.mouseMove(eventMd);
      expect(service['properties'].lines.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.D, service['properties'].linePath);
      expect(service['properties'].lines.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.STROKE_WIDTH, LINE_ATTRIBUTES.NULL + service['properties'].tipSizeWithSpeedCurrent);
      expect(service['properties'].circle.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.R, LINE_ATTRIBUTES.ZERO);
      expect(service['properties'].tipSizeWithSpeedPrevious).toEqual(service['properties'].tipSizeWithSpeedCurrent);
    });

    it('#mouseMove should not do anything if hasStarted is false', () => {
      service['properties'].hasStarted = false;
      spyOn(service, 'smoothLine');
      spyOn(service, 'findCursorSpeed');
      service.mouseMove(eventMd);
      expect(service.smoothLine).not.toHaveBeenCalled();
      expect(service.findCursorSpeed).not.toHaveBeenCalled();
    });
  });
});
