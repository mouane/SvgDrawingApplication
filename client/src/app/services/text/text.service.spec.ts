import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorToolProperties } from 'src/app/classes/colorToolProperties/color-tool-properties';
import { Line, TextProperties } from 'src/app/classes/textProperties/textProperties';
import { KEY, SIDEBAR } from 'src/app/enum';
import { TextService } from './text.service';

const POLICETEST = 'Roboto';
const SIZE = 25;
const POSXTEST = 10;
const WIDTHTEST = 20;
const SIZETEST = 5;
const OFFSETTEST = 10;
const VALUETEST = 5;
const UNDEF = 'undefined';

describe('TextService', () => {
  let service: TextService;
  let event: MouseEvent;
  let mockSVGA: jasmine.SpyObj<SVGAElement>;
  let mockRect: jasmine.SpyObj<DOMRect>;
  let mockSvgElem: jasmine.SpyObj<SVGElement>;
  let mockSvgEl: jasmine.SpyObj<SVGElement>;
  let mockDom1: jasmine.SpyObj<DOMRect>;
  let mockSvgAElem1: jasmine.SpyObj<SVGAElement>;
  let mockRenderer: jasmine.SpyObj<Renderer2>;
  let mockTarget: jasmine.SpyObj<EventTarget>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TextProperties, ColorToolProperties],
    });
    service = TestBed.get(TextService);
    event = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    mockSVGA = jasmine.createSpyObj('SVGAElement', ['getBBox']);
    mockRect = jasmine.createSpyObj('DOMRect', ['']);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['insertBefore', 'setAttribute', 'createElement', 'appendChild']);
    mockSvgElem = jasmine.createSpyObj('SVGElement', ['setAttribute', 'getBBox', 'style']);
    mockSvgAElem1 = jasmine.createSpyObj('SVGAElement', ['setAttribute', 'getBBox', 'getBoundingClientRect',
    'setAttributeNS']);
    mockDom1 = jasmine.createSpyObj('DOMRect', ['']);
    mockSvgAElem1.getBBox.and.returnValue(mockDom1);
    mockSvgElem.setAttribute.and.callThrough();
    mockRenderer.appendChild.and.callThrough();
    mockSVGA.getBBox.and.returnValue(mockRect);
    mockSvgEl = jasmine.createSpyObj('SVGElement', ['setAttribute']);
    mockTarget = jasmine.createSpyObj('EventTarget', ['']);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#mouseDown should set some values to size and call setOnFirstProperties, resetLines, setDefaultText, generateText ', () => {
    const mEvent = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    spyOn(service, 'removeRectangle');
    spyOn(service, 'setOnFirstProperties');
    spyOn(service, 'resetLines');
    spyOn(service, 'setDefaultText');
    spyOn(service, 'generateText');
    spyOn(service, 'appendText');
    spyOn(service, 'addFirstLine');
    spyOn(service, 'generateRectangle');
    spyOn(service, 'appendRectangle');
    service.mouseDown(mEvent);
    expect(service.removeRectangle).toHaveBeenCalled();
    expect(service['properties'].counter).toBe(0);
    expect(service['properties'].isDisabled).toBe(false);
    expect(service['properties'].onFirst).toBe(false);
    expect(service.setOnFirstProperties).toHaveBeenCalledWith(mEvent);
    expect(service.resetLines).toHaveBeenCalled();
    expect(service.setDefaultText).toHaveBeenCalled();
    expect(service.generateText).toHaveBeenCalled();
    expect(service.appendText).toHaveBeenCalled();
    expect(service.addFirstLine).toHaveBeenCalled();
    expect(service.generateRectangle).toHaveBeenCalled();
    expect(service.appendRectangle).toHaveBeenCalled();
  });

  it('#setOnFirstProperties should set all properties to default', () => {
      service['scrollDrawing']._ScrollX = 270;
      service['scrollDrawing']._ScrollY = 50;
      const mouseEvent = new MouseEvent('mousedown', {clientX: 50, clientY: 50});
      Object.defineProperty(mockRect, 'width', {value: 5});
      service['properties'].parent = mockSVGA;
      service.setOnFirstProperties(mouseEvent);
      expect(service['properties'].currentMouseEvent).toBe(mouseEvent);
      expect(service['properties'].typingEnabler).toBe(true);
      expect(service['properties'].posX).toBe(mouseEvent.clientX - SIDEBAR.sideBarWidth + service['scrollDrawing'].ScrollX);
      expect(service['properties'].posY).toBe(mouseEvent.clientY + service['scrollDrawing'].ScrollY);
      const current = (service['properties'].parent as SVGAElement);
      expect(service['properties'].drawingViewWidth).toBe(current.getBBox().width);

    });

  it('#generateText should set attributes to properties.text and create element text svg ', () => {
    const POLICETEST = 'Roboto';
    const SIZE = 25;
    const POSY = 10;
    const POSX = 20;
    const COLOR = 'red';
    service['renderer'] = mockRenderer;
    mockRenderer.createElement.and.returnValue(mockSvgElem);
    service['properties'].bold = service['properties'].BOLD;
    service['properties'].italic = service['properties'].ITALIC;
    service['properties'].size = SIZE;
    service['properties'].police = POLICETEST;
    service['properties'].posX = POSX;
    service['properties'].posY = POSY;
    service['properties'].color = COLOR;
    service['properties'].anchor = service['properties'].ANCHORLEFT;
    service.generateText();
    expect(mockRenderer.createElement).toHaveBeenCalledWith('text', 'svg');
    expect(service['properties'].text.setAttribute).toHaveBeenCalledWith('x', String(POSX));
    expect(service['properties'].text.setAttribute).toHaveBeenCalledWith('y', String(POSY));
    expect(service['properties'].text.setAttribute).toHaveBeenCalledWith('style', 'font: ' + service['properties'].BOLD + service['properties'].ITALIC + SIZE + 'px ' + POLICETEST + ';');
    expect(service['properties'].text.setAttribute).toHaveBeenCalledWith('fill', COLOR);
    expect(service['properties'].text.setAttribute).toHaveBeenCalledWith( 'text-anchor', service['properties'].ANCHORLEFT);
  });

  it('#onChangeTextProperty should set attributes and call appendText ', () => {
    service['properties'].text = mockSvgElem;
    service['properties'].bold = service['properties'].BOLD;
    service['properties'].italic = service['properties'].ITALIC;
    service['properties'].size = SIZE;
    service['properties'].police = POLICETEST;
    spyOn(service, 'appendText');
    service.onChangeTextProperty();
    expect(service.appendText).toHaveBeenCalled();
    expect(service['properties'].text.setAttribute).toHaveBeenCalledWith('style', 'font: ' + service['properties'].BOLD + service['properties'].ITALIC + SIZE + 'px ' + POLICETEST + ';');
  });

  it('#onChangeTextAlignement should set attributes call appendText & appendChild for each line in text and enlargeWidthRectangle ', () => {
    const mockClasslist = jasmine.createSpyObj('Classlist', ['add']);
    service.pushLine();
    service.pushLine();
    service['properties'].text = mockSvgElem;
    service['properties'].posX = 0;
    service['properties'].anchor = service['properties'].ANCHORLEFT;
    service['properties'].offsetX = 0;
    spyOn(service, 'enlargeWidthRectangle');
    spyOn(service, 'appendText');
    spyOn(service['renderer'], 'appendChild');
    Object.defineProperty(mockSvgElem, 'classList', {value: mockClasslist});
    service.onChangeTextAlignement();
    expect(service['properties'].text.setAttribute).toHaveBeenCalledWith('x', String(service['properties'].posX));
    expect(service['renderer'].appendChild).toHaveBeenCalledTimes(2);
    expect(service.appendText).toHaveBeenCalled();
    expect(service.enlargeWidthRectangle).toHaveBeenCalled();
  });

  it('#enlargeWidthRectangle should call enlargeWidthRectangleAnchorLeft if anchor == ANCHORLEFT', () => {
    spyOn(service, 'enlargeWidthRectangleAnchorLeft');
    service['properties'].anchor = service['properties'].ANCHORLEFT;
    service.enlargeWidthRectangle();
    expect(service.enlargeWidthRectangleAnchorLeft).toHaveBeenCalled();
  });

  it('#enlargeWidthRectangle should call enlargeWidthRectangleAnchorMiddleOrRight if anchor == ANCHORRIGHT', () => {
    spyOn(service, 'enlargeWidthRectangleAnchorMiddleOrRight');
    service['properties'].anchor = service['properties'].ANCHORRIGHT;
    service.enlargeWidthRectangle();
    expect(service.enlargeWidthRectangleAnchorMiddleOrRight).toHaveBeenCalled();
  });

  it('#enlargeWidthRectangle should call enlargeWidthRectangleAnchorMiddleOrRight if anchor == ANCHORMIDDLE', () => {
    spyOn(service, 'enlargeWidthRectangleAnchorMiddleOrRight');
    service['properties'].anchor = service['properties'].ANCHORMIDDLE;
    service.enlargeWidthRectangle();
    expect(service.enlargeWidthRectangleAnchorMiddleOrRight).toHaveBeenCalled();
  });

  it('#enlargeRectangle should call removeRectangle, generateRectangle and appendRectangle ', () => {
    spyOn(service, 'removeRectangle');
    spyOn(service, 'generateRectangle');
    spyOn(service, 'appendRectangle');
    service.enlargeRectangle();
    expect(service.removeRectangle).toHaveBeenCalled();
    expect(service.generateRectangle).toHaveBeenCalled();
    expect(service.appendRectangle).toHaveBeenCalled();
  });

  it('#reduceWidthRectangle should setAttribute of rectangle widht to bbox.with + properties.size', () => {
    service['properties'].size = SIZETEST;
    Object.defineProperty(mockSVGA, 'width', { value: WIDTHTEST });
    service['properties'].text = mockSVGA;
    service['properties'].rectangle = mockSvgElem;
    service.reduceWidthRectangle();
    expect(mockSvgElem.setAttribute).toHaveBeenCalledWith('width', String(mockSVGA.getBBox().width + service['properties'].size));
  });

  it('#removeRectangle should call do nothing if not on first', () => {
    service['properties'].onFirst = true;
    service['properties'].parent = mockSvgElem;
    service['properties'].rectangle = mockSvgElem;
    spyOn(service['renderer'], 'removeChild');
    service.removeRectangle();
    expect(service['renderer'].removeChild).not.toHaveBeenCalledWith(service['properties'].parent, service['properties'].rectangle);
  });
  it('#removeRectangle should NOT call removeChild if on first ', () => {
    service['properties'].onFirst = true;
    spyOn(service['renderer'], 'removeChild');
    service.removeRectangle();
    expect(service['renderer'].removeChild).not.toHaveBeenCalled();
  });

  it('#appendRectangle should call appendItem and git it rectangle as proprietes ', () => {
    spyOn(service, 'appendItem');
    service['properties'].parent = mockSvgEl;
    service['renderer'] = mockRenderer;
    service.appendRectangle();
    expect(service['renderer'].insertBefore).toHaveBeenCalledWith(service['properties'].parent, service['properties'].rectangle,
          service['properties'].parent.lastChild);
  });
  it('#removeRectangle should call do nothing if not on first', () => {
    service['properties'].onFirst = true;
    service['properties'].parent = mockSvgElem;
    service['properties'].rectangle = mockSvgElem;
    spyOn(service['renderer'], 'removeChild');
    service.removeRectangle();
    expect(service['renderer'].removeChild).not.toHaveBeenCalledWith(service['properties'].parent, service['properties'].rectangle);
  });

  it('#resetTextContent should set first line content to EMPTYSTRING ', () => {
    service.pushLine();
    service['lines'][0].content = 'Some content';
    service.resetTextContent();
    expect(service['lines'][0].content).toBe(service['properties'].EMPTYSTRING);
  });

  it('#Setbold should set value to bold if not bold and otherwises not bold and call onChangeProperty ', () => {
    service['properties'].onFirst = false;
    spyOn(service, 'onChangeTextProperty');
    service['properties'].bold = service['properties'].EMPTYSTRING;
    service.setBold();
    expect(service.onChangeTextProperty).toHaveBeenCalled();
    expect(service['properties'].bold).toBe(service['properties'].BOLD);

    service.setBold();
    expect(service.onChangeTextProperty).toHaveBeenCalled();
    expect(service['properties'].bold).toBe(service['properties'].EMPTYSTRING);
  });

  it('#setItalic should set value to italic if not italic and call onChangeProperty ', () => {
    service['properties'].onFirst = false;
    spyOn(service, 'onChangeTextProperty');
    service['properties'].italic = service['properties'].EMPTYSTRING;
    service.setItalic();
    expect(service.onChangeTextProperty).toHaveBeenCalled();
    expect(service['properties'].italic).toBe(service['properties'].ITALIC);
    service.setItalic();
    expect(service.onChangeTextProperty).toHaveBeenCalled();
    expect(service['properties'].italic).toBe(service['properties'].EMPTYSTRING);
  });

  it('#setItalic should set value to EMPTYSTRING if italic and call onChangeProperty ', () => {
      service['properties'].onFirst = false;
      spyOn(service, 'onChangeTextProperty');
      service['properties'].italic = service['properties'].ITALIC;
      service.setItalic();
      expect(service.onChangeTextProperty).toHaveBeenCalled();
      expect(service['properties'].italic).toBe(service['properties'].EMPTYSTRING);
    });

  it('#setDefaultText should set textContent to DEFAULTTEXT', () => {
    service.setDefaultText();
    expect(service['textContent']).toBe(service['properties'].DEFAULTTEXT);
  });

  it('#setPolice should set the text properties police to the given police in parameters and call on change text Properties', () => {
    service['properties'].onFirst = false;
    service['properties'].size = SIZE;
    spyOn(service, 'onChangeTextProperty');
    service.setPolice(POLICETEST);
    expect(service['properties'].police).toBe(POLICETEST);
    expect(service.onChangeTextProperty).toHaveBeenCalled();
  });

  it('#setAlignementLeft should change properties anchor and offset and NOT call onChangeTextAlignement if OnFirst', () => {
    service['properties'].anchor = service['properties'].ANCHORMIDDLE;
    service['properties'].offsetX = OFFSETTEST;
    service['properties'].onFirst = true;
    spyOn(service, 'onChangeTextAlignement');
    service.setAlignementLeft();
    expect(service['properties'].anchor).toBe(service['properties'].ANCHORLEFT);
    expect(service['properties'].offsetX).toBe(0);
    expect(service.onChangeTextAlignement).not.toHaveBeenCalled();
  });

  it('#setAlignementLeft should change properties anchor and offset and call onChangeTextAlignement if notOnFirst', () => {
    service['properties'].anchor = service['properties'].ANCHORMIDDLE;
    service['properties'].offsetX = OFFSETTEST;
    service['properties'].onFirst = false;
    Object.defineProperty(mockSVGA, 'x', { value: VALUETEST });
    service['properties'].rectangle = mockSVGA;
    service['properties'].text = mockSvgElem;
    spyOn(service, 'onChangeTextAlignement');
    service.setAlignementLeft();
    expect(service['properties'].anchor).toBe(service['properties'].ANCHORLEFT);
    expect(service['properties'].offsetX).toBe(0);
    expect(service['properties'].posX).toBe(mockSVGA.getBBox().x);
    expect(service.onChangeTextAlignement).toHaveBeenCalled();
  });

  it('#setAlignementRight should change properties anchor and offset and NOT call onChangeTextAlignement if OnFirst', () => {
    service['properties'].anchor = service['properties'].ANCHORMIDDLE;
    service['properties'].onFirst = true;
    spyOn(service, 'onChangeTextAlignement');
    service.setAlignementRight();
    expect(service['properties'].anchor).toBe(service['properties'].ANCHORRIGHT);
    expect(service.onChangeTextAlignement).not.toHaveBeenCalled();
  });

  it('#setAlignementRight should change properties anchor and offset and call onChangeTextAlignement if notOnFirst', () => {
    service['properties'].anchor = service['properties'].ANCHORMIDDLE;
    service['properties'].posX = POSXTEST;
    service['properties'].onFirst = false;
    Object.defineProperty(mockRect, 'width', { value: WIDTHTEST });
    service['properties'].rectangle = mockSVGA;
    service['properties'].text = mockSvgElem;
    spyOn(service, 'onChangeTextAlignement');
    service.setAlignementRight();
    expect(service['properties'].anchor).toBe(service['properties'].ANCHORRIGHT);
    expect(service['properties'].offsetX).toBe((mockSVGA.getBBox().width));
    expect(service.onChangeTextAlignement).toHaveBeenCalled();
  });

  it('#setAlignementMiddle should change properties anchor and offset and NOT call onChangeTextAlignement if OnFirst', () => {
    service['properties'].anchor = service['properties'].ANCHORLEFT;
    service['properties'].onFirst = true;
    spyOn(service, 'onChangeTextAlignement');
    service.setAlignementMiddle();
    expect(service['properties'].anchor).toBe(service['properties'].ANCHORMIDDLE);
    expect(service.onChangeTextAlignement).not.toHaveBeenCalled();
  });

  it('#setAlignementMiddle should change properties anchor and offset and call onChangeTextAlignement if notOnFirst', () => {
    service['properties'].anchor = service['properties'].ANCHORLEFT;
    service['properties'].offsetX = OFFSETTEST;
    service['properties'].onFirst = false;
    Object.defineProperty(mockSVGA, 'x', { value: POSXTEST });
    Object.defineProperty(mockRect, 'width', { value: WIDTHTEST });
    service['properties'].rectangle = mockSVGA;
    service['properties'].text = mockSvgElem;
    spyOn(service, 'onChangeTextAlignement');
    service.setAlignementMiddle();
    expect(service['properties'].anchor).toBe(service['properties'].ANCHORMIDDLE);
    expect(service['properties'].offsetX).toBe(mockSVGA.getBBox().width / 2);
    expect(service['properties'].posX).toBe(mockSVGA.getBBox().x);
    expect(service.onChangeTextAlignement).toHaveBeenCalled();
  });

  it('#setSize should set value to size and call onChangeProperty and enlargeRectangle if onFirst is false', () => {
    const value = 5;
    service['properties'].onFirst = false;
    spyOn(service, 'onChangeTextProperty');
    spyOn(service, 'enlargeRectangle');
    service.setSize(value);
    expect(service.onChangeTextProperty).toHaveBeenCalled();
    expect(service.enlargeRectangle).toHaveBeenCalled();
    expect(service['properties'].size).toBe(value);
  });
  it('#setSize should set value to size and not call onChangeProperty if onFirst is true', () => {
    const value = 5;
    service['properties'].onFirst = true;
    spyOn(service, 'onChangeTextProperty');
    service.setSize(value);
    expect(service.onChangeTextProperty).not.toHaveBeenCalled();
    expect(service['properties'].size).toBe(value);
  });

  it('#resetLines should reset the array of line', () => {
    const lineTest = new Line();
    service['lines'].push(lineTest);
    service.resetLines();
    expect(service['lines'].length).toBe(0);
  });

  it('#pushLine should push a new line to the array of lines', () => {
    service.pushLine();
    expect(service['lines'].length).toBe(1);
  });

  it('#removeLine should call reduceHeightRectangle, pop a line in the array of lines and decrement counter', () => {
    service['properties'].counter = 1;
    service.pushLine();
    spyOn(service, 'reduceHeightRectangle');
    spyOn(service['lines'], 'pop');
    service.removeLine();
    expect(service.reduceHeightRectangle).toHaveBeenCalled();
    expect(service['lines'].pop).toHaveBeenCalled();
    expect(service['properties'].counter).toBe(0);
  });

  it('#addLine should call enlargeHeightRectangle, pushLine, appendLines and increment counter', () => {
    service['properties'].counter = 1;
    spyOn(service, 'enlargeHeightRectangle');
    spyOn(service, 'pushLine');
    spyOn(service, 'appendLines');
    service.addLine();
    service.updateLines();
    expect(service.enlargeHeightRectangle).toHaveBeenCalled();
    expect(service.pushLine).toHaveBeenCalled();
    expect(service.appendLines).toHaveBeenCalled();
    expect(service['properties'].counter).toBe(2);
  });

  it('#addFirstLine should create first line set its attributes, push the line to array and call appendLine and increment counter', () => {
    const POSXTEST = 10;
    const OFFSETTEST = 0;
    const SOMECONTENT = 'some content';

    mockRenderer.createElement.and.returnValue(mockSvgElem);
    service['renderer'] = mockRenderer;
    service['textContent'] = SOMECONTENT;
    service['properties'].posX = POSXTEST + OFFSETTEST;
    service['properties'].counter = 0;
    spyOn(service, 'appendLines');
    service.addFirstLine();
    expect(mockRenderer.createElement).toHaveBeenCalledWith('tspan', 'svg');
    expect(service['properties'].counter).toBe(1);

    expect(service.appendLines).toHaveBeenCalled();
  });

  it('#updateLines should update line.svgElem.content with the line content and call appendChild(text, line)', () => {
    const CONTENTTEST = 'test';
    service.pushLine();
    service['properties'].text = mockSvgElem;
    service['lines'][0].svgElem = mockSvgEl;
    service['lines'][0].content = CONTENTTEST;
    service['renderer'] = mockRenderer;
    service.updateLines();
    expect(service['lines'][0].svgElem.textContent).toBe(CONTENTTEST);
    expect(mockRenderer.appendChild).toHaveBeenCalledWith(mockSvgElem, mockSvgEl);
  });

  it('#appendLines should call appendChild(text,line) and set attributes for each line in the array ', () => {
    const CONTENTTEST = 'test';
    const DY = '1em';
    let mockSvgEl2: jasmine.SpyObj<SVGElement>;
    mockSvgEl2 = jasmine.createSpyObj('SVGElement', ['']);
    service.pushLine();
    service.pushLine();
    service['properties'].posX = POSXTEST;
    service['properties'].offsetX = OFFSETTEST;
    service['properties'].text = mockSvgElem;
    service['lines'][0].svgElem = mockSvgEl;
    service['lines'][1].svgElem = mockSvgEl2;
    service['lines'][0].content = CONTENTTEST;
    service['lines'][1].content = CONTENTTEST;
    service['lines'][0].dY = DY;
    service['lines'][1].dY = DY;
    service['renderer'] = mockRenderer;
    service.appendLines();
    expect(service['lines'][0].svgElem.textContent).toBe(CONTENTTEST);
    expect(service['lines'][1].svgElem.textContent).toBe(CONTENTTEST);
    expect(mockRenderer.setAttribute).toHaveBeenCalledWith(service['lines'][0].svgElem, 'x', String(POSXTEST + OFFSETTEST));
    expect(mockRenderer.setAttribute).toHaveBeenCalledWith(service['lines'][0].svgElem, 'dy', DY);
    expect(mockRenderer.setAttribute).toHaveBeenCalledWith(service['lines'][1].svgElem, 'x', String(POSXTEST + OFFSETTEST));
    expect(mockRenderer.setAttribute).toHaveBeenCalledWith(service['lines'][1].svgElem, 'dy', DY);
    expect(mockRenderer.appendChild).toHaveBeenCalledWith(mockSvgElem, mockSvgEl);
    expect(mockRenderer.appendChild).toHaveBeenCalledWith(mockSvgElem, mockSvgEl2);
  });

  it('#appendItem should append item to DrawingView if mousetarget is not on any SVG item', () => {
    service['properties'].parent = mockSvgElem;
    service['properties'].currentMouseEvent = event;
    service['renderer'] = mockRenderer;
    Object.defineProperty(event, 'target', { value: mockTarget });
    Object.defineProperty(mockSVGA, 'nodeName', { value: '' });
    Object.defineProperty(mockSvgElem, 'parentNode', { value: mockSVGA });
    service.appendItem(mockSvgElem);
    expect(service['renderer'].appendChild).toHaveBeenCalledWith(service['properties'].currentMouseEvent.target, mockSvgElem);
  });
  it('#appendItem should append item to DrawingView if mousetarget if on any SVG item', () => {
    service['properties'].parent = mockSvgElem;
    service['properties'].currentMouseEvent = event;
    service['renderer'] = mockRenderer;
    Object.defineProperty(event, 'target', { value: mockTarget });
    Object.defineProperty(mockSvgEl, 'nodeName', { value: 'svg' });
    Object.defineProperty(mockSvgElem, 'parentNode', { value: mockSvgEl });
    service.appendItem(mockSvgElem);
    expect(service['renderer'].appendChild).toHaveBeenCalledWith((service['properties'].parent.parentNode as HTMLElement), mockSvgElem);
  });

  it('#keyEvent should call typeText if key lenght == 1', () => {
    const event = new KeyboardEvent('keypress', { key: KEY.KEY_C });
    service['properties'].isDisabled = false;
    service.pushLine();
    spyOn(service, 'typeText');
    service.keyEvent(event);
    expect(service.typeText).toHaveBeenCalled();
  });

  it('#keyEvent should call event preventDefault if key is Space', () => {
  const event = new KeyboardEvent('keypress', { code: KEY.KEY_SPACE });
  service['properties'].isDisabled = false;
  service.pushLine();
  spyOn(event, 'preventDefault');
  service.keyEvent(event);
  expect(event.preventDefault).toHaveBeenCalled();
});
  it('#keyEvent should call deleteChar if key is Backspace', () => {
    const event = new KeyboardEvent('keypress', { key: KEY.KEY_BACKSPACE });
    service['properties'].isDisabled = false;
    service.pushLine();
    spyOn(service, 'deleteChar');
    service.keyEvent(event);
    expect(service.deleteChar).toHaveBeenCalled();
  });
  it('#keyEvent should call addLine if key is Enter', () => {
    const event = new KeyboardEvent('keypress', { key: KEY.KEY_ENTER });
    service['properties'].isDisabled = false;
    service.pushLine();
    spyOn(service, 'addLine');
    service.keyEvent(event);
    expect(service.addLine).toHaveBeenCalled();
  });

  it('#enlargeHeightRectangle should set attribute and call appendRectangle', () => {
    const TESTCOUNTER = 1;
    service['properties'].size = VALUETEST;
    service['properties'].counter = TESTCOUNTER;
    service['properties'].rectangle = mockSvgElem;
    spyOn(service, 'appendRectangle');
    service.enlargeHeightRectangle();
    expect(mockSvgElem.setAttribute).toHaveBeenCalledWith('height', String(VALUETEST + VALUETEST * TESTCOUNTER));
    expect(service.appendRectangle).toHaveBeenCalled();
  });

  it('#reduceHeightRectangle should set attribute and call appendRectangle', () => {
    service['properties'].size = VALUETEST;
    service['properties'].rectangle = mockSvgElem;
    spyOn(service, 'appendRectangle');
    service.pushLine();
    service.reduceHeightRectangle();
    expect(mockSvgElem.setAttribute).toHaveBeenCalledWith('height', String(VALUETEST + VALUETEST * 1));
    expect(service.appendRectangle).toHaveBeenCalled();
  });

  it('#deleteChar should call appendLines and update the text if the lines lenght >=1 and call reduceWidthRectangle', () => {
    const stringToAdd = 'g';
    service.pushLine();
    service['properties'].counter = 1;
    service['lines'][0].content = stringToAdd;
    spyOn(service, 'reduceWidthRectangle');
    spyOn(service, 'appendLines');
    service['properties'].parent = mockSvgEl;
    service['renderer'] = mockRenderer;
    service.deleteChar();
    expect(service['lines'][0].content).toBe('');
    expect(service.reduceWidthRectangle).toHaveBeenCalled();
    expect(service.appendLines).toHaveBeenCalled();
  });

  it('#appendText should call renderSetStyle call renderer insterbefore', () => {
    spyOn(service['renderer'], 'setStyle');
    spyOn(service['renderer'], 'insertBefore');
    service['properties'].text = mockSvgElem;
    service['properties'].parent = mockSVGA;
    service.appendText();
    expect(service['renderer'].setStyle).toHaveBeenCalledWith(service['properties'].text, 'user-select', 'none');
    expect(service['renderer'].insertBefore).toHaveBeenCalledWith(service['properties'].parent, service['properties'].text, service['properties'].parent.lastChild);
  });

  it('#enlargeWidthRectangleAnchorLeft should call setAttribute of rectangle', () => {
    Object.defineProperty(mockSvgAElem1, 'width', { value: VALUETEST });
    Object.defineProperty(mockSvgAElem1, 'height', { value: VALUETEST });
    service['properties'].size = SIZE;
    service['properties'].text = mockSvgAElem1;
    service['properties'].rectangle = mockSvgEl;
    service.enlargeWidthRectangleAnchorLeft();
    expect(mockSvgEl.setAttribute).toHaveBeenCalledWith('width', String(mockSVGA.getBBox().width + service['properties'].size));
  });

  it('#enlargeWidthRectangleAnchorMiddleOrRight should call setAttribute of rectangle', () => {
    Object.defineProperty(mockSVGA, 'width', { value: VALUETEST });
    Object.defineProperty(mockSVGA, 'x', { value: VALUETEST });
    service['properties'].size = SIZE;
    service['properties'].text = mockSVGA;
    service['properties'].rectangle = mockSvgEl;
    service.enlargeWidthRectangleAnchorMiddleOrRight();
    expect(mockSvgEl.setAttribute).toHaveBeenCalledWith('width', String(mockSVGA.getBBox().width + service['properties'].size));
    expect(mockSvgEl.setAttribute).toHaveBeenCalledWith('x', String(mockSVGA.getBBox().x - service['properties'].size / 2));
  });

  it('#generateRectangle should call renderSetStyle call renderer insterbefore', () => {
     Object.defineProperty(mockSVGA, 'x', {value: 5});
     Object.defineProperty(mockSVGA, 'y', {value: 5});
     service['properties'].text = (mockSVGA as SVGElement);
     mockRenderer.createElement.and.returnValue(mockSvgEl);
     service['renderer'] = mockRenderer;
     service['properties'].size = 20;
     service.generateRectangle();
     expect(mockRenderer.createElement).toHaveBeenCalledWith('rect', 'http://www.w3.org/2000/svg');
     expect(service['properties'].rectangle.setAttribute).toHaveBeenCalledWith('x', UNDEF);
     expect(service['properties'].rectangle.setAttribute).toHaveBeenCalledWith('y', UNDEF);
     expect(service['properties'].rectangle.setAttribute).toHaveBeenCalledWith('stroke', 'gray');
     expect(service['properties'].rectangle.setAttribute).toHaveBeenCalledWith('stroke-width', '1.5');
     expect(service['properties'].rectangle.setAttribute).toHaveBeenCalledWith('stroke-dasharray', '10,10');
     expect(service['properties'].rectangle.setAttribute).toHaveBeenCalledWith('fill', 'none');
   });
});
