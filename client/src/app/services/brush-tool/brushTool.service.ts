import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BrushProperties } from 'src/app/classes/brushProperties/brush-properties';
import { ContainerProperties } from 'src/app/classes/containerProperties/container-properties';
import { LINE_ATTRIBUTES, LINE_TYPE, SIDEBAR } from '../../enum';
import { ColorToolService } from '../color-tool/color-tool.service';
import { ScrollDrawingService } from '../scroll-drawing/scroll-drawing.service';

@Injectable({
  providedIn: 'root',
})
export class BrushToolService {
  dissapearCircle: boolean;
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2, private colorService: ColorToolService, private properties: BrushProperties,
              private scrollDrawing: ScrollDrawingService, private container: ContainerProperties) {
      this.renderer = rendererFactory.createRenderer(null, null);
  }

  set _Tip(tip: number) {
    this.properties.tip = tip;
  }

  set _FilterBase(filter: SVGElement) {
    this.properties.filterBase = filter;
    this.properties.currentFilter = filter;
  }

  set _FilterTurbulence(filter: SVGElement) {
    this.properties.filterTurbulence = filter;
  }

  set _FilterNoise(filter: SVGElement) {
    this.properties.filterNoise = filter;
  }

  set _FilterBlurry(filter: SVGElement) {
    this.properties.filterBlurry = filter;
  }

  set _FilterSquigly(filter: SVGElement) {
    this.properties.filterSquigly = filter;
  }
  set _CurrentFilter(filter: SVGElement) {
    this.properties.currentFilter = filter;
  }

  get FilterBase(): SVGElement {
    return this.properties.filterBase;
  }

  get FilterTurbulence(): SVGElement {
    return this.properties.filterTurbulence;
  }

  get FilterNoise(): SVGElement {
    return this.properties.filterNoise;
  }

  get FilterBlurry(): SVGElement {
    return this.properties.filterBlurry;
  }

  get FilterSquigly(): SVGElement {
    return this.properties.filterSquigly;
  }

  mouseDown($event: MouseEvent): void {
    this.properties.subSvg = this.renderer.createElement('g', 'http://www.w3.org/2000/svg');
    this.container.createContainer($event, this.properties.subSvg, this.renderer);
    this.properties.color = this.colorService.Fill;
    this.properties.strokes = this.renderer.createElement(LINE_ATTRIBUTES.PATH, 'http://www.w3.org/2000/svg');
    this.properties.circle = this.renderer.createElement(LINE_ATTRIBUTES.CIRCLE, 'http://www.w3.org/2000/svg');
    this.properties.x = $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX;
    this.properties.y = $event.clientY + this.scrollDrawing.ScrollY;
    this.properties.stroke = LINE_ATTRIBUTES.M + this.properties.x + LINE_ATTRIBUTES.COMMA + this.properties.y;
    this.properties.strokes.setAttribute(LINE_ATTRIBUTES.D, this.properties.stroke);
    this.setAttributesPath();

    this.properties.circleX = this.properties.x;
    this.properties.circleY = this.properties.y;
    this.properties.circle.setAttribute(LINE_ATTRIBUTES.CX, LINE_ATTRIBUTES.NULL + this.properties.circleX);
    this.properties.circle.setAttribute(LINE_ATTRIBUTES.CY, LINE_ATTRIBUTES.NULL + this.properties.circleY);
    this.setAttributesCircle();

    const parent = this.properties.subSvg;
    this.container.appendLine(parent, this.properties.circle, this.renderer);
    this.container.appendLine(parent, this.properties.strokes, this.renderer);

    this.properties.isPath = true;
    this.dissapearCircle = false;

  }
  mouseUp($event: MouseEvent): void {
    if (this.dissapearCircle) {
      this.properties.circle.setAttribute(LINE_ATTRIBUTES.R, LINE_ATTRIBUTES.NULL + LINE_ATTRIBUTES.ZERO);
    }
    this.properties.isPath = false;
  }

  mouseMove($event: MouseEvent): void {
    if (this.properties.isPath) {
      this.properties.x = $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX;
      this.properties.y = $event.clientY + this.scrollDrawing.ScrollY;
      this.properties.stroke += LINE_ATTRIBUTES.L + this.properties.x + LINE_ATTRIBUTES.COMMA + this.properties.y;
      this.properties.strokes.setAttribute(LINE_ATTRIBUTES.D, this.properties.stroke);
      this.dissapearCircle = true;
    }
  }
  setAttributesPath(): void {
    this.properties.strokes.setAttribute(LINE_ATTRIBUTES.STROKE, this.properties.color);
    this.properties.strokes.setAttribute(LINE_ATTRIBUTES.FILL, LINE_ATTRIBUTES.NONE);
    this.properties.strokes.setAttribute(LINE_ATTRIBUTES.STROKE_WIDTH, LINE_ATTRIBUTES.NULL + this.properties.tip);
    this.properties.strokes.setAttribute(LINE_ATTRIBUTES.STROKE_LINECAP, LINE_TYPE.ROUND);
    this.properties.strokes.setAttribute(LINE_ATTRIBUTES.STROKE_LINEJOIN, LINE_TYPE.ROUND);
    this.properties.strokes.setAttribute(LINE_ATTRIBUTES.ID, LINE_ATTRIBUTES.PATH + this.properties.indexPath);
    this.properties.strokes.setAttribute(LINE_ATTRIBUTES.FILTER, LINE_ATTRIBUTES.URL +
      LINE_ATTRIBUTES.FILTER_POUND + this.properties.currentFilter.getAttribute(LINE_ATTRIBUTES.ID) + LINE_ATTRIBUTES.FILTER_CLOSE);
    this.properties.indexPath++;
  }

  setAttributesCircle(): void {
    this.properties.circle.setAttribute(LINE_ATTRIBUTES.FILL, this.properties.color);
    this.properties.circle.setAttribute(LINE_ATTRIBUTES.R, LINE_ATTRIBUTES.NULL + this.properties.tip / 2);
    this.properties.circle.setAttribute(LINE_ATTRIBUTES.ID, LINE_ATTRIBUTES.CIRCLE + this.properties.indexCircle);
    this.properties.circle.setAttribute(LINE_ATTRIBUTES.FILTER, LINE_ATTRIBUTES.URL +
      LINE_ATTRIBUTES.FILTER_POUND + this.properties.currentFilter.getAttribute(LINE_ATTRIBUTES.ID) + LINE_ATTRIBUTES.FILTER_CLOSE);
    this.properties.indexCircle++;
  }
}
