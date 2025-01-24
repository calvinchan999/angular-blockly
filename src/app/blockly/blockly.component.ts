import { Component, OnInit } from '@angular/core';
import * as Blockly from 'blockly';
import { javascriptGenerator, Order } from 'blockly/javascript';

@Component({
  selector: 'app-blockly',
  standalone: true,
  templateUrl: './blockly.component.html',
  styleUrls: ['./blockly.component.scss']
})
export class BlocklyComponent implements OnInit {
  workspace: any;

  ngOnInit() {
    this.defineCustomBlocks();
    setTimeout(() => {
      this.initWorkspace();
    });
  }

  private defineCustomBlocks() {
    // Register block type
    Blockly.common.defineBlocksWithJsonArray([
      {
        type: 'move_x_y',
        message0: 'Move X by %1 Move Y by %2',
        args0: [
          {
            type: 'input_value',
            name: 'X',
            check: 'Number'
          },
          {
            type: 'input_value',
            name: 'Y',
            check: 'Number'
          }
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 160,
        tooltip: 'Move in X and Y directions'
      }
    ]);

    // Register generator function
    javascriptGenerator.forBlock['move_x_y'] = (block) => {
      const xValue = javascriptGenerator.valueToCode(block, 'X', Order.ATOMIC) || '0';
      const yValue = javascriptGenerator.valueToCode(block, 'Y', Order.ATOMIC) || '0';
      return `this.moveXY(${xValue}, ${yValue});\n`;
    };
  }

  private initWorkspace() {
    this.workspace = Blockly.inject('blocklyDiv', {
      toolbox: this.getToolbox(),
      trashcan: true,
      scrollbars: true,
      move: {
        scrollbars: true,
        drag: true,
        wheel: true
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      }
    });
  }

  private getToolbox() {
    return {
      kind: 'categoryToolbox',
      contents: [
        {
          kind: 'category',
          name: 'Movement',
          colour: '160',
          contents: [
            {
              kind: 'block',
              type: 'move_x_y'
            }
          ]
        },
        {
          kind: 'category',
          name: 'Math',
          colour: '230',
          contents: [
            {
              kind: 'block',
              type: 'math_number'
            },
            {
              kind: 'block',
              type: 'math_arithmetic'
            }
          ]
        }
      ]
    };
  }

  moveXY(x: number, y: number) {
    console.log(`Moving X by ${x} and Y by ${y}`);
  }

  // runCode() {
  //   if (this.workspace) {
  //     const code = javascriptGenerator.workspaceToCode(this.workspace);
  //     try {
  //       new Function(code).bind(this)();
  //     } catch (e) {
  //       console.error('Error running code:', e);
  //     }
  //   }
  // }
}
