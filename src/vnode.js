import {
  isString,
  isObject,
  isFunction
} from 'utils'

export const Text = Symbol('Text');

export const ShapeFlags = {
  ELEMENT: 1,
  FUNCTIONAL_COMPONENT: 1 << 1,
  STATEFUL_COMPONENT: 1 << 2,
  TEXT_CHILDREN: 1 << 3,
  ARRAY_CHILDREN: 1 << 4,
  SLOTS_CHILDREN: 1 << 5,
  COMPONENT: ShapeFlags.FUNCTIONAL_COMPONENT | ShapeFlags.STATEFUL_COMPONENT
}

export const createVNode = (type, props, children) => {
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
      ? ShapeFlags.STATEFUL_COMPONENT
      : isFunction(type)
        ? ShapeFlags.FUNCTIONAL_COMPONENT
        : 0

  return {
    type,
    props,
    children,
    component: null,
    el: null,
    key: null,
    ref: null,
    shapeFlag,
    __isVNode: true
  }
}

export const createTextVNode = (text) => {
  return createVNode(Text, text)
}

export const isVNode = (s) => {
  return s && s.__isVNode;
}