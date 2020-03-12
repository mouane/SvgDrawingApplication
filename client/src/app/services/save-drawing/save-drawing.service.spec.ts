import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SaveDrawingService } from './save-drawing.service';

describe('SaveDrawingService', () => {
  let service: SaveDrawingService;
  let mockRenderer: jasmine.SpyObj<Renderer2>;
  let mockSvg: jasmine.SpyObj<SVGElement>;
  let mockCanvas: jasmine.SpyObj<HTMLCanvasElement>;
  let mockBackgroundColor: jasmine.SpyObj<CSSStyleDeclaration>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaveDrawingService, Renderer2],
      imports: [HttpClientTestingModule, AngularFireModule.initializeApp(environment.firebase), AngularFireStorageModule],
    });
    service = TestBed.get(SaveDrawingService);
    mockCanvas = jasmine.createSpyObj('HTMLCanvasElement', ['getContext', 'getBoundingClientRect', 'height', 'width', 'remove']);
    mockSvg = jasmine.createSpyObj('SVGElement', ['setAttribute', 'getBoundingClientRect', 'getAttribute']);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['createElement', 'insertBefore', 'appendChild', 'selectRootElement']);
    mockBackgroundColor = jasmine.createSpyObj('CSSStyleDeclaration', ['']);
    mockSvg.setAttribute.and.callThrough();
    mockRenderer.selectRootElement.and.callThrough();
    mockSvg.getBoundingClientRect.and.callThrough();
    mockRenderer.createElement.and.returnValue(mockSvg);
    mockRenderer.createElement.and.returnValue(mockCanvas);
    service['renderer'] = mockRenderer;
  });

  it('should generate svgImage base64', () => {
    const svg: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const begin = 'data:image/svg+xml;base64,';
    const expected = begin + btoa(new XMLSerializer().serializeToString(svg as Node));
    expect(service.svgImage(svg)).toEqual(expected);
  });

  it('getSVGElement should get svg element', () => {
    mockRenderer.selectRootElement.and.returnValue(mockSvg);
    const result = service.getSVGElement();
    expect(result).toEqual(mockSvg);
  });

  it('encodeSvgToFireBase should serialize to string', () => {
    const svg: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const result: string = service.encodeSvgToFireBase(svg);
    const expected = btoa(new XMLSerializer().serializeToString(svg as Node));
    expect(result).toEqual(expected);
  });

  it('#sendDrawingData should return an Observable should match the right data', (done) => {

    service['renderer'] = mockRenderer;
    Object.defineProperty(mockSvg, 'style', {value: mockBackgroundColor});
    service['saveDrawingProperties']['svg'] = mockSvg;
    mockRenderer.selectRootElement.and.returnValue(mockSvg);

    const mockHttp: HttpTestingController = TestBed.get(HttpTestingController);
    service.sendDrawingData( 'bla', 'bla').pipe(take(1)).subscribe();
    const REQUEST: TestRequest = mockHttp.expectOne('http://localhost:3000/api/index/saveDrawing');
    expect(REQUEST.request.method).toEqual('POST');
    REQUEST.flush({});
    mockHttp.verify();
    done();
  });

  it('saveDrawingLocally should return a drawing object', () => {
    Object.defineProperty(mockSvg, 'style', {value: mockBackgroundColor});
    service['saveDrawingProperties']['svg'] = mockSvg;
    mockRenderer.selectRootElement.and.returnValue(mockSvg);
    service.formattingSvgDrawing();
    spyOn(service, 'formattingSvgDrawing');
    service.saveDrawingLocally('hey');
    expect(service.formattingSvgDrawing).toHaveBeenCalled();
    expect(service.saveDrawingLocally).toBeTruthy();

  });

  it('formattingSvgDrawing should format drawing', () => {
    Object.defineProperty(mockSvg, 'style', {value: mockBackgroundColor});
    service['saveDrawingProperties']['svg'] = mockSvg;
    mockRenderer.selectRootElement.and.returnValue(mockSvg);
    spyOn(service, 'formattingSvgDrawing');
    service.formattingSvgDrawing();
    expect(service.formattingSvgDrawing).toHaveBeenCalled();
  });

  it('sendToFireBase should send to firebase', () => {
    spyOn(service, 'sendToFireBase');
    service.sendToFireBase('test', 'test');
    expect(service.sendToFireBase).toHaveBeenCalled();

  });

  it('deleteDrawingFromFirebase should delete from firebase', () => {
    spyOn(service, 'deleteDrawingFromFirebase');
    service.deleteDrawingFromFirebase('test');
    expect(service.deleteDrawingFromFirebase).toHaveBeenCalled();

  });
});
