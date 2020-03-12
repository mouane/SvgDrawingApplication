import { Injectable } from '@angular/core';
import { DEFAULT_VALUES } from 'src/app/enum';

@Injectable({
  providedIn: 'root',
})
export class ScrollDrawingService {
  private xScroll: number = DEFAULT_VALUES.ORIGIN_POSITION;
  private yScroll: number = DEFAULT_VALUES.ORIGIN_POSITION;
  private windowScroll: number = DEFAULT_VALUES.ORIGIN_POSITION;

  // tslint:disable-next-line: no-empty
  constructor() {}
  set _ScrollX(xScroll: number) {
    this.xScroll = xScroll;
  }

  set _ScrollY(yScroll: number) {
    this.yScroll = yScroll;
  }

  set _WindowScroll(windowScroll: number) {
    this.windowScroll = windowScroll;
  }

  get ScrollX(): number {
    return this.xScroll;
  }

  get ScrollY(): number {
    return (this.yScroll + this.windowScroll);
  }
}
