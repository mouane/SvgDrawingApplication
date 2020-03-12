import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ColorToolProperties } from 'src/app/classes/colorToolProperties/color-tool-properties';
import { ShapeProperties } from 'src/app/classes/shapeProperties/shape-properties';
import { SvgShapeElements } from 'src/app/classes/svgShapeElements/svg-shape-elements';
import { ColorToolService } from 'src/app/services/color-tool/color-tool.service';
import { DEFAULT_VALUES, GROUP, LINE_ATTRIBUTES, SHAPES, SIDEBAR, tools } from '../../enum';
import { ScrollDrawingService } from '../scroll-drawing/scroll-drawing.service';

@Injectable({
  providedIn: 'root',
})

export class ShapeToolService {
  private rendererRect: Renderer2;
  private rendererEllipse: Renderer2;
  private rendererPolygon: Renderer2;
  SVGobjectList: any[] = [];

  constructor(private colorProperties: ColorToolProperties, rendererFactory: RendererFactory2,
              private colorService: ColorToolService, private properties: ShapeProperties,
              private scrollDrawing: ScrollDrawingService, private svgShape: SvgShapeElements) {
    this.rendererRect = rendererFactory.createRenderer(null, null);
    this.rendererEllipse = rendererFactory.createRenderer(null, null);
    this.rendererPolygon = rendererFactory.createRenderer(null, null);
    this.properties.primaryColor = this.colorProperties.primary;
    this.properties.secondaryColor = this.colorProperties.secondary;
    this.colorService.currentPrimaryColor.subscribe((color: string) => {
      this.properties.primaryColor = color;
    });
    this.colorService.currentSecondaryColor.subscribe((color: string) => {
      this.properties.secondaryColor = color;
    });
  }

  thickness(thickness: number): number {
    this.properties.strokethickness = thickness;
    return this.properties.strokethickness;
  }

  traceType(type: string, clicked: boolean): void {
    this.properties.click = clicked;
    this.properties.type = type;

    switch (type) {
      case DEFAULT_VALUES.STROKE:
        this.properties.stroke = this.properties.secondaryColor;
        this.properties.fill = DEFAULT_VALUES.TRANSPARENT;
        break;
      case DEFAULT_VALUES.FILL:
        this.properties.stroke = DEFAULT_VALUES.STROKE_NONE;
        this.properties.fill = this.properties.primaryColor;
        break;
      case DEFAULT_VALUES.FILLSTROKE:
        this.properties.stroke = this.properties.secondaryColor;
        this.properties.fill = this.properties.primaryColor;
        break;
    }
  }

  updateTrace(): void {
    this.traceType(this.properties.type, this.properties.click);
  }
  updateShapeChosen( shape: string): void {
    this.properties.shapeChosen = shape;
  }
  setPolygonSide(nbrOfSide: number): void {
    this.properties.polygonSides = nbrOfSide;
  }

  mouseDown($event: MouseEvent): void {
    this.updateTrace();
    const position = this.mousePosition($event, this.properties.x1, this.properties.y1);
    this.properties.x1 = position[0];
    this.properties.y1 = position[1];
    this.properties.drag = true;

    this.creatSvgShapes();
    this.allowDrawing($event);
  }

  mouseUp($event: MouseEvent): void {
    this.properties.drag = false;
    this.properties.points = [];
    if (this.properties.shapeChosen === tools.CIRCLE || this.properties.shapeChosen === tools.POLYGON) {
      this.rendererRect.removeChild($event.target, this.svgShape.rectangle);
    }
  }

  mousePosition($event: MouseEvent, positionX: number, positionY: number): number[] {
    positionX = $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX;
    positionY = $event.clientY + this.scrollDrawing.ScrollY;
    return [positionX, positionY];
  }

  onShiftDown(): void {
    if (this.properties.drag && (this.properties.shapeChosen !== tools.POLYGON)) {
      this.createSquare();
      this.draw();
    }
  }

  onShiftUp(): void {
    if (this.properties.drag) {
      this.properties.fakeW = this.properties.x2 - this.properties.x1;
      this.properties.fakeH = this.properties.y2 - this.properties.y1;
      this.draw();
    }
  }

  creatSvgShapes(): void {
    this.svgShape.rectangle = this.rendererRect.createElement(SHAPES.RECT, SHAPES.LINK_SVG);
    this.svgShape.ellipse = this.rendererEllipse.createElement(SHAPES.ELLIPSE, SHAPES.LINK_SVG);
    this.svgShape.polygon = this.rendererPolygon.createElement(SHAPES.POLYGON, SHAPES.LINK_SVG);
  }

  allowDrawing($event: MouseEvent): void {
    if (this.rendererRect != null) {
      const parent = ($event.target as HTMLElement).parentNode as HTMLElement;

      if (parent.nodeName !== LINE_ATTRIBUTES.SVG) {
        if (parent.tagName === GROUP.GROUP_EL) {
          this.rendererRect.insertBefore(parent.parentNode, this.svgShape.ellipse, ($event.target as HTMLElement).lastChild);
          this.rendererRect.insertBefore(parent.parentNode, this.svgShape.rectangle, ($event.target as HTMLElement).lastChild);
          this.rendererRect.insertBefore(parent.parentNode, this.svgShape.polygon, ($event.target as HTMLElement).lastChild);
          this.SVGobjectList.push(this.svgShape);
        } else {
          this.rendererRect.insertBefore($event.target, this.svgShape.ellipse, ($event.target as HTMLElement).lastChild);
          this.rendererRect.insertBefore($event.target, this.svgShape.rectangle, ($event.target as HTMLElement).lastChild);
          this.rendererRect.insertBefore($event.target, this.svgShape.polygon, ($event.target as HTMLElement).lastChild);
          this.SVGobjectList.push(this.svgShape);
        }
      } else {
        this.rendererRect.insertBefore(parent, this.svgShape.ellipse, parent.lastChild);
        this.rendererRect.insertBefore(parent, this.svgShape.rectangle, parent.lastChild);
        this.rendererRect.insertBefore(parent, this.svgShape.polygon, parent.lastChild);
        this.SVGobjectList.push(this.svgShape);
      }
    }
  }

  updateDimension($event: MouseEvent): void {
    if ($event.shiftKey && (this.properties.shapeChosen !== tools.POLYGON)) {
      this.onShiftDown();
    } else {
      this.properties.fakeW = this.properties.x2 - this.properties.x1;
      this.properties.fakeH = this.properties.y2 - this.properties.y1;
    }
  }

  createSquare(): void {
    this.properties.fakeW = this.properties.x2 - this.properties.x1;
    if (((this.properties.y2 - this.properties.y1) > 0 && (this.properties.x2 - this.properties.x1) < 0) ||
      ((this.properties.y2 - this.properties.y1) < 0 && (this.properties.x2 - this.properties.x1) > 0)) {
      this.properties.fakeH = this.properties.x1 - this.properties.x2;
    } else { this.properties.fakeH = this.properties.x2 - this.properties.x1; }
  }

  plotShape($event: MouseEvent): void {
    const position = this.mousePosition($event, this.properties.x2, this.properties.y2);
    this.properties.x2 = position[0];
    this.properties.y2 = position[1];

    this.updateDimension($event);

    if (this.properties.drag) {
      this.draw();
    }
  }

  sortByNumber(a: number, b: number): number { return a - b; }

  draw(): void {
    this.properties.xs = [this.properties.x1, this.properties.x2].sort(this.sortByNumber);
    this.properties.ys = [this.properties.y1, this.properties.y2].sort(this.sortByNumber);
    if (this.properties.shapeChosen === tools.CIRCLE) {
      this.updateEllipseAttributes();
    } else if (this.properties.shapeChosen === tools.POLYGON) {
      this.updatePolygonAttributes();
    } else {
      this.updateRectAttributes(false);
    }
  }

  updateRectAttributes(isPreview: boolean): void {
    this.svgShape.rectangle.setAttribute('x', this.properties.xs[0].toString());
    this.svgShape.rectangle.setAttribute('y', this.properties.ys[0].toString());
    this.svgShape.rectangle.setAttribute('width', Math.abs(this.properties.fakeW).toString());
    this.svgShape.rectangle.setAttribute('height', Math.abs(this.properties.fakeH).toString());
    if (isPreview) {
      this.svgShape.rectangle.setAttribute('stroke', 'gray');
      this.svgShape.rectangle.setAttribute('stroke-width', '1.5');
      this.svgShape.rectangle.setAttribute('stroke-dasharray', '10,10');
      this.svgShape.rectangle.setAttribute('fill', 'none');
    } else {
      if (this.properties.click) {
        this.svgShape.rectangle.setAttribute('fill', this.properties.fill);
        this.svgShape.rectangle.setAttribute('stroke', this.properties.stroke);
      } else {
        this.svgShape.rectangle.setAttribute('fill', this.properties.primaryColor);
        this.svgShape.rectangle.setAttribute('stroke', this.properties.secondaryColor);
      }
      this.svgShape.rectangle.setAttribute('stroke-width', (this.properties.strokethickness).toString());
    }
  }

  updateEllipseAttributes(): void {
    this.updateRectAttributes(true);
    this.svgShape.ellipse.setAttribute('cx', (this.properties.xs[0] + (Math.abs(this.properties.fakeW) / 2)).toString());
    this.svgShape.ellipse.setAttribute('cy', (this.properties.ys[0] + (Math.abs(this.properties.fakeH) / 2)).toString());
    this.svgShape.ellipse.setAttribute('rx', (Math.abs(this.properties.fakeW / 2 +
                                              this.ellipseStrokeWidth(this.properties.fakeW))).toString());
    this.svgShape.ellipse.setAttribute('ry', (Math.abs(this.properties.fakeH / 2 +
                                              this.ellipseStrokeWidth(this.properties.fakeH))).toString());
    if (this.properties.click) {
      this.svgShape.ellipse.setAttribute('fill', this.properties.fill);
      this.svgShape.ellipse.setAttribute('stroke', this.properties.stroke);
    } else {
      this.svgShape.ellipse.setAttribute('fill', this.properties.primaryColor);
      this.svgShape.ellipse.setAttribute('stroke', this.properties.secondaryColor);
    }
    this.svgShape.ellipse.setAttribute('stroke-width', (this.properties.strokethickness).toString());
  }

  updatePolygonAttributes(): void {
    this.properties.radiusPolygon = Math.min(Math.abs(this.properties.fakeH), Math.abs(this.properties.fakeW));
    if (this.properties.polygonSides === SHAPES.TRIANGLE) {
      this.drawTriangle();
    } else {
      for (let i = 0; i < this.properties.polygonSides; i++) {
        this.properties.points.push(((this.properties.x1 + this.properties.x2) / 2.0) +
          (this.properties.radiusPolygon / 2.0 - this.properties.strokethickness / 2.0)
          * Math.cos(2 * Math.PI * i / this.properties.polygonSides));
        this.properties.points.push(((this.properties.y1 + this.properties.y2) / 2.0) +
          (this.properties.radiusPolygon / 2.0 - this.properties.strokethickness / 2.0)
          * Math.sin(2 * Math.PI * i / this.properties.polygonSides));
      }
    }
    this.updateRectAttributes(true);

    this.svgShape.polygon.setAttribute('points', this.properties.points.join(','));
    if (this.properties.click) {
      this.svgShape.polygon.setAttribute('fill', this.properties.fill);
      this.svgShape.polygon.setAttribute('stroke', this.properties.stroke);
    } else {
      this.svgShape.polygon.setAttribute('fill', this.properties.primaryColor);
      this.svgShape.polygon.setAttribute('stroke', this.properties.secondaryColor);
    }
    this.svgShape.polygon.setAttribute('stroke-width', (this.properties.strokethickness).toString());
    this.properties.points = [];
  }

  drawTriangle(): void {
    for (let i = 0; i < this.properties.polygonSides; i++) {
      this.svgShape.rectangle.setAttribute('x', this.properties.xs[0].toString());
      this.svgShape.rectangle.setAttribute('y', this.properties.ys[0].toString());
      this.properties.points.push(((this.properties.x1 + this.properties.x2) / 2.0) +
        (this.properties.radiusPolygon / (2.0 * Math.sin(Math.PI / this.properties.polygonSides))) *
        Math.cos(Math.PI / this.properties.polygonSides * (1 + 2 * i)) + this.triangleStrokeWidth('x', i));
      this.properties.points.push(((this.properties.y1 + this.properties.y2) / 2.0) +
        (this.properties.radiusPolygon / (2.0 * Math.sin(Math.PI / this.properties.polygonSides))) *
        Math.sin(Math.PI / this.properties.polygonSides * (1 + 2 * i)) + this.triangleStrokeWidth('y', i));
    }
  }

  ellipseStrokeWidth(dimension: number): number {
    if (dimension < 0) {
      return (this.properties.strokethickness / 2);
    } else {
      return (- this.properties.strokethickness / 2);
    }
  }

  triangleStrokeWidth(axes: string, index: number): number {
    if (axes === 'y' && index === 0) {
      return (-this.properties.strokethickness);
    } else if ( (axes === 'y' && index === 2)) {
      return this.properties.strokethickness;
      } else if (axes === 'x' && index === 1) {
        return (2 * this.properties.strokethickness);
        } else {
          return 0;
        }
  }
}
