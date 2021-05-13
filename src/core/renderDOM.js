import { model } from './model';
import { options } from './config';
import Paragraph from './Paragraph';
import List from './List';

export default function renderDOM() {
  // (re)render all the blocks from the model data
  options.outputElement.innerHTML = '';
  model.blocks.forEach((block) => {
    switch (block.type) {
      case 'paragraph':
        const paragraph = new Paragraph(block);
        options.outputElement.append(paragraph.render());
        break;
      case 'list':
        const list = new List(block);
        options.outputElement.append(list.render());
        break;
    }
  });
}
