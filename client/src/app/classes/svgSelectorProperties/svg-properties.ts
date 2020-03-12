import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SvgSelectorProperties {
    isRendering = false;
    selected = false;
    isResize = false;
    isObjectMove = false;
    alreadyClicked = true;

    index = 0;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    childX1: number;
    childX2: number;
    childY1: number;
    childY2: number;
    fakeW: number;
    fakeH: number;
    eventX: number;
    eventY: number;
    multipleSelectionX: number[];
    multipleSelectionY: number[];

    pathD: string;
    parcedPath: string[];
    parcedCoordinate: string[];

    rectangle: SVGElement;
    parent: SVGElement;
    topLeftCtrl: SVGElement;
    topCenterCtrl: SVGElement;
    topRightCtrl: SVGElement;
    centerLeftCtrl: SVGElement;
    centerRightCtrl: SVGElement;
    bottomLeftCtrl: SVGElement;
    bottomCenterCtrl: SVGElement;
    bottomRightCtrl: SVGElement;
    selectBox: SVGElement;

    childs: NodeListOf<Node>;
    selctedChilds: Node[];
    rightSelctedChilds: Node[];
}
