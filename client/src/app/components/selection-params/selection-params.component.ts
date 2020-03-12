import { Component, OnInit, Renderer2, RendererFactory2} from '@angular/core';
import { Subscription } from 'rxjs';
import { SvgSelectorProperties } from 'src/app/classes/svgSelectorProperties/svg-properties';
import { UndoRedoProperties } from 'src/app/classes/undoRedoProperties/undo-redo-properties';
import { CopyPasteProperties } from '../../classes/copyPaste-properties/copy-paste-properties';
import { COPYPASTE} from '../../enum';
import { CopyPasteService } from '../../services/copy-paste/copy-paste.service';
import { MagnetismService } from '../../services/magnetism/magnetism.service';
import { MouseControlService } from '../../services/mouse-control/mouse-control.service';
import { MovingObjectService } from '../../services/moving-object/moving-object.service';
import { SvgSelectorToolService } from '../../services/svg-selector-tool/svg-selector-tool.service';
import { UndoRedoService } from '../../services/undo-redo/undo-redo.service';
@Component({
  selector: 'app-selection-params',
  templateUrl: './selection-params.component.html',
  styleUrls: ['./selection-params.component.scss'],
})
export class SelectionParamsComponent implements OnInit {
  private renderer: Renderer2;
  drawingViewSub: Subscription;
  magnetActive: boolean;
  lastClicked: HTMLElement;
  fakeMouseClick: MouseEvent;
  activatedMagnet: boolean;
  constructor( rendererFactory: RendererFactory2, private svgSelector: SvgSelectorToolService,
               private mouseCtrl: MouseControlService, private properties: SvgSelectorProperties,
               private copyPaste: CopyPasteService, private copyPasteProperties: CopyPasteProperties,
               private undoRedo: UndoRedoService, private undoRedoProperties: UndoRedoProperties,
               private magnetism: MagnetismService, private movingService: MovingObjectService) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.activatedMagnet = false;
    this.magnetActive = false;
  }

  ngOnInit() {
   this.drawingViewSub = this.mouseCtrl.view.subscribe((view: SVGElement) => {
     this.drawingViewSubscription(view);
    });
   this.undoRedo.updateCopyPasteParams.subscribe((view: SVGElement) => {
     this.drawingViewSubscription(view);
    });
   this.svgSelector.selection.subscribe((childs: NodeListOf<Node>) => {
      this.copyPasteProperties.selected = childs;
      if (childs.length > 0 && this.copyPasteProperties.selectAll) {
        this.copyPasteProperties.enable = true;
      } else {
        this.copyPasteProperties.enable = false;
      }
    });
  }

  drawingViewSubscription(view: SVGElement): void {
    this.copyPasteProperties.drawingView = view;
    if (this.checkIfChildExists(this.copyPasteProperties.drawingView)) {
      this.copyPasteProperties.selectAll = true;
    } else if (this.copyPasteProperties.clipboard.length > 0) {
     this.copyPasteProperties.selectAll = false;
     this.copyPasteProperties.enable = false;
     this.copyPasteProperties.copy = true;
    } else {
      this.copyPasteProperties.selectAll = false;
      this.copyPasteProperties.enable = false;
      this.copyPasteProperties.copy = false;
    }
  }
  checkIfChildExists(drawingView: SVGElement): boolean {
    this.copyPasteProperties.selectAll = false;
    drawingView.childNodes.forEach((child) => {
      if (this.copyPaste.filteringChilds(child) && (child as HTMLElement).id !== 'selector' &&
       ((child as SVGElement).getAttribute('stroke') !== null || (child as SVGElement).nodeName === 'g')
       || (child as SVGElement).nodeName === 'image') {
        this.copyPasteProperties.selectAll = true;
      }
    });
    return this.copyPasteProperties.selectAll;
  }
  setCutTool(): void {
    this.copyPasteProperties.copy = true;
    this.setCopyTool();
    this.copyPasteProperties.clipboard.forEach((i) => { this.copyPasteProperties.drawingView.removeChild(i); });
    this.removeSelectionBox();
    this.mouseCtrl.mouseDown(this.fakeMouseClick, this.copyPasteProperties.drawingView);
    this.undoRedo.childNodesChange(this.copyPasteProperties.drawingView);
  }

  setCopyTool(): void {
    this.svgSelector.selection.subscribe((childs: NodeListOf<Node>) => {
      this.copyPasteProperties.selected = childs;
    });
    this.copyPasteProperties.copy = true;
    this.copyPasteProperties.clipboard = [];
    this.copySelected(COPYPASTE.COPY);
    this.mouseCtrl.mouseDown(this.fakeMouseClick, this.copyPasteProperties.drawingView);
  }
  pasteSelected( tool: string, clip: Node[], temp: Node[]): void {
    this.copyPasteProperties.maxX = Number(this.copyPasteProperties.drawingView.getAttribute('width'));
    this.copyPasteProperties.maxY = Number(this.copyPasteProperties.drawingView.getAttribute('height'));
    this.copyPaste.pasteTool(tool, clip, temp, this.renderer);
    this.undoRedo.childNodesChange(this.copyPasteProperties.drawingView);

  }
  copySelected( tool: string): void {
    this.copyPaste.copyTool( tool);
  }
  setDuplicateTool(): void {
    this.copyPasteProperties.duplicate = [];
    this.copySelected(COPYPASTE.DUPLICATE);
    this.pasteSelected(COPYPASTE.DUPLICATE, this.copyPasteProperties.duplicate, this.copyPasteProperties.tempDuplicate);
    this.copyPasteProperties.duplicate = this.copyPasteProperties.tempDuplicate;
    this.copyPasteProperties.tempDuplicate = [];
    this.removeSelectionBox();
  }
  setDeleteTool(): void {
    this.copyPasteProperties.delete = [];
    this.copySelected(COPYPASTE.DELETE);
    this.copyPasteProperties.delete.forEach((i) => { this.copyPasteProperties.drawingView.removeChild(i); });
    this.removeSelectionBox();
    this.undoRedoProperties.onChange = true;
    this.mouseCtrl.mouseDown(this.fakeMouseClick, this.copyPasteProperties.drawingView);
    this.undoRedo.childNodesChange(this.copyPasteProperties.drawingView);
  }
  setPasteTool(): void {
    this.pasteSelected(COPYPASTE.PASTE, this.copyPasteProperties.clipboard, this.copyPasteProperties.tempClipboard);
    this.copyPasteProperties.clipboard = this.copyPasteProperties.tempClipboard;
    this.copyPasteProperties.tempClipboard = [];
    this.removeSelectionBox();
    this.mouseCtrl.mouseDown(this.fakeMouseClick, this.copyPasteProperties.drawingView);
  }
  setSelectAllTool(): void {
    this.svgSelector.selection.subscribe((childs: NodeListOf<Node>) => {
      this.copyPasteProperties.selected = childs;
      if (childs.length !== 0) {
        this.copyPasteProperties.enable = true;
      } else {
        if (!this.copyPasteProperties.copy) {
          this.copyPasteProperties.enable = false;
        }
      }
    });
    this.properties.selctedChilds = [];
    this.copyPaste.selectAllTool();
  }
  removeSelectionBox(): void {
    if (this.copyPasteProperties.toDelete.length !== 0) {
      this.svgSelector.removeControlPoints();
      this.copyPasteProperties.drawingView.removeChild(this.copyPasteProperties.toDelete[0]);
      this.copyPasteProperties.toDelete = [];
    }
  }
  activateAnchor($event: MouseEvent): void {
    this.copyPasteProperties.trans = 0.2;
    if (this.lastClicked) {
      this.lastClicked.setAttribute('style', 'opacity:20%;');
    }
    this.lastClicked = (($event.target) as HTMLElement).parentElement as HTMLElement;
    this.lastClicked.setAttribute('style', 'opacity:100%;');
    this.magnetism.setAnchor(this.lastClicked.id);
  }
  onMagnetActivate(): void {
    this.magnetActive = !this.magnetActive;
    this.movingService.magnet = this.magnetActive;
  }
}
