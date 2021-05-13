import { setModel } from '../core/model';
import renderDOM from '../core/renderDOM';
import createModal from './Modal';

export default function showOpenFileModal() {
  // if the modal already exists in the DOM, open it, else create a new one
  if (document.getElementById('openFileModal')) {
    document.getElementById('openFileModal').classList.add('open');
  } else {
    let modal = createModal(modalTemplate, 'openFileModal');
    let fileInput = document.getElementById('file-input');
    let fileList = [];

    fileInput.addEventListener('change', () => {
      fileList = [];
      for (var i = 0; i < fileInput.files.length; i++) {
        fileList.push(fileInput.files[i]);
      }
    });

    let fileCatcher = document.getElementById('file-catcher');

    fileCatcher.addEventListener('submit', function (event) {
      event.preventDefault();
      fileList.forEach(function (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
          var contents = e.target.result;
          openFile(contents);
          modal.classList.remove('open');
        };
        reader.readAsText(file);
      });
    });
  }
}

const openFile = (contents) => {
  setModel(JSON.parse(contents));
  renderDOM();
};

const modalTemplate = `<div class="modal-background modal-exit"></div>
<fieldset class="modal-container">
  <form id='file-catcher'>
    <input input id='file-input' type='file' placeholder="Select file..."/>
    <button type='submit' class="button">Open</button>
  </form>
</fieldset>`;
