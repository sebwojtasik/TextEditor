export default function createModal(content, id) {
  let modal = document.createElement('div');
  modal.classList.add('modal', 'open');
  modal.setAttribute('id', id);
  modal.innerHTML = content;
  let exits = modal.querySelectorAll('.modal-exit');
  exits.forEach(function (exit) {
    exit.addEventListener('click', function (event) {
      event.preventDefault();
      modal.classList.remove('open');
    });
  });
  document.body.append(modal);
  return modal;
}
