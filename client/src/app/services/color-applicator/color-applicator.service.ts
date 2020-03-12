import { Injectable,  Renderer2, RendererFactory2 } from '@angular/core';
import { GROUP, LINE_ATTRIBUTES, MOUSE_CLICK } from 'src/app/enum';
import { ColorToolService } from 'src/app/services/color-tool/color-tool.service';

@Injectable({
  providedIn: 'root',
})
export class ColorApplicatorService {
  primaryColor: string;
  secondaryColor: string;
  renderer: Renderer2;
  constructor( rendererFactory: RendererFactory2, private colorService: ColorToolService) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.primaryColor = colorService.Fill;
   }

   mouseDown($event: MouseEvent): void {
     const element = (($event.target as HTMLElement).parentNode as HTMLElement);
     // tslint:disable-next-line: deprecation
     if ($event.which === 1) {
      this.primaryColor = this.colorService.Fill;
      (element.tagName === GROUP.GROUP_EL) ? this.checkGroupElements(element.childNodes, MOUSE_CLICK.LEFT) :
        this.renderer.setAttribute($event.target, LINE_ATTRIBUTES.FILL, this.primaryColor);
     }
   }

   rightClick($event: MouseEvent): void {
    $event.preventDefault();
    this.secondaryColor = this.colorService.Outline;
    const element = (($event.target as HTMLElement).parentNode as HTMLElement);
    (element.tagName === 'g') ? this.checkGroupElements(element.childNodes, MOUSE_CLICK.RIGHT) :
      this.renderer.setAttribute($event.target, LINE_ATTRIBUTES.STROKE, this.secondaryColor);
   }

  checkGroupElements(children: NodeListOf<ChildNode>, click: string): void {
    // tslint:disable-next-line: prefer-for-of
    if (click === MOUSE_CLICK.LEFT) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < children.length; i++) {
        this.renderer.setAttribute(children[i], LINE_ATTRIBUTES.FILL, this.primaryColor);
      }
    } else {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < children.length; i++) {
        this.renderer.setAttribute(children[i], LINE_ATTRIBUTES.STROKE, this.secondaryColor);
      }
    }
  }
}
