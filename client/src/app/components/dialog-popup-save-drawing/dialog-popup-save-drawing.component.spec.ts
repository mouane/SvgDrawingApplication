import { HttpClient, HttpHandler } from '@angular/common/http';
import { Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MatFormFieldModule, MatSelectModule } from '@angular/material';
import { DialogPopupSaveDrawingProperties } from 'src/app/classes/dialogPopupSaveDrawingProperties/dialogPopupSaveDrawingProperties';
import { SafePipe } from '../../pipe/safe.pipe';
import { DialogPopupSaveDrawingComponent } from './dialog-popup-save-drawing.component';

describe('DialogPopupSaveDrawingComponent', () => {
  let rendererService: jasmine.SpyObj<Renderer2>;
  let fixture: ComponentFixture<DialogPopupSaveDrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPopupSaveDrawingComponent ],
      imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatDialogModule],
      providers: [HttpClient, HttpHandler, SafePipe, DialogPopupSaveDrawingProperties,
         { provide: MatDialogRef }, { provide: Renderer2, useValue: rendererService }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPopupSaveDrawingComponent);
    rendererService = jasmine.createSpyObj('renderer', ['selectRootElement']);
    fixture.detectChanges();
  });

});
