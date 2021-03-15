import {
  Text,
  ShapeFlags
} from './vnode';
import { nodeOps } from './nodeOps';

const {
  createText,
  insert,
  setText
} = nodeOps;

const patch = (
  n1,
  n2,
  container,
  anchor
) => {
  const { type, shapeFlag } = n2;

  switch (type) {
    case Text:
      processText(
        n1,
        n2,
        container,
        anchor
      );
      break;
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(
          n1,
          n2,
          container,
          anchor
        )
      } else if (shapeFlag & ShapeFlags.COMPONENT) {
        processComponent(
          n1,
          n2,
          container,
          anchor
        )
      }
  }
}

const processText = (
  n1,
  n2,
  container,
  anchor
) => {
  if (n1 == null) {
    n2.el = createText(n2.children)
    insert(n2.el, container, anchor)
  } else {
    const el = n2.el = n1.el;
    if (n2.children !== n1.children) {
      setText(el, n2.children)
    }
  }
}

const processElement = (
  n1,
  n2,
  container,
  anchor
) => {
  
}

export const render = (root, container) => {
  if (container) {
    patch(null, root, container);
  } else {
    // unmount
  }
}

