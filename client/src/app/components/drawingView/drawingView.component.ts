import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DrawingViewProperties } from 'src/app/classes/drawingViewProperties/drawing-view-properties';
import { UndoRedoProperties } from 'src/app/classes/undoRedoProperties/undo-redo-properties';
import { KEY, tools } from 'src/app/enum';
import { ConfigureDrawingSizeService } from 'src/app/services/configure-drawing-size/configure-drawing-size';
import { HotkeysService } from 'src/app/services/hotkeys/hotkeys.service';
import { LineToolService } from 'src/app/services/line-tool/line-tool.service';
import { OpenDrawingService } from 'src/app/services/open-drawing/open-drawing.service';
import { SaveDrawingService } from 'src/app/services/save-drawing/save-drawing.service';
import { ScrollDrawingService } from 'src/app/services/scroll-drawing/scroll-drawing.service';
import { UndoRedoService } from 'src/app/services/undo-redo/undo-redo.service';
import { BrushToolService } from '../../services/brush-tool/brushTool.service';
import { GridConfigService } from '../../services/grid-config/grid-config.service';
import { MouseControlService } from '../../services/mouse-control/mouse-control.service';

@Component({
  selector: 'app-drawingView',
  templateUrl: './drawingView.component.html',
  styleUrls: ['./drawingView.component.scss'],
})
export class DrawingViewComponent implements OnInit, AfterViewInit {

  constructor(
    private drawingSizeService: ConfigureDrawingSizeService,
    private mouseService: MouseControlService,
    private renderer: Renderer2,
    private brushTool: BrushToolService,
    private gridService: GridConfigService,
    private hotkey: HotkeysService,
    private lineService: LineToolService,
    private scrollDrawing: ScrollDrawingService,
    private saveDrawingService: SaveDrawingService,
    private openDrawingService: OpenDrawingService,
    private undoRedoService: UndoRedoService,
    private undoRedoProperties: UndoRedoProperties,
    private drawingViewProperties: DrawingViewProperties,
  ) {
    this.openDrawingService.listenToOpen().subscribe((event: Event) => {
      this.openDrawing();
    });
    this.drawingViewProperties.svg = this.renderer.createElement('svg', 'svg');
    this.prepareDrawingSize();
    this.prepareGrid();
    this.resetDrawing();
  }
  @ViewChild('mainDiv', { static: false }) private div: ElementRef;
  @ViewChild('container', { static: false }) private container: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.drawingSizeService.resizeBrowser(this.container.nativeElement.offsetWidth, this.container.nativeElement.offsetHeight);
  }

  @HostListener('window:keydown.shift', ['$event'])
  onShiftDown(): void {
    this.mouseService.onShiftDown();
  }

  @HostListener('window:keyup.shift', ['$event'])
  onShiftUp(): void {
    this.mouseService.onShiftUp();
  }

  @HostListener('scroll', ['$event'])
  amountScrolled($event: Event) {
    const scroll = $event.target as HTMLDivElement;
    this.scrollDrawing._ScrollX = scroll.scrollLeft;
    this.scrollDrawing._ScrollY = scroll.scrollTop;
  }

  @HostListener('window:scroll', [])
  windowScroll($event: Event) {
    const scrollWindowY = window.scrollY;
    this.scrollDrawing._WindowScroll = scrollWindowY;
  }

  ngOnInit() {
    this.hotkey.change.subscribe((temp: string) => {
      if (temp === KEY.KEY_BACKSPACE) {
        this.lineService.deleteRecentLine();
      } else if (temp === KEY.KEY_ESCAPE) {
        this.lineService.deletePath();
      }
    });
  }
  prepareGrid(): void {
    this.drawingViewProperties.grid = this.gridService.grid;
    this.gridService.changeGrid.subscribe((grid: SVGElement) => {
      this.renderer.setStyle(this.drawingViewProperties.grid.firstChild, 'opacity', (grid.firstChild as SVGElement).style.opacity);
      this.renderer.setAttribute(this.drawingViewProperties.grid.firstChild, 'd', 'M ' + this.gridService.gridValue + ' 0 L 0 0 0 '
      + this.gridService.gridValue);

      this.renderer.setAttribute(this.drawingViewProperties.grid, 'width', '' + this.gridService.gridValue);
      this.renderer.setAttribute(this.drawingViewProperties.grid, 'height', '' + this.gridService.gridValue);
    });
  }

  prepareDrawingSize(): void {
    this.drawingSizeService.changeH.subscribe((y: number) => {
      this.drawingViewProperties.height = y;
    });
    this.drawingSizeService.changeW.subscribe((x: number) => {
      this.drawingViewProperties.width = x;
    });
    this.colorSubscribe();
  }
  colorSubscribe(): void {
    this.undoRedoProperties.hexSubcribe = this.drawingSizeService.changeHEX.subscribe(($event: string) => {
      this.drawingViewProperties.hexColor = $event;
      const current = this.drawingViewProperties.svg.cloneNode(true) as SVGElement;
      this.renderer.setStyle(current, 'background-color', this.drawingViewProperties.hexColor);
      if (this.drawingViewProperties.svg.style.backgroundColor !== current.style.backgroundColor &&
        this.undoRedoProperties.actions.length > 0) {
        if (!this.undoRedoProperties.isClone) {
          this.renderer.setStyle(this.drawingViewProperties.svg, 'background-color', this.drawingViewProperties.hexColor);
          this.undoRedoService.addView(this.drawingViewProperties.svg);
        }
      }
    });
  }
  resetDrawing(): void {
    this.drawingSizeService.changeBool.subscribe(() => {
      if (this.drawingViewProperties.showSVG && (this.div.nativeElement.firstChild !== null)) {
        this.renderer.removeChild(this.div.nativeElement, this.div.nativeElement.firstChild);
        this.undoRedoProperties.hexSubcribe.unsubscribe();
      }
      this.drawingViewProperties.showSVG = true;
      this.initSvg();
      this.saveDrawingService.setRenderer = this.renderer;
    });
  }
  openDrawing(): void {
    try {
      this.drawingViewProperties.drawingElements = this.openDrawingService.getTheSelectedDrawing();
      this.drawingViewProperties.hexColor = this.drawingViewProperties.drawingElements.drawingColor;
      this.drawingViewProperties.width = Number(this.drawingViewProperties.drawingElements.drawingWidth);
      this.drawingViewProperties.height = Number(this.drawingViewProperties.drawingElements.drawingHeight);
      this.drawingViewProperties.showSVG = true;
      this.drawingSizeService.createSVG(this.drawingViewProperties.width, this.drawingViewProperties.height,
                                        this.drawingViewProperties.hexColor);
      for (const index of this.drawingViewProperties.drawingElements.childList) {
        if (index.substr(1, index.indexOf(' ') - 1) !== '') {
          const element = this.renderer.createElement(index.substr(1, index.indexOf(' ') - 1));
          this.renderer.appendChild(this.drawingViewProperties.svg, element);
          element.outerHTML = index;
        }
      }
      this.openDrawingService.errorFound(false);
      this.undoRedoProperties.actions = [];
      this.undoRedoService.addView(this.drawingViewProperties.svg);
      this.undoRedoProperties.isClone = false;
    } catch (e) {
      window.alert('le fichier que vous avez selectionné ne peut pas être ouvert, le format n\'est pas approprié, svg choisissez un autre fichier');
      this.openDrawingService.errorFound(true);
    }
  }
  initSvg(): void {
    this.renderer.setStyle(this.div.nativeElement, 'height', this.div.nativeElement.offsetHeight + 'px');
    this.renderer.setStyle(this.div.nativeElement, 'width', this.div.nativeElement.offsetWidth + 'px');
    this.drawingViewProperties.svg = this.renderer.createElement('svg', 'svg');
    this.renderer.setAttribute(this.drawingViewProperties.svg, 'version', '1.1');
    this.drawingViewProperties.mainRectangle = this.renderer.createElement('rect', 'svg');
    this.renderer.setAttribute(this.drawingViewProperties.mainRectangle, 'height', '100%');
    this.renderer.setAttribute(this.drawingViewProperties.mainRectangle, 'width', '100%');
    this.renderer.setAttribute(this.drawingViewProperties.mainRectangle, 'fill', 'url(#grid)');
    this.renderer.setAttribute(this.drawingViewProperties.mainRectangle, 'id', 'grid');
    this.renderer.setStyle(this.drawingViewProperties.mainRectangle, 'pointer-events', 'none');

    this.renderer.setStyle(this.drawingViewProperties.svg, 'background-color', this.drawingViewProperties.hexColor);
    this.renderer.setAttribute(this.drawingViewProperties.svg, 'width', '' + this.drawingViewProperties.width);
    this.renderer.setAttribute(this.drawingViewProperties.svg, 'height', '' + this.drawingViewProperties.height);
    this.renderer.setAttribute(this.drawingViewProperties.svg, 'id', 'drawing');
    this.renderer.appendChild(this.drawingViewProperties.svg, this.drawingViewProperties.grid);

    this.renderer.listen(this.drawingViewProperties.svg, 'mousedown', (event) => { this.mouseService.mouseDown(event); });
    this.renderer.listen(this.drawingViewProperties.svg, 'mouseup', (event) => { this.mouseService.mouseUp(event); });
    // tslint:disable-next-line: max-line-length
    this.renderer.listen(this.drawingViewProperties.svg, 'mouseup', (event) => { this.undoRedoService.childNodesChange(this.drawingViewProperties.svg); });
    this.renderer.listen(this.drawingViewProperties.svg, 'mousemove', (event) => { this.mouseService.mouseMove(event); });
    // tslint:disable-next-line: max-line-length
    this.renderer.listen(this.drawingViewProperties.svg, 'mouseleave', (event) => { this.mouseService.mouseUp(event); this.mouseService.mouseleave(event); });
    this.renderer.listen(this.drawingViewProperties.svg, 'contextmenu', (event) => { this.mouseService.rightClick(event); });
    this.renderer.listen(this.drawingViewProperties.svg, 'dblclick', (event) => { this.mouseService.doubleClick(event); });

    this.renderer.setAttribute(this.drawingViewProperties.svg, 'baseProfile', 'full');
    this.renderer.appendChild(this.drawingViewProperties.svg, this.brushTool.FilterBase);
    this.renderer.appendChild(this.drawingViewProperties.svg, this.brushTool.FilterTurbulence);
    this.renderer.appendChild(this.drawingViewProperties.svg, this.brushTool.FilterNoise);
    this.renderer.appendChild(this.drawingViewProperties.svg, this.brushTool.FilterBlurry);
    this.renderer.appendChild(this.drawingViewProperties.svg, this.brushTool.FilterSquigly);
    this.renderer.appendChild(this.div.nativeElement, this.drawingViewProperties.svg);
    this.renderer.appendChild(this.drawingViewProperties.svg, this.drawingViewProperties.mainRectangle);

    this.undoRedoProperties.actions = [];
    this.undoRedoService.addView(this.drawingViewProperties.svg);
    this.undoRedoProperties.isClone = false;

    const observer = new MutationObserver((mutation) => this.undoRedoService.checkMutation(mutation, this.drawingViewProperties.svg));
    observer.observe(this.drawingViewProperties.svg, this.undoRedoProperties.config);

    this.colorSubscribe();
  }

  ngAfterViewInit(): void {
    this.drawingSizeService.resizeBrowser(this.container.nativeElement.offsetWidth, this.container.nativeElement.offsetHeight);
    this.drawingSizeService.changeBackgroundColor(this.drawingViewProperties.hexColor);
    this.undoRedoService.setDrawingDiv(this.div.nativeElement);
  }
  setMyStyles() {
    return {
      'background-color': this.drawingViewProperties.hexColor,
    };
  }
  eraserEnabled(): string {
    if (this.mouseService.getChoice() === tools.ERASER) {
      return 'none';
    } else {
      return 'default';
    }
  }
}
