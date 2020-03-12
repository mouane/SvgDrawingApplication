import { ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injectable,
  Injector, Renderer2, RendererFactory2 } from '@angular/core';
import { AirBrushParamsComponent } from 'src/app/components/airbrush-params/airBrush-params.component';
import { BrushParamsComponent } from 'src/app/components/brush-params/brush-params.component';
import { EraserComponent } from 'src/app/components/eraser/eraser.component';
import { GridParamsComponent } from 'src/app/components/grid-params/grid-params.component';
import { LineParamsComponent } from 'src/app/components/line-params/line-params.component';
import { PaintBucketParamsComponent } from 'src/app/components/paint-bucket-params/paint-bucket-params.component';
import { PenToolParamsComponent } from 'src/app/components/pen-tool-params/pen-tool-params.component';
import { PencilParamsComponent } from 'src/app/components/pencil-params/pencil-params.component';
import { PipetteParamsComponent } from 'src/app/components/pipette-params/pipette-params.component';
import { QuillParamsComponent } from 'src/app/components/quill-params/quill-params/quill-params.component';
import { SelectionParamsComponent } from 'src/app/components/selection-params/selection-params.component';
import { ShapeParamsComponent } from 'src/app/components/shape-params/shape-params.component';
import { StampParamsComponent } from 'src/app/components/stamp-params/stamp-params.component';
import { TextParamsComponent } from 'src/app/components/text-params/text-params.component';
import { tools } from 'src/app/enum';
import { SelectToolProperties } from '../../classes/selectProperties/select-properties';
import { MouseControlService } from '../mouse-control/mouse-control.service';
@Injectable({
  providedIn: 'root',
})

export class SelectToolService {

  private renderer: Renderer2;
  constructor(private mouseCtrl: MouseControlService, rendererFactory: RendererFactory2,
              private componentFactoryResolver: ComponentFactoryResolver, private appRef: ApplicationRef,
              private injector: Injector, private selectProperties: SelectToolProperties,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initRefs();
  }

  initRefs(): void {
    this.selectProperties.eraserParams = this.setComponentRef(EraserComponent);
    this.selectProperties.stampParams = this.setComponentRef(StampParamsComponent);
    this.selectProperties.bucketParams = this.setComponentRef(PaintBucketParamsComponent);
    this.selectProperties.pipetteParams = this.setComponentRef(PipetteParamsComponent);
    this.selectProperties.gridParams = this.setComponentRef(GridParamsComponent);
    this.selectProperties.lineParams = this.setComponentRef(LineParamsComponent);
    this.selectProperties.airBrushParams = this.setComponentRef(AirBrushParamsComponent);
    this.selectProperties.brushParams = this.setComponentRef(BrushParamsComponent);
    this.selectProperties.pencilParams = this.setComponentRef(PencilParamsComponent);
    this.selectProperties.shapeParams = this.setComponentRef(ShapeParamsComponent);
    this.selectProperties.selectionParams = this.setComponentRef(SelectionParamsComponent);
    this.selectProperties.textParams = this.setComponentRef(TextParamsComponent);
    this.selectProperties.penParams = this.setComponentRef(PenToolParamsComponent);
    this.selectProperties.quillParams = this.setComponentRef(QuillParamsComponent);
  }
  setComponentRef(component: any): HTMLElement {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const ref = componentFactory.create(this.injector);
    this.appRef.attachView(ref.hostView);
    return (ref.hostView as EmbeddedViewRef<any>).rootNodes[0];
  }

  setToolsElement(element: HTMLElement): void {
    this.selectProperties.tools = element.firstChild as HTMLElement;
  }
  setParamsElement(element: HTMLElement): void {
    this.selectProperties.params = element.firstChild as HTMLElement;
  }

  grid(): void {
    this.clearParams();
    this.makeSelection(tools.GRID_SELECT);
    this.mouseCtrl.setChoice(tools.GRID);
    this.renderer.appendChild(this.selectProperties.params, this.selectProperties.gridParams);
  }
  select(): void {
    this.clearParams();
    this.makeSelection(tools.SELECT_SELECT);
    this.mouseCtrl.setChoice(tools.SELECT);
    this.renderer.appendChild(this.selectProperties.params, this.selectProperties.selectionParams);
  }
  erase(): void {
    this.clearParams();
    this.makeSelection(tools.ERASER);
    this.mouseCtrl.setChoice(tools.ERASER);
  }
  line(): void {
    this.clearParams();
    this.makeSelection(tools.LINE_SELECT);
    this.mouseCtrl.setChoice(tools.LINE);
    this.renderer.appendChild(this.selectProperties.params, this.selectProperties.lineParams);
  }

  airBrush(): void {
    this.clearParams();
    this.makeSelection(tools.AIR_BRUSH_SELECT);
    this.mouseCtrl.setChoice(tools.AIR_BRUSH);
    this.renderer.appendChild(this.selectProperties.params, this.selectProperties.airBrushParams);
  }
  pencil(): void {
    this.clearParams();
    this.makeSelection(tools.PENCIL_SELECT);
    this.mouseCtrl.setChoice(tools.PENCIL);
    this.renderer.appendChild(this.selectProperties.params, this.selectProperties.pencilParams);
  }

  pen(): void {
    this.clearParams();
    this.makeSelection(tools.PEN_SELECT);
    this.mouseCtrl.setChoice(tools.PEN);
    this.renderer.appendChild(this.selectProperties.params, this.selectProperties.penParams);
  }

  brush(): void {
    this.clearParams();
    this.makeSelection(tools.BRUSH_SELECT);
    this.mouseCtrl.setChoice(tools.BRUSH);
    this.renderer.appendChild(this.selectProperties.params, this.selectProperties.brushParams);
  }
  colorApplicator(): void {
    this.clearParams();
    this.makeSelection(tools.APPCOLOR_SELECT);
    this.mouseCtrl.setChoice(tools.APPCOLOR);
  }
  paintBucket(): void {
    this.clearParams();
    this.makeSelection(tools.BUCKET_SELECT);
    this.mouseCtrl.setChoice(tools.BUCKET);
    this.renderer.appendChild(this.selectProperties.params, this.selectProperties.bucketParams);
  }
  rectangle(): void {
    this.clearParams();
    this.makeSelection(tools.RECTANGLE_SELECT);
    this.mouseCtrl.setChoice(tools.RECTANGLE);
    this.renderer.appendChild(this.selectProperties.params, this.selectProperties.shapeParams);
  }
  pipette(): void {
    this.clearParams();
    this.makeSelection(tools.PIPETTE_SELECT);
    this.mouseCtrl.setChoice(tools.PIPETTE);
    this.renderer.appendChild(this.selectProperties.params, this.selectProperties.pipetteParams);
  }
  stamp(): void {
    this.clearParams();
    this.makeSelection(tools.STAMP_SELECT);
    this.mouseCtrl.setChoice(tools.STAMP);
    this.renderer.appendChild(this.selectProperties.params, this.selectProperties.stampParams);
  }
  text(): void {
    this.clearParams();
    this.makeSelection(tools.TEXTSELECT);
    this.mouseCtrl.setChoice(tools.TEXT);
    this.renderer.appendChild(this.selectProperties.params, this.selectProperties.textParams);
  }

  eraser(): void {
    this.clearParams();
    this.makeSelection(tools.ERASER);
    this.mouseCtrl.setChoice(tools.ERASER);
    this.renderer.appendChild(this.selectProperties.params, this.selectProperties.eraserParams);
  }

  quill(): void {
    this.clearParams();
    this.makeSelection(tools.QUILL_SELECT);
    this.mouseCtrl.setChoice(tools.QUILL);
    this.renderer.appendChild(this.selectProperties.params, this.selectProperties.quillParams);
  }

  nothing(): void {
    this.clearParams();
    this.makeSelection('');
    this.mouseCtrl.setChoice('');
  }

  clearParams(): void {
    this.selectProperties.params.childNodes.forEach((child) => {
      if (!(child as HTMLElement).classList.contains('keep')) {
        this.renderer.removeChild(this.selectProperties.params, child);
      }
    });
  }

  clearSelection(): void {
    this.selectProperties.tools.childNodes.forEach((child) => {
      this.renderer.removeClass(child, 'option');
    });
  }
  makeSelection(toSelect: string): void {
    this.clearSelection();
    this.selectProperties.tools.childNodes.forEach((child) => {
      if ((child as HTMLElement).classList.contains(toSelect)) {
        this.renderer.addClass(child, 'option');
      }
    });
  }

}
