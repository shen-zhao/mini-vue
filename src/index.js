
import { createVNode } from './vnode.js';
import { render } from './renderer.js';
export * from './reactivity.js';

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