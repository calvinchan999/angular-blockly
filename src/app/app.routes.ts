import { Routes } from '@angular/router';
import { BlocklyComponent } from './blockly/blockly.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, //default route
  { path: 'home', component: BlocklyComponent },
];
