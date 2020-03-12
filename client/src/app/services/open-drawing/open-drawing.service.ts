import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { OpenDrawingProperties } from 'src/app/classes/openDrawingProperties/open-drawing-properties';
import { Drawing } from '../../../../../common/communication/drawing';
import { MouseControlService } from '../mouse-control/mouse-control.service';

@Injectable({
  providedIn: 'root',
})
export class OpenDrawingService {
  openDrawingListener: Subject <Event> = new Subject<Event>();
  selectedDrawing: Drawing;
  constructor(public http: HttpClient, private mouseServ: MouseControlService, private properties: OpenDrawingProperties) { }

  getDrawingData() {
    return this.http.get('http://localhost:3000/api/index/getDrawings');
   }

  setSpecificDrawing( drawing: Drawing): void {
    this.selectedDrawing = drawing;
  }

  getTheSelectedDrawing(): Drawing {
    return this.selectedDrawing;
  }

  listenToOpen(): Observable<Event> {
     return this.openDrawingListener.asObservable();
   }

  clickOpen() {
    return this.openDrawingListener.next();
  }

  loadDrawingCaller(selectedDrawing: Drawing): void {
    this.properties.theSelectedDrawing = selectedDrawing;
  }

  loadDrawing(): void {
    if (this.mouseServ.drawingContainsElement) {
      if (confirm('Etes-vous sur de vouloir abandonner le dessin courant')) {
        this.setSpecificDrawing(this.properties.theSelectedDrawing);
        this.clickOpen();
      }
    } else {
      this.setSpecificDrawing(this.properties.theSelectedDrawing);
      this.clickOpen();
    }
  }

  errorFound(errorFound: boolean): void {
    this.properties.errorFound = errorFound;
  }

  getErrorFound(): boolean {
    return this.properties.errorFound;
  }
}
