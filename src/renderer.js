import {
  Text,
  ShapeFlags,
  isSameVNode
} from './vnode.js'
import {
  createComponentInstance,
  renderComponentRoot
} from './component.js'
import { effect } from './reactivity.js';
import { isReservedProp, isOn } from './utils.js';

const doc = document;
const nodeOps = {
  createText(text) {
    return doc.createTextNode(text);
  },
  insert(node, container, anchor) {
    return container.insertBefore(node, anchor)
  },
  setText(node, text) {
    node.nodeValue = text
  },
  createElement(type) {
    return doc.createElement(type)
  },
  patchProp(
    el,
    key,
    prevValue,
    nextValue
  ) {
    switch (key) {
      case 'class':
        el.className = nextValue
        break
      case 'style':
        if (nextValue == null) {
          el.removeAttribute('style')
        } else {
          Object.assign(el.style, nextValue)
        }
        break
      default:
        if (isOn(key)) {
          const invokers = el._vei || (el._vei = {})
          const name = key.slice(2).toLowerCase()
          if (nextValue && invokers[name]) {
            invokers[name].value = nextValue
          } else {
            if (nextValue) {
              let invoker = function (ev) {
                invoker.value(ev)
              }
              invoker.value = nextValue
              invokers[name] = invoker
              el.addEventListener(name, invoker)
            } else {
              el.removeEventListener(name, invokers[name])
              invokers[name] = undefined
            }
          }
        }
    }
  }
}

const patch = (
  n1,
  n2,
  container,
  anchor,
  parentComponent
) => {
  if (n1 && !isSameVNode(n1, n2)) {
    anchor = getNextNode(n1)
    unmount(n1)
    n1 = null
  }

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
          anchor,
          parentComponent
        )
      } else if (shapeFlag & ShapeFlags.COMPONENT) {
        processComponent(
          n1,
          n2,
          container,
          anchor,
          parentComponent
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
    n2.el = nodeOps.createText(n2.children)
    nodeOps.insert(n2.el, container, anchor)
  } else {
    const el = n2.el = n1.el;
    if (n2.children !== n1.children) {
      nodeOps.setText(el, n2.children)
    }
  }
}

const processElement = (
  n1,
  n2,
  container,
  anchor,
  parentComponent
) => {
  if (n1 == null) {
    mountElement(
      n2,
      container,
      anchor,
      parentComponent
    )
  } else {
    patchElement(
      n1,
      n2,
      container,
      anchor,
      parentComponent
    )
  }
}

const mountElement = (
  vnode,
  container,
  anchor,
  parentComponent
) => {
  const {
    type,
    children,
    props
  } = vnode
  const el = (vnode.el = nodeOps.createElement(type))

  if (Array.isArray(children)) {
    mountChildren(
      children,
      el,
      null,
      parentComponent
    )
  }

  for (let key in props) {
    if (!isReservedProp(key)) {
      nodeOps.patchProp(
        el,
        key,
        null,
        props[key]
      )
    }
  }
  
  nodeOps.insert(el, container, anchor)
}

const patchElement = (
  n1,
  n2,
  parentComponent
) => {
  n2.el = n1.el

  patchProps(
    n2.el,
    n1.props,
    n2.props
  )

  patchChildren(
    n1.children,
    n2.children,
    n2.el,
    parentComponent
  )
}

const mountChildren = (
  children,
  container,
  anchor,
  parentComponent,
  start = 0
) => {
  for (let i = start, len = children.length; i < len; i++) {
    patch(
      null,
      children[i],
      container,
      anchor,
      parentComponent
    )
  }
}

const patchChildren = (
  c1,
  c2,
  container,
  parentComponent
) => {
  const oldLength = c1.length
  const newLength = c2.length
  const commonLen = Math.min(oldLength, newLength)
  let i
  for (i = 0; i < commonLen; i++) {
    patch(
      c1[i],
      c2[i],
      container,
      null,
      parentComponent
    )
  }

  if (oldLength > newLength) {
    unmountChildren(
      c1,
      container,
      parentComponent,
      commonLen
    )
  } else {
    mountChildren(
      c1,
      container,
      null,
      parentComponent,
      commonLen
    )
  }
}

const unmountChildren = () => {
  // TODO:
}

const patchProps = (
  el,
  oldProps,
  newProps
) => {
  if (oldProps !== newProps) {
    for (const key in newProps) {
      nodeOps.patchProp(el, key, oldProps[key], newProps[key])
    }
  }
}

const processComponent = (
  n1,
  n2,
  container,
  anchor,
  parentComponent
) => {
  if (n1 == null) {
    mountComponent(n2, container, anchor, parentComponent)
  } else {
    updateComponent(n1, n2, container, anchor, parentComponent)
  }
}

const mountComponent = (
  vnode,
  container,
  anchor,
  parentComponent
) => {
  const instance = (vnode.component = createComponentInstance(vnode, parentComponent))

  instance.update = effect(() => {
    if (!instance.isMounted) {
      const subTree = (instance.subTree = renderComponentRoot(instance))

      patch(
        null,
        subTree,
        container,
        anchor,
        instance
      )

      vnode.el = subTree.el

      instance.isMounted = true
    } else {
      let { next } = instance
      // 父级触发更新
      if (next) {
        next.el = vnode.el
      } else { // 自更新
        next = vnode
      }
      const prevTree = instance.subTree
      const nextTree = renderComponentRoot(instance)

      patch(
        prevTree,
        nextTree,
        container,
        anchor,
        instance
      )
    }
  })
}

const unmount = () => {
  // TODO:
}

const getNextNode = (vnode) => {
  if (vnode.shapeFlag & ShapeFlags.COMPONENT) {
    return getNextNode(vnode.component.subTree)
  }
  return vnode.el.nextSibling
}

export const render = (root, container) => {
  if (container) {
    patch(null, root, container);
  } else {
    // unmount
  }
}

