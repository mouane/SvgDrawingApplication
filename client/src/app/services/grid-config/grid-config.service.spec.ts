import { TestBed } from '@angular/core/testing';

import { GridConfigService } from './grid-config.service';

describe('GridConfigService', () => {
  let service: GridConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridConfigService, ],
    });
    service = TestBed.get(GridConfigService);
});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('#initGrid should do stuff', () => {
    spyOn(service['renderer'], 'setAttribute');
    service.initgrid();
    expect(service['renderer'].setAttribute).toHaveBeenCalledTimes(8);
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(service.grid, 'id', 'grid');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(service.grid, 'width', '8');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(service.grid, 'height', '8');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(service.grid, 'patternUnits', 'userSpaceOnUse');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(service.gridPath, 'd' , 'M 8 0 L 0 0 0 8');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(service.gridPath, 'stroke', 'black');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(service.gridPath, 'fill', 'none');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(service.gridPath, 'stroke-width', '0.5');
  });
  it('#initGrid should emit grid', (done) => {
    service.changeGrid.subscribe((g: SVGElement) => {
      expect(g).toEqual(service.grid);
      done();
    });
    service.initgrid();
  });
  it('#updateGrid should call initGrid', () => {
    const mockBool = true;
    const value = 5;
    const mockOpacity = 25;
    spyOn(service, 'initgrid');
    service.updateGrid(mockBool, value, mockOpacity);
    expect(service.initgrid).toHaveBeenCalled();
  });
  it('#updateGrid should call initGrid and change opacity to 0 when bool is false', () => {
    const mockBool = false;
    const value = 5;
    const mockOpacity = 25;
    service.updateGrid(mockBool, value, mockOpacity);
    expect(service.gridOpacity).toBe(0.5);
  });
});
