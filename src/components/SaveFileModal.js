import { getSanitizedModel } from '../core/model';
import createModal from './Modal';

export default function showSaveFileModal() {
  // if the modal already exists in the DOM, open it, else create a new one
  if (document.getElementById('saveFileModal')) {
    document.getElementById('saveFileModal').classList.add('open');
  } else {
    createModal(modalTemplate, 'saveFileModal');
    let filenameInput = document.getElementById('filename');
    document.getElementById('saveButton').addEventListener('click', () => {
      saveFile(JSON.stringify(getSanitizedModel(), null, 2), filenameInput.value);
    });
  }
}

const saveFile = (content, filename = 'output.json') => {
  const a = document.createElement('a');
  const file = new Blob([content], { type: 'text/json' });

  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();

  URL.revokeObjectURL(a.href);
};

const modalTemplate = `<div class="modal-background modal-exit"></div>
<fieldset class="modal-container">
  <input type="text" id="filename" placeholder="filename.json">
  <button id="saveButton" class="button">Save</button>
</fieldset>`;
