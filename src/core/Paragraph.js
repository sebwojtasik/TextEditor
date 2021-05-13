import { textEditor } from '../app';

export default class Paragraph {
  constructor(block) {
    this.block = block;
    this.paragraphElement;
  }

  render() {
    this.paragraphElement = document.createElement('p');
    this.paragraphElement.innerHTML = this.block.data.text;
    this.paragraphElement.setAttribute('contenteditable', 'true');
    this.paragraphElement.addEventListener('input', (event) => this.save(event), true);
    this.paragraphElement.addEventListener('focus', () => {
      this.focusOnCurrent();
    });
    document.addEventListener(
      'save',
      () => {
        this.save();
      },
      false
    );
    this.paragraphElement.addEventListener(
      'keydown',
      (event) => {
        if (
          event.key === 'Backspace' &&
          (this.paragraphElement.innerText === '' || this.paragraphElement.innerHTML === '<br>')
        )
          this.deleteCurrentParagraph();
        if (event.key === 'ArrowDown') {
          textEditor.focusOnBlockIndex(textEditor.getCurrentBlockIndex() + 1);
        }
        if (event.key === 'ArrowUp') {
          textEditor.focusOnBlockIndex(textEditor.getCurrentBlockIndex() - 1);
        }
      },
      true
    );
    return this.paragraphElement;
  }

  deleteCurrentParagraph() {
    let previousBlockIndex = textEditor.getCurrentBlockIndex() - 1;
    textEditor.deleteCurrentBlock();
    this.paragraphElement.remove();
    textEditor.focusOnBlockIndex(previousBlockIndex);
  }

  focusOnCurrent() {
    textEditor.unfocusAllBlocks();
    this.block.current = true;
  }

  save(event = {}) {
    if (event.inputType === 'insertParagraph') {
      event.preventDefault();
      textEditor.insertNewBlock();
    } else {
      this.block.data.text = this.paragraphElement.innerHTML;
    }
  }
}
