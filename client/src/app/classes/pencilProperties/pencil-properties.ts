import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PencilProperties {
    line: string;
    color: string;
    x: number;
    y: number;
    isPath = false;
    lines: SVGElement;
    circle: SVGElement;
    image: SVGElement;
    circleX: number;
    circleY: number;
    tip = 5;
    indexPath = 0;
    indexCircle = 0;
    subSvg: SVGElement;
}
