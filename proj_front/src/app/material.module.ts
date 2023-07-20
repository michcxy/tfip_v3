import { NgModule } from "@angular/core";

import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import {MatChipsModule} from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import {MatStepperModule} from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';


const matModules: any[] = [
  MatToolbarModule, MatButtonModule, MatIconModule, MatRadioModule,
  MatInputModule, MatFormFieldModule, MatChipsModule, MatGridListModule, MatStepperModule, MatMenuModule, MatDialogModule, MatCardModule
]

@NgModule({
  imports: matModules,
  exports: matModules
})
export class MaterialModule { }