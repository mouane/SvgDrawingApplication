import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToolBoxPropreties } from 'src/app/classes/toolBoxPropreties/toolsBoxPropreties';
import { ColorPickerComponent } from 'src/app/components/color-picker/color-picker.component';
import { DIALOG_OPEN, tools } from 'src/app/enum';
import { ColorToolService } from 'src/app/services/color-tool/color-tool.service';
import { ConfigureDrawingSizeService } from 'src/app/services/configure-drawing-size/configure-drawing-size';
import { HotkeysService } from 'src/app/services/hotkeys/hotkeys.service';
import { MouseControlService } from 'src/app/services/mouse-control/mouse-control.service';
import { SelectToolService } from 'src/app/services/select-tool/select-tool.service';
import { StampselectorService } from 'src/app/services/stamp-selector/stampselector.service';
import { SvgSelectorToolService } from 'src/app/services/svg-selector-tool/svg-selector-tool.service';
import { DialogPopupOpenLocallyComponent } from '../dialog-popup-open-locally/dialog-popup-open-locally.component';
import { DialogPopupSaveDrawingComponent } from '../dialog-popup-save-drawing/dialog-popup-save-drawing.component';
import { DialogPopupSaveLocallyComponent } from '../dialog-popup-save-locally/dialog-popup-save-locally.component';
import { DialogPopupComponent } from '../dialog-popup/dialog-popup.component';
import { UserGuideComponent } from '../user-guide/user-guide.component';
import { DialogPopupOpenDrawingComponent } from './../dialog-popup-open-drawing/dialog-popup-open-drawing.component';
import { ExportDrawingComponent } from './../export-drawing/export-drawing.component';
export interface Shapes {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-tool-box',
  templateUrl: './tool-box.component.html',
  styleUrls: ['./tool-box.component.scss'],
})

export class ToolBoxComponent implements OnInit, AfterViewInit {

  shapes: Shapes[] = [
    { value: 'rectangle-0', viewValue: 'Rectangle' },
    { value: 'ellipse-1', viewValue: 'Ellipse' },
    { value: 'polygon-2', viewValue: 'Polygon' },
  ];

  colorPickerDisabled = this.hotkey.welcomeWindowActive;

  primary: string = this.colorToolService.Fill;

  constructor(public dialog: MatDialog,
              private colorToolService: ColorToolService,
              private drawingSizeService: ConfigureDrawingSizeService,
              private select: SelectToolService,
              private mouseControl: MouseControlService,
              private hotkey: HotkeysService,
              private stampSelect: StampselectorService,
              public http: HttpClient,
              private toolBoxProperties: ToolBoxPropreties,
              private selector: SvgSelectorToolService,
              private colorPicker: ColorPickerComponent,
  ) { }

  @ViewChild('tools', { static: false }) private tools: ElementRef;
  @ViewChild('params', { static: false }) private params: ElementRef;

  ngOnInit() {
    this.drawingSizeService.changeBool.subscribe(() => { this.toolBoxProperties.drawingExist = true; });
    this.colorToolService.setType('back');
    this.hotkey.cast.subscribe((current) => this.toolBoxProperties.isSelected = current);
    this.hotkey.change.subscribe((temp: string) => {
      this.keyboardControl(temp);
    });
    this.stampSelect.rotationFact.subscribe((item: number) => this.toolBoxProperties.rotationFactor = item);
    this.stampSelect.nominator.subscribe((item: number) => this.toolBoxProperties.nominator = item);
    this.stampSelect.denominator.subscribe((item: number) => this.toolBoxProperties.denominator = item);

  }
  ngAfterViewInit(): void {
    this.select.setToolsElement(this.tools.nativeElement as HTMLElement);
    this.select.setParamsElement(this.params.nativeElement as HTMLElement);
  }

  keyboardControl(temp: string): void {
    this.toolBoxProperties.isSelected = temp;
    switch (temp) {
        case tools.CREATEDRAWING:
          this.openDialog();
          break;
        case tools.PENCIL:
          this.usePencil();
          break;
        case tools.BRUSH:
          this.useBrush();
          break;
        case tools.RECTANGLE:
          this.drawShape();
          break;
        case tools.CIRCLE:
          this.drawShape();
          break;
        case tools.POLYGON:
            this.drawShape();
            break;
        case tools.CIRCLE:
          this.selectObjects();
          break;
        case tools.APPCOLOR:
          this.useApplicator();
          break;
        case tools.BUCKET:
          this.useBucket();
          break;
        case tools.LINE:
          this.useLine();
          break;
        case tools.PEN:
          this.usePen();
          break;
        case tools.AIR_BRUSH:
          this.useAirBrush();
          break;
        case tools.SELECT:
          this.selectObjects();
          break;
        case tools.ERASER:
          this.useEraser();
          break;
        case tools.PIPETTE:
          this.pipette();
          break;
        case tools.GRID:
            this.toolBoxProperties.gridActivated = !this.toolBoxProperties.gridActivated;
            break;
        case tools.SAVE:
          this.openLocalSave();
          break;
        case tools.DOWNLOAD:
          this.openDrawingDialog();
          break;
        case tools.TEXT:
          this.useText();
          break;
        case tools.EXPORT:
          this.openExportDrawingDialog();
          break;
        case tools.QUILL:
          this.useQuill();
          break;
        default:
      }
    }

  getOutline() {
    return this.colorToolService.Outline;
  }

  selectObjects(): void {
    if (!this.hotkey.welcomeWindowActive && this.toolBoxProperties.drawingExist) {
      if (this.mouseControl.getChoice() === tools.SELECT) {
        this.selector.resetSelectBox();
      }
      if (this.mouseControl.getChoice() !== tools.SELECT) {
        this.select.select();
      } else {
        this.select.nothing();
      }
    }
  }

  useEraser(): void {
    if (!this.mouseControl.drawingContainsElement) {
      window.alert(DIALOG_OPEN.ERASER_ALERT);
    }
    if (!this.hotkey.welcomeWindowActive && this.toolBoxProperties.drawingExist && this.mouseControl.drawingContainsElement) {
      if (this.mouseControl.getChoice() === tools.SELECT) {
        this.selector.resetSelectBox();
      }
      if (this.mouseControl.getChoice() !== tools.ERASER) {
        this.select.eraser();
      } else {
        this.select.nothing();
      }
    }
  }

  useText(): void {
    if (!this.hotkey.welcomeWindowActive && this.toolBoxProperties.drawingExist) {
      if (this.mouseControl.getChoice() === tools.SELECT) {
        this.selector.resetSelectBox();
      }
      if (this.mouseControl.getChoice() !== tools.TEXT) {
        this.select.text();
      } else {
        this.select.nothing();
      }
    }
  }

  usePen(): void {
    if (!this.hotkey.welcomeWindowActive && this.toolBoxProperties.drawingExist) {
      if (this.mouseControl.getChoice() === tools.SELECT) {
        this.selector.resetSelectBox();
      }
      if (this.mouseControl.getChoice() !== tools.PEN) {
        this.select.pen();
      } else {
        this.select.nothing();
      }
    }
  }
  usePencil(): void {
    if (!this.hotkey.welcomeWindowActive && this.toolBoxProperties.drawingExist) {
      if (this.mouseControl.getChoice() === tools.SELECT) {
        this.selector.resetSelectBox();
      }
      if (this.mouseControl.getChoice() !== tools.PENCIL) {
        this.select.pencil();
      } else {
        this.select.nothing();
      }
    }
  }

  useQuill(): void {
    if (!this.hotkey.welcomeWindowActive && this.toolBoxProperties.drawingExist) {
      if (this.mouseControl.getChoice() === tools.SELECT) {
        this.selector.resetSelectBox();
      }
      if (this.mouseControl.getChoice() !== tools.QUILL) {
        this.select.quill();
      } else {
        this.select.nothing();
      }
    }
  }
  useLine(): void {
    if (!this.hotkey.welcomeWindowActive && this.toolBoxProperties.drawingExist) {
      if (this.mouseControl.getChoice() === tools.SELECT) {
        this.selector.resetSelectBox();
      }
      if (this.mouseControl.getChoice() !== tools.LINE) {
        this.select.line();
      } else {
        this.select.nothing();
      }
    }
  }

  useAirBrush(): void {
    if (!this.hotkey.welcomeWindowActive && this.toolBoxProperties.drawingExist) {
      if (this.mouseControl.getChoice() === tools.SELECT) {
        this.selector.resetSelectBox();
      }
      if (this.mouseControl.getChoice() !== tools.AIR_BRUSH) {
        this.select.airBrush();
      } else {
        this.select.nothing();
      }
    }
  }
  useApplicator(): void {
    if (!this.hotkey.welcomeWindowActive && this.toolBoxProperties.drawingExist) {
      if (this.mouseControl.getChoice() === tools.SELECT) {
        this.selector.resetSelectBox();
      }
      if (this.mouseControl.getChoice() !== tools.APPCOLOR) {
        this.select.colorApplicator();
      } else {
        this.select.nothing();
      }
    }
  }
  useBucket(): void {
    if (!this.hotkey.welcomeWindowActive && this.toolBoxProperties.drawingExist) {
      if (this.mouseControl.getChoice() === tools.SELECT) {
        this.selector.resetSelectBox();
      }
      if (this.mouseControl.getChoice() !== tools.BUCKET) {
        this.select.paintBucket();
      } else {
        this.select.nothing();
      }
    }
  }
  useBrush(): void {
    if (!this.hotkey.welcomeWindowActive && this.toolBoxProperties.drawingExist) {
      if (this.mouseControl.getChoice() === tools.SELECT) {
        this.selector.resetSelectBox();
      }
      if (this.mouseControl.getChoice() !== tools.BRUSH) {
        this.select.brush();
      } else {
        this.select.nothing();
      }
    }
  }

  chooseBackground(): void {
    if (!this.hotkey.welcomeWindowActive && this.toolBoxProperties.drawingExist) {
      if (this.mouseControl.getChoice() === tools.SELECT) {
        this.selector.resetSelectBox();
      }
      if (this.mouseControl.getChoice() !== tools.GRID) {
        this.select.grid();
      } else {
        this.select.nothing();
      }
    }
  }

  drawShape(): void {
    if (!this.hotkey.welcomeWindowActive && this.toolBoxProperties.drawingExist) {
      if (this.mouseControl.getChoice() === tools.SELECT) {
        this.selector.resetSelectBox();
      }
      if (this.mouseControl.getChoice() !== tools.RECTANGLE) {
        this.select.rectangle();
      } else {
        this.select.nothing();
      }
    }
  }

  pipette(): void {
    if (!this.hotkey.welcomeWindowActive && this.toolBoxProperties.drawingExist) {
      if (this.mouseControl.getChoice() === tools.SELECT) {
        this.selector.resetSelectBox();
      }
      if (this.mouseControl.getChoice() !== tools.PIPETTE) {
        this.select.pipette();
      } else {
        this.select.nothing();
      }
    }
  }

  openDialog(): void {
    if (!this.hotkey.welcomeWindowActive) {
      this.colorPicker.setColorType('back');
      this.dialog.open(DialogPopupComponent, {
        data: {
        },
      });
      this.hotkey.popupBoolChange(true);
      this.colorPickerDisabled = true;
      this.toolBoxProperties.enable = true;
    }
  }

  openSaveDialog(): void {
    if (!this.hotkey.welcomeWindowActive && this.toolBoxProperties.drawingExist) {
      if (this.mouseControl.getChoice() === tools.SELECT) {
        this.selector.resetSelectBox();
      }
      this.dialog.open(DialogPopupSaveDrawingComponent, {
        data: {
        },
      });
    }
  }
  openExportDrawingDialog(): void {
    if (!this.hotkey.welcomeWindowActive && this.toolBoxProperties.drawingExist) {
      if (this.mouseControl.getChoice() === tools.SELECT) {
        this.selector.resetSelectBox();
      }
      this.dialog.open(ExportDrawingComponent, {
        data: {
        },
      });
      this.hotkey.popupActive = true;
    }
  }

  openLocalSave(): void {
    if (!this.hotkey.welcomeWindowActive && this.toolBoxProperties.drawingExist) {
      if (this.mouseControl.getChoice() === tools.SELECT) {
        this.selector.resetSelectBox();
      }
      this.dialog.open(DialogPopupSaveLocallyComponent, {
        data: {
        },
      });
    }
  }

  openDrawingDialog(): void {
    if (!this.hotkey.welcomeWindowActive) {
      this.dialog.open(DialogPopupOpenDrawingComponent, {
        data: {
        },
      });
    }
  }

  openLocalUpload(): void {
    if (!this.hotkey.welcomeWindowActive) {
      this.dialog.open(DialogPopupOpenLocallyComponent, {
        data: {
        },
      });
    }
  }

  openUserGuide(): void {
    if (!this.hotkey.welcomeWindowActive) {
      this.dialog.open(UserGuideComponent, {
        data: {},
      });
    }
  }

  useStamp(): void {
    if (!this.hotkey.welcomeWindowActive && this.toolBoxProperties.drawingExist) {
      if (this.mouseControl.getChoice() === tools.SELECT) {
        this.selector.resetSelectBox();
      }
      if (this.mouseControl.getChoice() !== tools.STAMP) {
        this.select.stamp();
      } else {
        this.select.nothing();
      }
    }
  }
}
