import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class StampSelectorProperties {
    imageChosen = false;
    imgUrl: string;
    path = '../../../../assets/imgs/';
    rotationFactor = 0;
    denominatorScale = 1;
    nominatorScale = 1;
    sizeS: string;
    sizeI: number;
    posX: number;
    posY: number;
    image: CanvasImageSource;
}
