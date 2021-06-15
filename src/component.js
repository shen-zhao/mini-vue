import { ShapeFlags } from './vnode.js';
import { reactive } from './reactivity.js';

export const createComponentInstance = (vnode, parent) => {
  const {
    type: Component,
    props
  } = vnode
  
  const { setup } = Component;
  // reactive props as shallow
  const reactiveProps = reactive(props, true)

  let res;
  if (typeof setup === 'function') {
    res = setup(reactiveProps);
  }

  let render = typeof res === 'function' ? res : Component.render
  if (typeof render !== 'function') {
    throw new Error('render must be a function')
  }

  const instance = {
    $el: null,
    type: Component,
    vnode,
    render,
    props: reactiveProps,
    parent
  }
  // root ref
  instance.root = parent ? parent.root : instance

  return instance
}

export const renderComponentRoot = (instance) => {
  const {
    vnode,
    type: Component,
    render,
    props
  } = instance

  let result
  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    result = render.call(instance, props)
  } else {
    result = Component(props)
  }

  return result
}
