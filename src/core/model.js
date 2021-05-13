// declare initial model state
export let model = {
  blocks: [
    {
      type: 'paragraph',
      data: {
        text: 'Hello, my name is Sebastian Wojtasik, and this is my solution for the text editor task.',
      },
      current: false,
    },
    {
      type: 'list',
      data: {
        items: [
          'It is a <span style="font-weight: bold;">block based</span> text editor',
          'It <span style="font-weight: bold;">does not</span> make use of the deprecated <span style="font-style: italic;">document.execCommand</span> method',
          'It returns clean formatted data output in JSON',
          'It supports opening and saving JSON files',
        ],
      },
      current: false,
    },
    {
      type: 'paragraph',
      data: {
        text: 'Looking forward to hearing from you :)',
      },
      current: false,
    },
  ],
};

export function setModel(newModelObject) {
  model = newModelObject;
}

// return the model without the 'current' attributes
export function getSanitizedModel() {
  return { blocks: model.blocks.map(({ current, ...keepAttributes }) => keepAttributes) };
}
