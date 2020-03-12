import { TestBed } from '@angular/core/testing';

import { ScrollDrawingService } from './scroll-drawing.service';

describe('ScrollDrawingService', () => {
  let service: ScrollDrawingService;
  let value: number;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ScrollDrawingService);
    value = 5;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('#_ScrollX should set value to xscroll', () => {
    service._ScrollX = value;
    expect(service['xScroll']).toEqual(value);
  });
  it('#_ScrollY should set value to yscroll', () => {
    service._ScrollY = value;
    expect(service['yScroll']).toEqual(value);
  });
  it('#ScrollX should return value', () => {
    service._ScrollX = value;
    expect(service.ScrollX).toEqual(value);
  });
  it('#ScrollY should return value', () => {
    service._ScrollY = value;
    expect(service.ScrollY).toEqual(value);
  });
});
