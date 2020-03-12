import { EventEmitter, Injectable, Output} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EraserProperties } from 'src/app/classes/eraserProperties/eraser-properties';
import { ShapeProperties } from 'src/app/classes/shapeProperties/shape-properties';
import { SelectionParamsComponent } from '../../components/selection-params/selection-params.component';
import { DIALOG_OPEN, KEY, tools } from '../../enum';
import { EraserService } from '../eraser/eraser.service';
import { GridConfigService } from '../grid-config/grid-config.service';
import { MouseControlService } from '../mouse-control/mouse-control.service';
import { TextService } from '../text/text.service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';

const GRIDSCALE = 5;
const GRIDMAXSCALE = 500;
@Injectable({
  providedIn: 'root',
})
export class HotkeysService {
  popupActive: boolean;
  welcomeWindowActive: boolean;
  onFocus: boolean;
  constructor(private grid: GridConfigService, private text: TextService, private copyPaste: SelectionParamsComponent,
              private mouse: MouseControlService, private undoRedo: UndoRedoService, private eraser: EraserService,
              private shapeProperties: ShapeProperties, private eraseProperties: EraserProperties) {
                this.popupActive = false;
                this.onFocus = false;
               }
  private current =  new BehaviorSubject<string>('defaut');
  cast = this.current.asObservable();

  @Output() change = new EventEmitter();
  @Output() reverseMagnetState = new EventEmitter<boolean>();

  keyEvent(event: KeyboardEvent) {
    if (!this.popupActive) {
      if (this.mouse.getChoice() === tools.ERASER && event.key !== KEY.KEY_E && event.key !== KEY.KEY_G && !event.ctrlKey) {
        this.eraser.deleteEraser();
      }
      if (this.mouse.getChoice() === tools.TEXT) {
        this.text.keyEvent(event);
      } else {
        if (event.ctrlKey) {
          event.preventDefault();
          this.multipleKeysCheck(event);
        } else {
          if (!this.onFocus) {
            this.singleKeyCheck(event);
          }
        }
      }
    }
  }

  multipleKeysCheck(event: KeyboardEvent): void {
    if (event.shiftKey && event.key === KEY.KEY_Z_U) {
      this.undoRedo.redo();
    } else {
      switch (event.key) {
        case KEY.KEY_O:
          if (!this.popupActive) {
            this.change.emit(tools.CREATEDRAWING);
          }
          break;
        case KEY.KEY_S:
          if (!this.popupActive) {
            this.change.emit(tools.SAVE);
          }
          break;
        case KEY.KEY_G:
          this.change.emit(tools.DOWNLOAD);
          break;
        case KEY.KEY_E:
          this.change.emit(tools.EXPORT);
          break;
        case KEY.KEY_Z:
          this.undoRedo.undo();
          break;
        case KEY.KEY_X:
          this.copyPaste.setCutTool();
          break;
        case KEY.KEY_C:
          this.copyPaste.setCopyTool();
          break;
        case KEY.KEY_V:
          this.copyPaste.setPasteTool();
          break;
        case KEY.KEY_D:
          this.copyPaste.setDuplicateTool();
          break;
        case KEY.KEY_A:
          this.copyPaste.setSelectAllTool();
          break;
        default:
      }
    }
  }

  singleKeyCheck(event: KeyboardEvent): void {
    switch (event.key) {
      case KEY.KEY_A:
        this.change.emit(tools.AIR_BRUSH);
        break;
      case KEY.KEY_B:
        this.change.emit(tools.BUCKET);
        break;
      case KEY.KEY_C:
        this.change.emit(tools.PENCIL);
        break;
      case KEY.KEY_M:
        this.copyPaste.onMagnetActivate();
        break;
      case KEY.KEY_W:
        this.change.emit(tools.BRUSH);
        break;
      case KEY.KEY_Y:
        this.change.emit(tools.PEN);
        break;
      case KEY.KEY_E:
        if (this.mouse.drawingContainsElement) {
          this.change.emit(tools.ERASER);
          this.eraser.getElements();
          this.eraseProperties.onFirst = true;
        } else {
          window.alert(DIALOG_OPEN.ERASER_ALERT);
        }
        break;
      case KEY.KEY_I:
        this.change.emit(tools.PIPETTE);
        break;
      case KEY.KEY_R:
        this.change.emit(tools.APPCOLOR);
        break;
      case KEY.KEY_ESCAPE:
        this.change.emit(KEY.KEY_ESCAPE);
        break;
      case KEY.KEY_BACKSPACE:
        this.change.emit(KEY.KEY_BACKSPACE);
        break;
      case KEY.KEY_L:
        this.change.emit(tools.LINE);
        break;
      case KEY.KEY_P:
        this.change.emit(tools.QUILL);
        break;
      case KEY.KEY_S:
        this.change.emit(tools.SELECT);
        break;
      case KEY.KEY_G:
        this.grid.gridActivated = ! this.grid.gridActivated;
        this.grid.updateGrid(this.grid.gridActivated, this.grid.gridValue, this.grid.gridOpacity);
        break;
      case KEY.KEY_1:
          if (this.mouse.getChoice() !== tools.RECTANGLE) {
            this.change.emit(tools.RECTANGLE);
          }
          this.shapeProperties.shapeChosen = tools.RECTANGLE;
          this.shapeProperties.selected = tools.RECTANGLE;
          break;
      case KEY.KEY_2:
          if (this.mouse.getChoice() !== tools.RECTANGLE) {
          this.change.emit(tools.CIRCLE);
          }
          this.shapeProperties.shapeChosen = tools.CIRCLE;
          this.shapeProperties.selected = tools.CIRCLE;
          break;
      case KEY.KEY_3:
          if (this.mouse.getChoice() !== tools.RECTANGLE) {
            this.change.emit(tools.POLYGON);
          }
          this.shapeProperties.shapeChosen = tools.POLYGON;
          this.shapeProperties.selected = tools.POLYGON;
          break;
      case KEY.KEY_T:
        this.change.emit(tools.TEXT);
        break;
      case KEY.KEY_DEL:
        this.copyPaste.setDeleteTool();
        break;
      case KEY.KEY_PLUS:
        if (this.grid.gridActivated && this.grid.gridValue < GRIDMAXSCALE) {
        this.grid.updateGrid(this.grid.gridActivated, this.grid.gridValue + GRIDSCALE, this.grid.gridOpacity);
        }
        break;
      case KEY.KEY_MINUS:
        if (this.grid.gridActivated && this.grid.gridValue > GRIDSCALE) {
          this.grid.updateGrid(this.grid.gridActivated, this.grid.gridValue - GRIDSCALE, this.grid.gridOpacity);
        }
        break;
      default:
    }
  }
  popupBoolChange(value: boolean): void {
    this.popupActive = value;
  }
}
