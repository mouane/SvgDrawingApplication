import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ColorToolProperties } from 'src/app/classes/colorToolProperties/color-tool-properties';
import { BASE_COLORS, COLOR_PICKER, DEFAULT_COLORS } from 'src/app/enum';
import {ColorToolService } from 'src/app/services/color-tool/color-tool.service';
import { HotkeysService } from 'src/app/services/hotkeys/hotkeys.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent implements OnInit {
  constructor( private toolPropreties: ColorToolProperties, private colorService: ColorToolService, private hotkey: HotkeysService) {}

  @Input() color: string;
  @Input() transLevel: number;
  @Output() event: EventEmitter<string> = new EventEmitter<string>();
  @Output() outputColor = new EventEmitter();

  defaultColors: string[] = [
    DEFAULT_COLORS.WHITE,
    DEFAULT_COLORS.BLACK,
    DEFAULT_COLORS.RED,
    DEFAULT_COLORS.GREEN,
    DEFAULT_COLORS.BLUE,
    DEFAULT_COLORS.YELLOW,
    DEFAULT_COLORS.TURQUOISE,
    DEFAULT_COLORS.PINK,
    DEFAULT_COLORS.GRAY,
    DEFAULT_COLORS.ORANGE,
  ];

  ngOnInit() {
    this.toolPropreties.rgba = COLOR_PICKER.RGBA;
    this.transLevel = 100;
    this.toolPropreties.typeColor = this.colorService.findType();
    this.setColorType(this.toolPropreties.typeColor);
    this.outputColor.emit(this.toolPropreties.colorTrans);
  }

  setColorType(type: string, event?: MouseEvent): void {
    if (event !== undefined) {
      this.highlightTab(event);
    }
    this.colorService.getType(type);
    this.toolPropreties.typeColor = type;
    if (type === DEFAULT_COLORS.PRIMARY) {
      this.transLevel = this.toolPropreties.transPrimary;
      this.setHexTrans(this.transLevel);
      this.toolPropreties.colorTrans = this.toolPropreties.primary;
      this.colorService.currentPrimaryColor.subscribe((color: string) => {
        this.toolPropreties.colorTrans = color;
        this.toolPropreties.primary = color;
      });
    } else if (type === DEFAULT_COLORS.SECONDARY) {
      this.transLevel = this.toolPropreties.transSecondary;
      this.setHexTrans(this.transLevel);
      this.toolPropreties.colorTrans = this.toolPropreties.secondary;
      this.colorService.currentSecondaryColor.subscribe((color: string) => {
        this.toolPropreties.colorTrans = color;
        this.toolPropreties.secondary = color;
      });
    } else {
      this.transLevel = this.toolPropreties.transBackground;
      this.setHexTrans(this.transLevel);
      this.toolPropreties.colorTrans = this.toolPropreties.background;
      this.colorService.currentBackgroundColor.subscribe((color: string) => {
        this.toolPropreties.colorTrans = color;
      });
    }
    this.toolPropreties.colorHEX = this.toolPropreties.colorTrans.slice(0, 7);
  }
  swapColors(): void {
    const temp = this.colorService.Fill;
    const tempTrans = this.toolPropreties.transPrimary;
    this.toolPropreties.transPrimary = this.toolPropreties.transSecondary;
    this.toolPropreties.transSecondary = tempTrans;
    this.colorService._Fill = this.colorService.Outline;
    this.colorService._Outline = temp;
  }
  changeColor(color: string): void {
    this.toolPropreties.invalid = false;
    this.toolPropreties.colorTrans = color;
    this.event.emit(this.toolPropreties.colorTrans);
    this.toolPropreties.show = false;
    for (let i = 0; i < 10; i++) {
      if (color.slice(0, 7) === this.defaultColors[i]) {
        this.defaultColors.unshift(color);
        this.defaultColors[i + 1] = this.defaultColors[10];
        i = 100;
      }
      if (i === 9) {
      this.defaultColors.unshift(color);
    }
  }
    this.defaultColors.splice(10);
    this.toolPropreties.colorTrans = color.slice(0, 7) + this.toolPropreties.transHex;
    this.toolPropreties.colorHEX = this.toolPropreties.colorTrans.slice(0, 7);
    this.outputColor.emit(this.toolPropreties.colorTrans);
    this.hexToRgba(this.toolPropreties.colorTrans);
    this.colorService.setColor(this.toolPropreties.colorTrans);
  }
  highlightTab(event: MouseEvent): void {
    const parent = (((event.target) as HTMLElement).parentElement);
    if (parent !== null) {
      if (parent.nodeName !== COLOR_PICKER.BUTTON) {
        // tslint:disable-next-line: forin
        for ( const child in parent.childNodes) {
          if ((parent.childNodes[child] as HTMLElement).classList !== undefined) {
            (parent.childNodes[child] as HTMLElement).classList.remove(COLOR_PICKER.ACTIVE);
          }
        }
        (event.target as HTMLElement).classList.add( COLOR_PICKER.ACTIVE);
      } else {
        if (parent.parentNode !== null) {
          for ( const child in parent.parentNode.childNodes) {
            if ((parent.parentNode.childNodes[child] as HTMLElement).classList !== undefined) {
              (parent.parentNode.childNodes[child] as HTMLElement).classList.remove(COLOR_PICKER.ACTIVE);
            }
          }
        }
        (parent).classList.add( COLOR_PICKER.ACTIVE);
      }
    }
  }
  hexToRgba(color: string): void {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const a = (parseInt(color.slice(7, 9), 16) / 255).toFixed(2);

    this.toolPropreties.rgba = COLOR_PICKER.PAR_OPEN + r + COLOR_PICKER.COMMA + g + COLOR_PICKER.COMMA + b +
      COLOR_PICKER.COMMA + a + COLOR_PICKER.PAR_CLOSE;
}
  changeColorManual(color: string): void {
    switch (color) {
      case BASE_COLORS.RED:
        color = DEFAULT_COLORS.RED;
        break;
      case BASE_COLORS.GREEN:
        color = DEFAULT_COLORS.GREEN;
        break;
      case BASE_COLORS.BLUE:
        color = DEFAULT_COLORS.BLUE;
        break;
    }
    const isValid = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);

    if (isValid) {
      this.changeColor(color);
      this.toolPropreties.show = true;
    } else {
      this.toolPropreties.invalid = true;
    }
    this.toggleColors();
  }

  receiveColorPalette($event: string): void {
    this.changeColor($event);
  }
  setHexTrans(trans: number) {
    const hexNumber = (trans / 100) * 255;
    const hexInteger = Math.floor(hexNumber);
    const hexString = hexInteger.toString(16);
    this.toolPropreties.transHex = hexInteger < 16 ? COLOR_PICKER.ZERO + hexString : hexString;
  }

  transparency(trans: number): void {
    if (trans >= 0 && trans <= 100) {
      this.setHexTrans(trans);
      if (this.toolPropreties.typeColor === DEFAULT_COLORS.PRIMARY) {
        this.toolPropreties.transPrimary = trans;
      } else if (this.toolPropreties.typeColor === DEFAULT_COLORS.SECONDARY) {
        this.toolPropreties.transSecondary = trans;
      } else {
        this.toolPropreties.transBackground = trans;
      }
      this.updateColor();
    } else {
      window.alert(COLOR_PICKER.ALERT);
    }
    this.hotkey.onFocus = false;
  }
  updateColor(): void {
    this.toolPropreties.colorHEX = this.toolPropreties.colorTrans.slice(0, 7);
    this.toolPropreties.colorTrans = this.toolPropreties.colorHEX + this.toolPropreties.transHex;
    this.hexToRgba(this.toolPropreties.colorTrans);
    this.setColorType(this.toolPropreties.typeColor);
    this.outputColor.emit(this.toolPropreties.colorTrans);
    this.colorService.setColor(this.toolPropreties.colorTrans);
    this.changeColor(this.toolPropreties.colorTrans);
  }

  toggleColors(): void {
    if (!this.toolPropreties.invalid) {
      this.toolPropreties.show = !this.toolPropreties.show;
    }
  }
  onFocus(): void {
    this.hotkey.onFocus = true;
  }
  onBlur(): void {
    this.hotkey.onFocus = false;
  }
}
