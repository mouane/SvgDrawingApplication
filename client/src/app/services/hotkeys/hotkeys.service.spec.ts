import { TestBed } from '@angular/core/testing';
import { EraserProperties } from 'src/app/classes/eraserProperties/eraser-properties';
import { SelectionParamsComponent } from 'src/app/components/selection-params/selection-params.component';
import {KEY, tools } from '../../enum';
import { HotkeysService } from '../hotkeys/hotkeys.service';
describe('HotkeysService', () => {
  let service: HotkeysService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectionParamsComponent, EraserProperties],
    });
    service = TestBed.get(HotkeysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#service should prevent defaut when ctlr key is pressed', () => {
    const event = new KeyboardEvent('keypress', {
      ctrlKey: true});
    service.welcomeWindowActive = false;
    service.popupActive = false;
    spyOn(event, 'preventDefault').and.callThrough();

    service.keyEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('#keyEvent should called multipleKeysCheck when ctlr and another key is pressed', () => {
    const event = new KeyboardEvent('keypress', {
      ctrlKey: true, key: KEY.KEY_O});
    service.welcomeWindowActive = false;
    service.popupActive = false;

    spyOn(service, 'multipleKeysCheck').and.callThrough();

    service.keyEvent(event);
    expect(service.multipleKeysCheck).toHaveBeenCalled();
  });
  it('#keyEvent should called singleKeyCheck when any single key is pressed', () => {
    const event = new KeyboardEvent('keypress', {
      key: KEY.KEY_C});
    service.welcomeWindowActive = false;
    service.popupActive = false;

    spyOn(service, 'singleKeyCheck').and.callThrough();

    service.keyEvent(event);
    expect(service.singleKeyCheck).toHaveBeenCalled();
  });

  it('#KeyEvent should not call singleKeyCheck when any single key is pressed and popupActive is true', () => {
    const event = new KeyboardEvent('keypress', {
      key: KEY.KEY_C});
    service.welcomeWindowActive = false;
    service.popupActive = true;

    spyOn(service, 'singleKeyCheck').and.callThrough();

    service.keyEvent(event);
    expect(service.singleKeyCheck).not.toHaveBeenCalled();
  });

  it('#multipleKeysCheck should receive keyboard event ctrl + KEY_O and emit "createDrawing', () => {
    const event = new KeyboardEvent('keypress', {
     ctrlKey: true, key: KEY.KEY_O});
    spyOn(service.change, 'emit');
    service.multipleKeysCheck(event);
    expect(service.change.emit).toHaveBeenCalledWith(tools.CREATEDRAWING);
 });

  it('#multipleKeysCheck should receive keyboard event ctrl + KEY_O and not emit "createDrawing if popupActive is true', () => {
  const event = new KeyboardEvent('keypress', {
   ctrlKey: true, key: KEY.KEY_O});
  service.popupActive = true;
  spyOn(service.change, 'emit');
  service.multipleKeysCheck(event);
  expect(service.change.emit).not.toHaveBeenCalledWith(tools.CREATEDRAWING);
});

  it('#singleKeyCheck should receive keyboard event KEY and emit corresponding action' , () => {
    const eventC = new KeyboardEvent('keypress', {
      key: KEY.KEY_C});
    const eventW = new KeyboardEvent('keypress', {
      key: KEY.KEY_W});
    const event1 = new KeyboardEvent('keypress', {
      key: KEY.KEY_1});
    const event2 = new KeyboardEvent('keypress', {
      key: KEY.KEY_2});
    const event3 = new KeyboardEvent('keypress', {
      key: KEY.KEY_3});
    const eventL = new KeyboardEvent('keypress', {
      key: KEY.KEY_L});
    const eventS = new KeyboardEvent('keypress', {
      key: KEY.KEY_S});
    const eventR = new KeyboardEvent('keypress', {
      key: KEY.KEY_R});
    const eventBackspace = new KeyboardEvent('keypress', {
      key: KEY.KEY_BACKSPACE});
    const eventEscape = new KeyboardEvent('keypress', {
      key: KEY.KEY_ESCAPE});
    spyOn(service.change, 'emit');
    service.singleKeyCheck(eventC);
    expect(service.change.emit).toHaveBeenCalledWith(tools.PENCIL);
    service.singleKeyCheck(eventW);
    expect(service.change.emit).toHaveBeenCalledWith(tools.BRUSH);
    service.singleKeyCheck(event1);
    expect(service.change.emit).toHaveBeenCalledWith(tools.RECTANGLE);
    service.singleKeyCheck(event2);
    expect(service.change.emit).toHaveBeenCalledWith(tools.CIRCLE);
    service.singleKeyCheck(event3);
    expect(service.change.emit).toHaveBeenCalledWith(tools.POLYGON);
    service.singleKeyCheck(eventL);
    expect(service.change.emit).toHaveBeenCalledWith(tools.LINE);
    service.singleKeyCheck(eventS);
    expect(service.change.emit).toHaveBeenCalledWith(tools.SELECT);
    service.singleKeyCheck(eventR);
    expect(service.change.emit).toHaveBeenCalledWith(tools.APPCOLOR);
    service.singleKeyCheck(eventBackspace);
    expect(service.change.emit).toHaveBeenCalledWith(KEY.KEY_BACKSPACE);
    service.singleKeyCheck(eventEscape);
    expect(service.change.emit).toHaveBeenCalledWith(KEY.KEY_ESCAPE);
 });

  it('#singleKeyCheck() should not emit if event.key is not one of the case', () => {
    const eventDefault = new KeyboardEvent('keypress', {});
    spyOn(service.change, 'emit');
    service.singleKeyCheck(eventDefault);
    expect(service.change.emit).not.toHaveBeenCalled();
  });

  // tslint:disable-next-line: max-line-length
  it('#popupBoolChange() function should set popupActive to true when input is true and to false when input is false', () => {
  service.popupBoolChange(true);
  expect(service.popupActive).toBeTruthy();
  service.popupBoolChange(false);
  expect(service.popupActive).toBeFalsy();
});
});
