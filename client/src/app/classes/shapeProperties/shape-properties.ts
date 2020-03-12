import { Injectable } from '@angular/core';
import { DEFAULT_VALUES } from 'src/app/enum';

@Injectable({
    providedIn: 'root',
})
export class ShapeProperties {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    fakeW: number;
    fakeH: number;
    stroke: string;
    fill: string;
    polygonSides = 3;
    radiusPolygon: number;
    strokethickness = 5;
    drag = false;
    click = false;
    points: number[] = [];
    xs: number[];
    ys: number[];
    primaryColor: string;
    secondaryColor: string;
    type = 'fillStroke';

    nbrOfSidesPolygon: number = DEFAULT_VALUES.NUMBER_SIDES_POLYGON;
    selected: string = DEFAULT_VALUES.SHAPE_SELECTED;
    sliderValue: number;
    shapeChosen: string = DEFAULT_VALUES.SHAPE_CHOSEN;
}
