import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class RotationProperties {
  INCREMENT = 'increment';
  DECREMENT = 'decrement';
  ROTATE = 'rotate';
  TRANSLATE = 'translate';
  SCALE = 'scale';
  TRANSFORM = 'transform';
  ROTATIONFACT = 15;
  rotator = 0;
  rotationFactor = 0;
  different: boolean;
  rotationAtThisCenterExists: boolean;
  tempRotation: number;
  oldTransform: string;
  oldScale: string;
  oldRotateCenterItem: string;
  oldRotateCenterSelection: string;
  existRotate = false;
  differentToggled = false;
  currentSelected: Node[];
  oldCenterX: number;
  oldCenterY: number;
  onNewSelection = true;
}
