import { EventEmitter, Injectable, Output, Renderer2, RendererFactory2 } from '@angular/core';
import { ContainerProperties } from 'src/app/classes/containerProperties/container-properties';
import { QuillProperties } from 'src/app/classes/quillProperties/quill-properties';
import { LINE_ATTRIBUTES, SIDEBAR } from '../../enum';
import { ColorToolService } from '../color-tool/color-tool.service';
import { ScrollDrawingService } from '../scroll-drawing/scroll-drawing.service';

enum Variable {
  TIP = 30,
  ANGLE = 0,
  SMALL_INCREMENT = 1,
  BIG_INCREMENT = 15,
}
@Injectable({
  providedIn: 'root',
})

export class QuillToolService {
  private renderer: Renderer2;
  @Output() rotation: EventEmitter<number> = new EventEmitter();
  tip: number;
  angle: number;
  isPath: boolean;

  constructor(rendererFactory: RendererFactory2, private colorService: ColorToolService, private properties: QuillProperties,
              private scrollDrawing: ScrollDrawingService, private container: ContainerProperties) {
      this.renderer = rendererFactory.createRenderer(null, null);
      this.tip = Variable.TIP;
      this.angle = Variable.ANGLE;

  }
  mouseDown($event: MouseEvent): void {
    this.properties.subSvg = this.renderer.createElement('g', 'http://www.w3.org/2000/svg');
    this.container.createContainer($event, this.properties.subSvg, this.renderer);
    this.properties.color = this.colorService.Fill;
    this.properties.lines = this.renderer.createElement('polygon', 'http://www.w3.org/2000/svg');
    this.properties.x = $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX;
    this.properties.y = $event.clientY + this.scrollDrawing.ScrollY;
    this.findPoints(this.toRadian(this.angle));
    this.setPoints();

    this.createLine();
    this.properties.lines.setAttribute('points', this.properties.line);
    const parent = this.properties.subSvg;
    this.container.appendLine(parent, this.properties.lines, this.renderer);

    this.isPath = true;
  }
  mouseUp($event: MouseEvent): void {
    this.isPath = false;
  }

  mouseMove($event: MouseEvent): void {
    if (this.isPath) {
      this.setPoints();

      this.properties.x = $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX;
      this.properties.y = $event.clientY + this.scrollDrawing.ScrollY;

      this.properties.lines = this.renderer.createElement('polygon', 'http://www.w3.org/2000/svg');
      this.setAttributesPath();

      this.findPoints(this.toRadian(this.angle));

      this.createLine();
      this.properties.lines.setAttribute('points', this.properties.line);
      const parent = this.properties.subSvg;
      this.container.appendLine(parent, this.properties.lines, this.renderer);
    }
  }
  setAttributesPath(): void {
    this.properties.lines.setAttribute(LINE_ATTRIBUTES.STROKE, this.properties.color);
    this.properties.lines.setAttribute(LINE_ATTRIBUTES.FILL, this.properties.color);
    this.properties.lines.setAttribute(LINE_ATTRIBUTES.STROKE_WIDTH, LINE_ATTRIBUTES.NULL + 1 );
  }

  findPoints(angle: number): void {
    const opposite = (this.tip / 2) * Math.cos(angle);
    const adjacent = (this.tip / 2) * Math.sin(angle);

    if (this.angle === 90) {
      this.properties.leftX = this.properties.x;
      this.properties.leftY = this.properties.y - this.tip / 2;

      this.properties.rightX = this.properties.x;
      this.properties.rightY = this.properties.y + this.tip / 2;
    } else {
      this.properties.leftX = this.properties.x + opposite;
      this.properties.leftY = this.properties.y - adjacent;

      this.properties.rightX = this.properties.x - opposite;
      this.properties.rightY = this.properties.y + adjacent;
    }
  }

  createLine(): void {
    this.properties.line = '' + this.properties.startLeftX + ',' + this.properties.startLeftY +
      ' ' + this.properties.leftX + ',' + this.properties.leftY + ' ' + this.properties.rightX + ',' + this.properties.rightY +
        ' ' + this.properties.startRightX + ',' + this.properties.startRightY;
  }

  toRadian(angle: number): number {
    return angle * (Math.PI / 180);
  }

  setPoints(): void {
    this.properties.startLeftX = this.properties.leftX;
    this.properties.startLeftY = this.properties.leftY;
    this.properties.startRightX = this.properties.rightX;
    this.properties.startRightY = this.properties.rightY;
  }

  incrementAngle($event: WheelEvent): void {
    if ($event.altKey) {
      this.angle += Variable.SMALL_INCREMENT;
    } else {
      this.angle += Variable.BIG_INCREMENT;
    }
    this.rotation.emit(this.angle);
  }

  decrementAngle($event: WheelEvent): void {
    if ($event.altKey) {
      this.angle -= Variable.SMALL_INCREMENT;
    } else {
      this.angle -= Variable.BIG_INCREMENT;
    }
    this.rotation.emit(this.angle);
  }

}
