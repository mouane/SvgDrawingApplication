import { EventEmitter, Injectable, Output, Renderer2, RendererFactory2 } from '@angular/core';
import { DEFAULT_VALUES } from 'src/app/enum';

@Injectable({
  providedIn: 'root',
})
export class GridConfigService {

  gridOpacity: number = DEFAULT_VALUES.GRID_ZORO;
  gridValue: number = DEFAULT_VALUES.GRID_VALUE;
  gridActivated: boolean;
  private renderer: Renderer2;
  grid: SVGElement;
  gridPath: SVGElement;
  @Output() changeGrid: EventEmitter<SVGElement> = new EventEmitter();

  constructor( rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initgrid();
    this.gridOpacity = DEFAULT_VALUES.GRID_OPACITY;
  }

   initgrid(): void {
     this.grid = this.renderer.createElement('pattern', 'svg' );
     this.renderer.setAttribute(this.grid, 'id', 'grid');
     this.renderer.setAttribute(this.grid, 'width', '8');
     this.renderer.setAttribute(this.grid, 'height', '8');
     this.renderer.setAttribute(this.grid, 'patternUnits', 'userSpaceOnUse');

     this.gridPath  = this.renderer.createElement('path', 'svg');
     this.renderer.setAttribute(this.gridPath, 'd' , 'M 8 0 L 0 0 0 8');
     this.renderer.setAttribute(this.gridPath, 'stroke', 'black');
     this.renderer.setAttribute(this.gridPath, 'fill', 'none');
     this.renderer.setStyle(this.gridPath, 'opacity', this.gridOpacity);
     this.renderer.setAttribute(this.gridPath, 'stroke-width', '0.5');
     this.renderer.appendChild(this.grid, this.gridPath);
     this.changeGrid.emit(this.grid);
    }

  updateGrid(activated: boolean, value: number, opacity: number): void {
    this.gridActivated = activated;
    this.gridValue = value;
    const tmp = this.gridOpacity;
    this.gridOpacity = !this.gridActivated ? 0 : opacity;
    this.initgrid();
    this.gridOpacity = tmp;

  }

}
