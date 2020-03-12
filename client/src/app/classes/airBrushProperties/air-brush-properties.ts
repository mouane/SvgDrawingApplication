import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AirBrushProperties {
    dotsPerTick = 2;
    radius: number;
    spray: any;
    groupEl: SVGElement;
    offset = [0, 0];

    color: string;
    spraying: boolean;
    xPos: number;
    yPos: number;

    path: SVGElement;
    circlePath: string;
    parent: SVGElement;
}
