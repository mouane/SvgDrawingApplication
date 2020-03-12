import { Injectable, Renderer2 } from '@angular/core';
import { ERASER } from 'src/app/enum';

@Injectable({
    providedIn: 'root',
})
export class EraserProperties {
    renderer: Renderer2;
    eraserSVG: SVGElement;
    borderRectangle: SVGElement;
    clicked = false;
    mouseMovedAndClicked = false;
    eraserSize: number = ERASER.BASICSIZE;
    childs: NodeListOf<Node>;
    drawingViewSVGAs: SVGAElement[];
    toBeDestroyed: SVGElement[];
    borderRectArray: SVGElement[];
    oldX: number;
    oldY: number;
    onTopElement: SVGElement;
    onFirst = true;
}
