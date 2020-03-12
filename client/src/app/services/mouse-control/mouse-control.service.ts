import { EventEmitter, Injectable, Output } from '@angular/core';
import { tools } from 'src/app/enum';
import { BrushToolService } from '../brush-tool/brushTool.service';
import { ColorApplicatorService } from '../color-applicator/color-applicator.service';
import { LineToolService } from '../line-tool/line-tool.service';
import { PenToolService } from '../pen-tool/pen-tool.service';
import { PencilToolService } from '../pencilTool/pencilTool';
import { PipetteService } from '../pipette/pipette.service';
import { QuillToolService } from '../quill-tool/quill-tool.service';
import { RotateService } from '../rotate-tool/rotate.service';
import { ShapeToolService } from '../shape-tool/shape-tool.service';
import { StampselectorService } from '../stamp-selector/stampselector.service';
import { SvgSelectorToolService } from '../svg-selector-tool/svg-selector-tool.service';
import { TextService } from '../text/text.service';
import { EraserService } from './../eraser/eraser.service';

import { EraserProperties } from 'src/app/classes/eraserProperties/eraser-properties';
import { AirBrushToolService } from '../airBrush-tool/air-brush-tool.service';
import { PaintBucketService } from './../paint-bucket/paint-bucket.service';
@Injectable({
  providedIn: 'root',
})
export class MouseControlService {
private choice: string;
private parent: HTMLElement;
drawingContainsElement: boolean;
@Output() view: EventEmitter<any> = new EventEmitter();

constructor(private shape: ShapeToolService,
            private pencil: PencilToolService,
            private pen: PenToolService,
            private airBrush: AirBrushToolService,
            private brush: BrushToolService,
            private applicator: ColorApplicatorService,
            private pipette: PipetteService,
            private paintBucket: PaintBucketService,
            private line: LineToolService,
            private stamp: StampselectorService,
            private svgSelector: SvgSelectorToolService,
            private svgEraser: EraserService,
            private text: TextService,
            private rotateServ: RotateService,
            private quill: QuillToolService,
            private eraserProperties: EraserProperties,
  ) {
    this.drawingContainsElement = false;
   }

  setChoice( select: string): void {
    if (this.choice === tools.TEXT) {
      this.text.removeRectangle();
    }
    if (this.choice === tools.ERASER) {
      this.svgEraser.deleteEraser();
    }
    if (select === tools.ERASER && this.drawingContainsElement) {
      this.svgEraser.getElements();
      this.eraserProperties.onFirst = true;
    }
    this.choice = select;
  }
  getChoice(): string {
    return this.choice;
  }
  mouseDown($event?: MouseEvent, target?: SVGElement): void {
    if ($event) {
      this.parent = ($event.target as HTMLElement).parentNode as HTMLElement;
      if ( this.parent.nodeName !== 'svg') {
        this.view.emit($event.target);
      } else {
        this.view.emit(this.parent);
      }
      if (this.choice !== tools.SELECT) {
        this.svgSelector.leftMouseDown($event);
        this.svgSelector.setIsRendering(false);
      }
      switch (this.choice) {
        case tools.PENCIL:
          this.pencil.mouseDown($event);
          this.elementCreated();
          break;
        case tools.PEN:
          this.pen.mouseDown($event);
          this.elementCreated();
          break;
        case tools.AIR_BRUSH:
          this.airBrush.mouseDown($event);
          this.elementCreated();
          break;
        case tools.RECTANGLE:
          this.shape.mouseDown($event);
          this.elementCreated();
          break;
        case tools.BRUSH:
          this.brush.mouseDown($event);
          this.elementCreated();
          break;
        case tools.APPCOLOR:
          this.applicator.mouseDown($event);
          this.elementCreated();
          break;
        case tools.BUCKET:
          this.paintBucket.mouseDown($event);
          this.elementCreated();
          break;
        case tools.PIPETTE:
          this.pipette.getSvgColor($event);
          this.elementCreated();
          break;
        case tools.STAMP:
          this.stamp.mouseDown($event);
          this.elementCreated();
          break;
        case tools.SELECT:
          this.svgSelector.leftMouseDown($event);
          this.svgSelector.rightMouseDown($event);
          this.elementCreated();
          break;
        case tools.ERASER:
          this.svgEraser.leftMouseDown($event);
          break;
        case tools.LINE:
          this.line.mouseDown($event);
          this.elementCreated();
          break;
        case tools.TEXT:
          this.text.mouseDown($event);
          this.elementCreated();
          break;
        case tools.QUILL :
          this.quill.mouseDown($event);
          this.elementCreated();
          break;
        default:
      }
    } else {
      this.view.emit(target);
    }
  }

  mouseMove($event: MouseEvent): void {
    switch (this.choice) {
      case tools.PENCIL:
        this.pencil.mouseMove($event);
        break;
      case tools.PEN:
        this.pen.mouseMove($event);
        break;
      case tools.AIR_BRUSH:
        this.airBrush.mouseMove($event);
        break;
      case tools.RECTANGLE:
        this.shape.plotShape($event);
        break;
      case tools.BRUSH:
        this.brush.mouseMove($event);
        break;
      case tools.SELECT:
        this.svgSelector.leftMouseMove($event);
        this.svgSelector.rightMouseMove($event);
        break;
      case tools.ERASER:
        this.svgEraser.eraserMouseMove($event);
        break;
      case tools.LINE:
        this.line.mouseMove($event);
        break;
      case tools.QUILL:
        this.quill.mouseMove($event);
        break;
      default:
    }
  }

  mouseUp($event: MouseEvent): void {
    const parent = ($event.target as HTMLElement).parentNode as HTMLElement;
    const emitter = (parent.nodeName !== 'svg') ? $event.target : parent;
    this.view.emit(emitter);

    switch (this.choice) {
      case tools.PENCIL:
        this.pencil.mouseUp($event);
        break;
      case tools.PEN:
        this.pen.mouseUp($event);
        break;
      case tools.AIR_BRUSH:
        this.airBrush.mouseUp($event);
        break;
      case tools.RECTANGLE:
        this.shape.mouseUp($event);
        break;
      case tools.BRUSH:
        this.brush.mouseUp($event);
        break;
      case tools.SELECT:
        this.svgSelector.mouseUp($event);
        this.rotateServ.resetRotationFactor();
        this.rotateServ.setCurrentSelectedChilds();
        break;
      case tools.ERASER:
        this.svgEraser.eraserMouseUp($event);
        break;
      case tools.QUILL:
        this.quill.mouseUp($event);
        break;
      default:
      }
  }
  mouseWheel($event: WheelEvent): void {
    if (this.getChoice() === tools.SELECT) {
      if ($event.deltaY < 0) {
        this.rotateServ.incrementRotationFactor($event);
      } else {
        this.rotateServ.decrementRotationFactor($event);
      }
    } else if (this.getChoice() === tools.STAMP) {
      if ($event.deltaY < 0) {
        this.stamp.incrementRotationFactor();
      } else {
        this.stamp.decrementRotationFactor();
      }
    } else if (this.getChoice() === tools.QUILL) {
      if ($event.deltaY < 0) {
        this.quill.incrementAngle($event);
      } else {
        this.quill.decrementAngle($event);
      }
    }
  }

    rightClick($event: MouseEvent): void {
    switch (this.choice) {
      case tools.APPCOLOR:
           this.applicator.rightClick($event);
           break;
    }
  }

  mouseleave($event: MouseEvent): void {
    if ( this.choice === tools.ERASER ) {
      this.svgEraser.deleteEraser();
    }
  }

  onShiftDown(): void {
    if (this.choice === tools.RECTANGLE) {
      this.shape.onShiftDown();
    }
  }

  onShiftUp(): void {
    if (this.choice === tools.RECTANGLE) {
      this.shape.onShiftUp();
    }
  }

  doubleClick($event: MouseEvent): void {
    if (this.choice === tools.LINE) {
      this.line.doubleClick($event);
    }
  }
  elementCreated(): void {
    this.drawingContainsElement = true;
  }
}
