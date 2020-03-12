import { Injectable } from '@angular/core';
import { COLOR_PICKER } from 'src/app/enum';

@Injectable({
    providedIn: 'root',
})
export class ColorToolProperties {
    typeColor: string;
    tabsShow = true;
    colorTrans = 'rgb(255,255,255)';
    colorHEX: string;
    primary = '#000000';
    secondary = '#000000';
    background = '#FFFFFF';

    transPrimary = 100;
    transSecondary = 100;
    transBackground = 100;
    rgba: string;
    invalid = false;
    show = false;
    transHex: string = COLOR_PICKER.FF;
}
