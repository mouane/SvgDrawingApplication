import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { PipetteProperties } from 'src/app/classes/pipetteProperties/pipette-properties';
import { SIDEBAR } from 'src/app/enum';
import { ScrollDrawingService } from '../scroll-drawing/scroll-drawing.service';

@Injectable({
  providedIn: 'root',
})
export class PipetteService {
  private renderer: Renderer2;
  primaryColor: string;
  secondaryColor: string;

  constructor(rendererFactory: RendererFactory2, private scrollDrawing: ScrollDrawingService,
              private properties: PipetteProperties) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  getPrimaryColor(): string {
    return this.primaryColor;
  }

  getSecondaryColor(): string {
    return this.secondaryColor;
  }

  getSvgColor($event: MouseEvent): void {
    if (this.renderer != null) {
      const element = ($event.target as HTMLElement);
      if (element.nodeName === 'svg') {
        this.properties.color = element.style.backgroundColor || '';
      } else if (element.nodeName === 'path') {
        this.properties.color = element.getAttribute('stroke') || '';
        } else if (element.nodeName === 'rect' || element.nodeName === 'ellipse' || element.nodeName === 'polygon') {

        this.properties.xPos = $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX;
        this.properties.yPos = $event.clientY + this.scrollDrawing.ScrollY;

        if (element.nodeName === 'rect') {
          this.rangeRectangle(element);
        } else if (element.nodeName === 'ellipse') {
          this.rangeEllipse(element);
        } else {
          this.rangePolygon(element);
        }
      }

      // tslint:disable-next-line: deprecation
      if ($event.which === 1) {
        this.primaryColor = this.properties.color;
      // tslint:disable-next-line: deprecation
      } else if ($event.which === 3) {
        $event.preventDefault();
        this.secondaryColor = this.properties.color;
      }
    }
  }

  rangePolygon(element: HTMLElement): void {
    let points = new Array();
    const pointsX = new Array();
    const pointsY = new Array();
    const strokeWidth = parseFloat((element.getAttribute('stroke-width') || ''));

    points = (element.getAttribute('points') || '').split(',');

    for (let i = 0; i < points.length; i++) {
      points[i] = Math.round(parseFloat(points[i]) * 10) / 10;
      if (i % 2 === 0) {
        pointsX.push(points[i]);
      } else {
        pointsY.push(points[i]);
      }
    }
    this.polygonCenter(pointsX, pointsY);

    while (this.properties.newPointsX.length > 0) {
      this.properties.newPointsX.pop();
      this.properties.newPointsY.pop();
    }

    for (let k = 0; k < pointsX.length; k++) {
      this.ajustedPoints(pointsX[k], pointsY[k], this.properties.centerX, this.properties.centerY, strokeWidth);
    }

    const inside = this.hitSides();

    if (!inside) {
      this.properties.color = element.getAttribute('stroke') || '';
    } else {
      this.properties.color = element.getAttribute('fill') || '';
    }
  }

  polygonCenter(pointsX: number[], pointsY: number[]): void {
    let midX = 0;
    let midY = 0;
    for (let i = 0; i < pointsX.length; i++) {
        midX += pointsX[i];
        midY += pointsY[i];
    }
    this.properties.centerX = midX / pointsX.length;
    this.properties.centerY = midY / pointsY.length;
  }

  ajustedPoints(xPoint: number, yPoint: number, centerX: number, centerY: number, strokeWidth: number): void {
    const distX = centerX - (Math.round(10 * xPoint) / 10);
    const distY = centerY - (Math.round(10 * yPoint) / 10);
    const length = Math.sqrt(distX * distX + distY * distY);

    xPoint = xPoint + distX * (strokeWidth / length);

    yPoint = yPoint + distY * (strokeWidth / length);

    this.properties.newPointsX.push(xPoint);
    this.properties.newPointsY.push(yPoint);
  }

  hitSides(): boolean {
   let z;
   let j;
   let hitSides = false;
   for (z = 0, j = this.properties.newPointsX.length - 1; z < this.properties.newPointsX.length; j = z++) {
      if (((this.properties.newPointsY[z] >= this.properties.yPos) !== (this.properties.newPointsY[j] >= this.properties.yPos)) &&
        (this.properties.xPos <= (this.properties.newPointsX[j] - this.properties.newPointsX[z]) *
          (this.properties.yPos - this.properties.newPointsY[z]) /
          (this.properties.newPointsY[j] - this.properties.newPointsY[z]) + this.properties.newPointsX[z])) {
            hitSides = !hitSides;
      }
    }
   return hitSides;
  }

  rangeRectangle(element: HTMLElement): void {
    const x = parseFloat((element.getAttribute('x') || ''));
    const y = parseFloat((element.getAttribute('y') || ''));
    const strokeWidth = parseFloat(element.getAttribute('stroke-width') || '');
    const width = parseFloat((element.getAttribute('width') || ''));
    const height = parseFloat((element.getAttribute('height') || ''));

    this.properties.xMin = x + (strokeWidth / 2);
    this.properties.xMax = this.properties.xMin + width - strokeWidth;

    this.properties.yMin = y + strokeWidth;
    this.properties.yMax = this.properties.yMin + height - strokeWidth;

    if ((this.properties.xPos < this.properties.xMin || this.properties.xPos > this.properties.xMax) ||
      (this.properties.yPos < this.properties.yMin || this.properties.yPos > this.properties.yMax)) {
      this.properties.color = element.getAttribute('stroke') || '';
    } else {
      this.properties.color = element.getAttribute('fill') || '';
    }
  }

  rangeEllipse(element: HTMLElement): void {
    const cx = parseFloat((element.getAttribute('cx') || ''));
    const rx = parseFloat((element.getAttribute('rx') || ''));
    const strokeWidth = parseFloat(element.getAttribute('stroke-width') || '');
    const cy = parseFloat((element.getAttribute('cy') || ''));
    const ry = parseFloat((element.getAttribute('ry') || ''));

    this.properties.ellipseRange = (Math.pow(this.properties.xPos - cx, 2) / Math.pow(rx - (strokeWidth / 2), 2)) +
      (Math.pow(this.properties.yPos - cy, 2) / Math.pow(ry - (strokeWidth / 2), 2));
    if (this.properties.ellipseRange <= 1) {
      this.properties.color = element.getAttribute('fill') || '';
    } else {
      this.properties.color = element.getAttribute('stroke') || '';
    }
  }
}
