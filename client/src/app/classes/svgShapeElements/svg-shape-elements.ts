import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SvgShapeElements {
    rectangle: SVGElement;
    ellipse: SVGElement;
    polygon: SVGElement;
}
