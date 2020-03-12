import { Injectable, Renderer2 } from '@angular/core';

@Injectable({
    providedIn: 'root',
  })
export class ContainerProperties {
    createContainer($event: MouseEvent, svg: SVGElement, renderer: Renderer2): void {
        const parent = (($event.target as HTMLElement).parentNode as HTMLElement );
        if (parent.nodeName !== 'svg') {
          renderer.insertBefore($event.target, svg, ($event.target as HTMLElement).lastChild);
        } else {
          renderer.insertBefore(parent, svg, parent.lastChild);
        }
    }

    appendLine(parent: SVGElement, svg: SVGElement, renderer: Renderer2): void {
        renderer.insertBefore(parent, svg, parent.lastChild);
      }
}
