import { Component, OnInit } from '@angular/core';
import * as Blockly from 'blockly';
import { javascriptGenerator, Order } from 'blockly/javascript';
import { saveAs } from 'file-saver';

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
    // First define the mutator blocks
    Blockly.Blocks['if_then_container'] = {
      init: function() {
        this.appendDummyInput()
            .appendField('if');
        this.appendStatementInput('STACK');
        this.setColour(210);
        this.contextMenu = false;
      }
    };

    Blockly.Blocks['if_then_elseif'] = {
      init: function() {
        this.appendDummyInput()
            .appendField('else if');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(210);
        this.contextMenu = false;
      }
    };

    // Then define the main if_then block
    Blockly.Blocks['if_then'] = {
      init: function() {
        this.appendValueInput('IF0')
            .setCheck('Boolean')
            .appendField('if');
        this.appendStatementInput('DO0')
            .appendField('then');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(210);
        // Use built-in controls_if mutator
        this.jsonInit({
          'mutator': 'controls_if_mutator'
        });
      }
    };

    // Register block types
    Blockly.common.defineBlocksWithJsonArray([
      {
        type: 'move_x_y',
        message0: `Move X by %1\n Y by %2`,
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
      },
      {
        type: 'rotate',
        message0: 'Rotate by %1 degrees',
        args0: [
          {
            type: 'input_value',
            name: 'THETA',
            check: 'Number'
          }
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 160,
        tooltip: 'Rotate by specified angle'
      },
      {
        type: 'wait',
        message0: 'Wait for %1 seconds',
        args0: [
          {
            type: 'input_value',
            name: 'SECONDS',
            check: 'Number'
          }
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 120,
        tooltip: 'Wait for specified seconds'
      },
      {
        type: 'repeat_times',
        message0: 'Repeat %1 times %2',
        args0: [
          {
            type: 'input_value',
            name: 'TIMES',
            check: 'Number'
          },
          {
            type: 'input_statement',
            name: 'DO'
          }
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 120,
        tooltip: 'Repeat code specified number of times'
      }
    ]);

    // Register generator functions
    javascriptGenerator.forBlock['move_x_y'] = (block) => {
      const xValue = javascriptGenerator.valueToCode(block, 'X', Order.ATOMIC) || '0';
      const yValue = javascriptGenerator.valueToCode(block, 'Y', Order.ATOMIC) || '0';
      return `this.moveXY(${xValue}, ${yValue});\n`;
    };

    javascriptGenerator.forBlock['rotate'] = (block) => {
      const theta = javascriptGenerator.valueToCode(block, 'THETA', Order.ATOMIC) || '0';
      return `this.rotate(${theta});\n`;
    };

    javascriptGenerator.forBlock['wait'] = (block) => {
      const seconds = javascriptGenerator.valueToCode(block, 'SECONDS', Order.ATOMIC) || '0';
      return `await this.wait(${seconds});\n`;
    };

    javascriptGenerator.forBlock['repeat_times'] = (block) => {
      const times = javascriptGenerator.valueToCode(block, 'TIMES', Order.ATOMIC) || '0';
      const code = javascriptGenerator.statementToCode(block, 'DO') || '';
      return `for(let count = 0; count < ${times}; count++) {\n${code}}\n`;
    };

    // Use the same generator as controls_if
    javascriptGenerator.forBlock['if_then'] = javascriptGenerator.forBlock['controls_if'];
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
            },
            {
              kind: 'block',
              type: 'rotate'
            }
          ]
        },
        {
          kind: 'category',
          name: 'Control',
          colour: '120',
          contents: [
            {
              kind: 'block',
              type: 'wait'
            },
            {
              kind: 'block',
              type: 'if_then'
            },
            {
              kind: 'block',
              type: 'repeat_times'
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
            },
            {
              kind: 'block',
              type: 'logic_compare'
            },
            {
              kind: 'block',
              type: 'logic_boolean'
            }
          ]
        }
      ]
    };
  }

  moveXY(x: number, y: number) {
    console.log(`Moving X by ${x} and Y by ${y}`);
  }

  rotate(theta: number) {
    console.log(`Rotating by ${theta} degrees`);
  }

  async wait(seconds: number) {
    console.log(`Waiting for ${seconds} seconds`);
    await new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }

  exportToJson() {
    if (this.workspace) {
      // Get the workspace state
      const dom = Blockly.serialization.workspaces.save(this.workspace);
      
      // Convert to JSON string with proper formatting
      const jsonStr = JSON.stringify(dom, null, 2);
      
      // Create blob and save file
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      saveAs(blob, `blocks-${timestamp}.json`);
    }
  }

  runCode() {
    if (this.workspace) {
      const code = javascriptGenerator.workspaceToCode(this.workspace);
      try {
        new Function(code).bind(this)();
      } catch (e) {
        console.error('Error running code:', e);
      }
    }
  }
}
