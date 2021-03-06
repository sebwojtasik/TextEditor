import renderDOM from './renderDOM';
import Controls from '../components/Controls';
import { model, setModel } from './model';
import { options } from './config';

export default class TextEditor {
  constructor() {
    this.controls;
  }

  init() {
    // create controls component and render the model
    this.controls = new Controls();
    this.controls.init();
    renderDOM();
  }

  getCurrentBlock() {
    return model.blocks.filter((block) => block.current == true)[0];
  }

  getCurrentBlockIndex() {
    return model.blocks.indexOf(this.getCurrentBlock());
  }

  focusOnBlockIndex(index) {
    let properIndex = index;
    if (index < 0) properIndex = 0;
    if (index >= model.blocks.length) properIndex = model.blocks.length - 1;
    let element = options.outputElement.children[properIndex];
    element.focus();
    //if the block is a list focus on last list item
    if (model.blocks[properIndex].type === 'list') {
      element.lastChild.focus();
    }
    // Improvment possibility: figure out a way to move the caret to the end of the element
  }

  deleteCurrentBlock() {
    model.blocks.splice(this.getCurrentBlockIndex(), 1);
  }

  unfocusAllBlocks() {
    model.blocks.forEach((block) => (block.current = false));
  }

  // create and insert a new block below the currently focused one
  insertNewBlock(blockType = 'paragraph') {
    let newBlockIndex = model.blocks.indexOf(this.getCurrentBlock()) + 1;
    this.unfocusAllBlocks();
    let newBlock = {};
    if (blockType === 'list') {
      newBlock = {
        type: blockType,
        data: {
          items: [''],
        },
        current: true,
      };
    } else {
      newBlock = {
        type: blockType,
        data: {
          text: '',
        },
        current: true,
      };
    }
    model.blocks.splice(newBlockIndex, 0, newBlock);
    renderDOM();
    this.focusOnBlockIndex(this.getCurrentBlockIndex());
  }

  // replace the current model with a blank new one
  newDocument() {
    setModel({ blocks: [{ type: 'paragraph', data: { text: '' }, current: false }] });
    renderDOM();
  }
}
