import { Injectable, Renderer2} from '@angular/core';
import { SvgSelectorProperties } from 'src/app/classes/svgSelectorProperties/svg-properties';
import { CopyPasteProperties } from '../../classes/copyPaste-properties/copy-paste-properties';
import { COPYPASTE, FILTER } from '../../enum';
import { SvgSelectorToolService } from '../../services/svg-selector-tool/svg-selector-tool.service';
@Injectable({
  providedIn: 'root',
})
export class CopyPasteService {
  constructor(private copyPasteProperties: CopyPasteProperties, private svgSelector: SvgSelectorToolService,
              private properties: SvgSelectorProperties) { }

  copyTool(tool: string): void {
    if (this.properties.selectBox) {
      if (this.copyPasteProperties.selectBoxX !== Number(this.properties.selectBox.getAttribute('x'))) {
        this.copyPasteProperties.selectBoxX = Number(this.properties.selectBox.getAttribute('x')) || 0;
        this.copyPasteProperties.selectBoxY = Number(this.properties.selectBox.getAttribute('y')) || 0;
        this.copyPasteProperties.tempX = Number(this.properties.selectBox.getAttribute('x')) || 0;
        this.copyPasteProperties.tempY = Number(this.properties.selectBox.getAttribute('y')) || 0;
        this.copyPasteProperties.translateValue = 0;
      }
      for (const index in this.copyPasteProperties.drawingView.childNodes) {
        if (this.filteringChilds(this.copyPasteProperties.drawingView.childNodes[index])) {
          if ((this.copyPasteProperties.drawingView.childNodes[index] as HTMLElement).id === 'box') {
            this.copyPasteProperties.toDelete.push(this.copyPasteProperties.drawingView.childNodes[index]);
          }
          this.copyPasteProperties.selected.forEach((i) => { if (this.copyPasteProperties.drawingView.childNodes[index] === i ) {
          if (tool === COPYPASTE.COPY) {
              this.copyPasteProperties.clipboard.push(this.copyPasteProperties.drawingView.childNodes[index]);
          } else if (tool === COPYPASTE.DUPLICATE) {
            this.copyPasteProperties.duplicate.push(this.copyPasteProperties.drawingView.childNodes[index]);
          } else {
            this.copyPasteProperties.delete.push(this.copyPasteProperties.drawingView.childNodes[index]);
          }
          }
          });
        }
      }
    }
  }

  pasteTool(tool: string, clip: Node[], temp: Node[],  renderer: Renderer2): void {
    this.copyPasteProperties.counterDuplicate = 0;
    this.copyPasteProperties.tempX += COPYPASTE.COPYPASTE_OFFSET;
    this.copyPasteProperties.tempY += COPYPASTE.COPYPASTE_OFFSET;
    this.copyPasteProperties.moveX += COPYPASTE.COPYPASTE_OFFSET;
    this.copyPasteProperties.moveY += COPYPASTE.COPYPASTE_OFFSET;
    clip.forEach((shape) => {
      this.copyPasteProperties.paste = shape as SVGAElement;
      this.copyPasteProperties.paste = shape.cloneNode(true) as SVGElement;
      if ((this.copyPasteProperties.tempX >= (this.copyPasteProperties.maxX )) ||
       (this.copyPasteProperties.tempY >= (this.copyPasteProperties.maxY))) {
        if (tool === COPYPASTE.DUPLICATE) {
          this.copyPasteProperties.translateValue = -(COPYPASTE.COPYPASTE_OFFSET);
        } else {
          this.copyPasteProperties.translateValue =
          this.copyPasteProperties.selectBoxX - this.copyPasteProperties.tempX + COPYPASTE.COPYPASTE_OFFSET;
        }
        this.copyPasteProperties.wentOver = true;
        this.copyPasteProperties.counter++;
        if (this.copyPasteProperties.counter === this.copyPasteProperties.selected.length) {
          this.copyPasteProperties.tempX = this.copyPasteProperties.selectBoxX;
          this.copyPasteProperties.tempY = this.copyPasteProperties.selectBoxY;
        }
      } else {
        if (tool === COPYPASTE.PASTE) {
          this.copyPasteProperties.translateValue = COPYPASTE.COPYPASTE_OFFSET;
        }
        this.copyPasteProperties.counter = 0;
      }
      this.checkAttributeRotate(tool);
      renderer.insertBefore(this.copyPasteProperties.drawingView,
        this.copyPasteProperties.paste, this.copyPasteProperties.drawingView.lastChild);
      temp.push(this.copyPasteProperties.paste as Node);
    });
  }

  checkAttributeRotate(tool: string): void {
    const temporary = this.copyPasteProperties.paste.getAttribute('transform');
    if (tool === COPYPASTE.DUPLICATE) {
      if (this.copyPasteProperties.counterDuplicate === 0) {
        this.copyPasteProperties.translateValue += COPYPASTE.COPYPASTE_OFFSET;
        this.copyPasteProperties.counterDuplicate++;
      }
    }
    if (temporary) {
      this.copyPasteProperties.paste.setAttribute('transform', temporary + 'translate(' +
      (this.copyPasteProperties.translateValue) + ',' + (this.copyPasteProperties.translateValue) + ')');
    } else {
      this.copyPasteProperties.paste.setAttribute('transform', 'translate(' +
      (this.copyPasteProperties.translateValue) + ',' + (this.copyPasteProperties.translateValue) + ')');
    }
  }
  filteringChilds(child: Node): boolean {
    let answer: boolean;
    let currentClass: string;
    ( (child as HTMLElement).classList !== undefined) ?  currentClass = (child as HTMLElement).classList[0] : currentClass = '';
    (child instanceof Node
      && currentClass !== FILTER.CONTROL
      && (child as HTMLElement).nodeName !== FILTER.FILTER
      && (child as HTMLElement).nodeName !== FILTER.PATTERN
      && (child as HTMLElement).id !== FILTER.GRID) ?  answer = true : answer =  false;
    return answer;
  }

  selectAllTool(): void {
    // tslint:disable-next-line: forin
    for (const index in this.copyPasteProperties.drawingView.childNodes) {
      if ((this.copyPasteProperties.drawingView.childNodes[index].nodeName === 'g')) {
        this.properties.selctedChilds.push(this.copyPasteProperties.drawingView.childNodes[index]);
      }
      if (this.copyPasteProperties.drawingView.childNodes[index] instanceof Node
         && (this.copyPasteProperties.drawingView.childNodes[index] as HTMLElement).id !== FILTER.BOX
         && this.filteringChilds(this.copyPasteProperties.drawingView.childNodes[index])
         && (this.copyPasteProperties.drawingView.childNodes[index] as HTMLElement).getAttribute('fill') !== null
         || ((this.copyPasteProperties.drawingView.childNodes[index] as HTMLElement)).nodeName === 'image') {
        this.properties.selctedChilds.push(this.copyPasteProperties.drawingView.childNodes[index]);
      }
    }
    this.properties.parent = this.copyPasteProperties.drawingView;
    this.svgSelector.updateSelectBox();

  }
}
