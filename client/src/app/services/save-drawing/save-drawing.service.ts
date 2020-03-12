import { HttpClient } from '@angular/common/http';
import { Injectable, Renderer2 } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { SaveDrawingProperties } from 'src/app/classes/saveDrawingProperties/save-drawing-properties';
import { Drawing } from '../../../../../common/communication/drawing';

@Injectable({
  providedIn: 'root',
})
export class SaveDrawingService {
  private renderer: Renderer2;
  constructor(public http: HttpClient,
              private saveDrawingProperties: SaveDrawingProperties,
              private firebaseStorage: AngularFireStorage ) { }

  formattingSvgDrawing(): void {
      this.saveDrawingProperties.svg = this.getSVGElement();
      this.saveDrawingProperties.savedSvg = [];
      this.saveDrawingProperties.childs = this.saveDrawingProperties.svg.childNodes;
      for (const child in this.saveDrawingProperties.childs) {
        if ((this.saveDrawingProperties.childs[child] as HTMLElement).nodeName !== 'filter' &&
         (this.saveDrawingProperties.childs[child] as HTMLElement).nodeName !== 'pattern'   &&
         this.saveDrawingProperties.childs[child] instanceof Node) {
           this.saveDrawingProperties.savedSvg.push((this.saveDrawingProperties.childs[child] as SVGElement).outerHTML);
         }
      }
  }

  getSVGElement(): SVGElement {
    const svg = this.renderer.selectRootElement('#drawing', true);
    return svg;
  }
  sendToFireBase(svgBase64: string, name: string): void {
    const storageRef = this.firebaseStorage.ref('images/').child(name + '.svg');
    try {
      // angularfirestore object no type for the snap response.
      storageRef.putString(svgBase64, 'base64', { contentType: 'image/svg+xml' }).then((snap: any) => {
        console.log('Uploaded a data_url string!');
      }).catch((error: Error) => {
        console.log(error);
      });

    } catch (error) {
      console.log(error);
    }
  }

  deleteDrawingFromFirebase(name: string): void {
      this.firebaseStorage.ref('images/' + name + '.svg').delete();

  }
  encodeSvgToFireBase(svg: SVGElement): string {
    return btoa(new XMLSerializer().serializeToString(svg as Node));
  }

  svgImage(svg: SVGElement): string {

    const begining = 'data:image/svg+xml;base64,';
    const xml: string = new XMLSerializer().serializeToString(svg as Node);
    const svg64: string = btoa(xml);
    this.saveDrawingProperties.svgImg = begining + svg64;
    return this.saveDrawingProperties.svgImg;
  }
  set setRenderer(renderer: Renderer2) {
    this.renderer = renderer;
  }

  sendDrawingData(name: string, tags: string): Observable<Drawing> {
    this.formattingSvgDrawing();
    const drawing: Drawing = {
      tags: tags.split(',', 20),
      name,
      childList: this.saveDrawingProperties.savedSvg,
      drawingImg: this.saveDrawingProperties.svgImg,
      drawingColor: (this.saveDrawingProperties.svg.style.backgroundColor || ''),
      drawingHeight: (this.saveDrawingProperties.svg.getAttribute('height') || ''),
      drawingWidth: (this.saveDrawingProperties.svg.getAttribute('width') || ''),
      createdAt: Date.now().toString(),
    };

    return this.http.post<Drawing>('http://localhost:3000/api/index/saveDrawing', drawing );
  }

  saveDrawingLocally(name: string): Drawing {
    this.formattingSvgDrawing();
    const drawingLocal: Drawing = {
      tags: [],
      name,
      childList: this.saveDrawingProperties.savedSvg,
      drawingImg: this.saveDrawingProperties.svgImg,
      drawingColor: (this.saveDrawingProperties.svg.style.backgroundColor || ''),
      drawingHeight: (this.saveDrawingProperties.svg.getAttribute('height') || ''),
      drawingWidth: (this.saveDrawingProperties.svg.getAttribute('width') || ''),
      createdAt: this.saveDrawingProperties.createdAt,
    };
    return drawingLocal;
  }
}
