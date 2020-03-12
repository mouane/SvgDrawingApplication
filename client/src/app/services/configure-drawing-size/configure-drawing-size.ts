import { EventEmitter, Injectable, Output} from '@angular/core';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigureDrawingSizeService {

  private height = new BehaviorSubject<number>(0);
  private width = new BehaviorSubject<number>(0);
  private hex = new BehaviorSubject<string>('');
  currentHeight = this.height.asObservable();
  currentWidth = this.width.asObservable();
  currentHex = this.hex.asObservable();
  drawingCreated = false;

  @Output() changeH: EventEmitter<number> = new EventEmitter();
  @Output() changeW: EventEmitter<number> = new EventEmitter();
  @Output() changeHEX: EventEmitter<string> = new EventEmitter();
  @Output() changeBool: EventEmitter<string> = new EventEmitter();

  createSVG(x: number , y: number, hexColor: string): void {
    if (!isNaN(x) && !isNaN(y)) {
      this.changeH.emit(y);
      this.changeW.emit(x);
      this.changeHEX.emit(hexColor);
      this.drawingCreated = true;
      this.changeBool.emit('true');
    }
  }
  resizeBrowser(w: number, h: number): void {
    this.changeH.emit(h);
    this.changeW.emit(w);
    this.height.next(h);
    this.width.next(w);
  }
  changeBackgroundColor( hexColor: string): void {
    this.changeHEX.emit(hexColor);
  }
}
