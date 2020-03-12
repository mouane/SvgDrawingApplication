import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class BrushProperties {
    stroke: string;
    color: string;
    x: number;
    y: number;
    isPath = false;
    strokes: SVGElement;
    circle: SVGElement;
    circleX: number;
    circleY: number;
    tip = 5;
    indexPath = 0;
    indexCircle = 0;
    filterBase: SVGElement;
    filterTurbulence: SVGElement;
    filterNoise: SVGElement;
    filterBlurry: SVGElement;
    filterSquigly: SVGElement;
    currentFilter: SVGElement;
    subSvg: SVGElement;
}
