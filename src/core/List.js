import { textEditor } from '../app';
import { model } from './model';

export default class List {
  constructor(block) {
    this.block = block;
    this.listElement;
  }

  render() {
    this.listElement = document.createElement('ul');
    this.block.data.items.forEach((item) => {
      this.listElement.append(this.createListItem(item));
    });
    return this.listElement;
  }

  save(event = {}) {
    if (event.inputType === 'insertParagraph') {
      event.preventDefault();
    } else {
      const items = Array.from(this.listElement.querySelectorAll('li'));
      this.block.data.items = items.map((li) => li.innerHTML);
    }
  }

  focusOnCurrent() {
    textEditor.unfocusAllBlocks();
    this.block.current = true;
  }

  insertNewListItem(callingListItem) {
    callingListItem.innerHTML = callingListItem.innerText.replaceAll('\n', '');
    if (this.listElement.lastChild.innerText == '') {
      // create a new paragraph if the previous list item is empty
      if (this.listElement.children.length > 1) this.listElement.lastChild.remove();
      this.save();
      textEditor.insertNewBlock();
    } else {
      // create a new list item after the currently selected one
      let newListItem = this.createListItem();
      callingListItem.insertAdjacentElement('afterend', newListItem);
      newListItem.focus();
      callingListItem.innerHTML = callingListItem.innerText.replaceAll('\n', '');
      this.save();
    }
  }

  createListItem(item = '') {
    let listItem = document.createElement('li');
    listItem.innerHTML = item;
    listItem.setAttribute('contenteditable', 'true');
    listItem.addEventListener('input', (event) => this.save(event));
    document.addEventListener('save', () => this.save(), false);
    listItem.addEventListener('keydown', (event) => this.handleKeydown(event, listItem));
    listItem.addEventListener('focus', () => {
      this.focusOnCurrent();
    });
    return listItem;
  }

  removeItem(event, listItem) {
    // delete it only if it's not the last block left
    if (model.blocks.length > 1) {
      // if the item is the only one in the list, delete the whole list block
      if (!listItem.previousSibling) {
        let currentBlockIndex = textEditor.getCurrentBlockIndex();
        this.listElement.remove();
        delete model.blocks[currentBlockIndex];
        textEditor.focusOnBlockIndex(currentBlockIndex - 1);
      } else {
        // else delete previous list item
        listItem.previousSibling.focus();
        listItem.remove();
        this.save();
      }
    }
  }

  handleKeydown(event, listItem) {
    if (event.key === 'Backspace' && (listItem.innerText === '' || listItem.innerHTML === '<br>')) {
      this.removeItem(event, listItem);
    } else if (event.key === 'ArrowDown') {
      if (listItem.nextSibling) {
        listItem.nextSibling.focus();
      } else {
        textEditor.focusOnBlockIndex(textEditor.getCurrentBlockIndex() + 1);
      }
    } else if (event.key === 'ArrowUp') {
      if (listItem.previousSibling) {
        listItem.previousSibling.focus();
      } else {
        textEditor.focusOnBlockIndex(textEditor.getCurrentBlockIndex() - 1);
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.insertNewListItem(listItem);
    }
  }
}
