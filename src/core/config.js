export const options = {
  controlsElement: document.getElementById('controls'),
  outputElement: document.getElementById('output'),
};

export const controls = [
  {
    text: '<b>B</b>',
    title: 'Bold',
    id: 'bold',
    state: true,
  },
  {
    text: '<i>i</i>',
    title: 'Italic',
    id: 'italic',
    state: true,
  },
  {
    text: '&#8226; List',
    title: 'List',
    id: 'list',
    state: true,
  },
  {
    text: '💾 Save',
    title: 'Save',
    id: 'save',
    state: true,
  },
  {
    text: '<span class="closed">📁</span><span class="open">📂</span> Open',
    title: 'Open',
    id: 'open',
    state: true,
  },
  {
    text: '🆕 New document',
    title: 'New document',
    id: 'new',
    state: true,
  },
  {
    text: '<span class="closed">🙈</span><span class="open">🙉</span> Preview JSON',
    title: 'Preview JSON',
    id: 'preview',
    state: true,
  },
];
