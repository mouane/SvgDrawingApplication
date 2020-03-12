import { Injectable, RendererFactory2 } from '@angular/core';
import { EraserProperties } from 'src/app/classes/eraserProperties/eraser-properties';
import { SvgSelectorProperties } from 'src/app/classes/svgSelectorProperties/svg-properties';
import { ERASER, SIDEBAR } from 'src/app/enum';
import { ScrollDrawingService } from '../scroll-drawing/scroll-drawing.service';

@Injectable({
  providedIn: 'root',
})

export class EraserService {

  constructor(rendererFactory: RendererFactory2, private properties: SvgSelectorProperties,
              private scrollDrawing: ScrollDrawingService, private eraserProperties: EraserProperties ) {
    this.eraserProperties.renderer = rendererFactory.createRenderer(null, null);
    this.eraserProperties.toBeDestroyed = [];
    this.eraserProperties.borderRectArray = [];
    this.eraserProperties.drawingViewSVGAs = [];
  }
  // ----------------------------------------- SELECTION MANAGEMENT -------------------------------------------------
  getElements(): void {
    if (this.eraserProperties.renderer != null) {
      this.eraserProperties.childs = this.properties.parent.childNodes;
      for (const child in this.properties.childs) {
        if (this.boxElement(child)) {
          const currentChild = (this.properties.childs[child] as SVGAElement);
          const bbox = currentChild.getBBox();
          if (bbox.height > 0 && bbox.width > 0) {
            if (currentChild.id !== ERASER.ERASERID) {
              this.eraserProperties.drawingViewSVGAs.push(currentChild);
            }
          }
        }
      }
    }
  }
  swapParents(parent: SVGElement): void {
    this.properties.parent = parent;
  }
  // ----------------------------------------- MOUSE MANAGEMENT -------------------------------------------------
  leftMouseDown($event: MouseEvent): void {
    this.eraserProperties.clicked = true;
    // tslint:disable-next-line: deprecation not possible otherwise to get correct target event.
    if (($event.target as SVGElement).classList[0] !== 'ctrl' && $event.which === 1) {
      for (const child in this.eraserProperties.childs) {
        if (this.elementIsPartOf(child, this.eraserProperties.childs[child] as SVGAElement)) {
          const currentChild = this.eraserProperties.childs[child] as SVGAElement;
          if (this.intersectRect(currentChild, this.eraserProperties.eraserSVG)) {
            this.eraserProperties.toBeDestroyed.push(currentChild);
          }
        }
      }
    }
  }
  eraserMouseMove($event: MouseEvent): void {
    if (this.eraserProperties.clicked) {
      const movement = Math.abs(this.eraserProperties.oldX - ($event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX)) +
        Math.abs(this.eraserProperties.oldY - ($event.clientY + this.scrollDrawing.ScrollY));
      this.eraserProperties.oldX = $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX;
      this.eraserProperties.oldY = $event.clientY + this.scrollDrawing.ScrollY;
      if (movement >= ERASER.MINORRORGAJE) {
        this.eraserProperties.mouseMovedAndClicked = true;
      }
    } else {
      this.eraserProperties.mouseMovedAndClicked = false;
    }
    this.generateEraserRectangle($event);
    this.verifyIntersection();
  }
  eraserMouseUp($event: MouseEvent) {
    if (($event.clientX + this.scrollDrawing.ScrollX) <= ERASER.TOOLBOXWIDTHOFFSET + 2) {
      this.deleteEraser();
    }
    if (!this.eraserProperties.mouseMovedAndClicked) {
      this.trimOverlap();
    }
    this.delete();
    this.eraserProperties.clicked = false;
    this.eraserProperties.onFirst = true;
    this.getElements();
  }
  // ---------------------------------------- INTERSECTION MANAGEMENT --------------------------------------------
  verifyIntersection(): void {
    this.eraserProperties.drawingViewSVGAs.forEach((currentChild) => {
      const bbox = currentChild.getBBox();
      if (this.intersectRect(currentChild, this.eraserProperties.eraserSVG)) {
        if (this.eraserProperties.clicked) {
          this.eraserProperties.toBeDestroyed.push(currentChild);
          this.generateRectBorderFromBbox(bbox, currentChild);
        } else {
          this.generateRectBorderFromBbox(bbox, currentChild);
          if (this.eraserProperties.borderRectArray.length > 0) {
            this.trimBorders();
          }
        }
      } else {
        if (this.eraserProperties.borderRectArray.length >= 1) {
          this.eraserProperties.borderRectArray.forEach((elem) => {
            const elementBbox = (elem as SVGAElement).getBBox();
            if (this.verifyBBoxEqual(bbox, elementBbox) && !this.eraserProperties.clicked) {
              this.eraserProperties.renderer.removeChild(this.properties.parent, elem);
              this.eraserProperties.borderRectArray.splice(this.eraserProperties.borderRectArray.indexOf(elem), 1);
            }
          });
        }
      }
    });
  }
  generateRectBorderFromBbox(bbox: DOMRect, elem: SVGAElement) {
    let existAlready = false;
    this.eraserProperties.borderRectArray.forEach((element) => {
      const elementBbox = (element as SVGAElement).getBBox();
      if (this.verifyBBoxEqual(bbox, elementBbox)) {
        existAlready = true;
      }
    });
    if (!existAlready) {
      this.eraserProperties.borderRectangle = this.eraserProperties.renderer.createElement('rect', ERASER.SVGNODENAME);
      this.eraserProperties.borderRectangle.setAttributeNS(null, 'id', ERASER.BORDERID);
      this.eraserProperties.borderRectangle.setAttribute('stroke', '#ff0000ff');
      this.eraserProperties.borderRectangle.setAttribute('stroke-width', '2');
      this.eraserProperties.borderRectangle.setAttribute('stroke-opacity', '2');
      this.eraserProperties.borderRectangle.setAttribute('x', String(bbox.x));
      this.eraserProperties.borderRectangle.setAttribute('y', String(bbox.y));
      this.eraserProperties.borderRectangle.setAttribute('width', String(bbox.width));
      this.eraserProperties.borderRectangle.setAttribute('height', String(bbox.height));
      this.eraserProperties.borderRectangle.setAttribute('fill', 'none');
      if (elem.getAttribute('transform') !== null) {
        this.eraserProperties.borderRectangle.setAttribute('transform', String(elem.getAttribute('transform')));
      }
      this.eraserProperties.renderer.insertBefore(this.properties.parent,
        this.eraserProperties.borderRectangle, this.properties.parent.lastChild);

      this.eraserProperties.borderRectArray.push(this.eraserProperties.borderRectangle);
      this.eraserProperties.onTopElement = this.eraserProperties.borderRectangle;
    }
  }
  elementIsPartOf(child: string, currentChild: SVGAElement): boolean {
    if (this.boxElement(child)) {
      const bbox = currentChild.getBBox();
      if (bbox.height > 0 && bbox.width > 0) {
        if (currentChild.id !== ERASER.ERASERID) {
          return true;
        }
      }
    }
    return false;
  }
  intersectRect(elem1: SVGElement, elem2: SVGElement): boolean {
    const child1 = elem1.getBoundingClientRect();
    const child2 = elem2.getBoundingClientRect();

    return !(child2.left > child1.right ||
      child2.right < child1.left ||
      child2.top > child1.bottom ||
      child2.bottom < child1.top);
  }
  boxElement(child: string): boolean {
    const childs: number = parseInt(child, 10);
    const childsHTML = this.properties.childs[childs] as HTMLElement;
    return (this.properties.childs[childs] instanceof Node && (childsHTML).id !== 'selector'
      && (childsHTML).classList[0] !== 'ctrl'
      && (childsHTML).id !== 'box'
      && (childsHTML).nodeName !== 'filter' &&
      (childsHTML).nodeName !== 'pattern'
      && (childsHTML).id !== 'grid');
  }
  // ----------------------------------------------------- ERASER RECTANGLE -------------------------------------------------
  generateEraserRectangle(event: MouseEvent): void {
    if (this.eraserProperties.onFirst) {
      const element = document.getElementById(ERASER.ERASERID);
      if (element) {
        this.eraserProperties.renderer.removeChild(this.eraserProperties.renderer, element);
      }
      this.properties.parent = (event.target as SVGElement);
      if (this.properties.parent.nodeName !== ERASER.SVGNODENAME) {
        this.properties.parent = ((event.target as SVGElement).parentNode as SVGElement);
      }
      this.eraserProperties.eraserSVG = this.eraserProperties.renderer.createElement('rect', ERASER.SVGNODENAME);
      this.eraserProperties.eraserSVG.setAttributeNS(null, 'id', ERASER.ERASERID);
      this.eraserProperties.eraserSVG.setAttributeNS(null, 'stroke', '#000000ff');
      this.eraserProperties.eraserSVG.setAttributeNS(null, 'stroke-width', '3');
      this.eraserProperties.eraserSVG.setAttributeNS(null, 'fill', '#ffffffff');
      this.eraserProperties.eraserSVG.setAttributeNS(null, 'pointer-events', 'none');
      this.eraserProperties.eraserSVG.setAttributeNS(null, 'height', String(this.eraserProperties.eraserSize));
      this.eraserProperties.eraserSVG.setAttributeNS(null, 'width', String(this.eraserProperties.eraserSize));
      this.eraserProperties.eraserSVG.setAttributeNS(null, 'x', String((event.clientX - SIDEBAR.sideBarWidth +
      this.scrollDrawing.ScrollX) - this.eraserProperties.eraserSize / 2));
      this.eraserProperties.eraserSVG.setAttributeNS(null, 'y', String((event.clientY + this.scrollDrawing.ScrollY)
                                                    - this.eraserProperties.eraserSize / 2));
      this.eraserProperties.renderer.insertBefore(this.properties.parent, this.eraserProperties.eraserSVG,
                                                  this.properties.parent.lastChild);
      this.eraserProperties.onFirst = false;
    } else {
      this.eraserProperties.eraserSVG.setAttributeNS(null, 'x', String((event.clientX - SIDEBAR.sideBarWidth +
        this.scrollDrawing.ScrollX) - this.eraserProperties.eraserSize / 2));
      this.eraserProperties.eraserSVG.setAttributeNS(null, 'y', String((event.clientY + this.scrollDrawing.ScrollY)
                                                    - this.eraserProperties.eraserSize / 2));
    }

  }
  deleteEraser() {
    this.eraserProperties.renderer.removeChild(this.properties.parent, this.eraserProperties.eraserSVG);
  }
  // --------------------------------------------- DELETE -----------------------------------------------------------
  delete() {
    this.eraserProperties.toBeDestroyed.forEach((el) => {
      this.eraserProperties.borderRectArray.forEach((element) => {
          this.eraserProperties.renderer.removeChild(this.properties.parent, element);
      });
      this.eraserProperties.renderer.removeChild(this.properties.parent, el);
    });
  }
  verifyBBoxEqual(bbox: DOMRect, elementBbox: DOMRect) {
    return (bbox.x === elementBbox.x && bbox.y === elementBbox.y &&
      bbox.width === elementBbox.width && bbox.height === elementBbox.height);
  }
  trimOverlap() {
    this.eraserProperties.toBeDestroyed.forEach((elem1) => {
      if (elem1.id !== ERASER.BORDERID) {
        this.eraserProperties.toBeDestroyed.forEach((elem2) => {
          if (elem2.id !== ERASER.BORDERID && elem1 !== elem2) {
            if (this.intersectRect(elem1, elem2)) {
              const indexElem1 = this.eraserProperties.toBeDestroyed.indexOf(elem1);
              const indexElem2 = this.eraserProperties.toBeDestroyed.indexOf(elem2);
              if (indexElem1 > indexElem2) {
                this.eraserProperties.toBeDestroyed.splice(this.eraserProperties.toBeDestroyed.indexOf(elem2), 1);

              } else {
                this.eraserProperties.toBeDestroyed.splice(this.eraserProperties.toBeDestroyed.indexOf(elem1), 1);
              }
            }
          }
        });
      }
    });
  }
  trimBorders(): void {
    this.eraserProperties.borderRectArray.forEach((element) => {
      if (element !== this.eraserProperties.onTopElement) {
        this.eraserProperties.borderRectArray.splice(this.eraserProperties.borderRectArray.indexOf(element), 1);
        this.eraserProperties.renderer.removeChild(this.properties.parent, element);
      }
    });
  }
  // ------------------------------------------------- SETTERS ----------------------------------------------------------
  setEraserSize(size: number): void {
    this.eraserProperties.eraserSize = size;
    this.eraserProperties.eraserSVG.setAttribute('width', String(this.eraserProperties.eraserSize));
  }
}
