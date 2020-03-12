import { NgModule } from '@angular/core';
import { MatButtonModule, MatButtonToggleModule, MatCheckboxModule, MatDialogModule,
         MatIconModule, MatInputModule, MatListModule, MatMenuModule,
         MatSidenavModule, MatSliderModule, MatTableModule, MatToolbarModule, MatTooltipModule, } from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const modules = [
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatButtonModule,
];

@NgModule(
    {
        imports: modules,
        exports: modules,
    },
)
export class MaterialModule {}
