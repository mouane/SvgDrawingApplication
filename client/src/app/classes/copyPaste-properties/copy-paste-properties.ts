import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CopyPasteProperties {
  selected: NodeListOf<Node>;
  drawingView: SVGElement;
  paste: SVGElement;
  clipboard: Node[] = [];
  tempClipboard: Node[] = [];
  toDelete: Node[] = [];
  moveX: number;
  moveY: number;
  maxX: number;
  maxY: number;
  duplicate: Node[] = [];
  tempDuplicate: Node[] = [];
  delete: Node[] = [];
  selectBoxX: number;
  selectBoxY: number;
  tempX: number;
  tempY: number;
  counter = 0;
  counterDuplicate = 0;
  translateValue = 0;
  wentOver = false;
  enable = false;
  copy = false;
  selectAll = false;
  trans = 1;
}
