import createModal from './Modal';

export default function showPreviewJsonModal(output) {
  // if the modal already exists in the DOM, open it, else create a new one
  if (document.getElementById('previewJsonModal')) {
    document.getElementById('jsonOutput').innerText = output;
    document.getElementById('previewJsonModal').classList.add('open');
  } else {
    createModal(modalTemplate, 'previewJsonModal');
    document.getElementById('jsonOutput').innerText = output;
  }
}

const modalTemplate = `<div class="modal-background modal-exit"></div>
<div class="modal-container">
  <code id="jsonOutput"></code>
</div>`;
