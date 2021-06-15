import {
  isString,
  isObject,
  isFunction
} from './utils.js'

export const Text = Symbol('Text');

export const ShapeFlags = {
  ELEMENT: 1,
  FUNCTIONAL_COMPONENT: 1 << 1,
  STATEFUL_COMPONENT: 1 << 2
}

ShapeFlags.COMPONENT = ShapeFlags.FUNCTIONAL_COMPONENT | ShapeFlags.STATEFUL_COMPONENT

export const createVNode = (type, props, children) => {
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
      ? ShapeFlags.STATEFUL_COMPONENT
      : isFunction(type)
        ? ShapeFlags.FUNCTIONAL_COMPONENT
        : type

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
  return createVNode(Text, null, text)
}

export const isVNode = (s) => {
  return s && s.__isVNode
}

export const isSameVNode = (n1, n2) => n1.type === n2.type && n1.key === n2.key
