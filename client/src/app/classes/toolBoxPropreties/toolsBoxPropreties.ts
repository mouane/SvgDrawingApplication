import { Injectable } from '@angular/core';
import { DEFAULT_VALUES } from 'src/app/enum';

@Injectable({
    providedIn: 'root',
})
export class ToolBoxPropreties {
    drawingExist = false;

    fill: string;
    outline: string;
    shapeChosen = '';
    enable = false;
    gridOpacity: number = DEFAULT_VALUES.GRID_OPACITY_PERCENT;
    gridValue: number = DEFAULT_VALUES.GRID_VALUE;
    gridActivated = false;
    nominator: number = DEFAULT_VALUES.STAMP_NUM;
    denominator: number = DEFAULT_VALUES.STAMP_NUM;
    rotationFactor = 0;
    shapeOpened = false;

    isSelected: string;
    icon: any;

}
