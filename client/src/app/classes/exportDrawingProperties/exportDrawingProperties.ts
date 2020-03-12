import { Injectable, Renderer2 } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ExportDrawingProperties {
  svg: SVGElement;
  renderer: Renderer2;
  drawingFormat: string;
  drawingImage: HTMLImageElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
}
