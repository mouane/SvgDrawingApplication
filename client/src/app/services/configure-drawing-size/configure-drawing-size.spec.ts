import { TestBed } from '@angular/core/testing';

import { ConfigureDrawingSizeService } from './configure-drawing-size';

describe('ConfigureDrawingSizeService', () => {
  let service: ConfigureDrawingSizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ConfigureDrawingSizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#createSVG should emit change height event', (done) => {
    service.changeH.subscribe((g: number) => {
       expect(g).toEqual(200);
       done();
    });
    service.createSVG(200, 200, '');
  });

  it('#createSVG should emit width event', (done) => {
    service.changeW.subscribe((g: number) => {
       expect(g).toEqual(200);
       done();
    });
    service.createSVG(200, 200, '');
  });

  it('#createSVG should emit hexcolor', (done) => {
  service.changeHEX.subscribe((g: string) => {
     expect(g).toEqual('#FFFFFF');
     done();
  });
  service.createSVG(200, 200, '#FFFFFF');
  });

  it('#createSVG should emit boolean', (done) => {
    service.changeBool.subscribe((g: string) => {
       expect(g).toEqual('true');
       done();
    });
    service.createSVG(200, 200, '#FFFFFF');
    });

  it('#createSVG should emit change height event', (done) => {
    service.changeH.subscribe((g: number) => {
       expect(g).toEqual(200);
       done();
    });
    service.resizeBrowser(200, 200);
  });

  it('#createSVG should emit width event', (done) => {
    service.changeW.subscribe((g: number) => {
       expect(g).toEqual(200);
       done();
    });
    service.resizeBrowser(200, 200);
  });
});
