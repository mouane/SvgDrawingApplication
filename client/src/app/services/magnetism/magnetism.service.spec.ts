import { TestBed } from '@angular/core/testing';

import { MagnetismProperties } from 'src/app/classes/magnetismProperties/magnetism-properties';
import { MovingProperties } from 'src/app/classes/movingProperties/moving-properties';
import { SvgSelectorProperties } from 'src/app/classes/svgSelectorProperties/svg-properties';
import { MagnetismService } from './magnetism.service';

describe('MagnetismService', () => {
  let service: MagnetismService;
  let mockSvg: jasmine.SpyObj<SVGElement>;
  let childs: Node[];
  let eventMM: MouseEvent;
  let mockHtml: jasmine.SpyObj<HTMLElement>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MovingProperties, MagnetismProperties, SvgSelectorProperties],
    });
    service = TestBed.get(MagnetismService);
    mockSvg = jasmine.createSpyObj('SVGElement', ['getAttribute']);
    mockHtml = jasmine.createSpyObj('HTMLElement', ['getAttribute', 'setAttribute']);
    mockSvg.getAttribute.and.returnValue('50');
    service['selectorProperties'].selectBox = mockSvg;
    childs = [];
    eventMM = new MouseEvent('mousemove', {clientX: 50, clientY: 50});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#setObjects should set attributes selectBoxX/Y/WX/MX/WY/MY', () => {
    service.setObjects(childs, eventMM);
    expect(service['magnetismProperties'].selectBoxX).toBe(50);
    expect(service['magnetismProperties'].selectBoxY).toBe(50);
    expect(service['magnetismProperties'].selectBoxWX).toBe(100);
    expect(service['magnetismProperties'].selectBoxWY).toBe(100);
    expect(service['magnetismProperties'].selectBoxMX).toBe(75);
    expect(service['magnetismProperties'].selectBoxMY).toBe(75);
  });

  it('#setObjects should set attributes to 0 selectBoxX/Y/WX/MX/WY/MY', () => {
    mockSvg.getAttribute.and.callThrough();
    service.setObjects(childs, eventMM);
    expect(service['magnetismProperties'].selectBoxX).toBe(0);
    expect(service['magnetismProperties'].selectBoxY).toBe(0);
    expect(service['magnetismProperties'].selectBoxWX).toBe(0);
    expect(service['magnetismProperties'].selectBoxWY).toBe(0);
    expect(service['magnetismProperties'].selectBoxMX).toBe(0);
    expect(service['magnetismProperties'].selectBoxMY).toBe(0);
  });

  it('#setObjects should set attributes refX/refY/firstTime', () => {
    service.setObjects(childs, eventMM);
    expect(service['properties'].refX).toBe(50);
    expect(service['properties'].refY).toBe(50);
    expect(service['properties'].firstTime).toBeTruthy();
  });

  it('#setObjects should set attributes differenceX/Y/WX/WY/MX/MY', () => {
    service.setObjects(childs, eventMM);
    expect(service['magnetismProperties'].differenceX).toBe(-320);
    expect(service['magnetismProperties'].differenceY).toBe(0);
    expect(service['magnetismProperties'].differenceWX).toBe(370);
    expect(service['magnetismProperties'].differenceWY).toBe(50);
    expect(service['magnetismProperties'].differenceMX).toBe(345);
    expect(service['magnetismProperties'].differenceMY).toBe(25);
  });

  it('#setAnchor should set anchor', () => {
    const test = 'test';
    service.setAnchor(test);
    expect(service['magnetismProperties'].anchor).toBe(test);
  });

  it('#anchorFunc should return move and set offset', () => {
    const magnet = 51;
    const move = 50;
    service['properties'].refX = 100;
    service['gridService'].gridValue = 50;
    const result = service.anchorFunc(move, magnet, eventMM);
    expect(result).toBe(49);
    expect(service['magnetismProperties'].offset).toBe(100);
  });

  it('#anchorFunc should return move and set offset', () => {
    const magnet = 49;
    const move = 50;
    service['properties'].refX = 100;
    service['gridService'].gridValue = 50;
    const result = service.anchorFunc(move, magnet, eventMM);
    expect(result).toBe(51);
    expect(service['magnetismProperties'].offset).toBe(52);
  });

  describe('move', () => {
    beforeEach(() => {
      service['properties'].refX = 100;
      service['properties'].refY = 100;
      childs.pop();
    });

    it('#move should increment counter when firstTime is true and translateIndex > -1', () => {
      mockHtml.getAttribute.and.returnValue('translate');
      childs.push((mockHtml as Node));
      service['magnetismProperties'].counter = 0;
      service['properties'].firstTime = true;
      service['properties'].selectedChilds = childs;
      service.move(eventMM);
      expect(service['magnetismProperties'].counter).toBe(1);
    });

    it('#move should increment counter and set firstTime to false when firstTime is true and translateIndex > -1', () => {
      mockHtml.getAttribute.and.returnValue('translate');
      childs.push((mockHtml as Node));
      service['magnetismProperties'].counter = 1;
      service['properties'].firstTime = true;
      service['properties'].selectedChilds = childs;
      service.move(eventMM);
      expect(service['magnetismProperties'].counter).toBe(2);
      expect(service['properties'].firstTime).toBeFalsy();
    });

    it('#move should set oldTransform to empty and set translate', () => {
      mockHtml.getAttribute.and.returnValue('');
      childs.push((mockHtml as Node));
      service['magnetismProperties'].counter = 1;
      service['properties'].firstTime = true;
      service['properties'].selectedChilds = childs;
      service.move(eventMM);
      expect(service['magnetismProperties'].counter).toBe(1);
      expect(mockHtml.setAttribute).toHaveBeenCalledWith('transform',
        'translate(-50,-50)');
    });

    describe('move(switch)', () => {
      beforeEach(() => {
        mockHtml.getAttribute.and.returnValue('translate()');
        service['magnetismProperties'].counter = 0;
        service['magnetismProperties'].differenceX = 30;
        service['magnetismProperties'].differenceY = 25;
        service['magnetismProperties'].differenceWX = -30;
        service['magnetismProperties'].differenceWY = -25;
        service['magnetismProperties'].differenceMX = -30;
        service['magnetismProperties'].differenceMY = -25;
        service['gridService'].gridValue = 300;
        service['properties'].firstTime = false;
      });

      it('#move should set oldTransform to empty and set movingX/Y when anchor === topLeft', () => {
        childs.push((mockHtml as Node));
        service['properties'].selectedChilds = childs;
        service['magnetismProperties'].anchor = 'topLeft';
        service.move(eventMM);
        expect(mockHtml.setAttribute).toHaveBeenCalledWith('transform',
          'translate(-50,-75)');
      });

      it('#move should set oldTransform to empty and set movingX/Y when anchor === topCenter', () => {
        childs.push((mockHtml as Node));
        service['properties'].selectedChilds = childs;
        service['magnetismProperties'].anchor = 'topCenter';
        service.move(eventMM);
        expect(mockHtml.setAttribute).toHaveBeenCalledWith('transform',
          'translate(-50,-75)');
      });

      it('#move should set oldTransform to empty and set movingX/Y when anchor === topRight', () => {
        childs.push((mockHtml as Node));
        service['properties'].selectedChilds = childs;
        service['magnetismProperties'].anchor = 'topRight';
        service.move(eventMM);
        expect(mockHtml.setAttribute).toHaveBeenCalledWith('transform',
          'translate(-50,-75)');
      });

      it('#move should set oldTransform to empty and set movingX/Y when anchor === centerLeft', () => {
        childs.push((mockHtml as Node));
        service['properties'].selectedChilds = childs;
        service['magnetismProperties'].anchor = 'centerLeft';
        service.move(eventMM);
        expect(mockHtml.setAttribute).toHaveBeenCalledWith('transform',
          'translate(-50,-50)');
      });

      it('#move should set oldTransform to empty and set movingX/Y when anchor === centerMiddle', () => {
        childs.push((mockHtml as Node));
        service['properties'].selectedChilds = childs;
        service['magnetismProperties'].anchor = 'centerMiddle';
        service.move(eventMM);
        expect(mockHtml.setAttribute).toHaveBeenCalledWith('transform',
          'translate(-50,-75)');
      });

      it('#move should set oldTransform to empty and set movingX/Y when anchor === centerRight', () => {
        childs.push((mockHtml as Node));
        service['properties'].selectedChilds = childs;
        service['magnetismProperties'].anchor = 'centerRight';
        service.move(eventMM);
        expect(mockHtml.setAttribute).toHaveBeenCalledWith('transform',
          'translate(-50,-50)');
      });

      it('#move should set oldTransform to empty and set movingX/Y when anchor === bottomLeft', () => {
        childs.push((mockHtml as Node));
        service['properties'].selectedChilds = childs;
        service['magnetismProperties'].anchor = 'bottomLeft';
        service.move(eventMM);
        expect(mockHtml.setAttribute).toHaveBeenCalledWith('transform',
          'translate(-50,-75)');
      });

      it('#move should set oldTransform to empty and set movingX/Y when anchor === bottomCenter', () => {
        childs.push((mockHtml as Node));
        service['properties'].selectedChilds = childs;
        service['magnetismProperties'].anchor = 'bottomCenter';
        service.move(eventMM);
        expect(mockHtml.setAttribute).toHaveBeenCalledWith('transform',
          'translate(-50,-75)');
      });

      it('#move should set oldTransform to empty and set movingX/Y when anchor === bottomRight', () => {
        childs.push((mockHtml as Node));
        service['properties'].selectedChilds = childs;
        service['magnetismProperties'].anchor = 'bottomRight';
        service.move(eventMM);
        expect(mockHtml.setAttribute).toHaveBeenCalledWith('transform',
          'translate(-50,-75)');
      });

      it('#move should set oldTransform to empty and set movingX/Y when anchor is empty', () => {
        childs.push((mockHtml as Node));
        service['properties'].selectedChilds = childs;
        service['magnetismProperties'].anchor = '';
        service.move(eventMM);
        expect(mockHtml.setAttribute).toHaveBeenCalledWith('transform',
          'translate(-50,-50)');
      });
   });

    it('#move should set movingX/movingY if oldTransform is undefined', () => {
      mockHtml.getAttribute.and.callThrough();
      childs.push((mockHtml as Node));
      service['properties'].selectedChilds = childs;
      service.move(eventMM);
      expect(mockHtml.getAttribute('transform')).toBeUndefined();
      expect(mockHtml.setAttribute).toHaveBeenCalledWith('transform',
        'translate(-50,-50)');
    });
  });
});
