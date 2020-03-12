import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class QuillProperties {
    line: string;
    color: string;
    x: number;
    y: number;
    leftX: number;
    leftY: number;
    rightX: number;
    rightY: number;
    lines: SVGElement;
    subSvg: SVGElement;
    startLeftX: number;
    startLeftY: number;
    startRightX: number;
    startRightY: number;
}
