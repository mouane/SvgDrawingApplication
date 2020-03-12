import { TestBed } from '@angular/core/testing';

import { BrushProperties } from '../../classes/brushProperties/brush-properties';
import { ColorToolProperties } from '../../classes/colorToolProperties/color-tool-properties';
import { LINE_ATTRIBUTES, LINE_TYPE } from '../../enum';
import { BrushToolService } from './brushTool.service';

describe('BrushToolService', () => {
  // tslint:disable-next-line: prefer-const
  let value: SVGElement;
  let service: BrushToolService;
  let mockSVGEl: jasmine.SpyObj<SVGElement>;
  let mockFilter: jasmine.SpyObj<SVGElement>;
  let mockSVGPath: jasmine.SpyObj<SVGElement>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrushProperties, ColorToolProperties],
    });
    service = TestBed.get(BrushToolService);
    mockSVGEl = jasmine.createSpyObj('SVGElement', ['setAttribute']);
    mockFilter = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    mockSVGPath = jasmine.createSpyObj('SVGElement', ['setAttribute']);
    mockFilter.getAttribute.and.returnValue('base');
    mockSVGEl.setAttribute.and.callThrough();
    mockSVGPath.setAttribute.and.callThrough();
    service['properties'].currentFilter = mockFilter;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getFilterBase should return SVGELEMENT base', () => {
    expect(service.FilterBase).toBe(service['properties'].filterBase);
  });

  it('#getFilterTurbulence should return SVGELEMENT turbulence', () => {
    expect(service.FilterTurbulence).toBe(service['properties'].filterTurbulence);
  });

  it('#getFilterNoise should return SVGELEMENT noise', () => {
    expect(service.FilterNoise).toBe(service['properties'].filterNoise);
  });

  it('#getFilterBlurry should return SVGELEMENT blurry', () => {
    expect(service.FilterBlurry).toBe(service['properties'].filterBlurry);
  });

  it('#getFilterSquigly should return SVGELEMENT squigly', () => {
    expect(service.FilterSquigly).toBe(service['properties'].filterSquigly);
  });

  it('#_Tip should set value to tip', () => {
   // tslint:disable-next-line: no-shadowed-variable
   const value: number = (9);
   service._Tip = value;
   expect(service['properties'].tip).toEqual(value);
  });

  it('#_FilterBase should set value to filterBase', () => {
    service._FilterBase = value;
    expect(service.FilterBase).toBe(value);
   });

  it('#_FilterTurbulence should set value to filterTurbulence', () => {
    service._FilterTurbulence = value;
    expect(service.FilterTurbulence).toBe(value);
   });

  it('#_FilterBlurry should set value to filterBlurry', () => {
    service._FilterBlurry = value;
    expect(service.FilterBlurry).toBe(value);
   });

  it('#_FilterNoise should set value to filterNoise', () => {
    service._FilterNoise = value;
    expect(service.FilterNoise).toBe(value);
   });

  it('#_FilterSquigly should set value to filterSquigly', () => {
    service._FilterSquigly = value;
    expect(service.FilterSquigly).toBe(value);
   });
  it('#_CurrentFilter should set currentFilter to value', () => {
    const mockValue = mockSVGEl;
    service._CurrentFilter = mockValue;
    expect(service['properties'].currentFilter).toBe(mockValue);
  });

  it('#setAttributesCircle should call setAttribute', () => {
    service['properties'].circle = mockSVGEl;
    service.setAttributesCircle();
    expect(service['properties'].circle.setAttribute).toHaveBeenCalledTimes(4);
    expect(service['properties'].circle.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.FILL, service['properties'].color);
    expect(service['properties'].circle.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.R, LINE_ATTRIBUTES.NULL +
      service['properties'].tip / 2);
    expect(service['properties'].circle.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.ID, LINE_ATTRIBUTES.CIRCLE +
       (service['properties'].indexCircle - 1));
    expect(service['properties'].circle.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.FILTER, LINE_ATTRIBUTES.URL +
      LINE_ATTRIBUTES.FILTER_POUND + service['properties'].currentFilter.getAttribute(LINE_ATTRIBUTES.ID) + LINE_ATTRIBUTES.FILTER_CLOSE);
  });

  it('#setAttributesPath should call setAttribute', () => {
    service['properties'].strokes = mockSVGEl;
    service.setAttributesPath();
    expect(service['properties'].strokes.setAttribute).toHaveBeenCalledTimes(7);
    expect(service['properties'].strokes.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.ID, LINE_ATTRIBUTES.PATH +
      (service['properties'].indexPath - 1));
    expect(service['properties'].strokes.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.STROKE_WIDTH, LINE_ATTRIBUTES.NULL +
      service['properties'].tip);
    expect(service['properties'].strokes.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.STROKE_LINECAP, LINE_TYPE.ROUND);
    expect(service['properties'].strokes.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.STROKE_LINEJOIN, LINE_TYPE.ROUND);
    expect(service['properties'].strokes.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.FILTER, LINE_ATTRIBUTES.URL +
      LINE_ATTRIBUTES.FILTER_POUND + service['properties'].currentFilter.getAttribute(LINE_ATTRIBUTES.ID) + LINE_ATTRIBUTES.FILTER_CLOSE);
    expect(service['properties'].strokes.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.STROKE, service['properties'].color);
    expect(service['properties'].strokes.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.FILL, LINE_ATTRIBUTES.NONE);
  });

  it('#setAttributesCircle should increment indexCircle', () => {
    service['properties'].circle = mockSVGEl;
    service.setAttributesCircle();
    expect(service['properties'].indexCircle).toBe(1);
  });

  it('#setAttributesPath should increment indexPath', () => {
    service['properties'].strokes = mockSVGPath;
    service.setAttributesPath();
    expect(service['properties'].indexPath).toBe(1);
  });

  it('#mouseUp should set isPath to false', () => {
    const event: MouseEvent = new MouseEvent('mouseup');
    service['properties'].circle = mockSVGEl;
    service.mouseUp(event);
    expect(service['properties'].isPath).toBe(false);
  });

  it('#mouseMove should call setAttribute when isPath is true', () => {
    const event: MouseEvent = new MouseEvent('mousemove', {clientX: 50, clientY: 50});
    const line = 'M0,0';
    service['properties'].isPath = true;
    service['properties'].stroke = line;
    service['properties'].circle = mockSVGEl;
    service['properties'].strokes = mockSVGPath;
    service.mouseMove(event);
    expect(service['properties'].strokes.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.D, service['properties'].stroke);
  });

  it('#mouseMove should not call setAttribute when isPath is false', () => {
    const event: MouseEvent = new MouseEvent('mousemove', {clientX: 50, clientY: 50});
    const line = 'M0,0';
    service['properties'].isPath = false;
    service['properties'].stroke = line;
    service['properties'].circle = mockSVGEl;
    service['properties'].strokes = mockSVGPath;
    service.mouseMove(event);
    expect(service['properties'].circle.setAttribute).not.toHaveBeenCalled();
    expect(service['properties'].strokes.setAttribute).not.toHaveBeenCalled();
  });

  it('#mouseDown should call appendChild 3 times for the circle and the path', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 50, clientY: 50});
    const mockParent: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    Object.defineProperty(mockParent, 'nodeName', {value: 'svg'});
    const line = 'M0,0';
    service['properties'].stroke = line;
    service['properties'].circle = mockSVGEl;
    service['properties'].strokes = mockSVGPath;
    Object.defineProperty(event, 'target', {get: () => mockSVG });
    Object.defineProperty(event.target, 'parentNode', {value: mockParent});
    // tslint:disable-next-line: no-string-literal
    spyOn(service['renderer'], 'insertBefore');
    service.mouseDown(event);
    // tslint:disable-next-line: no-string-literal
    expect(service['renderer'].insertBefore).toHaveBeenCalledTimes(3);
  });

  it('#mouseDown should not call appendChild 3 times for the circle and the path when parent != svg', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 50, clientY: 50});
    const mockParent: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockSVG: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    Object.defineProperty(mockParent, 'nodeName', {value: 'notSVG'});
    const line = 'M0,0';
    service['properties'].stroke = line;
    service['properties'].circle = mockSVGEl;
    service['properties'].strokes = mockSVGPath;
    Object.defineProperty(event, 'target', {get: () => mockSVG });
    Object.defineProperty(event.target, 'parentNode', {value: mockParent});
    // tslint:disable-next-line: no-string-literal
    spyOn(service['renderer'], 'insertBefore');
    service.mouseDown(event);
    // tslint:disable-next-line: no-string-literal
    expect(service['renderer'].insertBefore).toHaveBeenCalledTimes(3);
  });
});
