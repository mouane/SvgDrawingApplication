import { TestBed } from '@angular/core/testing';
import { RotateService } from './rotate.service';

describe('RotateService', () => {
  let service: RotateService;
  let mockSvg: jasmine.SpyObj<SVGElement>;
  let mockSvgElem: jasmine.SpyObj<SVGAElement>;
  let mockDom1: jasmine.SpyObj<DOMRect>;
  let mEvent: MouseEvent;
  let mEventAltKey: MouseEvent;
  let mockChildNode: jasmine.SpyObj<Node[]>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(RotateService);
    mEventAltKey = new MouseEvent('mousedown', { clientX: 50, clientY: 50, altKey: true});
    mEvent = new MouseEvent('mousedown', { clientX: 50, clientY: 50, altKey: false});
    mockSvgElem = jasmine.createSpyObj('SVGElement', ['getAttribute', 'setAttribute', 'getBBox', 'getBoundingClientRect',
    'setAttributeNS']);
    mockSvg = jasmine.createSpyObj('SVGElement', ['contains']);
    mockChildNode = jasmine.createSpyObj('Node[]', ['']);
    mockDom1 = jasmine.createSpyObj('DOMRect', ['']);
    Object.defineProperty(mockDom1, 'x', {value: 10});
    Object.defineProperty(mockDom1, 'y', {value: 10});
    Object.defineProperty(mockDom1, 'width', {value: 10});
    Object.defineProperty(mockDom1, 'height', {value: 10});
    mockSvg.contains.and.callThrough();
    mockSvgElem.setAttribute.and.callThrough();
    mockSvgElem.getBoundingClientRect.and.callThrough();
    mockSvgElem.getBBox.and.returnValue(mockDom1);
    service['selectorProperties'].selctedChilds = mockChildNode;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('setCurrentSelectedChild should set currentSelect to properties.selected and onNewSelection true', () => {
    service.setCurrentSelectedChilds();
    expect(service['properties'].currentSelected).toBe(service['selectorProperties'].selctedChilds);
    expect(service['properties'].onNewSelection).toBeTruthy();
  });
  // ------------------------------ ROTATIONFACTOR ---------------------------------
  it('incrementRotationFactor should increment rotationFactor by 1 if altkey and call rotate', () => {
    service['properties'].rotator = 0;
    spyOn(service, 'rotate');
    service.incrementRotationFactor(mEventAltKey);
    expect(service['properties'].rotator).toBe(1);
    expect(service.rotate).toHaveBeenCalledWith(mEvent.shiftKey, service['properties'].INCREMENT);
  });
  it('incrementRotationFactor should increment rotationFactor by 15 if not altkey and call rotate', () => {
    service['properties'].rotator = 0;
    spyOn(service, 'rotate');
    service.incrementRotationFactor(mEvent);
    expect(service['properties'].rotator).toBe(service['properties'].ROTATIONFACT);
    expect(service.rotate).toHaveBeenCalledWith(mEvent.shiftKey, service['properties'].INCREMENT);
  });
  it('decrementRotationFactor should decrement rotationFactor by 1 if altkey and call rotate', () => {
    service['properties'].rotator = 0;
    spyOn(service, 'rotate');
    service.decrementRotationFactor(mEventAltKey);
    expect(service['properties'].rotator).toBe(-1);
    expect(service.rotate).toHaveBeenCalledWith(mEvent.shiftKey, service['properties'].DECREMENT);
  });
  it('decrementRotationFactor should decrement rotationFactor by 15 if not altkey  and call rotate', () => {
    service['properties'].rotator = 0;
    spyOn(service, 'rotate');
    service.decrementRotationFactor(mEvent);
    expect(service['properties'].rotator).toBe(-service['properties'].ROTATIONFACT);
    expect(service.rotate).toHaveBeenCalledWith(mEvent.shiftKey, service['properties'].DECREMENT);
  });
  it('setCurrentSelectedChilds should set currentSelected to svg selector selected childs and onNewSelection true', () => {
    service['properties'].onNewSelection = false;
    service.setCurrentSelectedChilds();
    expect(service['properties'].currentSelected).toBe(service['selectorProperties'].selctedChilds);
    expect(service['properties'].onNewSelection).toBeTruthy();
  });
  it('resetRotationFactor should set rotationFactor to 15 if differentToggles true', () => {
    service['properties'].rotator = 100;
    service['properties'].rotationFactor = service['properties'].ROTATIONFACT;
    service['properties'].differentToggled = true;
    service.resetRotationFactor();
    expect(service['properties'].rotator).toBe(service['properties'].ROTATIONFACT);
    expect(service['properties'].differentToggled).toBeFalsy();
    expect(service['properties'].rotationAtThisCenterExists).toBeFalsy();
  });
  it('resetRotationFactor should set rotationFactor to 0 if differentToggles not true', () => {
    service['properties'].rotator = 100;
    service['properties'].differentToggled = false;
    service.resetRotationFactor();
    expect(service['properties'].rotator).toBe(0);
    expect(service['properties'].rotationAtThisCenterExists).toBeFalsy();
  });
  // ---------------------------------- ROTATE ---------------------------------
  it('rotate should NOT call resetRotationFactor, call rotateCenterOfSelection and set different false if shift is true dans different is false', () => {
    service['properties'].differentToggled = false;
    service['properties'].different = false;
    spyOn(service, 'resetRotationFactor');
    spyOn(service, 'rotateCenterOfItem');
    service.rotate(true, service['properties'].INCREMENT);
    expect(service.resetRotationFactor).not.toHaveBeenCalled();
    expect(service.rotateCenterOfItem).toHaveBeenCalledWith(service['properties'].INCREMENT);
    expect(service['properties'].different).toBeFalsy();
    expect(service['properties'].differentToggled).toBeFalsy();
  });
  it('rotate should call resetRotationFactor, rotateCenterOfSelection and set different false if shift = true and different = true', () => {
    service['properties'].differentToggled = false;
    service['properties'].different = true;
    spyOn(service, 'resetRotationFactor');
    spyOn(service, 'rotateCenterOfItem');
    service.rotate(true, service['properties'].INCREMENT);
    expect(service.resetRotationFactor).toHaveBeenCalled();
    expect(service.rotateCenterOfItem).toHaveBeenCalledWith(service['properties'].INCREMENT);
    expect(service['properties'].different).toBeFalsy();
    expect(service['properties'].differentToggled).toBeTruthy();
  });
  it('rotate should NOT call resetRotationFactor, call rotateCenterOfItem and set different', () => {
    service['properties'].differentToggled = false;
    service['properties'].different = true;
    spyOn(service, 'resetRotationFactor');
    spyOn(service, 'rotateCenterOfSelection');
    service.rotate(false, service['properties'].INCREMENT);
    expect(service.resetRotationFactor).not.toHaveBeenCalled();
    expect(service.rotateCenterOfSelection).toHaveBeenCalledWith(service['properties'].INCREMENT);
    expect(service['properties'].different).toBeTruthy();
    expect(service['properties'].differentToggled).toBeFalsy();
  });
  it('rotate should call resetRotationFactor, rotateCenterOfItem and set different true if shift is false and different is true', () => {
    service['properties'].differentToggled = false;
    service['properties'].different = false;
    spyOn(service, 'resetRotationFactor');
    spyOn(service, 'rotateCenterOfSelection');
    service.rotate(false, service['properties'].INCREMENT);
    expect(service.resetRotationFactor).toHaveBeenCalled();
    expect(service.rotateCenterOfSelection).toHaveBeenCalledWith(service['properties'].INCREMENT);
    expect(service['properties'].different).toBeTruthy();
    expect(service['properties'].differentToggled).toBeTruthy();
  });
  // ----------------------------------  ROTATE CENTER OF SELECTION -------------------------------------------
  it('rotateCenterOfItem should do nothing if selectedChilds.lenght not >= 1 ', () => {
    spyOn(service['selector'], 'updateSelectBox');
    spyOn(service, 'ifRotationWithThisCenterExist');
    service.rotateCenterOfSelection(service['properties'].INCREMENT);
    expect(service.ifRotationWithThisCenterExist).not.toHaveBeenCalled();
    expect(service['selector'].updateSelectBox).not.toHaveBeenCalled();
  });
  it('rotateCenterOfItem should rotate center of selection box if selectedChilds.lenght >= 1 ', () => {
    service['selectorProperties'].selctedChilds = [mockSvgElem];
    service['properties'].rotationAtThisCenterExists = true;
    service['properties'].tempRotation = 10;
    service['properties'].oldScale = '';
    service['properties'].oldRotateCenterItem = '';
    spyOn(service['selector'], 'updateSelectBox');
    spyOn(service, 'ifRotationWithThisCenterExist');
    service['selectorProperties'].selectBox = mockSvgElem;
    service.rotateCenterOfSelection(service['properties'].INCREMENT);
    expect(service['properties'].onNewSelection).toBeFalsy();
    expect(service.ifRotationWithThisCenterExist).toHaveBeenCalled();
    expect(service['selector'].updateSelectBox).toHaveBeenCalled();
    expect(mockSvgElem.setAttribute).toHaveBeenCalledWith('transform',
      'rotate(10 15 15)');
  });
  it('rotateCenterOfItem should set tempAttribute if currentSleceted = selctedChilds', () => {
    service['selectorProperties'].selctedChilds = [mockSvgElem];
    service['properties'].currentSelected = service['selectorProperties'].selctedChilds;
    service['properties'].onNewSelection = false;
    service['properties'].rotationAtThisCenterExists = true;
    service['properties'].existRotate = true;
    service['properties'].tempRotation = 10;
    service['properties'].oldScale = '';
    service['properties'].oldRotateCenterItem = '';
    service['properties'].oldRotateCenterSelection = '';
    service['properties'].oldCenterX = 20;
    service['properties'].oldCenterY = 20;
    spyOn(service['selector'], 'updateSelectBox');
    spyOn(service, 'ifRotationWithThisCenterExist');
    service['selectorProperties'].selectBox = mockSvgElem;
    service.rotateCenterOfSelection(service['properties'].INCREMENT);
    expect(mockSvgElem.setAttribute).toHaveBeenCalledWith('transform', 'rotate(10 20 20)');
  });
  it('rotateCenterOfItem should set tempAttribute if rotationAtThisCenterExist = false and existRotate = true', () => {
    service['selectorProperties'].selctedChilds = [mockSvgElem];
    service['properties'].rotationAtThisCenterExists = false;
    service['properties'].existRotate = true;
    service['properties'].rotator = 10;
    service['properties'].oldScale = '';
    service['properties'].oldRotateCenterItem = '';
    service['properties'].oldRotateCenterSelection = '';
    spyOn(service['selector'], 'updateSelectBox');
    spyOn(service, 'ifRotationWithThisCenterExist');
    service['selectorProperties'].selectBox = mockSvgElem;
    service.rotateCenterOfSelection(service['properties'].INCREMENT);
    expect(mockSvgElem.setAttribute).toHaveBeenCalledWith('transform', 'rotate(10 15 15)');
  });
  it('rotateCenterOfItem should set tempAttribute if rotationAtThisCenterExist/existRotate = false', () => {
    service['selectorProperties'].selctedChilds = [mockSvgElem];
    service['properties'].rotationAtThisCenterExists = false;
    service['properties'].existRotate = false;
    service['properties'].rotator = 10;
    service['properties'].oldScale = '';
    service['properties'].oldRotateCenterItem = '';
    spyOn(service['selector'], 'updateSelectBox');
    spyOn(service, 'ifRotationWithThisCenterExist');
    service['selectorProperties'].selectBox = mockSvgElem;
    service.rotateCenterOfSelection(service['properties'].INCREMENT);
    expect(mockSvgElem.setAttribute).toHaveBeenCalledWith('transform', 'rotate(10 15 15)');
  });
  // -----------------------------------------  ROTATE CENTER OF ITEMS SELECTED -----------------------------------------------
  it('rotateCenterOfItem should do nothing if selectedChilds.lenght not >= 1 ', () => {
    spyOn(service['selector'], 'updateSelectBox');
    spyOn(service, 'ifRotationWithThisCenterExist');
    service.rotateCenterOfItem(service['properties'].INCREMENT);
    expect(service.ifRotationWithThisCenterExist).not.toHaveBeenCalled();
    expect(service['selector'].updateSelectBox).not.toHaveBeenCalled();
  });
  it('rotateCenterOfItem should set attribute rotate to center of element if selectedChilds.lenght == 1 and no existing transformation or rotation', () => {
    service['properties'].existRotate = false;
    service['properties'].oldRotateCenterSelection = '';
    service['properties'].oldScale = '';
    service['selectorProperties'].selctedChilds = [mockSvgElem];
    spyOn(service['selector'], 'updateSelectBox');
    spyOn(service, 'ifRotationWithThisCenterExist');
    service.rotateCenterOfItem(service['properties'].INCREMENT);
    expect(service.ifRotationWithThisCenterExist).toHaveBeenCalledWith((mockSvgElem as SVGElement), 15, 15,
     service['properties'].INCREMENT);
    expect(mockSvgElem.setAttribute).toHaveBeenCalledWith('transform', service['properties'].oldRotateCenterSelection
    + service['properties'].oldScale + 'rotate(0,15,15)');
    expect(service['properties'].rotationAtThisCenterExists).toBeFalsy();
    expect(service['properties'].existRotate).toBeFalsy();
    expect(service['properties'].onNewSelection).toBeTruthy();
    expect(service['selector'].updateSelectBox).toHaveBeenCalled();
  });
  it('rotateCenterOfItem should and keep old transforms and set attribute rotate  to center of element if selectedChilds.lenght == 1 if rotation at this center already exists', () => {
    service['properties'].existRotate = false;
    service['properties'].oldRotateCenterSelection = '';
    service['properties'].oldScale = '';
    service['selectorProperties'].selctedChilds = [mockSvgElem, mockSvgElem];
    spyOn(service['selector'], 'updateSelectBox');
    spyOn(service, 'ifRotationWithThisCenterExist');
    service.rotateCenterOfItem(service['properties'].INCREMENT);
    expect(service.ifRotationWithThisCenterExist).toHaveBeenCalledWith((mockSvgElem as SVGElement), 15, 15,
    service['properties'].INCREMENT);
    expect(mockSvgElem.setAttribute).toHaveBeenCalledWith('transform', service['properties'].oldRotateCenterSelection
    + service['properties'].oldScale + 'rotate(0,15,15)');
    expect(service['properties'].rotationAtThisCenterExists).toBeFalsy();
    expect(service['properties'].existRotate).toBeFalsy();
    expect(service['properties'].onNewSelection).toBeTruthy();
    expect(service['selector'].updateSelectBox).toHaveBeenCalled();
  });
  it('rotateCenterOfItem should and keep old transforms and set attribute rotate  to center of element if selectedChilds.lenght == 1 if existing transformation or rotation', () => {
    service['properties'].existRotate = false;
    service['properties'].oldRotateCenterSelection = '';
    service['properties'].oldScale = '';
    service['properties'].oldRotateCenterItem = '';
    service['properties'].existRotate = true;
    mockSvgElem.setAttribute('transform', 'rotate(0,30,30)');
    service['selectorProperties'].selctedChilds = [mockSvgElem];
    spyOn(service['selector'], 'updateSelectBox');
    spyOn(service, 'ifRotationWithThisCenterExist');
    service.rotateCenterOfItem(service['properties'].INCREMENT);
    expect(service.ifRotationWithThisCenterExist).toHaveBeenCalledWith((mockSvgElem as SVGElement), 15, 15,
     service['properties'].INCREMENT);
    expect(mockSvgElem.setAttribute).toHaveBeenCalledWith('transform', service['properties'].oldRotateCenterSelection
    + service['properties'].oldScale  + 'rotate(0,30,30)');
    expect(mockSvgElem.setAttribute).toHaveBeenCalledWith('transform', service['properties'].oldRotateCenterSelection
    + service['properties'].oldScale  + 'rotate(0,15,15)');
    expect(service['properties'].rotationAtThisCenterExists).toBeFalsy();
    expect(service['properties'].existRotate).toBeFalsy();
    expect(service['properties'].onNewSelection).toBeTruthy();
    expect(service['selector'].updateSelectBox).toHaveBeenCalled();
  });
  it('rotateCenterOfItem should set tempAttribute if rotationAtThisCenterExist/existRotate = true', () => {
    service['properties'].rotationAtThisCenterExists = true;
    service['properties'].oldRotateCenterSelection = '';
    service['properties'].oldScale = '';
    service['properties'].oldRotateCenterItem = '';
    service['properties'].existRotate = true;
    service['properties'].tempRotation = 0;
    service['selectorProperties'].selctedChilds = [mockSvgElem];
    spyOn(service['selector'], 'updateSelectBox');
    spyOn(service, 'ifRotationWithThisCenterExist');
    service.rotateCenterOfItem(service['properties'].INCREMENT);
    expect(mockSvgElem.setAttribute).toHaveBeenCalledWith('transform', service['properties'].oldRotateCenterSelection
    + service['properties'].oldScale + service['properties'].oldRotateCenterItem + 'rotate(0,15,15)');
  });
  it('rotateCenterOfItem should set tempAttribute if rotationAtThisCenterExist = true and existRotate = false', () => {
    service['properties'].rotationAtThisCenterExists = true;
    service['properties'].oldRotateCenterSelection = '';
    service['properties'].oldScale = '';
    service['properties'].oldRotateCenterItem = '';
    service['properties'].existRotate = false;
    service['properties'].tempRotation = 0;
    service['selectorProperties'].selctedChilds = [mockSvgElem];
    spyOn(service['selector'], 'updateSelectBox');
    spyOn(service, 'ifRotationWithThisCenterExist');
    service.rotateCenterOfItem(service['properties'].INCREMENT);
    expect(mockSvgElem.setAttribute).toHaveBeenCalledWith('transform', service['properties'].oldRotateCenterSelection
    + service['properties'].oldScale  + 'rotate(0,15,15)');
  });
  // --------------- VERIFY IF ROTATION ALREADY EXISTS ON SELECTED ITEMS IN ORDER NOT TO WIPE THEM -----------------------
  it('ifRotationWithThisCenterExist should set old translate or scale in this.oldscale ', () => {
    service['properties'].oldScale = '';
    mockSvgElem.getAttribute.and.returnValue('translate(1,1,1)');
    service.ifRotationWithThisCenterExist((mockSvgElem as SVGElement), 15, 15, service['properties'].INCREMENT);
    expect(service['properties'].oldScale).toBe('translate(1,1,1)');
  });
  it('ifRotationWithThisCenterExist should not set old translate or scale if oldTransform is undefined', () => {
    service['properties'].oldScale = '';
    mockSvgElem.getAttribute.and.callThrough();
    service.ifRotationWithThisCenterExist((mockSvgElem as SVGElement), 15, 15, service['properties'].INCREMENT);
    expect(service['properties'].oldScale).toBe('');
  });
  it('ifRotationWithThisCenterExist should set old oldRotateCenterItem  if existing rotate from center of an item', () => {
    service['properties'].oldScale = '';
    mockSvgElem.getAttribute.and.returnValue('rotate(1,1,1)');
    service.ifRotationWithThisCenterExist((mockSvgElem as SVGElement), 15, 15, service['properties'].INCREMENT);
    expect(service['properties'].oldRotateCenterItem).toBe('rotate(1,1,1)');
    expect(service['properties'].existRotate).toBeTruthy();
  });
  it('ifRotationWithThisCenterExist should set old oldRotateCenterSelection  if existing rotate from center of a selection', () => {
    service['properties'].oldScale = '';
    mockSvgElem.getAttribute.and.returnValue('rotate(1 1 1)');
    service.ifRotationWithThisCenterExist((mockSvgElem as SVGElement), 15, 15, service['properties'].INCREMENT);
    expect(service['properties'].oldRotateCenterSelection).toBe('rotate(1 1 1)');
    expect(service['properties'].existRotate).toBeTruthy();
  });
  it('ifRotationWithThisCenterExist if rotation at this center exist of selection, should only increment the rotation factor from this center and set booleans', () => {
    service['properties'].oldScale = '';
    service['properties'].rotationFactor = service['properties'].ROTATIONFACT;
    mockSvgElem.getAttribute.and.returnValue('rotate(0,15,15)');
    service.ifRotationWithThisCenterExist((mockSvgElem as SVGElement), 15, 15, service['properties'].INCREMENT);
    expect(service['properties'].tempRotation).toBe(15);
    expect(service['properties'].rotationAtThisCenterExists).toBeTruthy();
    expect(service['properties'].existRotate).toBeFalsy();
  });
  it('ifRotationWithThisCenterExist if rotation at this center exist of selection, should only decrement the rotation factor from this center and set booleans', () => {
    service['properties'].oldScale = '';
    service['properties'].rotationFactor = service['properties'].ROTATIONFACT;
    mockSvgElem.getAttribute.and.returnValue('rotate(0,15,15)');
    service.ifRotationWithThisCenterExist((mockSvgElem as SVGElement), 15, 15, service['properties'].DECREMENT);
    expect(service['properties'].tempRotation).toBe(-15);
    expect(service['properties'].rotationAtThisCenterExists).toBeTruthy();
    expect(service['properties'].existRotate).toBeFalsy();
  });
  it('ifRotationWithThisCenterExist if rotation at this center exist of item, should only increment the rotation factor from this center and set booleans', () => {
    service['properties'].oldScale = '';
    service['properties'].rotationFactor = service['properties'].ROTATIONFACT;
    mockSvgElem.getAttribute.and.returnValue('rotate(0 15 15)');
    service.ifRotationWithThisCenterExist((mockSvgElem as SVGElement), 15, 15, service['properties'].INCREMENT);
    expect(service['properties'].tempRotation).toBe(15);
    expect(service['properties'].rotationAtThisCenterExists).toBeTruthy();
    expect(service['properties'].existRotate).toBeFalsy();
  });
  it('ifRotationWithThisCenterExist if rotation at this center exist of item, should only decrement the rotation factor from this center and set booleans', () => {
    service['properties'].oldScale = '';
    service['properties'].rotationFactor = service['properties'].ROTATIONFACT;
    mockSvgElem.getAttribute.and.returnValue('rotate(0 15 15)');
    service.ifRotationWithThisCenterExist((mockSvgElem as SVGElement), 15, 15, service['properties'].DECREMENT);
    expect(service['properties'].tempRotation).toBe(-15);
    expect(service['properties'].rotationAtThisCenterExists).toBeTruthy();
    expect(service['properties'].existRotate).toBeFalsy();
  });
});
