import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ContainerProperties } from 'src/app/classes/containerProperties/container-properties';
import { PencilProperties } from 'src/app/classes/pencilProperties/pencil-properties';
import { LINE_ATTRIBUTES, LINE_TYPE, SIDEBAR } from '../../enum';
import { ColorToolService } from '../color-tool/color-tool.service';
import { ScrollDrawingService } from '../scroll-drawing/scroll-drawing.service';

@Injectable({
  providedIn: 'root',
})
export class PencilToolService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2, private colorService: ColorToolService, private properties: PencilProperties,
              private scrollDrawing: ScrollDrawingService, private container: ContainerProperties) {
      this.renderer = rendererFactory.createRenderer(null, null);

  }
  set _Tip(tip: number) {
    this.properties.tip = tip;
  }
  mouseDown($event: MouseEvent): void {
    this.properties.subSvg = this.renderer.createElement('g', 'http://www.w3.org/2000/svg');
    this.container.createContainer($event, this.properties.subSvg, this.renderer);
    this.properties.color = this.colorService.Fill;
    this.properties.lines = this.renderer.createElement(LINE_ATTRIBUTES.PATH, 'http://www.w3.org/2000/svg');
    this.properties.circle = this.renderer.createElement(LINE_ATTRIBUTES.CIRCLE, 'http://www.w3.org/2000/svg');
    this.properties.image = this.renderer.createElement(LINE_ATTRIBUTES.IMAGE, 'http://www.w3.org/2000/svg' );
    this.properties.x = $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX;
    this.properties.y = $event.clientY + this.scrollDrawing.ScrollY;
    this.properties.line = LINE_ATTRIBUTES.M + this.properties.x + LINE_ATTRIBUTES.COMMA + this.properties.y;
    this.properties.lines.setAttribute(LINE_ATTRIBUTES.D, this.properties.line);
    this.setAttributesPath();

    this.properties.circleX = this.properties.x;
    this.properties.circleY = this.properties.y;
    this.properties.circle.setAttribute(LINE_ATTRIBUTES.CX, LINE_ATTRIBUTES.NULL + this.properties.circleX);
    this.properties.circle.setAttribute(LINE_ATTRIBUTES.CY, LINE_ATTRIBUTES.NULL + this.properties.circleY);
    this.setAttributesCircle();

    const parent = this.properties.subSvg;
    this.container.appendLine(parent, this.properties.circle, this.renderer);
    this.container.appendLine(parent, this.properties.lines, this.renderer);
    this.properties.isPath = true;
  }
  mouseUp($event: MouseEvent): void {
    this.properties.isPath = false;
  }

  mouseMove($event: MouseEvent): void {
    if (this.properties.isPath) {
      this.properties.circle.setAttribute(LINE_ATTRIBUTES.R, LINE_ATTRIBUTES.ZERO);
      this.properties.x = $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX;
      this.properties.y = $event.clientY + this.scrollDrawing.ScrollY;
      this.properties.line += LINE_ATTRIBUTES.L + this.properties.x + LINE_ATTRIBUTES.COMMA + this.properties.y;
      this.properties.lines.setAttribute(LINE_ATTRIBUTES.D, this.properties.line);
    }
  }
  setAttributesPath(): void {
    this.properties.lines.setAttribute(LINE_ATTRIBUTES.STROKE, this.properties.color);
    this.properties.lines.setAttribute(LINE_ATTRIBUTES.FILL, LINE_ATTRIBUTES.NONE);
    this.properties.lines.setAttribute(LINE_ATTRIBUTES.STROKE_WIDTH, LINE_ATTRIBUTES.NULL + this.properties.tip);
    this.properties.lines.setAttribute(LINE_ATTRIBUTES.STROKE_LINECAP, LINE_TYPE.ROUND);
    this.properties.lines.setAttribute(LINE_ATTRIBUTES.STROKE_LINEJOIN, LINE_TYPE.ROUND);
    this.properties.lines.setAttribute(LINE_ATTRIBUTES.ID, LINE_ATTRIBUTES.PATH + this.properties.indexPath);
    this.properties.indexPath++;
  }

  setAttributesCircle(): void {
    this.properties.circle.setAttribute(LINE_ATTRIBUTES.FILL, this.properties.color);
    this.properties.circle.setAttribute(LINE_ATTRIBUTES.R, LINE_ATTRIBUTES.NULL + this.properties.tip / 2);
    this.properties.circle.setAttribute(LINE_ATTRIBUTES.ID, LINE_ATTRIBUTES.CIRCLE);
    this.properties.indexCircle++;
  }

}
