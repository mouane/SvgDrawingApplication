import { Injectable } from '@angular/core';
import { Drawing } from '../../../../../common/communication/drawing';

@Injectable({
    providedIn: 'root',
})
export class SaveDrawingProperties {
    childs: NodeListOf<Node>;
    savedSvg: string[];
    drawingObj: Drawing;
    svg: SVGElement;
    svgImg: string;
    createdAt: string;
}
