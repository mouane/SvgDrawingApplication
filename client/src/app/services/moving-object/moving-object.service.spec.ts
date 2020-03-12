import { TestBed } from '@angular/core/testing';

import { MovingProperties } from 'src/app/classes/movingProperties/moving-properties';
import { MovingObjectService } from './moving-object.service';

describe('MovingObjectService', () => {
  let service: MovingObjectService;
  let eventMv: MouseEvent;
  let mockHtml: jasmine.SpyObj<HTMLElement>;
  const childs: Node[] = [];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MovingProperties],
    });
    service = TestBed.get(MovingObjectService);
    mockHtml = jasmine.createSpyObj('HTMLElement', ['getAttribute', 'setAttribute']);
    eventMv = new MouseEvent('mousemove', {clientX: 50, clientY: 50});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#setObjects should call magnetism.setObjects if magnet is true', () => {
    service.magnet = true;
    spyOn(service['magnetism'], 'setObjects');
    service.setObjects(childs, eventMv);
    expect(service['magnetism'].setObjects).toHaveBeenCalledWith(childs, eventMv);
  });

  it('#setObjects should set counter, refX and refY', () => {
    service.magnet = false;
    service.setObjects(childs, eventMv);
    expect(service.counter).toBe(1);
    expect(service['properties'].refX).toBe(50);
    expect(service['properties'].refY).toBe(50);
  });
  describe('move', () => {
    beforeEach(() => {
      service['properties'].refX = 100;
      service['properties'].refY = 100;
      childs.pop();
    });
    it('#move should call magnetism.move if magnet is true', () => {
      service.magnet = true;
      spyOn(service['magnetism'], 'move');
      service.move(eventMv);
      expect(service['magnetism'].move).toHaveBeenCalledWith(eventMv);
    });

    it('#move should increment counter if oldTransform is true, translateIndex > 1 and firstTime is true', () => {
      service.magnet = false;
      childs.push((mockHtml as Node));
      mockHtml.getAttribute.and.returnValue('translate');
      service['properties'].selectedChilds = childs;
      service['properties'].firstTime = true;
      service.counter = 0;
      service.move(eventMv);
      expect(service.counter).toBe(1);
    });

    it('#move should increment counter if oldTransform is true, translateIndex > -1, firstTime is true and counter > 1', () => {
      service.magnet = false;
      childs.push((mockHtml as Node));
      mockHtml.getAttribute.and.returnValue('translate');
      service['properties'].selectedChilds = childs;
      service['properties'].firstTime = true;
      service.counter = 1;
      service.move(eventMv);
      expect(service.counter).toBe(2);
      expect(service['properties'].firstTime).toBeFalsy();
    });

    it('#move should change oldTransform if oldTransform is true, translateIndex > -1, firstTime is false and counter > 1', () => {
      service.magnet = false;
      childs.push((mockHtml as Node));
      mockHtml.getAttribute.and.returnValue('translate(50,50)');
      service['properties'].selectedChilds = childs;
      service['properties'].firstTime = false;
      service.counter = 1;
      service.move(eventMv);
      expect(mockHtml.setAttribute).toHaveBeenCalledWith('transform', 'translate(-50,-50)');
    });

    it('#move should change oldTransform if oldTransform is true, translateIndex > -1, firstTime is false and counter > 1', () => {
      service.magnet = false;
      mockHtml.getAttribute.and.callThrough();
      childs.push((mockHtml as Node));
      service['properties'].selectedChilds = childs;
      service.move(eventMv);
      expect(mockHtml.setAttribute).toHaveBeenCalledWith('transform', 'translate(-50,-50)');
    });
  });
});
