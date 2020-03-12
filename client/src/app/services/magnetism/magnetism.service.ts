import { Injectable } from '@angular/core';
import { MagnetismProperties } from '../../classes/magnetismProperties/magnetism-properties';
import { MovingProperties } from '../../classes/movingProperties/moving-properties';
import { SvgSelectorProperties } from '../../classes/svgSelectorProperties/svg-properties';
import { CTRL_POINTS, SIDEBAR } from '../../enum';
import { GridConfigService } from '../grid-config/grid-config.service';
@Injectable({
  providedIn: 'root',
})
export class MagnetismService {

  constructor(private properties: MovingProperties, private selectorProperties: SvgSelectorProperties,
              private gridService: GridConfigService, private magnetismProperties: MagnetismProperties) { }

  setObjects(selectedChilds: Node[], event: MouseEvent): void {
    this.magnetismProperties.counter = 1;
    this.properties.firstTime = true;
    this.properties.selectedChilds = selectedChilds;
    this.properties.refX = event.clientX;
    this.properties.refY = event.clientY;
    this.magnetismProperties.selectBoxX = Number(this.selectorProperties.selectBox.getAttribute('x') || 0);
    this.magnetismProperties.selectBoxY = Number(this.selectorProperties.selectBox.getAttribute('y') || 0);
    this.magnetismProperties.selectBoxWX =
    Number(this.magnetismProperties.selectBoxX + Number(this.selectorProperties.selectBox.getAttribute('width') || 0));
    this.magnetismProperties.selectBoxWY =
    Number(this.magnetismProperties.selectBoxY + Number(this.selectorProperties.selectBox.getAttribute('height') || 0));
    this.magnetismProperties.selectBoxMX =
    Number(this.magnetismProperties.selectBoxX + Number(this.selectorProperties.selectBox.getAttribute('width') || 0) / 2);
    this.magnetismProperties.selectBoxMY =
    Number(this.magnetismProperties.selectBoxY + Number(this.selectorProperties.selectBox.getAttribute('height') || 0) / 2);
    this.magnetismProperties.differenceX = event.clientX - SIDEBAR.sideBarWidth - this.magnetismProperties.selectBoxX;
    this.magnetismProperties.differenceY = event.clientY - this.magnetismProperties.selectBoxY;
    this.magnetismProperties.differenceWX = this.magnetismProperties.selectBoxWX - (event.clientX - SIDEBAR.sideBarWidth);
    this.magnetismProperties.differenceWY = this.magnetismProperties.selectBoxWY - event.clientY;
    this.magnetismProperties.differenceMX = this.magnetismProperties.selectBoxMX - (event.clientX - SIDEBAR.sideBarWidth);
    this.magnetismProperties.differenceMY = this.magnetismProperties.selectBoxMY - event.clientY;
  }

  setAnchor( id: string): void {
    this.magnetismProperties.anchor = id;
  }

  move(event: MouseEvent): void {
    const magnetX = event.clientX - SIDEBAR.sideBarWidth - this.magnetismProperties.differenceX;
    const magnetY = event.clientY - this.magnetismProperties.differenceY;
    const magnetWX = event.clientX - SIDEBAR.sideBarWidth + this.magnetismProperties.differenceWX;
    const magnetWY = event.clientY + this.magnetismProperties.differenceWY;
    const magnetMX = event.clientX - SIDEBAR.sideBarWidth + this.magnetismProperties.differenceMX;
    const magnetMY = event.clientY + this.magnetismProperties.differenceMY;
    this.properties.selectedChilds.forEach( (child) => {
      let oldTransform = (child as HTMLElement).getAttribute('transform');
      if (oldTransform) {
        const translateIndex = oldTransform.indexOf('translate');
        if (translateIndex > -1) {
          if (this.properties.firstTime) {
            this.magnetismProperties.counter++;
            if (this.magnetismProperties.counter > this.properties.selectedChilds.length ) {
              this.properties.firstTime = false;
            }
          } else {
            let translate = oldTransform.slice(translateIndex);
            translate = translate.substring(translateIndex, translate.indexOf(')') + 1);
            oldTransform = oldTransform.replace(translate, '');
          }
        }
        let movingX =  - (this.properties.refX - event.clientX);
        let movingY = - (this.properties.refY - event.clientY);

        switch (this.magnetismProperties.anchor) {
          case CTRL_POINTS.TOP_LEFT:
            movingX = this.anchorFunc(movingX, magnetX, event);
            movingY = this.anchorFunc(movingY, magnetY, event);
            break;
          case CTRL_POINTS.TOP_CENTER:
            movingY = this.anchorFunc(movingY, magnetY, event);
            break;
          case CTRL_POINTS.TOP_RIGHT:
            movingX = this.anchorFunc(movingX, magnetWX, event);
            movingY = this.anchorFunc(movingY, magnetY, event);
            break;
          case CTRL_POINTS.CENTER_LEFT:
            movingX = this.anchorFunc(movingX, magnetX, event);
            break;
          case CTRL_POINTS.CENTER_MIDDLE:
            movingX = this.anchorFunc(movingX, magnetMX, event);
            movingY = this.anchorFunc(movingY, magnetMY, event);
            break;
          case CTRL_POINTS.CENTER_RIGHT:
            movingX = this.anchorFunc(movingX, magnetWX, event);
            break;
          case CTRL_POINTS.BOTTOM_LEFT:
            movingX = this.anchorFunc(movingX, magnetX, event);
            movingY = this.anchorFunc(movingY, magnetWY, event);
            break;
          case CTRL_POINTS.BOTTOM_CENTER:
            movingY = this.anchorFunc(movingY, magnetWY, event);
            break;
          case CTRL_POINTS.BOTTOM_RIGHT:
            movingX = this.anchorFunc(movingX, magnetWX, event);
            movingY = this.anchorFunc(movingY, magnetWY, event);
            break;
          default:
        }
        (child as HTMLElement).setAttribute('transform', 'translate('
        + movingX + ',' + movingY + ')' + oldTransform);
      } else {
        const movingX = - (this.properties.refX - event.clientX);
        const movingY = - (this.properties.refY - event.clientY);
        (child as HTMLElement).setAttribute('transform', 'translate(' + movingX + ',' + movingY + ')');
      }
    });
  }

  anchorFunc( move: number, magnet: number, event: MouseEvent): number {
    if ((magnet % this.gridService.gridValue) <= (Math.floor(this.gridService.gridValue / 2))) {
      move -= (magnet % this.gridService.gridValue);
      this.magnetismProperties.offset =
      Math.abs( move - (- (this.properties.refX - event.clientX) -  (magnet % this.gridService.gridValue)));
    } else {
      move += (this.gridService.gridValue - (magnet) % this.gridService.gridValue);
      this.magnetismProperties.offset =
      Math.abs(move - (- (this.properties.refX - event.clientX) +  (magnet % this.gridService.gridValue)));
    }
    return move;
  }
}
