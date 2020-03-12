import { Injectable, RendererFactory2 } from '@angular/core';
import { ResizeProperties } from 'src/app/classes/resizeProperties/resize-properties';
import { CTRL_POINTS, RESIZE } from 'src/app/enum';

@Injectable({
  providedIn: 'root',
})
export class ResizeSvgService {

  constructor(rendererFactory: RendererFactory2, private properties: ResizeProperties ) {
  this.properties.renderer = rendererFactory.createRenderer(null, null);
  }

  initResizing($event: MouseEvent, selectBox: SVGElement) : void{
    this.properties.bboxSelect = (selectBox as SVGAElement).getBBox();
    this.properties.refX = $event.clientX;
    this.properties.refY = $event.clientY;
    this.properties.shiftenable = false;
    this.properties.isFirstScale = true;
    this.properties.controlPoint = ($event.target as HTMLElement).id;
    this.setScalingValues();
    this.setTranslationValues();
  }

  setScalingValues(): void {
    switch (this.properties.controlPoint) {
      case CTRL_POINTS.TOP_LEFT:
        this.properties.scaleXenable = true;
        this.properties.scaleYenable = true;
        this.properties.isMirrorX = false;
        this.properties.isMirrorY = false;
        this.properties.shiftenable = true;
        this.properties.refX += this.properties.bboxSelect.width;
        this.properties.refY += this.properties.bboxSelect.height;
        break;
      case CTRL_POINTS.TOP_CENTER:
        this.properties.scaleXenable = false;
        this.properties.scaleYenable = true;
        this.properties.isMirrorY = false;
        this.properties.refY += this.properties.bboxSelect.height;
        break;
      case CTRL_POINTS.TOP_RIGHT:
        this.properties.scaleXenable = true;
        this.properties.scaleYenable = true;
        this.properties.isMirrorX = true;
        this.properties.isMirrorY = false;
        this.properties.shiftenable = true;
        this.properties.refX -= this.properties.bboxSelect.width;
        this.properties.refY += this.properties.bboxSelect.height;
        break;
      case CTRL_POINTS.CENTER_LEFT:
        this.properties.scaleXenable = true;
        this.properties.scaleYenable = false;
        this.properties.isMirrorX = false;
        this.properties.refX += this.properties.bboxSelect.width;
        break;
      case CTRL_POINTS.CENTER_RIGHT:
        this.properties.scaleXenable = true;
        this.properties.scaleYenable = false;
        this.properties.isMirrorX = true;
        this.properties.refX -= this.properties.bboxSelect.width;
        break;
      case CTRL_POINTS.BOTTOM_LEFT:
        this.properties.scaleXenable = true;
        this.properties.scaleYenable = true;
        this.properties.isMirrorX = false;
        this.properties.isMirrorY = true;
        this.properties.shiftenable = true;
        this.properties.refX += this.properties.bboxSelect.width;
        this.properties.refY -= this.properties.bboxSelect.height;
        break;
      case CTRL_POINTS.BOTTOM_CENTER:
        this.properties.scaleXenable = false;
        this.properties.scaleYenable = true;
        this.properties.isMirrorY = true;
        this.properties.refY -= this.properties.bboxSelect.height;
        break;
      case CTRL_POINTS.BOTTOM_RIGHT:
        this.properties.scaleXenable = true;
        this.properties.scaleYenable = true;
        this.properties.isMirrorX = true;
        this.properties.isMirrorY = true;
        this.properties.shiftenable = true;
        this.properties.refX -= this.properties.bboxSelect.width;
        this.properties.refY -= this.properties.bboxSelect.height;
        break;
    }
  }
  setTranslationValues(): void {
    switch (this.properties.controlPoint) {
      case CTRL_POINTS.TOP_LEFT:
        this.properties.translateX = String(this.properties.bboxSelect.x + this.properties.bboxSelect.width + RESIZE.BBOX_OFFSET_WIDTH);
        this.properties.translateY = String(this.properties.bboxSelect.y + this.properties.bboxSelect.height + RESIZE.BBOX_OFFSET_HEIGHT);
        break;
      case CTRL_POINTS.TOP_CENTER:
        this.properties.translateX = String(0);
        this.properties.translateY = String(this.properties.bboxSelect.y + this.properties.bboxSelect.height + RESIZE.BBOX_OFFSET_HEIGHT);
        break;
      case CTRL_POINTS.TOP_RIGHT:
        this.properties.translateX = String(this.properties.bboxSelect.x + RESIZE.BBOX_OFFSET_X);
        this.properties.translateY = String(this.properties.bboxSelect.y + this.properties.bboxSelect.height + RESIZE.BBOX_OFFSET_HEIGHT);
        break;
      case CTRL_POINTS.CENTER_LEFT:
        this.properties.translateX = String(this.properties.bboxSelect.x + this.properties.bboxSelect.width + RESIZE.BBOX_OFFSET_WIDTH);
        this.properties.translateY = String(0);
        break;
      case CTRL_POINTS.CENTER_RIGHT:
        this.properties.translateX = String(this.properties.bboxSelect.x + RESIZE.BBOX_OFFSET_X);
        this.properties.translateY = String(0);
        break;
      case CTRL_POINTS.BOTTOM_LEFT:
        this.properties.translateX = String(this.properties.bboxSelect.x + this.properties.bboxSelect.width + RESIZE.BBOX_OFFSET_WIDTH);
        this.properties.translateY = String(this.properties.bboxSelect.y + RESIZE.BBOX_OFFSET_Y);
        break;
      case CTRL_POINTS.BOTTOM_CENTER:
        this.properties.translateX = String(0);
        this.properties.translateY = String(this.properties.bboxSelect.y + RESIZE.BBOX_OFFSET_Y);
        break;
      case CTRL_POINTS.BOTTOM_RIGHT:
        this.properties.translateX = String(this.properties.bboxSelect.x + RESIZE.BBOX_OFFSET_X);
        this.properties.translateY = String(this.properties.bboxSelect.y + RESIZE.BBOX_OFFSET_Y);
        break;
    }
  }

  mouseMove($event: MouseEvent, childs: Node[]): void {
// asignation of scaling values //
    let scaleX = (this.properties.refX - $event.clientX) / (this.properties.bboxSelect.width);
    let scaleY = (this.properties.refY - $event.clientY) / (this.properties.bboxSelect.height);
    if (this.properties.isMirrorX) {
      scaleX = ($event.clientX - this.properties.refX) / (this.properties.bboxSelect.width);
    }
    if (this.properties.isMirrorY) {
      scaleY = ($event.clientY - this.properties.refY) / (this.properties.bboxSelect.height);
    }

// filtration of absurd scaling //
    if (!this.properties.scaleXenable) {
      scaleX = 1;
    }
    if (!this.properties.scaleYenable) {
      scaleY = 1;
    }

// modification of scaling values in case of alt //
    this.setTranslationValues();
    if ($event.altKey) {
      this.properties.translateX = String(this.properties.bboxSelect.x + (this.properties.bboxSelect.width / 2));
      this.properties.translateY = String(this.properties.bboxSelect.y + (this.properties.bboxSelect.height / 2));
      scaleX = (scaleX - 1) * 2 + 1;
      scaleY = (scaleY - 1) * 2 + 1;
    }

// updating scaling in shif and nonShift cumul scaling //
    if ($event.shiftKey && this.properties.shiftenable) {
      if ( Math.abs(scaleX) > Math.abs(scaleY)) {
        scaleY = Math.sign(scaleX) * Math.sign(scaleY) * scaleX ;
      } else {
        scaleX = Math.sign(scaleX) * Math.sign(scaleY) * scaleY;
      }
    }

// editing of transform values of selected childs //
    this.editingValues(scaleX, scaleY, childs);
    this.properties.isFirstScale = false;
  }

  editingValues(scaleX: number, scaleY: number, childs: Node[]): void {
    childs.forEach( (child) => {
      let stringTransform = '';
      const childScaleX = scaleX;
      const childScaleY = scaleY;
      const transform = (child as HTMLElement).getAttribute('transform');
      if (transform) {
        const splitted = String(transform).split(')');
        splitted.forEach((subTransform, index) => {
          if (subTransform[0] === 't' && index === (0) && !this.properties.isFirstScale) {
            subTransform = 'translate(' + this.properties.translateX + ' ' + this.properties.translateY;
          }
          if (subTransform[0] === 't' && index === (2) && !this.properties.isFirstScale) {
            subTransform = 'translate(' + Number(-this.properties.translateX) + ' ' + Number(-this.properties.translateY);
          }
          if (subTransform[0] === 's' && index === (1) && !this.properties.isFirstScale) {

            subTransform = 'scale(' + childScaleX + ' ' + childScaleY;
          }
          if (subTransform !== '') {
            stringTransform += subTransform + ')';
          }
        });
      }
      if (this.properties.isFirstScale) {
        stringTransform = 'translate(' + this.properties.translateX + ' ' + this.properties.translateY + ')' +
                          'scale(' + childScaleX + ' ' + childScaleY + ')' +
                          'translate(' + (-this.properties.translateX) + ' ' + (-this.properties.translateY) + ')' + stringTransform;
      }
      this.properties.renderer.setAttribute(child, 'transform', stringTransform);
    });
  }
}
