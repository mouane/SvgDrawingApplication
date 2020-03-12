import { Component, OnInit } from '@angular/core';
import { UndoRedoService } from 'src/app/services/undo-redo/undo-redo.service';

@Component({
  selector: 'app-undo-redo-params',
  templateUrl: './undo-redo-params.component.html',
  styleUrls: ['./undo-redo-params.component.scss'],
})
export class UndoRedoParamsComponent implements OnInit {

  constructor(private undoRedo: UndoRedoService) { }

  undoOption = false;
  redoOption = false;

  ngOnInit() {
    this.undoRedo.updateRedo.subscribe((state: boolean) => {
      this.redoOption = state;
    });
    this.undoRedo.updateUndo.subscribe((state: boolean) => {
      this.undoOption = state;
    });
  }

  undo(): void {
    this.undoRedo.undo();
  }

  redo(): void {
    this.undoRedo.redo();
  }
}
