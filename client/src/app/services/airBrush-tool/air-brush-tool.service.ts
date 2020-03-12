import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { AirBrushProperties } from 'src/app/classes/airBrushProperties/air-brush-properties';
import { GROUP, LINE_ATTRIBUTES, SHAPES, SIDEBAR } from '../../enum';
import { ColorToolService } from '../color-tool/color-tool.service';
import { ScrollDrawingService } from '../scroll-drawing/scroll-drawing.service';

const ZERO = 0;
const ONE = 1;
const TWO = 2;
const TIME_LAPS = 100;
const TICK = 0.1;
const START_INDEX = 4;
const RELATIVE_MOVE = ' m -';
const TWENTY = 20;

@Injectable({
  providedIn: 'root',
})
export class AirBrushToolService {
  private renderer: Renderer2;
  tip = TWO;
  sparksPerSec = TWENTY;

  constructor(rendererFactory: RendererFactory2, private colorService: ColorToolService, private properties: AirBrushProperties,
              private scrollDrawing: ScrollDrawingService) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  mousePosition($event: MouseEvent): void {
    this.properties.xPos = $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX;
    this.properties.yPos = $event.clientY + this.scrollDrawing.ScrollY;
  }

  mouseDown($event: MouseEvent): void {
    this.initialisePath();
    this.properties.color = this.colorService.Fill;
    this.properties.spraying = true;
    this.createGroupContainer($event);
    this.airBrush($event);
  }

  initialisePath(): void {
    this.properties.path = this.renderer.createElement(LINE_ATTRIBUTES.PATH, SHAPES.LINK_SVG);
    this.properties.circlePath = LINE_ATTRIBUTES.M + ZERO + LINE_ATTRIBUTES.COMMA + ZERO;
    this.properties.path.setAttribute(LINE_ATTRIBUTES.D, this.properties.circlePath);
  }

  createGroupContainer($event: MouseEvent): void {
    this.properties.groupEl = this.renderer.createElement(GROUP.GROUP_EL, SHAPES.LINK_SVG);
    const parent = (($event.target as HTMLElement).parentNode as HTMLElement);
    if (parent.nodeName !== LINE_ATTRIBUTES.SVG) {
      if (parent.tagName === GROUP.GROUP_EL) {
        this.renderer.insertBefore(parent.parentNode, this.properties.groupEl, ($event.target as HTMLElement).lastChild);
      } else {
        this.renderer.insertBefore($event.target, this.properties.groupEl, ($event.target as HTMLElement).lastChild);
      }
    } else {
      this.renderer.insertBefore(parent, this.properties.groupEl, parent.lastChild);
    }
  }

  mouseUp($event: MouseEvent): void {
    clearInterval(this.properties.spray);
    this.properties.spraying = false;
  }

  mouseMove($event: MouseEvent): void {
    if (this.properties.spraying) {
      this.mousePosition($event);
    }
  }

  airBrush($event: MouseEvent): void {
    this.properties.radius = this.tip / TWO;
    this.properties.dotsPerTick = Math.ceil(this.sparksPerSec * TICK);
    this.mousePosition($event);
    this.spray();
  }

  spray(): void {
    this.properties.spray = window.setInterval(() => {
      for (let i = ZERO; i < this.properties.dotsPerTick; i++) {
        this.properties.offset = this.randomPointInDiameter(this.properties.radius);
        this.properties.circlePath += this.circleToPath();
        this.properties.parent = this.properties.groupEl;
        if (this.properties.spraying) {
          this.properties.path.setAttribute(LINE_ATTRIBUTES.FILL, this.properties.color);
          this.properties.path.setAttribute(LINE_ATTRIBUTES.D,
                                    this.properties.circlePath.substring(START_INDEX, this.properties.circlePath.length));
        }
      }
      this.renderer.insertBefore(this.properties.parent, this.properties.path, this.properties.parent.lastChild);
    }, TIME_LAPS);
  }

  randomPointInDiameter(radius: number): number[] {
    let xCoord = Number.MAX_VALUE;
    let yCoord = Number.MAX_VALUE;
    while (xCoord * xCoord + yCoord * yCoord >= ONE) {
      xCoord = Math.random() * TWO - ONE;
      yCoord = Math.random() * TWO - ONE;
    }
    xCoord = xCoord * radius;
    yCoord = yCoord * radius;
    return [xCoord, yCoord];
  }

  circleString(cx: number, cy: number, r: number): string {
    return LINE_ATTRIBUTES.M + cx + LINE_ATTRIBUTES.SPACE + cy + RELATIVE_MOVE + r + LINE_ATTRIBUTES.COMMA +
      ZERO + LINE_ATTRIBUTES.ARC + r + LINE_ATTRIBUTES.COMMA + r + LINE_ATTRIBUTES.SPACE + ZERO + LINE_ATTRIBUTES.SPACE +
      ONE + LINE_ATTRIBUTES.COMMA + ZERO + LINE_ATTRIBUTES.SPACE + (r * TWO) + LINE_ATTRIBUTES.COMMA + ZERO + LINE_ATTRIBUTES.ARC + r +
      LINE_ATTRIBUTES.COMMA + r + LINE_ATTRIBUTES.SPACE + ZERO + LINE_ATTRIBUTES.SPACE + ONE + LINE_ATTRIBUTES.COMMA +
      0 + LINE_ATTRIBUTES.DASH + (r * TWO) + LINE_ATTRIBUTES.COMMA + ZERO;
  }
  circleToPath(): string {
    const cx = this.properties.xPos + this.properties.offset[ZERO];
    const cy = this.properties.yPos + this.properties.offset[ONE];
    const r = ONE;
    const circle = this.circleString(cx, cy, r);
    return circle;
  }
}
