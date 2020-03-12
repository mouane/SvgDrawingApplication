import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TextProperties {
    DEFAULTTEXT = 'Type';
    BASICWIDTH = 115;
    ITALIC = 'italic ';
    BOLD = 'bold ';
    EMPTYSTRING = '';
    ANCHORLEFT = 'start';
    ANCHORRIGHT = 'end';
    ANCHORMIDDLE = 'middle';
    ARRAYOFFSET = 1;
    EMNULL = '0em';
    typingEnabler = false;
    size = 25;
    posX: number;
    offsetX = 0;
    posY: number;
    parent: SVGElement;
    text: SVGElement;
    line: SVGElement;
    rectangle: SVGElement;
    color: string;
    anchor = this.ANCHORLEFT;
    fontType: string;
    italic = '';
    bold = '';
    police = 'sans-serif';
    drawingViewWidth: number;
    onFirst = true;
    isDisabled = true;
    currentMouseEvent: MouseEvent;
    counter: number;
    tspan: SVGElement;
    lastKey: string;
}
// tslint:disable-next-line: max-classes-per-file
export class Line {
    content: string;
    posX: number;
    dY: string;
    svgElem: SVGElement;
    addedByEnter = false;
}
