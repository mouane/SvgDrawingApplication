import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Line, TextProperties } from 'src/app/classes/textProperties/textProperties';
import { KEY, SIDEBAR } from 'src/app/enum';
import { ColorToolService } from '../color-tool/color-tool.service';
import { ScrollDrawingService } from '../scroll-drawing/scroll-drawing.service';

@Injectable({
  providedIn: 'root',
})
export class TextService {

  private renderer: Renderer2;
  private textContent: string;
  lines: Line[] = [];

  constructor(rendererFactory: RendererFactory2, private properties: TextProperties,
              private scrollDrawing: ScrollDrawingService, private colorService: ColorToolService) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }
  mouseDown($event: MouseEvent): void {
    this.properties.parent = $event.target as SVGElement;
    this.removeRectangle();
    this.setOnFirstProperties($event);
    this.properties.counter = 0;
    this.resetLines();
    this.setDefaultText();
    this.properties.isDisabled = false;
    this.properties.onFirst = false;
    this.generateText();
    this.appendText();
    this.addFirstLine();
    this.generateRectangle();
    this.appendRectangle();
  }
  generateText(): void {
    this.properties.text = this.renderer.createElement('text', 'svg');
    this.properties.posX = this.properties.posX;
    this.properties.text.setAttribute('class', 'tspan');
    this.properties.text.setAttribute('x', String(this.properties.posX));
    this.properties.text.setAttribute('y', String(this.properties.posY));
    this.properties.text.setAttribute('style', 'font: ' + this.properties.bold + this.properties.italic +
    this.properties.size + 'px ' + this.properties.police + ';');
    this.properties.text.setAttribute('fill', this.properties.color);
    this.properties.text.setAttribute('text-anchor', this.properties.anchor);
    this.properties.text.style.whiteSpace = 'pre';
  }
  appendText(): void {
    this.renderer.setStyle(this.properties.text, 'user-select', 'none');
    this.renderer.insertBefore(this.properties.parent, this.properties.text, this.properties.parent.lastChild);
  }
  addFirstLine(): void {
    const lineTemp = new Line();
    lineTemp.posX = this.properties.posX + this.properties.offsetX;
    lineTemp.content = this.textContent;
    lineTemp.svgElem = this.renderer.createElement('tspan', 'svg');
    lineTemp.posX = this.properties.posX;
    lineTemp.dY = this.properties.EMNULL;
    this.lines.push(lineTemp);
    this.properties.counter++;
    this.appendLines();
  }
  generateRectangle(): void {
    const currentChild = (this.properties.text as SVGAElement);
    this.properties.rectangle = this.renderer.createElement('rect', 'http://www.w3.org/2000/svg');
    this.properties.rectangle.setAttribute('x', String(currentChild.getBBox().x));
    this.properties.rectangle.setAttribute('y', String(currentChild.getBBox().y));
    this.properties.rectangle.setAttribute('width', String(currentChild.getBBox().width + this.properties.size / 2));
    this.properties.rectangle.setAttribute('height', String(currentChild.getBBox().height));
    this.properties.rectangle.setAttribute('stroke', 'gray');
    this.properties.rectangle.setAttribute('stroke-width', '1.5');
    this.properties.rectangle.setAttribute('stroke-dasharray', '10,10');
    this.properties.rectangle.setAttribute('fill', 'none');
  }
  appendRectangle(): void {
    this.renderer.insertBefore(this.properties.parent, this.properties.rectangle, this.properties.parent.lastChild);
  }
  removeRectangle(): void {
    if (!this.properties.onFirst) {
      this.renderer.removeChild(this.properties.parent, this.properties.rectangle);
    }
  }
  enlargeRectangle(): void {
    this.removeRectangle();
    this.generateRectangle();
    this.appendRectangle();
  }
  enlargeWidthRectangle(): void {
    if (this.properties.anchor === this.properties.ANCHORLEFT) {
      this.enlargeWidthRectangleAnchorLeft();
    }
    if (this.properties.anchor === this.properties.ANCHORRIGHT) {
      this.enlargeWidthRectangleAnchorMiddleOrRight();
    }
    if (this.properties.anchor === this.properties.ANCHORMIDDLE) {
      this.enlargeWidthRectangleAnchorMiddleOrRight();
    }
  }
  reduceWidthRectangle(): void {
    const currentChild = (this.properties.text as SVGAElement);
    const sizeTemp = currentChild.getBBox().width;
    this.properties.rectangle.setAttribute('width', String(sizeTemp + this.properties.size));
  }
  enlargeWidthRectangleAnchorLeft(): void {
    this.properties.rectangle.setAttribute('width', String((this.properties.text as SVGAElement).getBBox().width + this.properties.size));
  }
  enlargeWidthRectangleAnchorMiddleOrRight(): void {
    const currentChild = (this.properties.text as SVGAElement);
    const sizeTemp = currentChild.getBBox().width;
    const xTemp = currentChild.getBBox().x;
    this.properties.rectangle.setAttribute('width', String(sizeTemp + this.properties.size));
    this.properties.rectangle.setAttribute('x', String(xTemp - this.properties.size / 2));
  }
  enlargeHeightRectangle(): void {
    this.properties.rectangle.setAttribute('height', String(this.properties.size + this.properties.size * this.properties.counter));
    this.appendRectangle();
  }
  reduceHeightRectangle(): void {
    this.properties.rectangle.setAttribute('height', String(this.properties.size + this.properties.size * this.lines.length));
    this.appendRectangle();
  }
  addLine(): void {
    this.enlargeHeightRectangle();
    this.pushLine();
    this.appendLines();
    this.properties.counter++;
  }
  appendLines(): void {
    for (const l of this.lines) {
      this.renderer.setAttribute(l.svgElem, 'x', String(this.properties.posX + this.properties.offsetX));
      this.renderer.setAttribute(l.svgElem, 'dy', l.dY);
      l.svgElem.textContent = l.content;
      this.renderer.appendChild(this.properties.text, l.svgElem);
    }
  }
  updateLines(): void {
    for (const l of this.lines) {
      l.svgElem.textContent = l.content;
      this.renderer.appendChild(this.properties.text, l.svgElem);
    }
  }
  pushLine(): void {
    const lineTemp = new Line();
    lineTemp.content = ' ';
    lineTemp.addedByEnter = true;
    lineTemp.dY = '1em';
    lineTemp.svgElem = this.renderer.createElement('tspan', 'svg');
    this.lines.push(lineTemp);
  }
  resetLines(): void {
    while (this.lines.length > 0) {
      this.lines.pop();
    }
  }
  removeLine(): void {
    this.properties.counter--;
    this.lines.pop();
    this.reduceHeightRectangle();
  }
  appendItem(item: SVGElement): void {
    const parent = (this.properties.parent.parentNode as HTMLElement);
    if (parent.nodeName !== 'svg') {
      this.renderer.appendChild(this.properties.currentMouseEvent.target, item);
    } else {
      this.renderer.appendChild(parent, item);
    }
  }

  keyEvent(event: KeyboardEvent): void {
    if (!this.properties.isDisabled) {
      if (this.lines[0].content === this.properties.DEFAULTTEXT) {
        this.resetTextContent();
      }
      if (event.code === KEY.KEY_SPACE) {
        event.preventDefault();
      }
      if (event.key.length === 1) {
        this.typeText(event.key);
      }
      if (event.key === KEY.KEY_BACKSPACE) {
          this.deleteChar();
      }
      if (event.key === KEY.KEY_ENTER) {
        this.addLine();
      }
    }
  }
  typeText(str: string): void {
    const currentIndex = this.properties.counter - this.properties.ARRAYOFFSET;
    if ( this.lines[currentIndex].addedByEnter) {
      const temp = this.lines[currentIndex].content;
      this.lines[currentIndex].content = temp.substring(0, temp.length - 1);
      this.lines[currentIndex].addedByEnter = false;
    }
    this.lines[currentIndex].content = this.lines[currentIndex].content + str;
    this.lines[currentIndex].svgElem.textContent = this.lines[currentIndex].content;
    this.renderer.appendChild(this.properties.text, this.lines[currentIndex].svgElem);
    this.enlargeWidthRectangle();
  }
  deleteChar(): void {
      const temp = this.lines[this.properties.counter - this.properties.ARRAYOFFSET].content;
      if (temp.length >= 1) {
        this.lines[this.properties.counter - this.properties.ARRAYOFFSET].content = temp.substring(0, temp.length - 1);
        this.appendLines();
      }
      if (temp.length === 0 && this.lines.length > 1 ) {
        this.removeLine();
      }
      this.reduceWidthRectangle();
  }
  setOnFirstProperties($event: MouseEvent): void {
    this.properties.currentMouseEvent = $event;
    this.properties.typingEnabler = true;
    this.properties.color = this.colorService.Fill;
    this.properties.posX = $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX;
    this.properties.posY = $event.clientY + this.scrollDrawing.ScrollY;
    const current = (this.properties.parent as SVGAElement);
    this.properties.drawingViewWidth = current.getBBox().width;
  }
  onChangeTextProperty(): void {
    this.properties.text.setAttribute('style', 'font: ' + this.properties.bold
    + this.properties.italic + this.properties.size + 'px ' + this.properties.police + ';');
    this.appendText();
  }
  onChangeTextAlignement(): void {
    this.properties.text.setAttribute('x', String(this.properties.posX));
    this.properties.text.classList.add('tspan');
    this.properties.text.setAttribute('text-anchor', this.properties.anchor);
    this.appendText();
    this.lines.forEach((element) => {
      element.svgElem.setAttribute('x', String(this.properties.posX + this.properties.offsetX));
      this.renderer.appendChild(this.properties.text, element.svgElem);
    });
    this.enlargeWidthRectangle();
  }
  resetTextContent(): void {
    this.lines[0].content = this.properties.EMPTYSTRING;
  }
  setDefaultText(): void {
    this.textContent = this.properties.DEFAULTTEXT;
  }
  setBold(): void {
    if (this.properties.bold === this.properties.EMPTYSTRING) {
      this.properties.bold = this.properties.BOLD;
    } else if (this.properties.bold === this.properties.BOLD) {
      this.properties.bold = this.properties.EMPTYSTRING;
    }
    if (!this.properties.onFirst) {
      this.onChangeTextProperty();
    }
  }
  setItalic(): void {
    if (this.properties.italic === this.properties.EMPTYSTRING) {
      this.properties.italic = this.properties.ITALIC;
    } else if (this.properties.italic === this.properties.ITALIC) {
      this.properties.italic = this.properties.EMPTYSTRING;
    }
    if (!this.properties.onFirst) {
      this.onChangeTextProperty();
    }
  }
  setPolice(police: string): void {
    this.properties.police = police;
    if (!this.properties.onFirst) {
      this.onChangeTextProperty();
    }
  }
  setSize(size: number): void {
    this.properties.size = size;
    if (!this.properties.onFirst) {
      this.onChangeTextProperty();
      this.enlargeRectangle();
    }
  }
  setAlignementLeft(): void {
    if (!(this.properties.anchor === this.properties.ANCHORLEFT)) {
      this.properties.offsetX = 0;
      this.properties.anchor = this.properties.ANCHORLEFT;
      if (!this.properties.onFirst) {
        const currentChild = (this.properties.rectangle as SVGAElement);
        this.properties.posX = currentChild.getBBox().x;
        this.onChangeTextAlignement();

      }
    }
  }
  setAlignementRight(): void {
    if (!(this.properties.anchor === this.properties.ANCHORRIGHT)) {
      this.properties.anchor = this.properties.ANCHORRIGHT;
      if (!this.properties.onFirst) {
        const currentChild = (this.properties.rectangle as SVGAElement);
        this.properties.offsetX = currentChild.getBBox().width;
        this.properties.posX = currentChild.getBBox().x ;
        this.onChangeTextAlignement();
      }
    }
  }
  setAlignementMiddle(): void {
    if (!(this.properties.anchor === this.properties.ANCHORMIDDLE)) {
      this.properties.anchor = this.properties.ANCHORMIDDLE;
      if (!this.properties.onFirst) {
        const currentChild = (this.properties.rectangle as SVGAElement);
        this.properties.offsetX = currentChild.getBBox().width / 2;
        this.properties.posX = currentChild.getBBox().x;
        this.onChangeTextAlignement();
      }
    }
  }
}
