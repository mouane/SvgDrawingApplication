import { Injectable } from '@angular/core';
import { RotationProperties } from 'src/app/classes/rotationProperties/rotationProperties';
import { SvgSelectorProperties } from 'src/app/classes/svgSelectorProperties/svg-properties';
import { SvgSelectorToolService } from '../svg-selector-tool/svg-selector-tool.service';

@Injectable({
  providedIn: 'root',
})
export class RotateService {

  constructor(
    private properties: RotationProperties,
    private selectorProperties: SvgSelectorProperties,
    private selector: SvgSelectorToolService) { }

  setCurrentSelectedChilds(): void {
    this.properties.currentSelected = this.selectorProperties.selctedChilds;
    this.properties.onNewSelection = true;
  }
  incrementRotationFactor($event: MouseEvent): void {
    if ($event.altKey) {
      this.properties.rotationFactor = 1;
    } else {
      this.properties.rotationFactor = this.properties.ROTATIONFACT;
    }
    this.properties.rotator = this.properties.rotator + this.properties.rotationFactor;
    this.rotate($event.shiftKey, this.properties.INCREMENT);
  }
  decrementRotationFactor($event: MouseEvent): void {
    if ($event.altKey) {
      this.properties.rotationFactor = 1;
    } else {
      this.properties.rotationFactor = this.properties.ROTATIONFACT;
    }
    this.properties.rotator = this.properties.rotator - this.properties.rotationFactor;
    this.rotate($event.shiftKey, this.properties.DECREMENT);
  }
  resetRotationFactor(): void {
    if (this.properties.differentToggled) {
      this.properties.rotator = this.properties.rotationFactor;
      this.properties.differentToggled = false;
    } else {
      this.properties.rotator = 0;
    }
    this.properties.rotationAtThisCenterExists = false;
  }
  rotate(shift: boolean, direction: string): void {
    if (shift) {
      if (this.properties.different) {
        this.properties.differentToggled = true;
        this.resetRotationFactor();
      }
      this.rotateCenterOfItem(direction);
      this.properties.different = false;
    } else {
      if (!this.properties.different) {
        this.properties.differentToggled = true;
        this.resetRotationFactor();
      }
      this.rotateCenterOfSelection(direction);
      this.properties.different = true;
    }
  }
  rotateCenterOfSelection(direction: string): void {
    let centerX = this.properties.oldCenterX;
    let centerY = this.properties.oldCenterY;
    if (this.selectorProperties.selctedChilds.length >= 1) {
      this.selectorProperties.selctedChilds.forEach((element) => {
        if (this.properties.currentSelected !== this.selectorProperties.selctedChilds || this.properties.onNewSelection) {
          const currentBBox = (this.selectorProperties.selectBox as SVGAElement).getBBox();
          centerX = currentBBox.x + currentBBox.width / 2;
          centerY = currentBBox.y + currentBBox.height / 2;
          this.properties.oldCenterX = centerX;
          this.properties.oldCenterY = centerY;
          this.properties.onNewSelection = false;
        }
        this.ifRotationWithThisCenterExist((element as SVGElement), centerX, centerY, direction);
        let tempAttribute = '';
        if (this.properties.rotationAtThisCenterExists) {
         if (this.properties.existRotate) {
         tempAttribute =  this.properties.ROTATE + '(' + this.properties.tempRotation + ' ' + (centerX) + ' ' + (centerY) + ')'
         +  this.properties.oldRotateCenterSelection + this.properties.oldScale + this.properties.oldRotateCenterItem ;
         } else {
         tempAttribute = this.properties.ROTATE + '(' + this.properties.tempRotation + ' ' + (centerX) + ' ' + (centerY) + ')'
         + this.properties.oldScale + this.properties.oldRotateCenterItem;
         }
       } else {
        if (this.properties.existRotate) {
        tempAttribute = this.properties.ROTATE + '(' + this.properties.rotator + ' ' + (centerX) + ' ' + (centerY) + ')'
        + this.properties.oldRotateCenterSelection + this.properties.oldScale + this.properties.oldRotateCenterItem;
        } else {
          tempAttribute = this.properties.ROTATE + '(' + this.properties.rotator + ' ' + (centerX) + ' '
          + (centerY) + ')' + this.properties.oldScale +  this.properties.oldRotateCenterItem ;
        }
       }
        (element as SVGElement).setAttribute(this.properties.TRANSFORM, tempAttribute );
        this.properties.rotationAtThisCenterExists = false;
        this.properties.existRotate = false;
      });
      this.selector.updateSelectBox();
    }
  }
  rotateCenterOfItem(direction: string): void {
    if (this.selectorProperties.selctedChilds.length >= 1) {
      this.selectorProperties.selctedChilds.forEach((element) => {
      const currentBBox = (element as SVGAElement).getBBox();
      const centerX = currentBBox.x + currentBBox.width / 2;
      const centerY = currentBBox.y + currentBBox.height / 2;
      this.ifRotationWithThisCenterExist((element as SVGElement), centerX, centerY, direction);
      let tempAttribute = '';
      if (this.properties.rotationAtThisCenterExists) {
         if (this.properties.existRotate) {
          tempAttribute = this.properties.oldRotateCenterSelection + this.properties.oldScale + this.properties.oldRotateCenterItem +
          this.properties.ROTATE + '(' + this.properties.tempRotation + ',' + (centerX) + ',' + (centerY) + ')';
         } else {
          tempAttribute = this.properties.oldRotateCenterSelection + this.properties.oldScale +
           this.properties.ROTATE + '(' + this.properties.tempRotation + ',' + (centerX) + ',' + (centerY) + ')';
         }
       } else {
        if (this.properties.existRotate) {
          tempAttribute = this.properties.oldRotateCenterSelection + this.properties.oldScale + this.properties.oldRotateCenterItem +
          this.properties.ROTATE + '(' + this.properties.rotator + ',' + (centerX) + ',' + (centerY) + ')';
        } else {
          tempAttribute =  this.properties.oldRotateCenterSelection + this.properties.oldScale + this.properties.ROTATE + '('
          + this.properties.rotator + ',' + (centerX) + ',' + (centerY) + ')';
        }
       }
      (element as SVGElement).setAttribute(this.properties.TRANSFORM ,  tempAttribute);
      this.properties.rotationAtThisCenterExists = false;
      this.properties.existRotate = false;
      });
      this.selector.updateSelectBox();
    }
  }
  ifRotationWithThisCenterExist(element: SVGElement, centerX: number, centerY: number, direction: string): void {
    this.properties.oldScale = '';
    this.properties.oldRotateCenterItem = '';
    this.properties.oldRotateCenterSelection = '';

    const oldTransform =  (element as SVGElement).getAttribute(this.properties.TRANSFORM);
    if (oldTransform != null) {

          const temp = (oldTransform as string).split(')');
          temp.forEach((line) => {
            if (line.includes(this.properties.TRANSLATE) || line.includes(this.properties.SCALE)) {
              this.properties.oldScale += line + ')';
            } else if (line.includes(this.properties.ROTATE)) {
              let boolTemp = true;
              if (line.includes(String((centerX) + ',' + centerY))) {
                const tempValue1 = line.split(this.properties.ROTATE);
                const tempValue2 = tempValue1[1].split(',');

                if (direction === this.properties.INCREMENT) {
                   this.properties.tempRotation = +(tempValue2[0].substring(1, tempValue2[0].length)) + this.properties.rotationFactor;
                 } else {
                   this.properties.tempRotation = +(tempValue2[0].substring(1, tempValue2[0].length)) - this.properties.rotationFactor;
                 }
                this.properties.rotationAtThisCenterExists = true;
                boolTemp = false;
              }
              if (line.includes(String((centerX) + ' ' + centerY))) {
                const tempValue1 = line.split(this.properties.ROTATE);
                const tempValue2 = tempValue1[1].split(' ');

                if (direction === this.properties.INCREMENT) {
                   this.properties.tempRotation = +(tempValue2[0].substring(1, tempValue2[0].length)) + this.properties.rotationFactor;
                 } else {
                   this.properties.tempRotation = +(tempValue2[0].substring(1, tempValue2[0].length)) - this.properties.rotationFactor;
                 }
                this.properties.rotationAtThisCenterExists = true;
                boolTemp = false;
              }
              if (boolTemp) {
                if (line.includes(',')) {
                  this.properties.oldRotateCenterItem += line + ')';
                }
                if (line.includes(' ')) {
                  this.properties.oldRotateCenterSelection += line + ')';
                }
                this.properties.existRotate = true;
              }
            }
          });
      }
  }
}
