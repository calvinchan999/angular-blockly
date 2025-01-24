import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlocklyComponent } from './blockly/blockly.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BlocklyComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'rv-blocky';
}
