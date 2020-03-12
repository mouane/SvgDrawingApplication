import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LINE_ATTRIBUTES, SIDEBAR } from 'src/app/enum';
import { PaintBucketService } from './paint-bucket.service';

describe('PaintBucketService', () => {
  let service: PaintBucketService;
  let mockSVGEl: jasmine.SpyObj<SVGElement>;
  let mockRenderer: jasmine.SpyObj<Renderer2>;
  let mockImageData: jasmine.SpyObj<ImageData>;
  let mockCanvas: jasmine.SpyObj<HTMLCanvasElement>;
  let mockDom1: jasmine.SpyObj<DOMRect>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(PaintBucketService);
    mockCanvas = jasmine.createSpyObj('HTMLCanvasElement', ['getContext', 'getBoundingClientRect', 'height', 'width', 'remove']);
    mockSVGEl = jasmine.createSpyObj('SVGElement', ['setAttribute', 'getBoundingClientRect']);
    mockImageData = jasmine.createSpyObj('ImageData', ['height', 'width', 'data']);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['createElement', 'insertBefore', 'appendChild', 'selectRootElement']);
    mockSVGEl.setAttribute.and.callThrough();
    mockRenderer.selectRootElement.and.callThrough();
    mockDom1 = jasmine.createSpyObj('DOMRect', ['']);

    mockSVGEl.getBoundingClientRect.and.callThrough();

    mockRenderer.createElement.and.returnValue(mockSVGEl);
    mockRenderer.createElement.and.returnValue(mockCanvas);
    service['properties'].renderer = mockRenderer;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#_Tolerance should set the value of tolerance with the number passed in parameters ', () => {
    const value = 50;
    service._Tolerance = value;
    expect(service['properties'].tolerance).toEqual(50);
  });

  it('#mouseDown should call prepareFloodFill with the same event', () => {
    spyOn(service, 'prepareFloodFill');
    const event: MouseEvent = new MouseEvent('mousedown');
    service.mouseDown(event);
    expect(service.prepareFloodFill).toHaveBeenCalledWith(event);
  });

  it('#mouseDown should set the property eventTarget to the target of the the event passed in parameters', () => {
    spyOn(service, 'prepareFloodFill');
    const event: MouseEvent = new MouseEvent('mousedown');
    service.mouseDown(event);
    expect(service['properties'].eventTarget).toBe(event.target as HTMLElement);
  });

  it('#createPath should set correctly the attributes of the path passed in parameter', () => {
    const mockParent: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['insertBefore']);
    Object.defineProperty(mockParent, 'nodeName', { value: 'svg' });
    Object.defineProperty(mockParent, 'parentNode', { value: 'svg' });
    const pathString = 'M50 50';
    service['properties'].renderer = mockRenderer;
    mockRenderer.createElement.and.returnValue(mockSVGEl);
    service['properties'].eventTarget = (mockParent as unknown as HTMLElement);

    service['colorToolService']._Fill = 'black';
    const color = service['colorToolService'].Fill;

    service.createPath(pathString);
    expect(service['properties'].path.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.D, pathString);
    expect(service['properties'].path.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.FILL, color);
    expect(service['properties'].path.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.STROKE, color);
    expect(service['properties'].path.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.STROKE_WIDTH, '2');
  });

  it('#resetToConvert should set all values of toConvert array to 0', () => {
    const width = 321;
    const height = 1;
    service['properties'].toConvert = [];
    service.resetToConvert(width, height);

    expect(service['properties'].toConvert[0][0]).toEqual(0);
    expect(service['properties'].toConvert[0][1]).toEqual(0);
    expect(service['properties'].toConvert[1][0]).toEqual(0);
    expect(service['properties'].toConvert[1][1]).toEqual(0);
  });

  it('#createCanvas should set the canvas properly (height, width)', () => {
    mockRenderer.selectRootElement.and.returnValue(mockSVGEl);
    Object.defineProperty(mockDom1, 'height', { value: 10 });
    Object.defineProperty(mockDom1, 'width', { value: 10 });
    mockSVGEl.getBoundingClientRect.and.returnValue(mockDom1);
    service.createCanvas();
    expect(service['properties'].svg).toEqual(mockSVGEl);
    expect(service['properties'].canvas).toEqual(mockCanvas);
    expect(service['properties'].canvas.height).toEqual(mockDom1.height);
    expect(service['properties'].canvas.width).toEqual(mockDom1.width + SIDEBAR.sideBarWidth);
  });

  it('#createCanvas should append the canvas on the svg', () => {
    mockRenderer.selectRootElement.and.returnValue(mockSVGEl);
    Object.defineProperty(mockDom1, 'height', { value: 10 });
    Object.defineProperty(mockDom1, 'width', { value: 10 });
    mockSVGEl.getBoundingClientRect.and.returnValue(mockDom1);
    service.createCanvas();
    expect(service['properties'].renderer.appendChild).toHaveBeenCalledWith(service['properties'].svg, service['properties'].canvas);
  });

  it('#getPixel should return a table of -1 values if given a negative x or negatif y', () => {
    Object.defineProperty(mockImageData, 'width', { value: 10 });
    Object.defineProperty(mockImageData, 'height', { value: 10 });
    Object.defineProperty(mockImageData, 'data', { value: [255, 255, 255, 255] });
    const result = service.getPixel(mockImageData, -5, -5);

    expect(result).toEqual([-1, -1, -1, -1]);
  });

  it('#getPixel should return the image data from given positive x and y position', () => {
    Object.defineProperty(mockImageData, 'width', { value: 10 });
    Object.defineProperty(mockImageData, 'height', { value: 10 });
    Object.defineProperty(mockImageData, 'data', { value: [255, 255, 255, 255] });
    const result = service.getPixel(mockImageData, 0, 0);

    expect(result).toEqual([255, 255, 255, 255]);
  });

  it('#colorTolerance should return true if current pixel is within the chosen tolerance of the color to change', () => {
    const tolerance = 30;
    const oldColor = [0, 0, 0, 0];
    const pixelColor = [0, 0, 0, 20];

    const result = service.colorTolerance(oldColor, pixelColor, tolerance);

    expect(result).toBeTruthy();
  });

  it('#hexToRgba should return an array containing the rgba value of the hex color passed in parameters', () => {
    const hexColor = '#FFFFFFFF';
    const result = service.hexToRgba(hexColor);

    expect(result).toEqual([255, 255, 255, 255]);
  });

  it('#checkOutOfBound should return a Point containing {x + 1, y} coordinate if given x is out of bound', () => {
    const xPos = -1;
    const yPos = 5;

    const result = service.checkOutOfBound(xPos, yPos);
    expect(result).toEqual({x: xPos + 1, y: yPos});
  });

  it('#checkOutOfBound should return a Point containing {x, y + 1} coordinate if given y is out of bound', () => {
    const xPos = 5;
    const yPos = -1;

    const result = service.checkOutOfBound(xPos, yPos);
    expect(result).toEqual({ x: xPos, y: yPos + 1});
  });

  it('#checkOutOfBound should return a Point containing {x + 1, y + 1} coordinate if given x and y are out of bound', () => {
    const xPos = -1;
    const yPos = -1;

    const result = service.checkOutOfBound(xPos, yPos);
    expect(result).toEqual({ x: xPos + 1, y: yPos + 1 });
  });

  it('#checkOutOfBound should return a Point containing {x, y} coordinate if given x and y  are not out of bound', () => {
    const xPos = 5;
    const yPos = 20;

    const result = service.checkOutOfBound(xPos, yPos);
    expect(result).toEqual({ x: xPos, y: yPos});
  });

  it('#createRect should set correctly the attributes of the rectangle', () => {
    spyOn(service, 'addToDrawingView');
    Object.defineProperty(mockCanvas, 'height', { value: 10 });
    Object.defineProperty(mockCanvas, 'width', { value: 10 });
    mockRenderer.createElement.and.returnValue(mockSVGEl);
    service['properties'].renderer = mockRenderer;
    service['properties'].canvas = mockCanvas;

    service['colorToolService']._Fill = 'black';
    const color = service['colorToolService'].Fill;

    service.createRect();

    expect(mockSVGEl.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.WIDTH, mockCanvas.width);
    expect(mockSVGEl.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.HEIGTH, mockCanvas.height);
    expect(mockSVGEl.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.FILL, color);
    expect(mockSVGEl.setAttribute).toHaveBeenCalledWith(LINE_ATTRIBUTES.STROKE, color);
  });

  it('#createRect should call addToDrawingView with the created reactangle', () => {
    spyOn(service, 'addToDrawingView');
    Object.defineProperty(mockCanvas, 'height', { value: 10 });
    Object.defineProperty(mockCanvas, 'width', { value: 10 });
    mockRenderer.createElement.and.returnValue(mockSVGEl);
    service['properties'].renderer = mockRenderer;
    service['properties'].canvas = mockCanvas;

    service['colorToolService']._Fill = 'black';

    service.createRect();

    expect(service.addToDrawingView).toHaveBeenCalledWith(mockSVGEl);

  });

  it('#floodFill should call createPathwith with the correct path string', () => {
    spyOn(service, 'createRect');
    Object.defineProperty(mockImageData, 'width', { value: 10 });
    Object.defineProperty(mockImageData, 'height', { value: 10 });
    Object.defineProperty(mockImageData, 'data', { value: [255, 255, 255, 255] });

    service['properties'].tolerance = 100;
    service.floodFill(0, 0, mockImageData);

    expect(service.createRect).toHaveBeenCalledWith();
  });

  it('#floodFill should not change any toConvert index to 1 if the color to change is the same as the fillColor', () => {
    Object.defineProperty(mockImageData, 'width', { value: 10 });
    Object.defineProperty(mockImageData, 'height', { value: 10 });
    Object.defineProperty(mockImageData, 'data', { value: [255, 255, 255, 255] });

    service['properties'].tolerance = 10;
    service['colorToolService']._Fill = '#FFFFFFFF';
    service['properties'].toConvert = [[0, 0], [0, 0]];
    service.floodFill(0, 0, mockImageData);

    expect(service['properties'].toConvert[0][0]).toEqual(0);
    expect(service['properties'].toConvert[0][1]).toEqual(0);
    expect(service['properties'].toConvert[1][0]).toEqual(0);
    expect(service['properties'].toConvert[1][1]).toEqual(0);
  });

  it('#floodFill should set the toConvert matrix correctly', () => {
    const mockParent: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['insertBefore']);
    Object.defineProperty(mockParent, 'nodeName', { value: 'svg' });
    Object.defineProperty(mockParent, 'parentNode', { value: 'svg' });
    service['properties'].renderer = mockRenderer;
    mockRenderer.createElement.and.returnValue(mockSVGEl);
    service['properties'].eventTarget = (mockParent as unknown as HTMLElement);
    Object.defineProperty(mockImageData, 'width', { value: 10 });
    Object.defineProperty(mockImageData, 'height', { value: 10 });
    Object.defineProperty(mockImageData, 'data', { value: [255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 0] });

    service['properties'].tolerance = 10;
    service['colorToolService']._Fill = '#000000FF';
    service['properties'].toConvert = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    service.floodFill(0, 0, mockImageData);

    expect(service['properties'].toConvert).toEqual([[1, 1, 0, 0], [1, 1, 0, 0], [1, 0, 0, 0]]);
  });

  describe('move', () => {
    const mockParent: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('HTMLElement', ['']);
    const mockSVG: jasmine.SpyObj<HTMLElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockSVG2: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockSVG3: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);
    const mockSVG4: jasmine.SpyObj<SVGElement> = jasmine.createSpyObj('SVGElement', ['']);

    beforeEach(() => {
      service['properties'].renderer = mockRenderer;
    });

    it('#addToDrawingView should insertBefore the parent when nodeName === svg', () => {
      Object.defineProperties(mockSVG, {nodeName: { value: 'svg' }, tagName: {value: 'g'},
        parentNode: {value: mockSVG2}, lastChild: {value: mockSVG3}});
      Object.defineProperties(mockParent, {parentNode: { value: mockSVG }, lastChild: {value: mockSVG3}});
      service['properties'].eventTarget = mockParent;

      service.addToDrawingView(mockSVG4);
      expect(service['properties'].renderer.insertBefore).toHaveBeenCalledWith(mockSVG, mockSVG4, mockSVG3);
    });

    it('#addToDrawingView should insertBefore the eventTarget when nodeName !== svg and tagName === g', () => {
      Object.defineProperties(mockSVG, {nodeName: { value: 'notSvg' }, tagName: {value: 'g'},
        parentNode: {value: mockSVG2}, lastChild: {value: mockSVG3}});
      Object.defineProperties(mockParent, {parentNode: { value: mockSVG }, lastChild: {value: mockSVG3}});
      service['properties'].eventTarget = mockParent;

      service.addToDrawingView(mockSVG4);
      expect(service['properties'].renderer.insertBefore).toHaveBeenCalledWith(mockSVG2, mockSVG4, mockSVG3);
    });

    it('#addToDrawingView should insertBefore the eventTarget when nodeName !== svg and tagName !== g', () => {
      Object.defineProperties(mockSVG, {nodeName: { value: 'notSvg' }, tagName: {value: 'h'},
        parentNode: {value: mockSVG2}, lastChild: {value: mockSVG3}});
      Object.defineProperties(mockParent, {parentNode: { value: mockSVG }, lastChild: {value: mockSVG3}});
      service['properties'].eventTarget = mockParent;

      service.addToDrawingView(mockSVG4);
      expect(service['properties'].renderer.insertBefore).toHaveBeenCalledWith(mockParent, mockSVG4, mockSVG3);
    });
});

  it('#createObject should call createPathwith with the correct path string', () => {
    spyOn(service, 'createPath');

    service['properties'].toConvert = [[1, 1], [1, 0], [0, 0], [1, 1], [1, 1]];

    service.createObject();
    expect(service.createPath).toHaveBeenCalledWith('M0 0 L0.5 1.5 M1 0 L1.5 0.5 M3 0 L3.5 1.5 M4 0 L4.5 1.5 ');
  });

  it('#createObject should call createPathwith with an empty string if toConvert array is only madeup of zero', () => {
    spyOn(service, 'createPath');

    service['properties'].toConvert = [[0, 0], [0, 0], [0, 0]];

    service.createObject();
    expect(service.createPath).toHaveBeenCalledWith('');
  });
});
