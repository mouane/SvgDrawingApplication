import { EventEmitter, Injectable, Output, Renderer2, RendererFactory2 } from '@angular/core';
import { SvgSelectorProperties } from 'src/app/classes/svgSelectorProperties/svg-properties';
import { GROUP, SHAPES, SIDEBAR, SVGSELECT } from '../../enum';
import { MovingObjectService } from '../moving-object/moving-object.service';
import { ResizeSvgService } from '../resize-svg/resize-svg.service';
import { ScrollDrawingService } from '../scroll-drawing/scroll-drawing.service';
@Injectable({
  providedIn: 'root',
})

export class SvgSelectorToolService {
  private renderer: Renderer2;
  @Output() selection: EventEmitter<Node[]> = new EventEmitter();

  constructor(rendererFactory: RendererFactory2, private resizeSvg: ResizeSvgService,
              private scrollDrawing: ScrollDrawingService, private properties: SvgSelectorProperties,
              private moveObject: MovingObjectService) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setIsRendering(isRendering: boolean): void {
    this.properties.isRendering = isRendering;
  }

  mousePosition($event: MouseEvent, xPos: number, yPos: number): number[] {
    xPos = $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX;
    yPos = $event.clientY + this.scrollDrawing.ScrollY;

    return [xPos, yPos];
  }

  setUpSelection($event: MouseEvent, mouseSide: string): void {
    this.properties.eventY = 0;
    this.properties.eventX = 0;
    this.selectOnSvgElements($event, mouseSide);
    const position = this.mousePosition($event, this.properties.x1, this.properties.y1);
    this.properties.x1 = position[0];
    this.properties.y1 = position[1];
    this.setRectangleSelection();
  }

  leftMouseDown($event: MouseEvent): void {
    let currentClass: string;
    ( ($event.target as HTMLElement).classList !== undefined) ?  currentClass = ($event.target as HTMLElement).classList[0] : currentClass = '';
    const inside = this.insideSelectBox($event);
    // tslint:disable-next-line: deprecation
    if (currentClass !== 'ctrl' && $event.which === 1 && !inside) {
      this.setUpSelection($event, 'left');
      this.resetSelectBox();
      this.resetSelectedElements('selctedChilds', true);
      this.insertOrder();
      this.properties.alreadyClicked = true;
    } else if (currentClass === 'ctrl' && $event.target !== null) {
      this.properties.isResize = true;
      this.resizeSvg.initResizing($event, this.properties.selectBox);
    } else if (inside) {
      this.properties.alreadyClicked = true;
      this.moveObject.setObjects(this.properties.selctedChilds, $event);
      this.properties.isObjectMove = true;
    }
  }

  insideSelectBox( event: MouseEvent): boolean {
    let inside = false;
    if (this.properties.multipleSelectionX) {
      const maxX = this.properties.multipleSelectionX.length;
      const maxY = this.properties.multipleSelectionY.length;
      (this.properties.multipleSelectionX[0] <  event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX
      && this.properties.multipleSelectionX[maxX - 1] >  event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX
      && this.properties.multipleSelectionY[0] <  event.clientY + this.scrollDrawing.ScrollY
      && this.properties.multipleSelectionY[maxY - 1] >  event.clientY + this.scrollDrawing.ScrollY) ? inside = true : inside = false;
    }
    return inside;
  }

  insertOrder(): void {
    if (this.renderer != null) {
      this.renderer.insertBefore(this.properties.parent, this.properties.rectangle, this.properties.parent.lastChild);
      this.properties.childs = this.properties.parent.childNodes;
    }
  }

  resetSelectBox(): void {
    if ((this.properties.parent) && this.properties.parent.contains(this.properties.selectBox)) {
      this.renderer.removeChild(this.properties.parent, this.properties.selectBox);
      this.removeControlPoints();
    }
  }

  resetSelectedElements(childSelected: string, selctedChilds: boolean): void {
    if (childSelected === 'rightSelctedChilds') {
      this.properties.rightSelctedChilds = [];
    } else {
      this.properties.multipleSelectionX = [];
      this.properties.multipleSelectionY = [];
      if (selctedChilds) {
        this.properties.selctedChilds = [];
        this.selection.emit(this.properties.selctedChilds);
      }
    }
  }

  selectOnSvgElements($event: MouseEvent, mouseSide: string): void {
    this.properties.parent = ($event.target as SVGElement);
    if (this.properties.parent.nodeName !== 'svg') {
      if (this.properties.parent.nodeName === 'tspan') {
        this.properties.parent = (($event.target as SVGElement).parentNode as SVGElement);
        if (this.properties.parent.parentElement !== null) {
          (this.properties.parent as unknown as HTMLElement) = this.properties.parent.parentElement;
        }
      } else if ((this.properties.parent.parentNode as SVGAElement).nodeName === GROUP.GROUP_EL) {
        this.properties.parent = (($event.target as SVGElement).parentNode as SVGElement).parentNode as SVGElement;
      } else {
        this.properties.parent = (($event.target as SVGElement).parentNode as SVGElement);
      }

      if (mouseSide === 'left') {
        const eventPosition = this.mousePosition($event, this.properties.eventX, this.properties.eventY);
        this.properties.eventX = eventPosition[0];
        this.properties.eventY = eventPosition[1];
      }
    }
  }

  setRectangleSelection(): void {
    this.setIsRendering(true);
    this.properties.rectangle = this.renderer.createElement(SHAPES.RECT, SHAPES.LINK_SVG);
    this.renderer.setAttribute(this.properties.rectangle, 'id', 'selector');
    this.renderer.addClass(this.properties.rectangle, 'selector');
    this.properties.rectangle.setAttribute('stroke', '#4d4d4d');
    this.properties.rectangle.setAttribute('stroke-width', '1.3');
    this.properties.rectangle.setAttribute('stroke-dasharray', '6');
    this.properties.rectangle.setAttribute('fill-opacity', '0');

  }

  getSelectedObject(): SVGElement {

    return this.properties.rectangle;
  }
  findCoordinates(child: any): void {
    this.properties.childX1 = child.x + this.scrollDrawing.ScrollX - SIDEBAR.sideBarWidth - SIDEBAR.BOUNDING_RECT_X_OFFSET ;
    this.properties.childX2 = child.x + child.width + this.scrollDrawing.ScrollX - SIDEBAR.sideBarWidth - SIDEBAR.BOUNDING_RECT_X_OFFSET;
    this.properties.childY1 = child.y + this.scrollDrawing.ScrollY - SIDEBAR.BOUNDING_RECT_Y_OFFSET;
    this.properties.childY2 = child.y + child.height + this.scrollDrawing.ScrollY - SIDEBAR.BOUNDING_RECT_Y_OFFSET;
  }

  includechild(): void {
    for (const child in this.properties.childs) {
      if (this.boxElement(child)) {
        const currentChild = (this.properties.childs[child] as SVGAElement);
        const bbox = currentChild.getBoundingClientRect();
        this.findCoordinates(bbox);

        if (this.verifyCoordinates()) {
            if (!this.properties.selctedChilds.includes(this.properties.childs[child])) {
              this.properties.selctedChilds.push(this.properties.childs[child]);
            }
          } else if (this.properties.selctedChilds.includes(this.properties.childs[child])) {
            const index: number = this.properties.selctedChilds.indexOf(this.properties.childs[child]);
            if (index !== -1) {
              this.properties.selctedChilds.splice(index, 1);
            }
          }
      }
    }
  }

  boxElement(child: string): boolean {
    const childs: number = parseInt(child, 10);
    return (this.properties.childs[childs] instanceof Node && (this.properties.childs[childs] as HTMLElement).id !== 'selector'
      && (this.properties.childs[childs] as HTMLElement).classList[0] !== 'ctrl'
      && (this.properties.childs[childs] as HTMLElement).id !== 'box'
      && (this.properties.childs[childs] as HTMLElement).nodeName !== 'filter' &&
      (this.properties.childs[childs] as HTMLElement).nodeName !== 'pattern'
      && (this.properties.childs[childs] as HTMLElement).id !== 'grid');
  }

  verifyCoordinates(): boolean {
    return ((this.properties.childX1 <= this.properties.x2 && this.properties.childX2 >= this.properties.x1 && this.properties.fakeW > 0) ||
      (this.properties.childX1 <= this.properties.x1 && this.properties.childX2 >= this.properties.x2 && this.properties.fakeW < 0)) &&
      ((this.properties.childY1 <= this.properties.y2 && this.properties.childY2 >= this.properties.y1 && this.properties.fakeH > 0) ||
        (this.properties.childY1 <= this.properties.y1 && this.properties.childY2 >= this.properties.y2 && this.properties.fakeH < 0));
  }

  leftMouseMove($event: MouseEvent): void {
    // tslint:disable-next-line: deprecation
    if ($event.which === 1) {
      this.setFakeDimensions($event);

      if (this.properties.isResize) {
        this.resizeSvg.mouseMove($event, this.properties.selctedChilds);
        this.updateSelectBox();
      } else if (this.properties.isObjectMove) {
        this.moveObject.move($event);
        this.updateSelectBox();
        this.properties.alreadyClicked = false;

      }

      if (this.properties.isRendering) {
        this.updateRect();
        this.includechild();
        this.updateSelectBox();
      }
    }
  }

  initControlPoints(ctrl: SVGElement): void {
    this.renderer.setAttribute(ctrl, 'rx', '6');
    this.renderer.setAttribute(ctrl, 'ry', '6');
    this.renderer.setAttribute(ctrl, 'stroke-width', '2');
    this.renderer.setStyle(ctrl, 'stroke', 'blue');
    this.renderer.setStyle(ctrl, 'fill', '#b3d9ff');
    this.renderer.setStyle(ctrl, 'cursor', 'pointer');
    this.renderer.addClass(ctrl, 'ctrl');
    this.renderer.setAttribute(ctrl, 'id', 'selector');
  }

  removeControlPoints(): void {
    this.renderer.removeChild(this.properties.parent, this.properties.topLeftCtrl);
    this.renderer.removeChild(this.properties.parent, this.properties.topCenterCtrl);
    this.renderer.removeChild(this.properties.parent, this.properties.topRightCtrl);
    this.renderer.removeChild(this.properties.parent, this.properties.centerRightCtrl);
    this.renderer.removeChild(this.properties.parent, this.properties.centerLeftCtrl);
    this.renderer.removeChild(this.properties.parent, this.properties.bottomLeftCtrl);
    this.renderer.removeChild(this.properties.parent, this.properties.bottomCenterCtrl);
    this.renderer.removeChild(this.properties.parent, this.properties.bottomRightCtrl);
    this.properties.selected = false;
  }

  createEllipseCtrl(): void {
    this.properties.topLeftCtrl = this.renderer.createElement(SHAPES.ELLIPSE, SHAPES.LINK_SVG);
    this.properties.topCenterCtrl = this.renderer.createElement(SHAPES.ELLIPSE, SHAPES.LINK_SVG);
    this.properties.topRightCtrl = this.renderer.createElement(SHAPES.ELLIPSE, SHAPES.LINK_SVG);
    this.properties.centerLeftCtrl = this.renderer.createElement(SHAPES.ELLIPSE, SHAPES.LINK_SVG);
    this.properties.centerRightCtrl = this.renderer.createElement(SHAPES.ELLIPSE, SHAPES.LINK_SVG);
    this.properties.bottomLeftCtrl = this.renderer.createElement(SHAPES.ELLIPSE, SHAPES.LINK_SVG);
    this.properties.bottomCenterCtrl = this.renderer.createElement(SHAPES.ELLIPSE, SHAPES.LINK_SVG);
    this.properties.bottomRightCtrl = this.renderer.createElement(SHAPES.ELLIPSE, SHAPES.LINK_SVG);
  }

  initAllControlPoints(): void {
    this.initControlPoints(this.properties.topLeftCtrl);
    this.initControlPoints(this.properties.topCenterCtrl);
    this.initControlPoints(this.properties.topRightCtrl);
    this.initControlPoints(this.properties.centerLeftCtrl);
    this.initControlPoints(this.properties.centerRightCtrl);
    this.initControlPoints(this.properties.bottomLeftCtrl);
    this.initControlPoints(this.properties.bottomCenterCtrl);
    this.initControlPoints(this.properties.bottomRightCtrl);
  }

  setDimension(): void {
    const hRight: string = '' + (Number(this.properties.selectBox.getAttribute('x')) +
    (Number(this.properties.selectBox.getAttribute('width'))));
    const hCenter: string = '' + (Number(this.properties.selectBox.getAttribute('x')) +
    (Number(this.properties.selectBox.getAttribute('width')) / 2));
    const hLeft: string = '' + this.properties.selectBox.getAttribute('x');
    const vTop: string = '' + this.properties.selectBox.getAttribute('y');
    const vCenter: string = '' + (Number(this.properties.selectBox.getAttribute('y')) +
    (Number(this.properties.selectBox.getAttribute('height')) / 2));
    const vbottom: string = '' + (Number(this.properties.selectBox.getAttribute('y')) +
    (Number(this.properties.selectBox.getAttribute('height'))));

    this.setCtrlAttributes(hRight, hCenter, hLeft, vTop, vCenter, vbottom);
  }

  setCtrlAttributes(hRight: string, hCenter: string, hLeft: string, vTop: string, vCenter: string, vbottom: string): void {
    this.renderer.setAttribute(this.properties.topLeftCtrl, 'cx', hLeft);
    this.renderer.setAttribute(this.properties.topLeftCtrl, 'cy', vTop);
    this.renderer.setAttribute(this.properties.topLeftCtrl, 'id', 'topLeft');

    this.renderer.setAttribute(this.properties.topCenterCtrl, 'cx', hCenter);
    this.renderer.setAttribute(this.properties.topCenterCtrl, 'cy', vTop);
    this.renderer.setAttribute(this.properties.topCenterCtrl, 'id', 'topCenter');

    this.renderer.setAttribute(this.properties.topRightCtrl, 'cx', hRight);
    this.renderer.setAttribute(this.properties.topRightCtrl, 'cy', vTop);
    this.renderer.setAttribute(this.properties.topRightCtrl, 'id', 'topRight');

    this.renderer.setAttribute(this.properties.centerLeftCtrl, 'cx', hLeft);
    this.renderer.setAttribute(this.properties.centerLeftCtrl, 'cy', vCenter);
    this.renderer.setAttribute(this.properties.centerLeftCtrl, 'id', 'centerLeft');

    this.renderer.setAttribute(this.properties.centerRightCtrl, 'cx', hRight);
    this.renderer.setAttribute(this.properties.centerRightCtrl, 'cy', vCenter);
    this.renderer.setAttribute(this.properties.centerRightCtrl, 'id', 'centerRight');

    this.renderer.setAttribute(this.properties.bottomRightCtrl, 'cx', hRight);
    this.renderer.setAttribute(this.properties.bottomRightCtrl, 'cy', vbottom);
    this.renderer.setAttribute(this.properties.bottomRightCtrl, 'id', 'bottomRight');

    this.renderer.setAttribute(this.properties.bottomCenterCtrl, 'cx', hCenter);
    this.renderer.setAttribute(this.properties.bottomCenterCtrl, 'cy', vbottom);
    this.renderer.setAttribute(this.properties.bottomCenterCtrl, 'id', 'bottomCenter');

    this.renderer.setAttribute(this.properties.bottomLeftCtrl, 'cx', hLeft);
    this.renderer.setAttribute(this.properties.bottomLeftCtrl, 'cy', vbottom);
    this.renderer.setAttribute(this.properties.bottomLeftCtrl, 'id', 'bottomLeft');
  }

  insertCtrlOrder(): void {
    this.renderer.insertBefore(this.properties.parent, this.properties.topLeftCtrl, this.properties.parent.lastChild);
    this.renderer.insertBefore(this.properties.parent, this.properties.topCenterCtrl, this.properties.parent.lastChild);
    this.renderer.insertBefore(this.properties.parent, this.properties.topRightCtrl, this.properties.parent.lastChild);
    this.renderer.insertBefore(this.properties.parent, this.properties.centerRightCtrl, this.properties.parent.lastChild);
    this.renderer.insertBefore(this.properties.parent, this.properties.centerLeftCtrl, this.properties.parent.lastChild);
    this.renderer.insertBefore(this.properties.parent, this.properties.bottomLeftCtrl, this.properties.parent.lastChild);
    this.renderer.insertBefore(this.properties.parent, this.properties.bottomCenterCtrl, this.properties.parent.lastChild);
    this.renderer.insertBefore(this.properties.parent, this.properties.bottomRightCtrl, this.properties.parent.lastChild);
  }

  appendControlPoints(): void {
    if (this.properties.selected) {
      this.removeControlPoints();
    }
    this.createEllipseCtrl();
    this.initAllControlPoints();
    this.setDimension();
    this.insertCtrlOrder();

    this.properties.selected = true;
  }

  setSelectBox(): void {
    this.properties.selectBox = this.renderer.createElement(SHAPES.RECT, SHAPES.LINK_SVG);
    this.properties.selectBox.setAttribute('stroke-width', '3px');
    this.properties.selectBox.setAttribute('stroke', 'blue');
    this.renderer.addClass(this.properties.selectBox, 'selector');
    this.renderer.setAttribute(this.properties.selectBox, 'id', 'box');
    this.renderer.setStyle(this.properties.selectBox, 'pointer-events', 'none');
    this.properties.selectBox.setAttribute('fill-opacity', '0');
  }

  updateSelectBox(): void {
    this.resetSelectBox();
    if (this.properties.selctedChilds.length !== 0) {
      this.setSelectBox();
      this.renderer.insertBefore(this.properties.parent, this.properties.selectBox, this.properties.parent.lastChild);

      this.resetSelectedElements('selctedChilds', false);

      for (const selChild in this.properties.selctedChilds) {
        if (this.properties.selctedChilds[selChild] instanceof Node) {
          const bbox = (this.properties.selctedChilds[selChild] as SVGAElement).getBoundingClientRect();
          this.findCoordinates(bbox);
          if (this.properties.childX2 !== 0 && this.properties.childY2 !== 0) {
            this.properties.multipleSelectionX.push(this.properties.childX1, this.properties.childX2);
            this.properties.multipleSelectionY.push(this.properties.childY1, this.properties.childY2);
          }
        }
      }

      this.properties.multipleSelectionX.sort(this.sortByNumber);
      this.properties.multipleSelectionY.sort(this.sortByNumber);
      this.properties.fakeW = (this.properties.multipleSelectionX[this.properties.multipleSelectionX.length - 1] -
        this.properties.multipleSelectionX[0]);
      this.properties.fakeH = (this.properties.multipleSelectionY[this.properties.multipleSelectionY.length - 1] -
        this.properties.multipleSelectionY[0]);
      if (this.properties.multipleSelectionX[0] - SVGSELECT.POSITION_OFFSET > 0) {
        this.properties.selectBox.setAttribute('x', (this.properties.multipleSelectionX[0] - SVGSELECT.POSITION_OFFSET).toString());
      } else {
        this.properties.selectBox.setAttribute('x', (this.properties.multipleSelectionX[0]).toString());
      }
      if (this.properties.multipleSelectionY[0] - SVGSELECT.POSITION_OFFSET > 0) {
        this.properties.selectBox.setAttribute('y', (this.properties.multipleSelectionY[0] - SVGSELECT.POSITION_OFFSET).toString());
      } else {
        this.properties.selectBox.setAttribute('y', (this.properties.multipleSelectionY[0]).toString());
      }
      this.properties.selectBox.setAttribute('width', Math.abs(this.properties.fakeW + SVGSELECT.DIMENSION_OFFSET).toString());
      this.properties.selectBox.setAttribute('height', Math.abs(this.properties.fakeH + SVGSELECT.DIMENSION_OFFSET).toString());
      this.selection.emit(this.properties.selctedChilds);
      this.appendControlPoints();

    }
  }

  updateRect(): void {
    if (this.properties.isRendering) {
      if (((this.properties.fakeW > 0) && (this.properties.fakeH > 0))) {
        this.properties.rectangle.setAttribute('x', (this.properties.x1).toString());
        this.properties.rectangle.setAttribute('y', (this.properties.y1).toString());
      } else if ((this.properties.fakeW > 0) && (this.properties.fakeH < 0)) {
        this.properties.rectangle.setAttribute('x', (this.properties.x1).toString());
        this.properties.rectangle.setAttribute('y', (this.properties.y2).toString());

      } else if ((this.properties.fakeW < 0) && (this.properties.fakeH > 0)) {
        this.properties.rectangle.setAttribute('x', (this.properties.x2).toString());
        this.properties.rectangle.setAttribute('y', (this.properties.y1).toString());

      } else {
        this.properties.rectangle.setAttribute('x', (this.properties.x2).toString());
        this.properties.rectangle.setAttribute('y', (this.properties.y2).toString());

      }
      this.properties.rectangle.setAttribute('width', Math.abs(this.properties.fakeW).toString());
      this.properties.rectangle.setAttribute('height', Math.abs(this.properties.fakeH).toString());
    }
  }

  mouseUp($event: MouseEvent): void {
    if (this.properties.isResize) {
      this.properties.isResize = false;
    }
    if (this.properties.isObjectMove) {
      this.properties.isObjectMove = false;
      if (this.properties.alreadyClicked) {
        this.resetSelectBox();
        this.resetSelectedElements('selctedChilds', true);
        this.properties.alreadyClicked = false;
      }
    }
    if (this.properties.isRendering) {
      this.setIsRendering(false);
      if (this.properties.parent.contains(this.properties.rectangle)) {
        this.renderer.removeChild(this.properties.parent, this.properties.rectangle);
      }
      if (this.properties.selctedChilds.length === 0
        && $event.clientX - SIDEBAR.sideBarWidth + this.scrollDrawing.ScrollX === this.properties.eventX
        && $event.clientY + this.scrollDrawing.ScrollY === this.properties.eventY
        && $event.target as SVGElement) {
        if (($event.target as SVGElement).nodeName === 'tspan' ||
          (($event.target as SVGElement).parentNode as SVGElement).nodeName === 'g' ) {
          this.properties.selctedChilds.push((($event.target as SVGElement).parentNode as SVGElement));
        } else {
        this.properties.selctedChilds.push($event.target as SVGElement);
        }
      }
      this.updateSelectBox();
    }
  }

  sortByNumber(a: number, b: number): number {
    return a - b;
  }

  rightMouseDown($event: MouseEvent): void {
    // tslint:disable-next-line: deprecation
    if ($event.which === 3) {
      this.setUpSelection($event, 'right');
      this.resetSelectedElements('rightSelctedChilds', false);
      this.insertOrder();
      if (($event.target as SVGElement).nodeName !== 'svg' && ($event.target as SVGElement).classList[0] !== 'ctrl') {
        this.switchSelection(($event.target as SVGElement));
      }
    }
  }

  switchSelection(child: SVGElement): void {
    if (!this.properties.rightSelctedChilds.includes(child)) {
      this.properties.rightSelctedChilds.push(child);
      if (this.properties.selctedChilds.includes(child)) {
        const index: number = this.properties.selctedChilds.indexOf(child);
        if (index !== -1) {
          this.properties.selctedChilds.splice(index, 1);
        }
      } else {
        if (child.nodeName === 'tspan' || (child.parentNode as SVGElement).nodeName === 'g' ) {
          this.properties.selctedChilds.push(((child).parentNode as SVGElement));
        } else {
        this.properties.selctedChilds.push(child);
        }
      }
      this.updateSelectBox();
    }
  }

  setFakeDimensions($event: MouseEvent): void {
    const position = this.mousePosition($event, this.properties.x2, this.properties.y2);
    this.properties.x2 = position[0];
    this.properties.y2 = position[1];
    this.properties.fakeW = this.properties.x2 - this.properties.x1;
    this.properties.fakeH = this.properties.y2 - this.properties.y1;
  }

  rightMouseMove($event: MouseEvent): void {
    // tslint:disable-next-line: deprecation
    if ($event.which === 3) {
      this.setFakeDimensions($event);
      this.updateRect();
      for (const child in this.properties.childs) {
        if (this.boxElement(child)) {
          const currentChild = (this.properties.childs[child] as SVGAElement);
          const bbox = currentChild.getBBox();
          if (bbox.height > 0 && bbox.width > 0) {
            this.findCoordinates(currentChild.getBoundingClientRect());
            if (this.verifyCoordinates()) {
              this.switchSelection(currentChild);
            } else if (this.properties.rightSelctedChilds.includes(currentChild) && !this.properties.selctedChilds.includes(currentChild)) {
              const index: number = this.properties.rightSelctedChilds.indexOf(currentChild);
              if (index !== -1) {
                this.properties.rightSelctedChilds.splice(index, 1);
              }
              this.properties.selctedChilds.push(currentChild);
              this.updateSelectBox();
            } else if (this.properties.rightSelctedChilds.includes(currentChild) &&
              this.properties.selctedChilds.includes(currentChild)) {
              let index: number = this.properties.rightSelctedChilds.indexOf(currentChild);
              if (index !== -1) {
                this.properties.rightSelctedChilds.splice(index, 1);
              }
              index = this.properties.selctedChilds.indexOf(currentChild);
              if (index !== -1) {
                this.properties.selctedChilds.splice(index, 1);
              }
              this.updateSelectBox();
            }
          }
        }
      }
    }
  }
}
