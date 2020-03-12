import { Injectable, Renderer2, RendererFactory2,  } from '@angular/core';
import { ContainerProperties } from 'src/app/classes/containerProperties/container-properties';
import { LineProperties } from 'src/app/classes/lineProperties/line-properties';
import { LINE_ATTRIBUTES, LINE_TYPE, SIDEBAR } from '../../enum';
import { ColorToolService } from '../../services/color-tool/color-tool.service';
import { ScrollDrawingService } from '../scroll-drawing/scroll-drawing.service';

@Injectable({
  providedIn: 'root',
})
export class LineToolService {

  private renderer: Renderer2;
  isDragged: boolean;
  hasStarted: boolean;
  constructor(rendererFactory: RendererFactory2, private scrollDrawing: ScrollDrawingService,
              private colorService: ColorToolService, private properties: LineProperties,
              private container: ContainerProperties) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.isDragged = false;
    this.hasStarted = false;
  }
  set _Tip(tip: number) {
    this.properties.tip = tip;
  }
  set _DotSize(size: number) {
    this.properties.dotSize = size;
  }
  setJunctionDot(): void {
    this.properties.junctionType = LINE_TYPE.ROUND;
    this.properties.isDot = true;
  }
  setJunctionAngle(): void {
    this.properties.junctionType = LINE_TYPE.ANGLE;
    this.properties.isDot = false;
  }
  setJunctionRound(): void {
    this.properties.junctionType = LINE_TYPE.ROUND;
    this.properties.isDot = false;
  }
  setDottedLine(): void {
    this.properties.lineType = LINE_TYPE.DOTTED;
  }
  setDashLine(): void {
    this.properties.lineType = LINE_TYPE.DASH;
  }
  setContinuedLine(): void {
    this.properties.lineType = LINE_TYPE.BASE;
  }
  mouseDown($event: MouseEvent): void {
      this.properties.color = this.colorService.Fill;

      if (!this.hasStarted) {
        this.properties.circles = [];
        this.properties.arrayLinePaths = [];
        this.properties.subSvg = this.renderer.createElement('g', 'http://www.w3.org/2000/svg');
        this.container.createContainer($event, this.properties.subSvg, this.renderer);
        this.properties.startX = $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX;
        this.properties.startY = $event.clientY + this.scrollDrawing.ScrollY;
        this.properties.pathX = $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX;
        this.properties.pathY = $event.clientY + this.scrollDrawing.ScrollY;
        this.properties.circleX = this.properties.pathX;
        this.properties.circleY = this.properties.pathY;
        this.properties.lines = this.renderer.createElement(LINE_ATTRIBUTES.PATH, 'http://www.w3.org/2000/svg');
        this.properties.circle = this.renderer.createElement(LINE_ATTRIBUTES.CIRCLE, 'http://www.w3.org/2000/svg');
        this.properties.linePath = LINE_ATTRIBUTES.M + this.properties.pathX + LINE_ATTRIBUTES.COMMA + this.properties.pathY;
        this.properties.currentLine = this.properties.linePath;
        this.properties.lines.setAttribute(LINE_ATTRIBUTES.D, this.properties.linePath);
        this.setAttributesPath();
        this.properties.circle.setAttribute(LINE_ATTRIBUTES.CX, LINE_ATTRIBUTES.NULL + this.properties.circleX);
        this.properties.circle.setAttribute(LINE_ATTRIBUTES.CY, LINE_ATTRIBUTES.NULL + this.properties.circleY);
        this.setAttributesCircle();
        this.properties.circle.setAttribute(LINE_ATTRIBUTES.R, LINE_ATTRIBUTES.NULL + this.properties.dotSize);

        const parent = this.properties.subSvg;
        if (this.properties.isDot) {
        this.container.appendLine(parent, this.properties.circle, this.renderer);
        this.properties.circles.push(this.properties.circle);
        }
        this.container.appendLine(parent, this.properties.lines, this.renderer);
        this.hasStarted = true;
        this.properties.indexPath++;
      }

      if (this.properties.isDot && this.isDragged) {
        this.properties.circle = this.renderer.createElement(LINE_ATTRIBUTES.CIRCLE, 'http://www.w3.org/2000/svg');
        this.properties.circleX = $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX;
        this.properties.circleY = $event.clientY + this.scrollDrawing.ScrollY;
        this.properties.circle.setAttribute(LINE_ATTRIBUTES.CX, LINE_ATTRIBUTES.NULL + this.properties.circleX);
        this.properties.circle.setAttribute(LINE_ATTRIBUTES.CY, LINE_ATTRIBUTES.NULL + this.properties.circleY);
        this.setAttributesCircle();
        this.properties.circle.setAttribute(LINE_ATTRIBUTES.R, LINE_ATTRIBUTES.NULL + this.properties.dotSize);
        const parent = this.properties.subSvg;
        this.container.appendLine(parent, this.properties.circle, this.renderer);
        this.properties.circles.push(this.properties.circle);
      }
      this.properties.pathX = $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX;
      this.properties.pathY = $event.clientY + this.scrollDrawing.ScrollY;
      this.properties.previousLine = this.properties.linePath;
      this.properties.currentLine += LINE_ATTRIBUTES.M + this.properties.pathX + LINE_ATTRIBUTES.COMMA + this.properties.pathY;
      this.properties.linePath = this.properties.currentLine;
      this.properties.arrayLinePaths.push(this.properties.currentLine);
      this.properties.lines.setAttribute(LINE_ATTRIBUTES.D, this.properties.linePath);
      this.setAttributesPath();
      this.isDragged = true;
  }

  doubleClick($event: MouseEvent): void {
    if ($event.shiftKey) {
      this.properties.linePath += LINE_ATTRIBUTES.L + this.properties.startX + LINE_ATTRIBUTES.COMMA + this.properties.startY;
      this.properties.lines.setAttribute(LINE_ATTRIBUTES.D, this.properties.linePath);
    }
    this.isDragged = false;
    this.hasStarted = false;
  }

  mouseMove($event: MouseEvent): void {
    this.properties.currentX = $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX;
    this.properties.currentY = $event.clientY + this.scrollDrawing.ScrollY;

    if (this.isDragged) {
      if (!this.properties.isDot) {
        this.properties.circle.setAttribute(LINE_ATTRIBUTES.R, LINE_ATTRIBUTES.ZERO);
      }
      this.properties.currentLine = this.properties.linePath;
      this.properties.currentLine += LINE_ATTRIBUTES.L + this.properties.currentX + ',' + this.properties.currentY;
      this.properties.lines.setAttribute(LINE_ATTRIBUTES.D, this.properties.currentLine);
    }
  }
  deleteRecentLine(): void {
    if (this.hasStarted) {
      if (this.properties.arrayLinePaths.length > 1) {
        this.properties.arrayLinePaths.pop();
        this.renderer.setAttribute(this.properties.lines, 'd', this.properties.arrayLinePaths[this.properties.arrayLinePaths.length - 1]);
        this.properties.linePath = this.properties.arrayLinePaths[this.properties.arrayLinePaths.length - 1];
        if (this.properties.circles.length > 1) {
          this.renderer.removeChild(this.properties.subSvg, this.properties.circles[this.properties.circles.length - 1]);
          this.properties.circles.pop();
        }
      }
    }
  }
  deletePath(): void {
    if (this.hasStarted) {
      this.properties.linePath = LINE_ATTRIBUTES.NULL;
      this.properties.lines.setAttribute(LINE_ATTRIBUTES.D, this.properties.linePath);
      this.isDragged = false;
      this.hasStarted = false;
    }
  }

  setAttributesPath(): void {
    this.properties.lines.setAttribute(LINE_ATTRIBUTES.STROKE, this.properties.color);
    this.properties.lines.setAttribute(LINE_ATTRIBUTES.FILL, LINE_ATTRIBUTES.NONE);
    this.properties.lines.setAttribute(LINE_ATTRIBUTES.STROKE_WIDTH, LINE_ATTRIBUTES.NULL + this.properties.tip);
    this.properties.lines.setAttribute(LINE_ATTRIBUTES.STROKE_LINECAP, this.properties.junctionType);
    if (this.properties.lineType === LINE_TYPE.DOTTED) {
      this.properties.lines.setAttribute(LINE_ATTRIBUTES.STROKE_DASHARRAY, LINE_ATTRIBUTES.DOTTED);
    } else if (this.properties.lineType === LINE_TYPE.DASH) {
      this.properties.lines.setAttribute(LINE_ATTRIBUTES.STROKE_DASHARRAY, LINE_ATTRIBUTES.DASHED);
    }
    this.properties.lines.setAttribute(LINE_ATTRIBUTES.STROKE_LINEJOIN, LINE_TYPE.ROUND);
    this.properties.lines.setAttribute(LINE_ATTRIBUTES.ID, LINE_ATTRIBUTES.PATH + this.properties.indexPath);
  }

  setAttributesCircle(): void {
    this.properties.circle.setAttribute(LINE_ATTRIBUTES.FILL, this.properties.color);
    this.properties.circle.setAttribute(LINE_ATTRIBUTES.R, LINE_ATTRIBUTES.NULL + this.properties.tip / 2);
    this.properties.circle.setAttribute(LINE_ATTRIBUTES.ID, LINE_ATTRIBUTES.CIRCLE);
    this.properties.indexCircle++;
  }
}
