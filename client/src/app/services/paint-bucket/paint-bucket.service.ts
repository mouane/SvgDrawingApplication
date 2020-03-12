import { Point } from '@angular/cdk/drag-drop/typings/drag-ref';
import { Injectable, RendererFactory2 } from '@angular/core';
import { PaintBucketProperties } from 'src/app/classes/paintBucketProperties/paint-bucket-properties';
import { BASE64, CANVAS, GROUP, LINE_ATTRIBUTES, SHAPES, SIDEBAR } from 'src/app/enum';
import { ColorToolService } from '../color-tool/color-tool.service';
import { ScrollDrawingService } from '../scroll-drawing/scroll-drawing.service';

const ZERO = 0;
const OFFSET = 0.5;
const ONE = 1;
const TWO = 2;
const THREE = 3;
const FOUR = 4;
const SIXTEEN = 16;
const MAX_TOLERANCE = 100;
const MAX_COLOR = 255;
const EMPTY_PATH = '';

@Injectable({
  providedIn: 'root',
})
export class PaintBucketService {
  constructor(rendererFactory: RendererFactory2, private colorToolService: ColorToolService,
              private scrollDrawingService: ScrollDrawingService, private properties: PaintBucketProperties) {
    this.properties.renderer = rendererFactory.createRenderer(null, null);
  }

  set _Tolerance(tolerance: number) {
    this.properties.tolerance = tolerance;
  }

  mouseDown(event: MouseEvent): void {
    this.properties.eventTarget = event.target as HTMLElement;
    this.prepareFloodFill(event);
  }

  createPath(path: string): void {
    this.properties.path = this.properties.renderer.createElement(LINE_ATTRIBUTES.PATH, LINE_ATTRIBUTES.LINK_SVG);
    this.properties.path.setAttribute(LINE_ATTRIBUTES.D, path);
    this.properties.path.setAttribute(LINE_ATTRIBUTES.FILL, this.colorToolService.Fill);
    this.properties.path.setAttribute(LINE_ATTRIBUTES.STROKE, this.colorToolService.Fill);
    this.properties.path.setAttribute(LINE_ATTRIBUTES.STROKE_WIDTH, TWO.toString());

    this.addToDrawingView(this.properties.path);
  }

  resetToConvert(canvasWidth: number, canvasHeight: number): void {
    for (let i = ZERO; i <= (canvasWidth - SIDEBAR.sideBarWidth); i++) {
      this.properties.toConvert[i] = [];
      for (let j = ZERO; j <= canvasHeight; j++) {
        this.properties.toConvert[i][j] = ZERO;
      }
    }
  }

  createCanvas(): void {
    this.properties.svg = this.properties.renderer.selectRootElement('#drawing', true);
    this.properties.canvas = this.properties.renderer.createElement(CANVAS.CANVAS);
    this.properties.canvas.height = this.properties.svg.getBoundingClientRect().height;
    this.properties.canvas.width = this.properties.svg.getBoundingClientRect().width + SIDEBAR.sideBarWidth;
    this.properties.context = this.properties.canvas.getContext(CANVAS.CONTEXT) as CanvasRenderingContext2D;
    this.properties.renderer.appendChild(this.properties.svg, this.properties.canvas);
  }

  setUpImage(): void {
    this.properties.svgImage = new Image();
    this.properties.svgImage.height = this.properties.svg.getBoundingClientRect().height;
    this.properties.svgImage.width = this.properties.svg.getBoundingClientRect().width;
    const url = BASE64.URL;
    this.properties.svgImage.src = url + btoa(new XMLSerializer().serializeToString(this.properties.svg as Node));
  }

  prepareFloodFill(event: MouseEvent): void {
    this.createCanvas();

    if (this.properties.context) {
      this.setUpImage();

      this.properties.svgImage.decode().then(() => {
        if (this.properties.context) {
          this.properties.context.drawImage(this.properties.svgImage, SIDEBAR.sideBarWidth, ZERO);
          const boundingRect = this.properties.canvas.getBoundingClientRect();
          const xInit: number = event.clientX - boundingRect.left - SIDEBAR.sideBarWidth + this.scrollDrawingService.ScrollX;
          const yInit: number = event.clientY - boundingRect.top + this.scrollDrawingService.ScrollY;
          const imageData: ImageData = this.properties.context.getImageData(SIDEBAR.sideBarWidth, ZERO,
                                       this.properties.canvas.width, this.properties.canvas.height);
          this.resetToConvert(imageData.width, imageData.height);
          this.floodFill(xInit, yInit, imageData);
        }
      });
    }
    this.properties.canvas.remove();
  }

  getPixel(imageData: ImageData, x: number, y: number) {
    if (x < ZERO || y < ZERO || x >= imageData.width || y >= imageData.height) {
      return [-ONE, -ONE, -ONE, -ONE];
    } else {
      const offset = (y * imageData.width + x) * FOUR;
      return imageData.data.slice(offset, offset + FOUR);
    }
  }

  colorTolerance(oldColor: number[], pixelColor: number[], tolerance: number): boolean {
    const gap = (MAX_COLOR * tolerance) / MAX_TOLERANCE;
    const red = (oldColor[ZERO] <= pixelColor[ZERO] + gap) && (oldColor[ZERO] >= pixelColor[ZERO] - gap);
    const green = (oldColor[ONE] <= pixelColor[ONE] + gap) && (oldColor[ONE] >= pixelColor[ONE] - gap);
    const blue = (oldColor[TWO] <= pixelColor[TWO] + gap) && (oldColor[TWO] >= pixelColor[TWO] - gap);
    const alpha = (oldColor[THREE] <= pixelColor[THREE] + gap) && (oldColor[THREE] >= pixelColor[THREE] - gap);

    return (red && green && blue && alpha);
  }

  hexToRgba(color: string): number[] {
    const r = parseInt(color.slice(1, 3), SIXTEEN);
    const g = parseInt(color.slice(3, 5), SIXTEEN);
    const b = parseInt(color.slice(5, 7), SIXTEEN);
    const a = parseInt(color.slice(7, 9), SIXTEEN);

    return [r, g, b, a];
  }

  checkOutOfBound(xPos: number, yPos: number): Point {
    if (xPos < ZERO && yPos < ZERO) {
      return { x: xPos + ONE, y: yPos + ONE };
    } else if (xPos < ZERO) {
      return {x: xPos + ONE, y: yPos};
    } else if (yPos < ZERO) {
      return {x: xPos, y: yPos + ONE};
    } else {
      return {x: xPos, y: yPos};
    }
  }

  floodFill(xInit: number, yInit: number, imageData: ImageData): void {
    const visited = new Uint8Array(imageData.data.length);
    const colorToChange = this.getPixel(imageData, xInit, yInit);
    const fillColor = this.hexToRgba(this.colorToolService.Fill);

    if (this.properties.tolerance === MAX_TOLERANCE) {
      this.createRect();
    } else if (!this.colorTolerance(colorToChange as number[], fillColor, this.properties.tolerance)) {
      const pixelsToCheck = [[xInit, yInit]];
      while (pixelsToCheck.length > ZERO) {
        const position = pixelsToCheck.pop() || [ZERO, ZERO];
        const y = position[ONE];
        const x = position[ZERO];
        if (x !== undefined && y !== undefined) {
          const currentColor = this.getPixel(imageData, x, y);

          if (!visited[y * imageData.width + x] && this.colorTolerance(colorToChange as number[],
                                                                       currentColor as number[], this.properties.tolerance)) {
            this.properties.toConvert[x][y] = ONE;
            visited[y * imageData.width + x] = ONE;

            pixelsToCheck.push([x + ONE, y]);
            pixelsToCheck.push([x - ONE, y]);
            pixelsToCheck.push([x, y + ONE]);
            pixelsToCheck.push([x, y - ONE]);
          } else if (!this.colorTolerance(colorToChange as number[], currentColor as number[], this.properties.tolerance)) {
            const posToChange = this.checkOutOfBound(x , y);
            this.properties.toConvert[posToChange.x][posToChange.y] = ONE;
          }
        }
      }
      this.createObject();
    }
  }

  createRect(): void {
    const rect = this.properties.renderer.createElement(SHAPES.RECT, SHAPES.LINK_SVG);
    rect.setAttribute(LINE_ATTRIBUTES.WIDTH, this.properties.canvas.width);
    rect.setAttribute(LINE_ATTRIBUTES.HEIGTH, this.properties.canvas.height);
    rect.setAttribute(LINE_ATTRIBUTES.FILL, this.colorToolService.Fill);
    rect.setAttribute(LINE_ATTRIBUTES.STROKE, this.colorToolService.Fill);

    this.addToDrawingView(rect);
  }

  addToDrawingView(element: SVGElement): void {
    const parent = this.properties.eventTarget.parentNode as HTMLElement;
    if (parent.nodeName !== LINE_ATTRIBUTES.SVG) {
      if (parent.tagName === GROUP.GROUP_EL) {
        this.properties.renderer.insertBefore(parent.parentNode, element, this.properties.eventTarget.lastChild);
      } else {
        this.properties.renderer.insertBefore(this.properties.eventTarget, element, this.properties.eventTarget.lastChild);
      }
    } else {
      this.properties.renderer.insertBefore(parent, element, parent.lastChild);
    }
  }

  createObject(): void {
    let path = EMPTY_PATH;
    for (let i = ZERO; i < this.properties.toConvert.length; i++) {
      for (let j = ZERO; j < this.properties.toConvert[ZERO].length; j ++) {
        if ((j < this.properties.toConvert[ZERO].length) && this.properties.toConvert[i][j] === ZERO &&
          this.properties.toConvert[i][j + ONE] === ONE || (j === ZERO && this.properties.toConvert[i][j] === ONE)) {
          path += LINE_ATTRIBUTES.M + i + LINE_ATTRIBUTES.SPACE + j + LINE_ATTRIBUTES.SPACE;
        }
        if (((j === (this.properties.toConvert[ZERO].length - ONE)) || this.properties.toConvert[i][j + ONE] === ZERO) &&
                      this.properties.toConvert[i][j] === ONE) {
          path += LINE_ATTRIBUTES.L + (i + OFFSET) + LINE_ATTRIBUTES.SPACE + (j + OFFSET) + LINE_ATTRIBUTES.SPACE;
        }
      }
    }
    this.createPath(path);
  }
}
