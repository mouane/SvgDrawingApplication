import { TestBed } from '@angular/core/testing';

import { StampSelectorProperties } from 'src/app/classes/stampProperties/stamp-properties';
import { StampselectorService } from './stampselector.service';

describe('StampselectorService', () => {
  let mockSvgEl: jasmine.SpyObj<SVGElement>;
  let service: StampselectorService;
  let event: MouseEvent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StampselectorService, StampSelectorProperties],
    });
    mockSvgEl = jasmine.createSpyObj('SVGElement', ['setAttribute']);
    service = TestBed.get(StampselectorService);
    mockSvgEl.setAttribute.and.callThrough();
    event =  new MouseEvent('mousedown', {clientX: 50, clientY: 50});
});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#_Current() should set imgUrl to be equal the image path', () => {
    const imageCurrentPath = '../../../../assets/imgs/mich1';
    const defaultPath = '../../../../assets/imgs/';
    service._Current = imageCurrentPath;
    expect(service['properties'].imgUrl).toEqual(defaultPath + '../../../../assets/imgs/mich1' + '.png');
  });

  it('#_ImageChosen() should set isChosen to be equal the imageChosen', () => {
    const isChosen = true;
    service._ImageChosen  = isChosen;
    expect(service['properties'].imageChosen).toEqual(isChosen);
  });

  it('#incrementScalingFactor() should decrease denominator if denominator >1 and emit change ', () => {
    service['properties'].denominatorScale = 2;
    service['properties'].nominatorScale = 5;
    spyOn(service.denominator, 'emit').and.callThrough();
    service.incrementScalingFactor();
    expect(service['properties'].denominatorScale).toEqual(1);
    expect(service.denominator.emit).toHaveBeenCalled();
  });

  it('#incrementScalingFactor() should not decrease denominator if denominator <1 and not emit change ', () => {
    service['properties'].denominatorScale = 1;
    service['properties'].nominatorScale = 5;
    spyOn(service.denominator, 'emit').and.callThrough();
    service.incrementScalingFactor();
    expect(service['properties'].denominatorScale).toEqual(1);
    expect(service.denominator.emit).not.toHaveBeenCalled();
  });

  it('#incrementScalingFactor() should increase nominator if nominator <5 and denominator=1 and emit change', () => {
    service['properties'].denominatorScale = 1;
    service['properties'].nominatorScale = 2;
    spyOn(service.nominator, 'emit').and.callThrough();
    service.incrementScalingFactor();
    expect(service['properties'].nominatorScale).toEqual(3);
    expect(service.nominator.emit).toHaveBeenCalled();
  });

  it('#decrementScalingFactor() should decrease nominator if nominator >1 and emit change', () => {
    service['properties'].nominatorScale = 2;
    spyOn(service.nominator, 'emit').and.callThrough();
    service.decrementScalingFactor();
    expect(service['properties'].nominatorScale).toEqual(1);
    expect(service.nominator.emit).toHaveBeenCalled();
  });

  it('#decrementScalingFactor() should not decrease nominator if nominator <5 and not emit change', () => {
    service['properties'].nominatorScale = 1;
    service['properties'].denominatorScale = 6;
    spyOn(service.nominator, 'emit').and.callThrough();
    service.decrementScalingFactor();
    expect(service['properties'].nominatorScale).toEqual(1);
    expect(service.nominator.emit).not.toHaveBeenCalled();
  });

  it('#decrementScalingFactor() should increase denominator if denominator <5 and emit change ', () => {
    service['properties'].denominatorScale = 2;
    spyOn(service.denominator, 'emit').and.callThrough();
    service.decrementScalingFactor();
    expect(service['properties'].denominatorScale).toEqual(3);
    expect(service.denominator.emit).toHaveBeenCalled();
  });

  it('#incrementRotationFactor() should increase rotation factor and emit change', () => {
    service['properties'].rotationFactor = 1;
    spyOn(service.rotationFact, 'emit').and.callThrough();
    service.incrementRotationFactor();
    expect(service['properties'].rotationFactor).toEqual(16);
    expect(service.rotationFact.emit).toHaveBeenCalled();
  });

  it('#incrementRotationFactor() should not increase rotation factor and emit change when rotationFactor > 15', () => {
    service['properties'].rotationFactor = 200;
    spyOn(service.rotationFact, 'emit').and.callThrough();
    service.incrementRotationFactor();
    expect(service['properties'].rotationFactor).toEqual(200);
    expect(service.rotationFact.emit).not.toHaveBeenCalled();
  });

  it('#decrementRotationFactor() should decrease rotation factor and emit change', () => {
    service['properties'].rotationFactor = 1;
    spyOn(service.rotationFact, 'emit').and.callThrough();
    service.decrementRotationFactor();
    expect(service['properties'].rotationFactor).toEqual(-14);
    expect(service.rotationFact.emit).toHaveBeenCalled();
  });

  it('#decrementRotationFactor() should not decrease rotation factor and emit change when rotationFactor < -180', () => {
    service['properties'].rotationFactor = -190;
    spyOn(service.rotationFact, 'emit').and.callThrough();
    service.decrementRotationFactor();
    expect(service['properties'].rotationFactor).toEqual(-190);
    expect(service.rotationFact.emit).not.toHaveBeenCalled();
  });

  it('#mouseDown should not call appendChild when imageChosen is false', () => {
    service['properties'].imageChosen = false;
    // tslint:disable-next-line: no-string-literal
    spyOn(service['renderer'], 'insertBefore');
    service.mouseDown(event);
    // tslint:disable-next-line: no-string-literal
    expect(service['renderer'].insertBefore).not.toHaveBeenCalled();
  });
});
