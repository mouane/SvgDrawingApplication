import {DragDropModule} from '@angular/cdk/drag-drop';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import {AngularFireStorageModule, StorageBucket} from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatListModule, MatSelectModule } from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import { ColorPickerModule } from 'ngx-color-picker';
import { CookieService } from 'ngx-cookie-service';
import { HotkeysService } from 'src/app/services/hotkeys/hotkeys.service';
import { environment } from '../environments/environment';
import { AirBrushProperties } from './classes/airBrushProperties/air-brush-properties';
import { BrushProperties } from './classes/brushProperties/brush-properties';
import { ColorToolProperties } from './classes/colorToolProperties/color-tool-properties';
import { ContainerProperties } from './classes/containerProperties/container-properties';
import { CopyPasteProperties } from './classes/copyPaste-properties/copy-paste-properties';
import { EraserProperties } from './classes/eraserProperties/eraser-properties';
import { LineProperties } from './classes/lineProperties/line-properties';
import { OpenDrawingProperties } from './classes/openDrawingProperties/open-drawing-properties';
import { PaintBucketProperties } from './classes/paintBucketProperties/paint-bucket-properties';
import { PencilProperties } from './classes/pencilProperties/pencil-properties';
import { PenToolProperties } from './classes/penProperties/pen-properties';
import { PipetteProperties } from './classes/pipetteProperties/pipette-properties';
import { ShapeProperties } from './classes/shapeProperties/shape-properties';
import { StampSelectorProperties } from './classes/stampProperties/stamp-properties';
import { SvgSelectorProperties } from './classes/svgSelectorProperties/svg-properties';
import { SvgShapeElements } from './classes/svgShapeElements/svg-shape-elements';
import { TextProperties } from './classes/textProperties/textProperties';
import { ToolBoxPropreties } from './classes/toolBoxPropreties/toolsBoxPropreties';
import { AirBrushParamsComponent } from './components/airbrush-params/airBrush-params.component';
import {AppComponent} from './components/app/app.component';
import { MaterialModule } from './components/app/material';
import { BrushParamsComponent } from './components/brush-params/brush-params.component';
import { ColorPaletteComponent } from './components/color-palette/color-palette.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { DialogPopupOpenDrawingComponent } from './components/dialog-popup-open-drawing/dialog-popup-open-drawing.component';
import { DialogPopupOpenLocallyComponent } from './components/dialog-popup-open-locally/dialog-popup-open-locally.component';
import { DialogPopupSaveDrawingComponent } from './components/dialog-popup-save-drawing/dialog-popup-save-drawing.component';
import { DialogPopupSaveLocallyComponent } from './components/dialog-popup-save-locally/dialog-popup-save-locally.component';
import { DialogPopupComponent } from './components/dialog-popup/dialog-popup.component';
import { DrawingViewComponent } from './components/drawingView/drawingView.component';
import { EraserComponent } from './components/eraser/eraser.component';
import { ExportDrawingComponent } from './components/export-drawing/export-drawing.component';
import { FilterTextureComponent } from './components/filter-texture/filter-texture.component';
import { GridParamsComponent } from './components/grid-params/grid-params.component';
import { LineParamsComponent } from './components/line-params/line-params.component';
import { PaintBucketParamsComponent } from './components/paint-bucket-params/paint-bucket-params.component';
import { PenToolParamsComponent } from './components/pen-tool-params/pen-tool-params.component';
import { PencilParamsComponent } from './components/pencil-params/pencil-params.component';
import { PipetteParamsComponent } from './components/pipette-params/pipette-params.component';
import { QuillParamsComponent } from './components/quill-params/quill-params/quill-params.component';
import { SelectionParamsComponent } from './components/selection-params/selection-params.component';
import { ShapeParamsComponent } from './components/shape-params/shape-params.component';
import { StampParamsComponent } from './components/stamp-params/stamp-params.component';
import { TextParamsComponent } from './components/text-params/text-params.component';
import { ToolBoxComponent } from './components/tool-box/tool-box.component';
import { UndoRedoParamsComponent } from './components/undo-redo-params/undo-redo-params.component';
import { UserGuideComponent } from './components/user-guide/user-guide.component';
import { WelcomeWindowComponent } from './components/welcome-window/welcome-window.component';
import { SafePipe } from './pipe/safe.pipe';
@NgModule({
  declarations: [
    AppComponent,
    ToolBoxComponent,
    DrawingViewComponent,
    DialogPopupComponent,
    ColorPickerComponent,
    ColorPaletteComponent,
    WelcomeWindowComponent,
    FilterTextureComponent,
    UserGuideComponent,
    DialogPopupSaveDrawingComponent,
    DialogPopupOpenDrawingComponent,
    SafePipe,
    ExportDrawingComponent,
    StampParamsComponent,
    PipetteParamsComponent,
    GridParamsComponent,
    LineParamsComponent,
    ShapeParamsComponent,
    BrushParamsComponent,
    PencilParamsComponent,
    DialogPopupSaveLocallyComponent,
    DialogPopupOpenLocallyComponent,
    PenToolParamsComponent,

    SelectionParamsComponent,
    UndoRedoParamsComponent,
    EraserComponent,
    TextParamsComponent,
    PaintBucketParamsComponent,
    AirBrushParamsComponent,
    QuillParamsComponent,
  ],
  entryComponents: [DialogPopupComponent, UserGuideComponent, PaintBucketParamsComponent, AirBrushParamsComponent,
    DialogPopupSaveDrawingComponent, DialogPopupOpenDrawingComponent, DialogPopupSaveLocallyComponent, DialogPopupOpenLocallyComponent,
    StampParamsComponent, PipetteParamsComponent, GridParamsComponent, LineParamsComponent, PencilParamsComponent, BrushParamsComponent,
    ShapeParamsComponent, EraserComponent, SelectionParamsComponent, ExportDrawingComponent, TextParamsComponent, PenToolParamsComponent,
    QuillParamsComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    MatSelectModule,
    FormsModule,
    ColorPickerModule,
    DragDropModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatListModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
  ],
  providers: [HotkeysService, CookieService, ToolBoxPropreties, ShapeProperties, PipetteProperties, BrushProperties, EraserProperties,
    PencilProperties, LineProperties, ColorToolProperties, CopyPasteProperties, StampSelectorProperties, PaintBucketProperties,
    SvgShapeElements, SvgSelectorProperties, PenToolProperties, OpenDrawingProperties, DialogPopupOpenDrawingComponent,
    ColorPickerComponent, SafePipe, EraserComponent, TextProperties, GridParamsComponent,  SelectionParamsComponent,
    ContainerProperties, AirBrushProperties,
    { provide: StorageBucket, useValue: 'gs://projetii.appspot.com' }],

  bootstrap: [AppComponent],
})
export class AppModule {
}
