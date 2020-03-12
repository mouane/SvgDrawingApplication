import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeleteDrawingService {

  constructor(public http: HttpClient) { }

  deleteDrawing(drawingId: string) {
    return this.http.get('http://localhost:3000/api/index/deleteDrawing/' + drawingId );
  }

}
