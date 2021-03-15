
import { createVNode } from './vnode';
import { render } from './renderer';

export const createApp = (root) => {
  const context = {
    components: {}
  }

  let isMounted = false;

  return {
    context,
    component(name, options) {
      context.components[name] = options;
    },
    mount(selector) {
      if (isMounted) return;

      const container = typeof selector === 'string' ? document.querySelector(selector) : selector;
      const rootVNode = createVNode(root);
      render(rootVNode, container);
    }
  }
}