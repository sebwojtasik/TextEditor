import applyStyling from '../core/applyStyling';
import { options, controls } from '../core/config';
import showOpenFileModal from './OpenFileModal';
import showPreviewJsonModal from './PreviewJsonModal';
import showSaveFileModal from './SaveFileModal';
import { textEditor } from '../app';
import { getSanitizedModel } from '../core/model';

export default class Controls {
  constructor() {
    this.controls = controls;
    // create a new event type to update the model after applying styles
    this.saveEvent = new Event('save');
  }

  init() {
    // create control buttons based on the list from core/config.js
    this.controls.forEach((control) => {
      let button = document.createElement('button');
      button.innerHTML = control.text;
      button.title = control.title;
      button.setAttribute('type', 'button');
      button.setAttribute('id', control.id);
      button.classList.add('button');
      options.controlsElement.append(button);
    });

    // add appropriate event listeners to all control buttons
    document.getElementById('save').addEventListener('click', () => showSaveFileModal(), false);
    document.getElementById('open').addEventListener('click', () => showOpenFileModal(), false);
    document.getElementById('new').addEventListener('click', () => textEditor.newDocument(), false);
    document
      .getElementById('preview')
      .addEventListener(
        'click',
        () => showPreviewJsonModal(JSON.stringify(getSanitizedModel(), null, 2)),
        false
      );
    document
      .getElementById('list')
      .addEventListener('click', () => textEditor.insertNewBlock('list'), false);
    document.getElementById('bold').addEventListener(
      'click',
      () => {
        applyStyling(
          {
            style: 'font-weight',
            value: 'bold',
            initial: (element) =>
              Promise.resolve(element && element.style['font-weight'] === 'bold'),
          },
          'p,ul,li'
        );
        document.dispatchEvent(this.saveEvent);
      },
      false
    );
    document.getElementById('italic').addEventListener(
      'click',
      () => {
        applyStyling(
          {
            style: 'font-style',
            value: 'italic',
            initial: (element) =>
              Promise.resolve(element && element.style['font-style'] === 'italic'),
          },
          'p,ul,li'
        );
        document.dispatchEvent(this.saveEvent);
      },
      false
    );
  }
}
