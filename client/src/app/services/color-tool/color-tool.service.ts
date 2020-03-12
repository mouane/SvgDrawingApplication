import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { ColorToolProperties } from 'src/app/classes/colorToolProperties/color-tool-properties';
import { DEFAULT_COLORS } from 'src/app/enum';
import { ConfigureDrawingSizeService } from 'src/app/services/configure-drawing-size/configure-drawing-size';
@Injectable({
  providedIn: 'root',
})
export class ColorToolService {
  // tslint:disable-next-line: no-empty
  constructor(private properties: ColorToolProperties, private drawingSizeService: ConfigureDrawingSizeService) {}
  private typeColor: string;
  inDialog = false;
  primary = new BehaviorSubject<string>(this.Fill);
  secondary = new BehaviorSubject<string>(this.Outline);
  background = new BehaviorSubject<string>(this.Background);

  @Output() currentPrimaryColor: EventEmitter<string> = new EventEmitter();
  @Output() currentSecondaryColor: EventEmitter<string> = new EventEmitter();
  @Output() currentBackgroundColor: EventEmitter<string> = new EventEmitter();

  findType(): string {
    return this.typeColor;
  }
  setType(type: string) {
    this.typeColor = type;
  }
  getType(type: string): string {
    this.typeColor = type;
    if (type === DEFAULT_COLORS.PRIMARY) {
      return this.Fill;
    } else if (type === DEFAULT_COLORS.SECONDARY) {
      return this.Outline;
    } else {
      return this.Background;
    }
  }
  setColor(color: string): void {

    if (this.typeColor === DEFAULT_COLORS.PRIMARY) {
      this._Fill = color;
    } else if (this.typeColor === DEFAULT_COLORS.SECONDARY) {
      this._Outline = color;
    } else {
      this._Background = color;
    }
  }
  set _Fill(fill: string) {
    this.properties.primary = fill;
    this.currentPrimaryColor.emit(this.properties.primary);
  }

  set _Outline(outline: string) {
    this.properties.secondary = outline;
    this.currentSecondaryColor.emit(this.properties.secondary);
  }

  set _Background(backgroundColor: string) {
    this.properties.background = backgroundColor;
    if (!this.inDialog) {
      this.drawingSizeService.changeBackgroundColor(backgroundColor);
    }
  }

  get Fill(): string {
    return this.properties.primary;
  }

  get Outline(): string {
    return this.properties.secondary;
  }

  get Background(): string {
    return this.properties.background;
  }
}
