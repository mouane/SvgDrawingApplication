import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
  })

export class MagnetismProperties {
    counter: number;
    differenceX: number;
    differenceY: number;
    differenceWX: number;
    differenceWY: number;
    differenceMX: number;
    differenceMY: number;
    selectBoxX: number;
    selectBoxY: number;
    selectBoxWX: number;
    selectBoxWY: number;
    selectBoxMX: number;
    selectBoxMY: number;
    offset = 0;
    anchor = 'topLeft';
}
