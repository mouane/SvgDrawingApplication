import { Injectable, Renderer2 } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PaintBucketProperties {
    renderer: Renderer2;
    svg: SVGElement;
    path: SVGElement;
    svgImage: HTMLImageElement;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    eventTarget: HTMLElement;
    tolerance = 10;
    toConvert: number[][] = [];
}
