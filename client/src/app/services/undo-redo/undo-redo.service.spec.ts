import { TestBed } from '@angular/core/testing';

import { Renderer2 } from '@angular/core';
import { of } from 'rxjs';
import { BrushProperties } from 'src/app/classes/brushProperties/brush-properties';
import { ColorToolProperties } from 'src/app/classes/colorToolProperties/color-tool-properties';
import { EraserProperties } from 'src/app/classes/eraserProperties/eraser-properties';
import { LineProperties } from 'src/app/classes/lineProperties/line-properties';
import { PencilProperties } from 'src/app/classes/pencilProperties/pencil-properties';
import { PenToolProperties } from 'src/app/classes/penProperties/pen-properties';
import { PipetteProperties } from 'src/app/classes/pipetteProperties/pipette-properties';
import { ShapeProperties } from 'src/app/classes/shapeProperties/shape-properties';
import { StampSelectorProperties } from 'src/app/classes/stampProperties/stamp-properties';
import { SvgSelectorProperties } from 'src/app/classes/svgSelectorProperties/svg-properties';
import { SvgShapeElements } from 'src/app/classes/svgShapeElements/svg-shape-elements';
import { TextProperties } from 'src/app/classes/textProperties/textProperties';
import { UndoRedoProperties } from 'src/app/classes/undoRedoProperties/undo-redo-properties';
import { ConfigureDrawingSizeService } from '../configure-drawing-size/configure-drawing-size';
import { UndoRedoService } from './undo-redo.service';

describe('UndoRedoService', () => {
  let service: UndoRedoService;
  let mockSvg: jasmine.SpyObj<SVGElement>;
  let mockRenderer: jasmine.SpyObj<Renderer2>;
  let mockDrawingDiv: jasmine.SpyObj<HTMLElement>;
  let mockDrawingView: jasmine.SpyObj<SVGElement>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColorToolProperties, ShapeProperties, SvgShapeElements, PencilProperties, PenToolProperties,
                  BrushProperties, PipetteProperties, LineProperties, StampSelectorProperties, SvgSelectorProperties, TextProperties,
                  UndoRedoProperties, EraserProperties, {provide: ConfigureDrawingSizeService, useValue: {changeHEX: of('#ffffff')}}],
    });
    service = TestBed.get(UndoRedoService);
    mockSvg = jasmine.createSpyObj('SVGElement', ['cloneNode', 'style']);

    mockDrawingDiv = jasmine.createSpyObj('HTMLElement', ['']);
    mockDrawingView = jasmine.createSpyObj('SVGElement', ['']);

    mockRenderer = jasmine.createSpyObj('Renderer2', ['appendChild', 'removeChild', 'listen', 'setStyle', 'insertBefore']);
    mockRenderer.appendChild.and.callThrough();
    mockRenderer.removeChild.and.callThrough();
    mockRenderer.setStyle.and.callThrough();
    service['undoRedoProperties'].renderer = mockRenderer;
    service['undoRedoProperties'].drawingDiv = mockDrawingDiv;
    service['undoRedoProperties'].drawingView = mockDrawingView;

});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#childNodesChange should add view in case of changes', () => {
    service['undoRedoProperties'].onChange =  true;
    spyOn(service, 'addView');
    service.childNodesChange(mockSvg);
    expect(service.addView).toHaveBeenCalledWith(mockSvg);
    expect(service['undoRedoProperties'].onChange).toBe(false);
  });

  it('#childNodesChange should not add view in case of no change', () => {
    service['undoRedoProperties'].onChange =  false;
    spyOn(service, 'addView');
    service.childNodesChange(mockSvg);
    expect(service.addView).not.toHaveBeenCalledWith(mockSvg);
  });

  it('#undo should  decrement itterator and swap view if there are actions', () => {
    service['undoRedoProperties'].itterator = 1;
    service['undoRedoProperties'].actions = [mockSvg, mockSvg];
    spyOn(service, 'swapView');
    spyOn(service, 'checkItterator');
    service.undo();
    expect(service['undoRedoProperties'].itterator).toBe(0);
    expect(service.swapView).toHaveBeenCalledWith(service['undoRedoProperties'].actions[service['undoRedoProperties'].itterator]);
    expect(service.checkItterator).toHaveBeenCalled();

  });
  it('#undo should not decrement itterator and not call swap view if there are no action', () => {
    service['undoRedoProperties'].itterator = 0;
    spyOn(service, 'swapView');
    spyOn(service, 'checkItterator');
    service.undo();
    expect(service['undoRedoProperties'].itterator).toBe(0);
    expect(service.swapView).not.toHaveBeenCalled();
    expect(service.checkItterator).toHaveBeenCalled();
  });

  it('#redo should increment itterator and swap view if itterator doesnt correspond to the last action ', () => {
    service['undoRedoProperties'].itterator = 0;
    service['undoRedoProperties'].actions = [mockSvg, mockSvg];
    spyOn(service, 'swapView');
    spyOn(service, 'checkItterator');
    service.redo();
    expect(service['undoRedoProperties'].itterator).toBe(1);
    expect(service.swapView).toHaveBeenCalledWith(service['undoRedoProperties'].actions[service['undoRedoProperties'].itterator]);
    expect(service.checkItterator).toHaveBeenCalled();
  });

  it('#redo should not increment itterator and swap view if itterator correspond to the latest view ', () => {
    service['undoRedoProperties'].itterator = 1;
    service['undoRedoProperties'].actions = [mockSvg, mockSvg];
    spyOn(service, 'swapView');
    spyOn(service, 'checkItterator');
    service.redo();
    expect(service['undoRedoProperties'].itterator).toBe(1);
    expect(service.swapView).not.toHaveBeenCalled();
    expect(service.checkItterator).toHaveBeenCalled();
  });

  it('#checkItterator should test if update redo with false if itterator is at the head of actions', (done) => {
    service['undoRedoProperties'].itterator = 0 ;
    service['undoRedoProperties'].actions = [mockSvg];
    service.updateRedo.subscribe((g: boolean) => {
      expect(g).toBe(false);
      done();
    });
    service.checkItterator();
  });

  it('#checkItterator should update redo with true if itterator is at the head of actions', (done) => {
    service['undoRedoProperties'].itterator = 0 ;
    service['undoRedoProperties'].actions = [mockSvg, mockSvg];
    service.updateRedo.subscribe((g: boolean) => {
      expect(g).toBe(true);
      done();
    });
    service.checkItterator();
  });
  it('#checkItterator should update undo with true if itterator > 0 (possible previous actions)', (done) => {
    service['undoRedoProperties'].itterator = 1 ;
    service.updateUndo.subscribe((g: boolean) => {
      expect(g).toBe(true);
      done();
    });
    service.checkItterator();
  });
  it('#checkItterator should update undo with false if itterator = 0 (no previos actions) ', (done) => {
    service['undoRedoProperties'].itterator = 0 ;
    service.updateUndo.subscribe((g: boolean) => {
      expect(g).toBe(false);
      done();
    });
    service.checkItterator();
  });

  it('#addView should pop all actions ahead in case of modification to the current action', () => {
    service['undoRedoProperties'].actions = [mockSvg, mockSvg, mockSvg, mockSvg];
    spyOn(service['undoRedoProperties'].actions, 'pop').and.callThrough();
    service['undoRedoProperties'].itterator = 1;
    service.addView(mockSvg);
    expect(service['undoRedoProperties'].actions.pop).toHaveBeenCalledTimes(2);
    expect(service['undoRedoProperties'].actions.length).toBe(3);
    expect(service['undoRedoProperties'].itterator).toBe(2);
  });
  it('#addView should push the last action passed in param', () => {
    service['undoRedoProperties'].actions = [mockSvg, mockSvg, mockSvg, mockSvg];
    spyOn(service['undoRedoProperties'].actions, 'push').and.callThrough();
    service['undoRedoProperties'].itterator = 3;
    service.addView(mockSvg);
    expect(service['undoRedoProperties'].actions.push).toHaveBeenCalledWith(mockSvg.cloneNode(true) as SVGElement);
    expect(service['undoRedoProperties'].actions.length).toBe(5);
    expect(service['undoRedoProperties'].itterator).toBe(4);
  });

  it('#addView should add a clone of a view pass in params into actions', () => {
    service['undoRedoProperties'].actions = [mockSvg, mockSvg, mockSvg, mockSvg];
    const current = mockSvg.cloneNode(true) as SVGElement;
    service['undoRedoProperties'].itterator = 3;
    service.addView(mockSvg);
    expect(service['undoRedoProperties'].actions.length).toBe(5);
    expect(service['undoRedoProperties'].actions.includes(current)).toBeTruthy();
    expect(service['undoRedoProperties'].itterator).toBe(4);
  });

  it('#addView should always call checkItterator', () => {
    spyOn(service, 'checkItterator');
    service.addView(mockSvg);
    expect(service.checkItterator).toHaveBeenCalled();
  });

  it('#init should call prepareExternalModules with the svg passed in param', () => {
    spyOn(service, 'prepareExternalModules');
    service.init(mockSvg);
    expect(service.prepareExternalModules).toHaveBeenCalledWith(mockSvg);
  });

  it('#init should attached svg received in param with all events', () => {
    spyOn(service, 'prepareExternalModules');
    service.init(mockSvg);
    expect(service['undoRedoProperties'].renderer.listen).toHaveBeenCalledTimes(7);
  });

  it('#checkMutation should set onChange to true if type is childList and class/id isnt filtered', () => {
    const mockMutation = jasmine.createSpyObj('MutationRecord[]', ['type', 'addedNodes', 'contains']);
    const mockClassList = jasmine.createSpyObj('string[]', ['contains', 'classList']);

    Object.defineProperties(mockMutation, {type: {value: 'childList'}, addedNodes: {value: [mockSvg as Node]}, target: {value: mockSvg}});
    const mutations = [mockMutation];
    mockMutation.addedNodes.forEach((node: HTMLElement) => {
      Object.defineProperties(node, { classList: { value: mockClassList } });
    });
    service['undoRedoProperties'].onChange = false;
    service.checkMutation(mutations, mockSvg);
    expect(service['undoRedoProperties'].onChange).toBeTruthy();
  });

  it('#checkMutation should not set onChange to true if type is childList and class/id is to be filtered', () => {
    const mockMutation = jasmine.createSpyObj('MutationRecord[]', ['type', 'addedNodes', 'contains']);
    const mockClassList = jasmine.createSpyObj('string[]', ['contains', 'classList', 'push']);
    const mockNode = jasmine.createSpyObj('Node', ['']);
    mockClassList.push('selector');

    Object.defineProperties(mockNode, {classList: { value: mockClassList }});
    Object.defineProperty(mockNode, 'id', {value: 'selector'});
    Object.defineProperties(mockMutation, {type: {value: 'childList'}, addedNodes: {value: [mockNode]}, target: {value: mockSvg}});
    const mutations = [mockMutation];
    mockMutation.addedNodes.forEach((node: HTMLElement) => {
      Object.defineProperties(node, { classList: { value: mockClassList } });
    });
    service['undoRedoProperties'].onChange = false;
    service.checkMutation(mutations, mockSvg);
    expect(service['undoRedoProperties'].onChange).toBeFalsy();
  });

  it('#checkMutation should not set onChange to true if type is not childList and target of attribute change is the svg', () => {
    const mockMutation = jasmine.createSpyObj('MutationRecord[]', ['type', 'addedNodes', 'contains']);
    const mockClassList = jasmine.createSpyObj('string[]', ['contains', 'classList', 'push']);
    mockClassList.push('selector');
    Object.defineProperties(mockMutation, {type: {value: 'attributes'}, target: {value: mockSvg}});
    const mutations = [mockMutation];
    service['undoRedoProperties'].onChange = false;
    service.checkMutation(mutations, mockSvg);
    expect(service['undoRedoProperties'].onChange).toBeFalsy();
  });

  it('#checkMutation should set onChange to true if type is not childList and target of mutation is not the svg', () => {
    const mockMutation = jasmine.createSpyObj('MutationRecord[]', ['type', 'addedNodes', 'contains']);
    const mockClassList = jasmine.createSpyObj('string[]', ['contains', 'classList', 'push']);
    mockClassList.push('selector');
    Object.defineProperties(mockMutation, {type: {value: 'attributes'}, target: {value: ''}});
    const mutations = [mockMutation];
    service['undoRedoProperties'].onChange = false;
    service.checkMutation(mutations, mockSvg);
    expect(service['undoRedoProperties'].onChange).toBeTruthy();
  });

  it('#prepareExternalModules should call syncSvgElements, startObserver, and subscribe to drawingSizeService', () => {
    spyOn(service, 'syncSvgElements');
    spyOn(service, 'startObserver');
    Object.defineProperty(mockSvg.style, 'backgroundColor' , {value:  ''});
    service.prepareExternalModules(mockSvg);
    expect(mockRenderer.setStyle).toHaveBeenCalledWith(mockSvg, 'background-color' , '#ffffff');
    expect(service.syncSvgElements).toHaveBeenCalledWith(mockSvg);
    expect(service.startObserver).toHaveBeenCalledWith(mockSvg);
  });

  it('#prepareExternalModules should call add view if actions is not empty ', () => {
    spyOn(service, 'syncSvgElements');
    spyOn(service, 'startObserver');
    spyOn(service, 'addView');
    service['undoRedoProperties'].actions.length = 1;
    service.prepareExternalModules(mockSvg);
    expect(service.addView).toHaveBeenCalledWith(mockSvg);
  });
  it('#prepareExternalModules should not call add view if actions is empty ', () => {
    spyOn(service, 'syncSvgElements');
    spyOn(service, 'startObserver');
    spyOn(service, 'addView');
    service['undoRedoProperties'].actions.length = 0;
    service.prepareExternalModules(mockSvg);
    expect(service.addView).not.toHaveBeenCalled();
  });

  it('#syncSvgElement should insert the current grid and remove the old one', () => {
    const mockNode = jasmine.createSpyObj('Node', ['']);
    const mockClassList = jasmine.createSpyObj('DOMTokenList', ['contains', 'classList', 'push']);
    Object.defineProperty(mockNode, 'classlist', {value: mockClassList});
    Object.defineProperties(mockNode, {nodeName: {value: 'pattern'} , id: {value: 'grid'}});
    Object.defineProperties(mockSvg, {childNodes: {value: [mockNode]}});
    mockSvg.childNodes.forEach((node: HTMLElement) => {
      Object.defineProperties(node, { classList: { value: mockClassList } });
    });
    service.syncSvgElements(mockSvg);
    expect(service['undoRedoProperties'].renderer.insertBefore).toHaveBeenCalledWith(mockSvg, service['undoRedoProperties'].grid, mockNode);
    expect(service['undoRedoProperties'].renderer.removeChild).toHaveBeenCalledWith(mockSvg, mockNode);
  });
  it('#syncSvgElement should not insert the current grid and not remove the old one if there are no grid', () => {
    const mockNode = jasmine.createSpyObj('Node', ['']);
    const mockClassList = jasmine.createSpyObj('DOMTokenList', ['contains', 'classList', 'push']);
    Object.defineProperty(mockNode, 'classlist', {value: mockClassList});
    Object.defineProperties(mockNode, {nodeName: {value: ''} , id: {value: ''}});
    Object.defineProperties(mockSvg, {childNodes: {value: [mockNode]}});
    mockSvg.childNodes.forEach((node: HTMLElement) => {
      Object.defineProperties(node, { classList: { value: mockClassList } });
    });
    service.syncSvgElements(mockSvg);
    expect(service['undoRedoProperties'].renderer.insertBefore).not.toHaveBeenCalled();
    expect(service['undoRedoProperties'].renderer.removeChild).not.toHaveBeenCalled();
  });
  it('#syncSvgElement should remove child if is filtered by second if statement', () => {
    const mockNode = jasmine.createSpyObj('Node', ['']);
    const mockClassList = jasmine.createSpyObj('DOMTokenList', ['contains', 'classList', 'push']);
    Object.defineProperty(mockNode, 'classlist', {value: mockClassList});
    Object.defineProperties(mockNode, {nodeName: {value: ''} , id: {value: 'eraser'}});
    Object.defineProperties(mockSvg, {childNodes: {value: [mockNode]}});
    mockSvg.childNodes.forEach((node: HTMLElement) => {
      Object.defineProperties(node, { classList: { value: mockClassList } });
    });
    service.syncSvgElements(mockSvg);
    expect(service['undoRedoProperties'].renderer.removeChild).toHaveBeenCalledWith(mockSvg, mockNode);
  });

  it('#setDrawingDiv should asign the frawindgDiv with div passed in param', () => {
    const mockDiv = jasmine.createSpyObj('HTMLElement', ['']);
    service.setDrawingDiv(mockDiv);
    expect(service['undoRedoProperties'].drawingDiv).toBe(mockDiv);
  });
});
