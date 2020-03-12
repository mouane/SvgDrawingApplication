import { EventEmitter, Injectable, Output, RendererFactory2 } from '@angular/core';
import { UndoRedoProperties } from 'src/app/classes/undoRedoProperties/undo-redo-properties';
import { FILTER } from '../../enum';
import { ConfigureDrawingSizeService } from '../configure-drawing-size/configure-drawing-size';
import { EraserService } from '../eraser/eraser.service';
import { GridConfigService } from '../grid-config/grid-config.service';
import { LineToolService } from '../line-tool/line-tool.service';
import { MouseControlService } from '../mouse-control/mouse-control.service';

@Injectable({
  providedIn: 'root',
})
export class UndoRedoService {

  @Output() updateRedo: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() updateUndo: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() updateCopyPasteParams: EventEmitter<SVGElement> = new EventEmitter<SVGElement>();
  constructor(private rendererFactory: RendererFactory2,
              private mouseService: MouseControlService,
              private gridService: GridConfigService,
              private drawingSizeService: ConfigureDrawingSizeService,
              private undoRedoProperties: UndoRedoProperties,
              private eraserService: EraserService,
              private lineService: LineToolService,

  ) {
    this.undoRedoProperties.renderer = this.rendererFactory.createRenderer(null, null);
    this.undoRedoProperties.grid = this.gridService.grid;
    this.gridService.changeGrid.subscribe((grid: SVGElement) => {
      this.undoRedoProperties.renderer.setStyle(this.undoRedoProperties.grid.firstChild,
        'opacity', (grid.firstChild as SVGElement).style.opacity);
      this.undoRedoProperties.renderer.setAttribute(this.undoRedoProperties.grid.firstChild, 'd', 'M ' + this.gridService.gridValue + ' 0 L 0 0 0 ' + this.gridService.gridValue);
      this.undoRedoProperties.renderer.setAttribute(this.undoRedoProperties.grid, 'width', '' + this.gridService.gridValue);
      this.undoRedoProperties.renderer.setAttribute(this.undoRedoProperties.grid, 'height', '' + this.gridService.gridValue);
    });

    // When everything is ready, we just observe our target
  }

  setDrawingDiv(div: HTMLElement): void {
    this.undoRedoProperties.drawingDiv = div;
  }

  addView(view: SVGElement): void {
    const current = view.cloneNode(true) as SVGElement;
    if (this.undoRedoProperties.itterator < this.undoRedoProperties.actions.length - 1) {
      while (this.undoRedoProperties.actions.length > this.undoRedoProperties.itterator + 1) {
        this.undoRedoProperties.actions.pop();
      }
    }
    this.undoRedoProperties.actions.push(current);
    this.undoRedoProperties.itterator = this.undoRedoProperties.actions.length - 1;
    this.checkItterator();
  }

  checkItterator(): void {
    this.undoRedoProperties.itterator > 0 ? this.updateUndo.emit(true) : this.updateUndo.emit(false);
    this.undoRedoProperties.itterator < this.undoRedoProperties.actions.length - 1 ?
      this.updateRedo.emit(true) : this.updateRedo.emit(false);
  }

  undo(): void {
    if (this.undoRedoProperties.itterator > 0) {
      this.undoRedoProperties.itterator -= 1;
      this.swapView(this.undoRedoProperties.actions[this.undoRedoProperties.itterator]);
    }
    this.checkItterator();
  }

  redo(): void {
    if (this.undoRedoProperties.itterator < this.undoRedoProperties.actions.length - 1) {
      this.undoRedoProperties.itterator += 1;
      this.swapView(this.undoRedoProperties.actions[this.undoRedoProperties.itterator]);
    }
    this.checkItterator();
  }

  prepareExternalModules(svg: SVGElement): void {

    this.syncSvgElements(svg);

    this.undoRedoProperties.hexSubcribe = this.drawingSizeService.changeHEX.subscribe(($event: string) => {
      this.undoRedoProperties.renderer.setStyle(svg, 'background-color', $event);
      if (this.undoRedoProperties.actions.length > 0) {
        this.addView(svg);
      }
    });
    this.startObserver(svg);
  }

  startObserver(svg: SVGElement): void {
    const observer = new MutationObserver((mutation) => this.checkMutation(mutation, svg));
    observer.observe(svg, this.undoRedoProperties.config);
  }

  syncSvgElements(svg: SVGElement): void {
    svg.childNodes.forEach((child) => {
      if ((child as HTMLElement).id === FILTER.GRID && child.nodeName === FILTER.PATTERN) {
        this.undoRedoProperties.renderer.insertBefore(svg, this.undoRedoProperties.grid, child);
        this.undoRedoProperties.renderer.removeChild(svg, child);
      }
      if ((child as HTMLElement).classList.contains(FILTER.SELECTOR) ||
         (child as HTMLElement).classList.contains(FILTER.CONTROL) ||
         (child as HTMLElement).id === FILTER.ERASER ||
         (child as HTMLElement).id === FILTER.SELECTOR) {
        this.undoRedoProperties.renderer.removeChild(svg, child);
      }
    });
  }

  swapView(toAdd: SVGElement): void {
    this.lineService.hasStarted = false;
    this.lineService.isDragged = false;
    this.undoRedoProperties.isClone = true;
    this.undoRedoProperties.hexSubcribe.unsubscribe();
    const current = toAdd.cloneNode(true) as SVGElement;
    this.init(current);
    this.undoRedoProperties.renderer.removeChild(this.undoRedoProperties.drawingView, this.undoRedoProperties.drawingDiv.firstChild);
    this.undoRedoProperties.renderer.appendChild(this.undoRedoProperties.drawingDiv, current);
    this.eraserService.swapParents(current);
    this.updateCopyPasteParams.emit(current);
    this.eraserService.getElements();
  }

  init(svg: SVGElement): void {
    this.undoRedoProperties.renderer.listen(svg, 'mousedown', (event) => { this.mouseService.mouseDown(event); });
    this.undoRedoProperties.renderer.listen(svg, 'contextmenu', (event) => { this.mouseService.rightClick(event); });
    this.undoRedoProperties.renderer.listen(svg, 'mouseup', (event) => { this.mouseService.mouseUp(event); });
    this.undoRedoProperties.renderer.listen(svg, 'mouseup', (event) => { this.childNodesChange(svg); });
    this.undoRedoProperties.renderer.listen(svg, 'mousemove', (event) => { this.mouseService.mouseMove(event); });
    this.undoRedoProperties.renderer.listen(svg, 'mouseleave', (event) => { this.mouseService.mouseUp(event); });
    this.undoRedoProperties.renderer.listen(svg, 'dblclick', (event) => { this.mouseService.doubleClick(event); });
    this.prepareExternalModules(svg);
  }

  childNodesChange(svg: SVGElement): void {
    if (this.undoRedoProperties.onChange) {
      this.addView(svg);
    }
    this.undoRedoProperties.onChange = false;
  }
  checkMutation(mutation: MutationRecord[], svg: SVGElement): void {
    mutation.forEach((mut) => {
      if (mut.type === 'childList' && mut.target.nodeName !== 'tspan') {
          mut.addedNodes.forEach((node) => {
            if (!((node as HTMLElement).classList.contains(FILTER.SELECTOR) || (node as HTMLElement).id === FILTER.SELECTOR)) {
              this.undoRedoProperties.onChange = true;
            }
          });
      } else if (mut.target !== svg) {
        this.undoRedoProperties.onChange = true;
      }
    });
  }
}
