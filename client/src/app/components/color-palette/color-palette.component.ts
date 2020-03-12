import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { COLOR_PALETTE } from 'src/app/enum';

@Component({
  selector: 'app-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ColorPaletteComponent implements AfterViewInit {
  @Input() width = 225;
  @Input() height = 225;
  @Output() outputColor = new EventEmitter();

  @ViewChild(COLOR_PALETTE.CANVAS_VAL, {static: false}) canvasValue: ElementRef;

   hexVal: string;
   cx: CanvasRenderingContext2D;

  @ViewChild(COLOR_PALETTE.CANVAS, {static: false}) canvas: ElementRef;

  getPixel(event: MouseEvent): void {
    const boundingRect = this.canvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - boundingRect.left;
    const y = event.clientY - boundingRect.top;
    const px = this.cx.getImageData(x, y, 1, 1);
    const dataArray = px.data;
    const dColor = dataArray[2] + 256 * dataArray[1] + 65536 * dataArray[0];
    this.hexVal = ('#' + dColor.toString(16));
    this.outputColor.emit(this.hexVal);
  }

  ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    // tslint:disable-next-line: no-non-null-assertion
    this.cx = canvasEl.getContext(COLOR_PALETTE.TD)!;
    const image = new Image();

    canvasEl.width = this.width;
    canvasEl.height = this.height;
    image.onload = () => {
      this.cx.drawImage(image, 0, 0, this.width, this.height);
    };
    image.src = COLOR_PALETTE.SRC;
  }
}
