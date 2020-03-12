import { EventEmitter, Injectable, Output, Renderer2, RendererFactory2 } from '@angular/core';
import { StampSelectorProperties } from 'src/app/classes/stampProperties/stamp-properties';
import { SIDEBAR } from 'src/app/enum';
import { ScrollDrawingService } from '../scroll-drawing/scroll-drawing.service';

const BASICSIZE = 60;
const MAXROTATION = 180;
const MINROTATION = -180;
const ROTATIONFACT = 15;
const MAXSCALE = 5;
@Injectable({
  providedIn: 'root',
})
export class StampselectorService {

  private renderer: Renderer2;
  @Output() nominator: EventEmitter<number> = new EventEmitter();
  @Output() denominator: EventEmitter<number> = new EventEmitter();
  @Output() rotationFact: EventEmitter<number> = new EventEmitter();

  constructor(rendererFactory: RendererFactory2, private scrollDrawing: ScrollDrawingService ,
              private properties: StampSelectorProperties) {
    this.renderer = rendererFactory.createRenderer(null, null);

}
  set _Current(imgCurrent: string) {
    this.properties.imgUrl = this.properties.path + imgCurrent + '.png';
  }

  set _ImageChosen(isChosen: boolean) {
    this.properties.imageChosen = isChosen;
  }

  mouseDown($event: MouseEvent): void {
    if (this.properties.imageChosen && $event.button === 0) {
      this.properties.sizeI = BASICSIZE * this.properties.nominatorScale / this.properties.denominatorScale;
      this.properties.posX = $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX - this.properties.sizeI / 2;
      this.properties.posY = $event.clientY + this.scrollDrawing.ScrollY - this.properties.sizeI / 2;
      this.properties.image = this.renderer.createElement('image', 'http://www.w3.org/2000/svg' );
      this.renderer.setAttribute(this.properties.image, 'href', this.properties.imgUrl);
      this.renderer.setAttribute(this.properties.image, 'height', String(this.properties.sizeI));
      this.renderer.setAttribute(this.properties.image, 'width', String(this.properties.sizeI));
      this.renderer.setAttribute(this.properties.image, 'x', String(this.properties.posX));
      this.renderer.setAttribute(this.properties.image, 'y', String(this.properties.posY));
      this.renderer.setAttribute(this.properties.image, 'transform' , 'rotate(' + this.properties.rotationFactor + ' ' +
        (this.properties.posX + this.properties.sizeI / 2) + ' ' + (this.properties.posY + this.properties.sizeI / 2) + ')');
      const parent = ( (  $event.target as HTMLElement ).parentNode as HTMLElement );
      if ( parent.nodeName !== 'svg') {
      this.renderer.insertBefore($event.target, this.properties.image, ($event.target as HTMLElement).lastChild);
    } else {
      this.renderer.insertBefore(parent, this.properties.image, parent.lastChild);
    }
      this.convertToBase64(this.properties.sizeI, this.properties.sizeI);
    }
  }
  convertToBase64(width: number, height: number): void {
    const canvas = this.renderer.createElement('canvas') as HTMLCanvasElement;
    canvas.height = height;
    canvas.width = width;
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (context != null) {
      context.drawImage(this.properties.image, 0, 0, canvas.width, canvas.height);
      this.renderer.setAttribute(this.properties.image, 'href', canvas.toDataURL());
    }
  }
  incrementScalingFactor(): void {
    if (this.properties.denominatorScale > 1) {
      this.properties.denominatorScale--;
      this.denominator.emit(this.properties.denominatorScale);
    } else if (this.properties.nominatorScale < MAXSCALE) {
      this.properties.nominatorScale++;
      this.nominator.emit(this.properties.nominatorScale);
    }
  }
  decrementScalingFactor(): void {
    if (this.properties.nominatorScale > 1) {
      this.properties.nominatorScale--;
      this.nominator.emit(this.properties.nominatorScale);
    } else if (this.properties.denominatorScale < MAXSCALE) {
      this.properties.denominatorScale++;
      this.denominator.emit(this.properties.denominatorScale);
    }
  }
  incrementRotationFactor(): void {
    if (this.properties.rotationFactor < MAXROTATION) {
      this.properties.rotationFactor = this.properties.rotationFactor + ROTATIONFACT;
      this.rotationFact.emit(this.properties.rotationFactor);
    }
  }
  decrementRotationFactor(): void {
    if (this.properties.rotationFactor > MINROTATION) {
      this.properties.rotationFactor = this.properties.rotationFactor - ROTATIONFACT;
      this.rotationFact.emit(this.properties.rotationFactor);
    }
  }
}
