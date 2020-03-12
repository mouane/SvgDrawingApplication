import { TestBed } from '@angular/core/testing';

import { Renderer2 } from '@angular/core';
import { ResizeProperties } from 'src/app/classes/resizeProperties/resize-properties';
import { ResizeSvgService } from './resize-svg.service';

describe('ResizeSvgService', () => {
  let service: ResizeSvgService;
  let mockRenderer: jasmine.SpyObj<Renderer2>;
  let mockSvga: jasmine.SpyObj<SVGAElement>;
  let mockDom: jasmine.SpyObj<DOMRect>;
  let mockHtml: jasmine.SpyObj<HTMLElement>;
  let eventMd: MouseEvent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResizeProperties],
    });
    service = TestBed.get(ResizeSvgService);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['setAttribute']);
    mockSvga = jasmine.createSpyObj('SVGAElement', ['getBBox']);
    mockDom = jasmine.createSpyObj('DOMRect', ['']);
    mockHtml = jasmine.createSpyObj('HTMLElement', ['getAttribute']);
    eventMd = new MouseEvent('mousedown', {clientX: 50, clientY: 50});
    mockSvga.getBBox.and.returnValue(mockDom);
    mockRenderer.setAttribute.and.callThrough();
    service['properties'].renderer = mockRenderer;
    Object.defineProperties(mockDom, {height: {value: 50}, width: {value: 50}});
    mockDom.y = 50;
    mockDom.x = 50;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#initResizing should call setScalingValue, setTranslationValues', () => {
    Object.defineProperty(eventMd, 'target', {value: mockHtml});
    spyOn(service, 'setScalingValues');
    spyOn(service, 'setTranslationValues');
    service.initResizing(eventMd, (mockSvga as SVGElement));
    expect(service.setScalingValues).toHaveBeenCalled();
    expect(service.setTranslationValues).toHaveBeenCalled();
  });

  it('#initResizing should set refX, refY, shiftneable and isFirstScale', () => {
    Object.defineProperty(eventMd, 'target', {value: mockHtml});
    service.initResizing(eventMd, (mockSvga as SVGElement));
    expect(service['properties'].refX).toBe(50);
    expect(service['properties'].refY).toBe(50);
    expect(service['properties'].isFirstScale).toBeTruthy();
    expect(service['properties'].shiftenable).toBeFalsy();
  });
  it('#initResizing should set bboxSelect and controlPoint', () => {
    Object.defineProperty(eventMd, 'target', {value: mockHtml});
    Object.defineProperty(mockHtml, 'id', {value: 'test'});
    service.initResizing(eventMd, (mockSvga as SVGElement));
    expect(service['properties'].bboxSelect).toBe(mockDom);
    expect(service['properties'].controlPoint).toBe('test');
  });

  describe('SetScalingValues', () => {
    beforeEach(() => {
      service['properties'].bboxSelect = mockDom;
      service['properties'].refX = 0;
      service['properties'].refY = 0;
    });

    it('#setScalingValues should set attributes when controlPoint === topLeft', () => {
      service['properties'].controlPoint = 'topLeft';
      service.setScalingValues();
      expect(service['properties'].scaleXenable).toBeTruthy();
      expect(service['properties'].scaleYenable).toBeTruthy();
      expect(service['properties'].isMirrorX).toBeFalsy();
      expect(service['properties'].isMirrorY).toBeFalsy();
      expect(service['properties'].refX).toBe(50);
      expect(service['properties'].refY).toBe(50);
    });

    it('#setScalingValues should set attributes when controlPoint === topCenter', () => {
      service['properties'].controlPoint = 'topCenter';
      service.setScalingValues();
      expect(service['properties'].scaleXenable).toBeFalsy();
      expect(service['properties'].scaleYenable).toBeTruthy();
      expect(service['properties'].isMirrorY).toBeFalsy();
      expect(service['properties'].refY).toBe(50);
    });

    it('#setScalingValues should set attributes when controlPoint === topRight', () => {
      service['properties'].controlPoint = 'topRight';
      service.setScalingValues();
      expect(service['properties'].scaleXenable).toBeTruthy();
      expect(service['properties'].scaleYenable).toBeTruthy();
      expect(service['properties'].isMirrorX).toBeTruthy();
      expect(service['properties'].isMirrorY).toBeFalsy();
      expect(service['properties'].refX).toBe(-50);
      expect(service['properties'].refY).toBe(50);
    });

    it('#setScalingValues should set attributes when controlPoint === centerLeft', () => {
      service['properties'].controlPoint = 'centerLeft';
      service.setScalingValues();
      expect(service['properties'].scaleXenable).toBeTruthy();
      expect(service['properties'].scaleYenable).toBeFalsy();
      expect(service['properties'].isMirrorX).toBeFalsy();
      expect(service['properties'].refX).toBe(50);
    });

    it('#setScalingValues should set attributes when controlPoint === centerRight', () => {
      service['properties'].controlPoint = 'centerRight';
      service.setScalingValues();
      expect(service['properties'].scaleXenable).toBeTruthy();
      expect(service['properties'].scaleYenable).toBeFalsy();
      expect(service['properties'].isMirrorX).toBeTruthy();
      expect(service['properties'].refX).toBe(-50);
    });

    it('#setScalingValues should set attributes when controlPoint === bottomLeft', () => {
      service['properties'].controlPoint = 'bottomLeft';
      service.setScalingValues();
      expect(service['properties'].scaleXenable).toBeTruthy();
      expect(service['properties'].scaleYenable).toBeTruthy();
      expect(service['properties'].isMirrorX).toBeFalsy();
      expect(service['properties'].isMirrorY).toBeTruthy();
      expect(service['properties'].refX).toBe(50);
      expect(service['properties'].refY).toBe(-50);
    });

    it('#setScalingValues should set attributes when controlPoint === bottomCenter', () => {
      service['properties'].controlPoint = 'bottomCenter';
      service.setScalingValues();
      expect(service['properties'].scaleXenable).toBeFalsy();
      expect(service['properties'].scaleYenable).toBeTruthy();
      expect(service['properties'].isMirrorY).toBeTruthy();
      expect(service['properties'].refY).toBe(-50);
    });

    it('#setScalingValues should set attributes when controlPoint === bottomRight', () => {
      service['properties'].controlPoint = 'bottomRight';
      service.setScalingValues();
      expect(service['properties'].scaleXenable).toBeTruthy();
      expect(service['properties'].scaleYenable).toBeTruthy();
      expect(service['properties'].isMirrorX).toBeTruthy();
      expect(service['properties'].isMirrorY).toBeTruthy();
      expect(service['properties'].refX).toBe(-50);
      expect(service['properties'].refY).toBe(-50);
    });
  });

  describe('SetTranslationValues', () => {
    beforeEach(() => {
      service['properties'].bboxSelect = mockDom;
      service['properties'].translateX = '';
      service['properties'].translateY = '';
    });

    it('#setTranslationValues should set attributes when controlPoint === topLeft', () => {
      service['properties'].controlPoint = 'topLeft';
      service.setTranslationValues();
      expect(service['properties'].translateX).toBe('95.25');
      expect(service['properties'].translateY).toBe('97');
    });

    it('#setTranslationValues should set attributes when controlPoint === topCenter', () => {
      service['properties'].controlPoint = 'topCenter';
      service.setTranslationValues();
      expect(service['properties'].translateX).toBe('0');
      expect(service['properties'].translateY).toBe('97');
    });

    it('#setTranslationValues should set attributes when controlPoint === topRight', () => {
      service['properties'].controlPoint = 'topRight';
      service.setTranslationValues();
      expect(service['properties'].translateX).toBe('52.25');
      expect(service['properties'].translateY).toBe('97');
    });

    it('#setTranslationValues should set attributes when controlPoint === centerLeft', () => {
      service['properties'].controlPoint = 'centerLeft';
      service.setTranslationValues();
      expect(service['properties'].translateX).toBe('95.25');
      expect(service['properties'].translateY).toBe('0');
    });

    it('#setTranslationValues should set attributes when controlPoint === centerRight', () => {
      service['properties'].controlPoint = 'centerRight';
      service.setTranslationValues();
      expect(service['properties'].translateX).toBe('52.25');
      expect(service['properties'].translateY).toBe('0');
    });

    it('#setTranslationValues should set attributes when controlPoint === bottomLeft', () => {
      service['properties'].controlPoint = 'bottomLeft';
      service.setTranslationValues();
      expect(service['properties'].translateX).toBe('95.25');
      expect(service['properties'].translateY).toBe('54');
    });

    it('#setTranslationValues should set attributes when controlPoint === bottomCenter', () => {
      service['properties'].controlPoint = 'bottomCenter';
      service.setTranslationValues();
      expect(service['properties'].translateX).toBe('0');
      expect(service['properties'].translateY).toBe('54');
    });

    it('#setTranslationValues should set attributes when controlPoint === bottomRight', () => {
      service['properties'].controlPoint = 'bottomRight';
      service.setTranslationValues();
      expect(service['properties'].translateX).toBe('52.25');
      expect(service['properties'].translateY).toBe('54');
    });
  });

  describe('SetTranslationValues', () => {
    const scaleX = 50;
    const scaleY = 50;
    const childs: Node[] = [];

    beforeEach(() => {
      service['properties'].translateX = '50';
      service['properties'].translateY = '50';
      childs.pop();
    });

    it('#editingValues should set stringTransform when subTransform[0] === t and index === 0', () => {
      childs.push((mockHtml as Node));
      mockHtml.getAttribute.and.returnValue('transform');
      service['properties'].isFirstScale = false;
      service.editingValues(scaleX, scaleY, childs);
      expect(service['properties'].renderer.setAttribute).toHaveBeenCalledWith(mockHtml, 'transform',
      'translate(50 50)');
    });

    it('#editingValues should set stringTransform when subTransform[0] === t and index === 2', () => {
      childs.push((mockHtml as Node));
      mockHtml.getAttribute.and.returnValue('))transform');
      service['properties'].isFirstScale = false;
      service.editingValues(scaleX, scaleY, childs);
      expect(service['properties'].renderer.setAttribute).toHaveBeenCalledWith(mockHtml, 'transform',
      'translate(-50 -50)');
    });

    it('#editingValues should set stringTransform when subTransform[0] === s and index === 1', () => {
      childs.push((mockHtml as Node));
      mockHtml.getAttribute.and.returnValue(')scale');
      service['properties'].isFirstScale = false;
      service.editingValues(scaleX, scaleY, childs);
      expect(service['properties'].renderer.setAttribute).toHaveBeenCalledWith(mockHtml, 'transform',
      'scale(50 50)');
    });

    it('#editingValues should not set stringTransform when subTransform is empty', () => {
      childs.push((mockHtml as Node));
      mockHtml.getAttribute.and.returnValue('');
      service['properties'].isFirstScale = false;
      service.editingValues(scaleX, scaleY, childs);
      expect(service['properties'].renderer.setAttribute).toHaveBeenCalledWith(mockHtml, 'transform',
      '');
    });

    it('#editingValues should set stringTransform when isFirstScale is true', () => {
      childs.push((mockHtml as Node));
      mockHtml.getAttribute.and.returnValue('');
      service['properties'].isFirstScale = true;
      service.editingValues(scaleX, scaleY, childs);
      expect(service['properties'].renderer.setAttribute).toHaveBeenCalledWith(mockHtml, 'transform',
      'translate(50 50)scale(50 50)translate(-50 -50)');
    });

    it('#editingValues should not change stringTransform when transform is null/undefined', () => {
      childs.push((mockHtml as Node));
      mockHtml.getAttribute.and.callThrough();
      service['properties'].isFirstScale = false;
      service.editingValues(scaleX, scaleY, childs);
      expect(service['properties'].renderer.setAttribute).toHaveBeenCalledWith(mockHtml, 'transform',
      '');
    });
  });

  describe('mouseMove', () => {
    const childs: Node[] = [];

    beforeEach(() => {
      service['properties'].translateX = '50';
      service['properties'].translateY = '50';
      service['properties'].isFirstScale = true;
      service['properties'].scaleXenable = true;
      service['properties'].scaleYenable = true;
      service['properties'].refX = 100;
      service['properties'].refY = 100;
      service['properties'].bboxSelect = mockDom;
      childs.pop();
    });

    it('#mouseMove should set scaleX and scaleY when isMirrorX is true, but no button is pressed', () => {
      childs.push((mockHtml as Node));
      service['properties'].isMirrorX = true;
      service.mouseMove(eventMd, childs);
      expect(service['properties'].renderer.setAttribute).toHaveBeenCalledWith(mockHtml, 'transform',
      'translate(50 50)scale(-1 1)translate(-50 -50)');
    });

    it('#mouseMove should set scaleX and scaleY when isMirrorY is true, but no button is pressed', () => {
      childs.push((mockHtml as Node));
      service['properties'].isMirrorY = true;
      service.mouseMove(eventMd, childs);
      expect(service['properties'].renderer.setAttribute).toHaveBeenCalledWith(mockHtml, 'transform',
      'translate(50 50)scale(1 -1)translate(-50 -50)');
    });

    it('#mouseMove should set scaleX and scaleY when scaleXEnable is true, but no button is pressed', () => {
      childs.push((mockHtml as Node));
      service['properties'].refX = 150;
      service['properties'].refY = 150;
      service['properties'].scaleXenable = false;
      service.mouseMove(eventMd, childs);
      expect(service['properties'].renderer.setAttribute).toHaveBeenCalledWith(mockHtml, 'transform',
      'translate(50 50)scale(1 2)translate(-50 -50)');
    });

    it('#mouseMove should set scaleX and scaleY when scaleYEnable is true, but no button is pressed', () => {
      childs.push((mockHtml as Node));
      service['properties'].refX = 150;
      service['properties'].refY = 150;
      service['properties'].scaleYenable = false;
      service.mouseMove(eventMd, childs);
      expect(service['properties'].renderer.setAttribute).toHaveBeenCalledWith(mockHtml, 'transform',
      'translate(50 50)scale(2 1)translate(-50 -50)');
    });

    it('#mouseMove should set scaleX and scaleY when altKey is pressed', () => {
      childs.push((mockHtml as Node));
      Object.defineProperty(eventMd, 'altKey', {value: true});
      service['properties'].refX = 200;
      service['properties'].refY = 200;
      service.mouseMove(eventMd, childs);
      expect(service['properties'].renderer.setAttribute).toHaveBeenCalledWith(mockHtml, 'transform',
      'translate(75 75)scale(5 5)translate(-75 -75)');
    });

    it('#mouseMove should set isFirstScale to false', () => {
      childs.push((mockHtml as Node));
      service.mouseMove(eventMd, childs);
      expect(service['properties'].isFirstScale).toBeFalsy();
    });

    it('#mouseMove should set isFirstScale to false', () => {
      childs.push((mockHtml as Node));
      spyOn(service, 'editingValues');
      spyOn(service, 'setTranslationValues');
      service.mouseMove(eventMd, childs);
      expect(service.editingValues).toHaveBeenCalledWith(1, 1, childs);
      expect(service.setTranslationValues).toHaveBeenCalled();
    });

    it('#mouseMove should set scaleX and scaleY when shiftKey is pressed and scaleX > scaleY', () => {
      childs.push((mockHtml as Node));
      Object.defineProperty(eventMd, 'shiftKey', {value: true});
      service['properties'].shiftenable = true;
      service['properties'].refX = 150;
      service.mouseMove(eventMd, childs);
      expect(service['properties'].renderer.setAttribute).toHaveBeenCalledWith(mockHtml, 'transform',
      'translate(50 50)scale(2 2)translate(-50 -50)');
    });

    it('#mouseMove should set scaleX and scaleY when shiftKey is pressed and scaleY > scaleX', () => {
      childs.push((mockHtml as Node));
      Object.defineProperty(eventMd, 'shiftKey', {value: true});
      service['properties'].shiftenable = true;
      service['properties'].refY = 150;
      service.mouseMove(eventMd, childs);
      expect(service['properties'].renderer.setAttribute).toHaveBeenCalledWith(mockHtml, 'transform',
      'translate(50 50)scale(2 2)translate(-50 -50)');
    });
  });
});
