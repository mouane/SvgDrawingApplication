import { TestBed } from '@angular/core/testing';
import { ColorToolProperties } from 'src/app/classes/colorToolProperties/color-tool-properties';
import { PencilProperties } from 'src/app/classes/pencilProperties/pencil-properties';
import { LINE_ATTRIBUTES, LINE_TYPE } from '../../enum';
import { PencilToolService } from './pencilTool';

describe('PencilToolService', () => {
  let service: PencilToolService;
  let mockSVGEl: jasmine.SpyObj<SVGElement>;
  let mockSVGPath: jasmine.SpyObj<SVGElement>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PencilProperties, ColorToolProperties],
    });
    service = TestBed.get(PencilToolService);
    mockSVGEl = jasmine.createSpyObj('SVGElement', ['setAttribute']);
    mockSVGPath = jasmine.createSpyObj('SVGElement', ['setAttribute']);
    mockSVGEl.setAttribute.and.callThrough();
    mockSVGPath.setAttribute.and.callThrough();
});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#setTip should set value to tip', () => {
    const value: number = (9);
    service._Tip = value;
    expect(service['properties'].tip).toEqual(value);
   });

  it('#setAttributesCircle should call setAttribute', () => {
    service['properties'].circle = mockSVGEl;
    service.setAttributesCircle();
    expect(mockSVGEl.setAttribute).toHaveBeenCalledTimes(3);
    expect(service['properties'].circle.setAttribute).toHaveBeenCalledTimes(3);
    expect(service['properties'].circle.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.FILL, service['properties'].color);
    expect(service['properties'].circle.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.R, LINE_ATTRIBUTES.NULL +
      service['properties'].tip / 2);
    expect(service['properties'].circle.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.ID, LINE_ATTRIBUTES.CIRCLE);
  });

  it('#setAttributesCircle should increment indexCircle', () => {
    service['properties'].circle = mockSVGEl;
    service.setAttributesCircle();
    expect(service['properties'].indexCircle).toBe(1);
  });

  it('#setAttributesPath should increment indexPath', () => {
    service['properties'].lines = mockSVGPath;
    service.setAttributesPath();
    expect(service['properties'].indexPath).toBe(1);
  });

  it('#setAttributesPath should call setAttribute', () => {
    service['properties'].lines = mockSVGEl;
    service.setAttributesPath();
    expect(mockSVGEl.setAttribute).toHaveBeenCalledTimes(6);
    expect(service['properties'].lines.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.ID, LINE_ATTRIBUTES.PATH +
      (service['properties'].indexPath - 1));
    expect(service['properties'].lines.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.STROKE_WIDTH, LINE_ATTRIBUTES.NULL +
      service['properties'].tip);
    expect(service['properties'].lines.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.STROKE_LINECAP, LINE_TYPE.ROUND);
    expect(service['properties'].lines.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.STROKE_LINEJOIN, LINE_TYPE.ROUND);
    expect(service['properties'].lines.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.STROKE, service['properties'].color);
    expect(service['properties'].lines.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.FILL, LINE_ATTRIBUTES.NONE);
  });

  it('#mouseUp should set isPath to false', () => {
    const event: MouseEvent = new MouseEvent('mouseup');
    service.mouseUp(event);
    expect(service['properties'].isPath).toBe(false);
  });

  it('#mouseMove should call setAttribute when isPath is true', () => {
    const event: MouseEvent = new MouseEvent('mousemove', {clientX: 50, clientY: 50});
    const line = 'M0,0';
    service['properties'].isPath = true;
    service['properties'].line = line;
    service['properties'].circle = mockSVGEl;
    service['properties'].lines = mockSVGPath;
    service.mouseMove(event);
    expect(service['properties'].circle.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.R, LINE_ATTRIBUTES.ZERO);
    expect(service['properties'].lines.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.D, service['properties'].line);
  });

  it('#mouseMove should not call setAttribute when isPath is false', () => {
    const event: MouseEvent = new MouseEvent('mousemove', {clientX: 50, clientY: 50});
    const line = 'M0,0';
    service['properties'].isPath = false;
    service['properties'].line = line;
    service['properties'].circle = mockSVGEl;
    service['properties'].lines = mockSVGPath;
    service.mouseMove(event);
    expect(service['properties'].circle.setAttribute).not.toHaveBeenCalled();
    expect(service['properties'].lines.setAttribute).not.toHaveBeenCalled();
  });

  it('#mouseDown should call insertBefore 3 times for the circle and the path', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 50, clientY: 50});
    const mockParent: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    Object.defineProperty(mockParent, 'nodeName', {value: 'svg'});
    const line = 'M0,0';
    service['properties'].line = line;
    service['properties'].circle = mockSVGEl;
    service['properties'].lines = mockSVGPath;
    Object.defineProperty(event, 'target', {get: () => mockSVG });
    Object.defineProperty(event.target, 'parentNode', {value: mockParent});
    // tslint:disable-next-line: no-string-literal
    spyOn(service['renderer'], 'insertBefore');
    service.mouseDown(event);
    // tslint:disable-next-line: no-string-literal
    expect(service['renderer'].insertBefore).toHaveBeenCalledTimes(3);
  });

  it('#mouseDown should call appendChild 3 times for the circle and the path', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 50, clientY: 50});
    const mockParent: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    Object.defineProperty(mockParent, 'nodeName', {value: ''});
    const line = 'M0,0';
    service['properties'].line = line;
    service['properties'].circle = mockSVGEl;
    service['properties'].lines = mockSVGPath;
    Object.defineProperty(event, 'target', {get: () => mockSVG });
    Object.defineProperty(event.target, 'parentNode', {value: mockParent});
    // tslint:disable-next-line: no-string-literal
    spyOn(service['renderer'], 'insertBefore');
    service.mouseDown(event);
    // tslint:disable-next-line: no-string-literal
    expect(service['renderer'].insertBefore).toHaveBeenCalledTimes(3);
  });
});
