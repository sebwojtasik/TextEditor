export default async function applyStyling(action) {
  const selection = window.getSelection();
  const container = getAnchorNode(selection);

  if (!container) {
    return;
  }

  const sameSelection = container && container.innerText === selection.toString();

  if (sameSelection && container.style[action.style] !== undefined) {
    await updateSelection(container, action);
    return;
  }

  await replaceSelection(container, action, selection);
}

async function updateSelection(container, action) {
  container.style[action.style] = await getStyleValue(container, action);
  await cleanChildNodes(action, container);
}

async function replaceSelection(container, action, selection) {
  const range = selection.getRangeAt(0);

  // if user selected a whole list, updateSelection
  if (
    range.commonAncestorContainer &&
    ['ol', 'ul', 'dl'].some(
      (listType) => listType === range.commonAncestorContainer.nodeName.toLowerCase()
    )
  ) {
    await updateSelection(range.commonAncestorContainer, action);
    return;
  }

  const fragment = range.extractContents();
  const span = await createSpan(container, action);
  span.appendChild(fragment);
  await cleanChildNodes(action, span);
  await flattenChildNodes(action, span);
  range.insertNode(span);
  selection.selectAllChildren(span);
}

async function cleanChildNodes(action, span) {
  if (!span.hasChildNodes()) {
    return;
  } // Clean direct child nodes with same style

  const children = Array.from(span.children).filter((element) => {
    return element.style[action.style] !== undefined && element.style[action.style] !== '';
  });

  if (children && children.length > 0) {
    children.forEach((element) => {
      element.style[action.style] = '';

      if (element.getAttribute('style') === '' || element.style === null) {
        element.removeAttribute('style');
      }
    });
  }

  // clean children of this node too
  const cleanChildNodesChildren = Array.from(span.children).map((element) => {
    return cleanChildNodes(action, element);
  });

  if (!cleanChildNodesChildren || cleanChildNodesChildren.length <= 0) {
    return;
  }

  await Promise.all(cleanChildNodesChildren);
}

async function createSpan(container, action) {
  const span = document.createElement('span');
  span.style[action.style] = await getStyleValue(container, action);
  return span;
}

async function getStyleValue(container, action) {
  if (!container) {
    return action.value;
  }

  if (await action.initial(container)) {
    return 'initial';
  }

  const style = await findStyleNode(container, action.style);

  if (await action.initial(style)) {
    return 'initial';
  }

  return action.value;
}

// Try to remove spans that aren't needed anymore
async function flattenChildNodes(action, span) {
  if (!span.hasChildNodes()) {
    return;
  }

  const children = Array.from(span.children).filter((element) => {
    const style = element.getAttribute('style');
    return !style || style === '';
  });

  if (children && children.length > 0) {
    children.forEach((element) => {
      // Flatten only if there are not other styles applied to children nodes
      const styledChildren = element.querySelectorAll('[style]');

      if (!styledChildren || styledChildren.length === 0) {
        const text = document.createTextNode(element.textContent);
        element.parentElement.replaceChild(text, element);
      }
    });
    return;
  }

  // flatten children of this node too
  const flattenChildNodesChildren = Array.from(span.children).map((element) => {
    return flattenChildNodes(action, element);
  });

  if (!flattenChildNodesChildren || flattenChildNodesChildren.length <= 0) {
    return;
  }

  await Promise.all(flattenChildNodesChildren);
}

const findStyleNode = async (node, style) => {
  if (!node.parentNode) {
    return null;
  }

  const hasStyle =
    node.style[style] !== null && node.style[style] !== undefined && node.style[style] !== '';

  if (hasStyle) {
    return node;
  }

  return await findStyleNode(node.parentNode, style);
};

const getAnchorNode = (selection) => {
  const anchorNode = selection === null || selection === void 0 ? void 0 : selection.anchorNode;

  if (!anchorNode) {
    return undefined;
  }

  return anchorNode.nodeType !== Node.TEXT_NODE && anchorNode.nodeType !== Node.COMMENT_NODE
    ? anchorNode
    : anchorNode.parentElement;
};
