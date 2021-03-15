const doc = document;

export const nodeOps = {
  createText(text) {
    return doc.createTextNode(text);
  },
  insert(node, container, anchor) {
    if (anchor) {
      return container.insertBefore(node, anchor)
    } else {
      return container.appendChild(node)
    }
  },
  setText(node, text) {
    node.nodeValue = text
  }
}
