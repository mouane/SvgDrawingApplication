import { Injectable } from '@angular/core';
import { Drawing } from '../../../../../common/communication/drawing';

@Injectable({
    providedIn: 'root',
})
export class DrawingViewProperties {
    height: number;
    width: number;
    hexColor: string;
    backHexColor: string;
    showSVG = false;
    svg: SVGElement;
    mainRectangle: SVGElement;
    grid: SVGElement;
    drawingElements: Drawing;
}
