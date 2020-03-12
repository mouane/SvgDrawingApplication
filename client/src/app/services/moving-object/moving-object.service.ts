import { Injectable } from '@angular/core';
import { MovingProperties } from '../../classes/movingProperties/moving-properties';
import { MagnetismService } from '../magnetism/magnetism.service';

enum Variable {
  ZERO = 0,
}

@Injectable({
  providedIn: 'root',
})
export class MovingObjectService {

  counter: number;
  difference: number;
  selectBoxX: number;
  offset: number;
  magnet: boolean;
  constructor(private properties: MovingProperties, private magnetism: MagnetismService) {
    this.magnet = false;
    this.offset = Variable.ZERO;
  }

  setObjects(selectedChilds: Node[], event: MouseEvent): void {
    if (this.magnet) {
      this.magnetism.setObjects(selectedChilds, event);
    } else {
    this.counter = 1;
    this.properties.firstTime = true;
    this.properties.selectedChilds = selectedChilds;
    this.properties.refX = event.clientX;
    this.properties.refY = event.clientY;
    }
  }

  move(event: MouseEvent): void {
    if (this.magnet) {
      this.magnetism.move(event);
    } else {
    this.properties.selectedChilds.forEach( (child) => {
      let oldTransform = (child as HTMLElement).getAttribute('transform');
      if (oldTransform) {
        const translateIndex = oldTransform.indexOf('translate');
        if (translateIndex > -1) {
          if (this.properties.firstTime) {
            this.counter++;
            if (this.counter > this.properties.selectedChilds.length ) {
              this.properties.firstTime = false;
            }
          } else {
            let translate = oldTransform.slice(translateIndex);
            translate = translate.substring(translateIndex, translate.indexOf(')') + 1);
            oldTransform = oldTransform.replace(translate, '');
          }
        }
        const movingX = - (this.properties.refX - event.clientX);
        const movingY = - (this.properties.refY - event.clientY);

        (child as HTMLElement).setAttribute('transform', 'translate('
        + movingX + ',' + movingY + ')' + oldTransform);
      } else {
        const movingX = - (this.properties.refX - event.clientX);
        const movingY = - (this.properties.refY - event.clientY);
        (child as HTMLElement).setAttribute('transform', 'translate(' + movingX + ',' + movingY + ')');
      }
    });
  }
}

}
