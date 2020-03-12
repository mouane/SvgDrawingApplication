import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ContainerProperties } from 'src/app/classes/containerProperties/container-properties';
import { PenToolProperties } from 'src/app/classes/penProperties/pen-properties';
import { LINE_ATTRIBUTES, LINE_TYPE, SIDEBAR } from 'src/app/enum';
import { ColorToolService } from '../color-tool/color-tool.service';
import { ScrollDrawingService } from '../scroll-drawing/scroll-drawing.service';

@Injectable({
  providedIn: 'root',
})
export class PenToolService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2, private colorService: ColorToolService, private properties: PenToolProperties,
              private scrollDrawing: ScrollDrawingService, private container: ContainerProperties) {
      this.renderer = rendererFactory.createRenderer(null, null);
  }

  set _TipMax(tipMax: number) {
    this.properties.tipMax = tipMax;
  }

  set _TipMin(tipMin: number) {
    this.properties.tipMin = tipMin;
  }

  mouseDown($event: MouseEvent): void {
    this.properties.subSvg = this.renderer.createElement('g', 'http://www.w3.org/2000/svg');
    this.container.createContainer($event, this.properties.subSvg, this.renderer);
    this.properties.circle = this.renderer.createElement(LINE_ATTRIBUTES.CIRCLE, 'http://www.w3.org/2000/svg');
    this.createPath($event);

    this.properties.startX = this.properties.pathX;
    this.properties.startY = this.properties.pathY;
    this.properties.circleX = this.properties.pathX;
    this.properties.circleY = this.properties.pathY;
    this.setAttributesCircle();

    const parent = this.properties.subSvg;
    this.container.appendLine(parent, this.properties.circle, this.renderer);
    this.container.appendLine(parent, this.properties.lines, this.renderer);
    this.properties.hasStarted = true;
  }

  mouseUp($event: MouseEvent): void {
    this.properties.hasStarted = false;
    this.properties.tipSizeWithSpeedPrevious = this.properties.tipMax;
  }

  mouseMove($event: MouseEvent): void {
    if (this.properties.hasStarted) {
      this.findCursorSpeed($event);

      this.properties.tipSizeWithSpeedCurrent = this.properties.tipMax -
      (Math.max(Math.abs(this.properties.speedX), Math.abs(this.properties.speedY)) / 12);

      this.smoothLine();

      this.properties.circle.setAttribute(LINE_ATTRIBUTES.R, LINE_ATTRIBUTES.ZERO);
      this.properties.pathX = $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX;
      this.properties.pathY = $event.clientY + this.scrollDrawing.ScrollY;
      this.properties.linePath += LINE_ATTRIBUTES.L + this.properties.pathX + LINE_ATTRIBUTES.COMMA + this.properties.pathY;
      this.properties.lines.setAttribute(LINE_ATTRIBUTES.D, this.properties.linePath);
      this.properties.lines.setAttribute(LINE_ATTRIBUTES.STROKE_WIDTH, LINE_ATTRIBUTES.NULL + this.properties.tipSizeWithSpeedCurrent);

      this.createPath($event);
      const parent = this.properties.subSvg;
      this.container.appendLine(parent, this.properties.circle, this.renderer);
      this.container.appendLine(parent, this.properties.lines, this.renderer);
      this.properties.tipSizeWithSpeedPrevious = this.properties.tipSizeWithSpeedCurrent;
    }
  }

  setAttributesPath(): void {
    this.properties.lines.setAttribute(LINE_ATTRIBUTES.STROKE, this.properties.color);
    this.properties.lines.setAttribute(LINE_ATTRIBUTES.FILL, LINE_ATTRIBUTES.NONE);
    this.properties.lines.setAttribute(LINE_ATTRIBUTES.STROKE_WIDTH, LINE_ATTRIBUTES.NULL + this.properties.tipMax);
    this.properties.lines.setAttribute(LINE_ATTRIBUTES.STROKE_LINECAP, LINE_TYPE.ROUND);
    this.properties.lines.setAttribute(LINE_ATTRIBUTES.STROKE_LINEJOIN, LINE_TYPE.ROUND);
  }

  setAttributesCircle(): void {
    this.properties.circle.setAttribute(LINE_ATTRIBUTES.CX, LINE_ATTRIBUTES.NULL + this.properties.circleX);
    this.properties.circle.setAttribute(LINE_ATTRIBUTES.CY, LINE_ATTRIBUTES.NULL + this.properties.circleY);
    this.properties.circle.setAttribute(LINE_ATTRIBUTES.FILL, this.properties.color);
    this.properties.circle.setAttribute(LINE_ATTRIBUTES.R, LINE_ATTRIBUTES.NULL + this.properties.tipMax / 2);
  }

  findCursorSpeed($event: MouseEvent): void {
    if (this.properties.timeStamp === 0) {
      this.properties.timeStamp = Date.now();
      this.properties.lastMouseX = $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX;
      this.properties.lastMouseY = $event.clientY + this.scrollDrawing.ScrollY;
    }

    this.properties.timePresent = Date.now();
    this.properties.differenceTime = this.properties.timePresent - this.properties.timeStamp;
    this.properties.differenceX = ($event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX) - this.properties.lastMouseX;
    this.properties.differenceY = ($event.clientY + this.scrollDrawing.ScrollY) - this.properties.lastMouseY;
    this.properties.speedX = Math.round(this.properties.differenceX / this.properties.differenceTime * 100);
    this.properties.speedY = Math.round(this.properties.differenceY / this.properties.differenceTime * 100);

    this.properties.timeStamp = this.properties.timePresent;
    this.properties.lastMouseX = $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX;
    this.properties.lastMouseY = $event.clientY + this.scrollDrawing.ScrollY;
  }

  smoothLine() {
    if (this.properties.tipSizeWithSpeedPrevious - this.properties.tipSizeWithSpeedCurrent >= 0.01) {
      this.properties.tipSizeWithSpeedCurrent = this.properties.tipSizeWithSpeedPrevious * 0.90;
    }
    if (this.properties.tipSizeWithSpeedPrevious - this.properties.tipSizeWithSpeedCurrent <= 0.05
              && this.properties.tipSizeWithSpeedCurrent < this.properties.tipMax) {
        this.properties.tipSizeWithSpeedCurrent = this.properties.tipSizeWithSpeedPrevious * 1.05;
    }
  }

  createPath($event: MouseEvent): void {
    this.properties.color = this.colorService.Fill;
    this.properties.lines = this.renderer.createElement(LINE_ATTRIBUTES.PATH, 'http://www.w3.org/2000/svg');
    this.properties.pathX = $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX;
    this.properties.pathY = $event.clientY + this.scrollDrawing.ScrollY;
    this.properties.linePath = LINE_ATTRIBUTES.M + this.properties.pathX + LINE_ATTRIBUTES.COMMA + this.properties.pathY;
    this.properties.lines.setAttribute(LINE_ATTRIBUTES.D, this.properties.linePath);
    this.setAttributesPath();
  }
}
