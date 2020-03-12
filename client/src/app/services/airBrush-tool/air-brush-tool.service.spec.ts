import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SIDEBAR } from 'src/app/enum';
import { AirBrushToolService } from './air-brush-tool.service';

describe('AirBrushToolService', () => {
  let service: AirBrushToolService;
  let mockSVGEl: jasmine.SpyObj<SVGElement>;
  let mockPath: jasmine.SpyObj<SVGElement>;
  let mockRenderer: jasmine.SpyObj<Renderer2>;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(AirBrushToolService);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['setAttribute', 'insertBefore', 'createElement']);
    mockPath = jasmine.createSpyObj('SVGElement', ['setAttribute']);
    mockRenderer.setAttribute.and.callThrough();
    mockSVGEl = jasmine.createSpyObj('SVGElement', ['setAttribute']);
    mockSVGEl.setAttribute.and.callThrough();
    mockRenderer.createElement.and.returnValue(mockPath);
    mockPath.setAttribute.and.callThrough();

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#mouseDown should call createGroupContainer and airBrush with the same event', () => {
    spyOn(service, 'createGroupContainer');
    spyOn(service, 'airBrush');
    const event: MouseEvent = new MouseEvent('mousedown');
    service.mouseDown(event);
    expect(service.createGroupContainer).toHaveBeenCalledWith(event);
    expect(service.airBrush).toHaveBeenCalledWith(event);
  });

  it('#mouseUp should set spraying to false', () => {
    const event: MouseEvent = new MouseEvent('mouseup');
    service.mouseUp(event);
    expect(service['properties'].spraying).toBe(false);
  });

  it('#mouseUp should always clearInterval', () => {
    const event: MouseEvent = new MouseEvent('mouseup');
    spyOn(window, 'clearInterval');
    service.mouseUp(event);
    expect(window.clearInterval).toHaveBeenCalled();
  });

  it('#mousePosition should set x and y position correctly', () => {
    const event: MouseEvent = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    service.mousePosition(event);
    expect(service['properties'].xPos).toBe(50 - SIDEBAR.sideBarWidth + service['scrollDrawing'].ScrollX);
    expect(service['properties'].yPos).toBe(50 + service['scrollDrawing'].ScrollY);
  });

  it('#mouseMove should call mousePosition only if spraying is true', () => {
    spyOn(service, 'mousePosition');
    const event: MouseEvent = new MouseEvent('mousemove');
    service['properties'].spraying = true;
    service.mouseMove(event);
    expect(service.mousePosition).toHaveBeenCalledWith(event);
  });

  it('#mouseMove should not call mousePosition if spraying is false', () => {
    spyOn(service, 'mousePosition');
    spyOn(service, 'spray');
    const event: MouseEvent = new MouseEvent('mousemove');
    service['properties'].spraying = false;
    service.mouseMove(event);
    expect(service.mousePosition).not.toHaveBeenCalled();
    expect(service.spray).not.toHaveBeenCalled();
  });

  it('#createGroupContainer should insertBefore the groupEl on the parent element when the parent nodeName is svg ', () => {
    const event: MouseEvent = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    const mockParent: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    Object.defineProperty(mockParent, 'nodeName', { value: 'svg' });
    service['renderer'] = mockRenderer;
    Object.defineProperty(event, 'target', { get: () => mockSVG });
    Object.defineProperty(event.target, 'parentNode', { value: mockParent });

    service.createGroupContainer(event);
    expect(service['renderer'].insertBefore).toHaveBeenCalledWith(mockParent, service['properties'].groupEl, mockParent.lastChild);
  });

  it('#createGroupContainer should insertBefore the groupEl on the event target when the parent nodeName is not svg ', () => {
    const event: MouseEvent = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    const mockParent: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    Object.defineProperty(mockParent, 'nodeName', { value: 'notSvg' });
    service['renderer'] = mockRenderer;
    Object.defineProperty(event, 'target', { get: () => mockSVG });
    Object.defineProperty(event.target, 'parentNode', { value: mockParent });

    service.createGroupContainer(event);
    expect(service['renderer'].insertBefore).toHaveBeenCalledWith(event.target,
           service['properties'].groupEl, (event.target as HTMLElement).lastChild);
  });

  it('#randomPointInDiameter should return a table of numbers containing x and y coordinates within chosen diameter', () => {
    const radius = 40;
    let results = [0, 0];
    results = service.randomPointInDiameter(radius);
    const xCoord = results[0] / radius;
    const yCoord = results[1] / radius;
    expect(xCoord * xCoord + yCoord * yCoord).toBeLessThan(1);
  });

  it('#circleToPath should return the correct path segment', () => {
    service['properties'].xPos = 200;
    service['properties'].yPos = 200;
    const path = service.circleToPath();
    expect(path).toEqual('M200 200 m -1,0a 1,1 0 1,0 2,0a 1,1 0 1,0-2,0');
  });

  it('#airBrush should call mousePosition and spray with the correct parameters', () => {
    const event: MouseEvent = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    spyOn(service, 'mousePosition');
    spyOn(service, 'spray');
    service.airBrush(event);
    expect(service.mousePosition).toHaveBeenCalledWith(event);
    expect(service.spray).toHaveBeenCalled();
  });

  it('#initialisePath should create a path and set first coordinate to zero', () => {
    service['renderer'] = mockRenderer;
    service.initialisePath();
    expect(service['properties'].path).toBe(mockPath);
    expect(service['properties'].circlePath).toEqual('M0,0');
  });

  it('#mousePosition should set the coordinates xPos and yPos correctly ', () => {
    const event: MouseEvent = new MouseEvent('mousedown', { clientX: 600, clientY: 50 });
    service['scrollDrawing']._ScrollX = 100;
    service['scrollDrawing']._ScrollY = 50;
    service.mousePosition(event);
    expect(service['properties'].xPos).toEqual(380);
    expect(service['properties'].yPos).toEqual(100);
  });
});
