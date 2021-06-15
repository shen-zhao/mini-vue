export const isString = (val) => typeof val === 'string';
export const isObject = (val) => val != null && typeof val === 'object';
export const isFunction = (val) => typeof val === 'function';

export function makeMap(
  str,
  expectsLowerCase
) {
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val]
}

export const isReservedProp = /*#__PURE__*/ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ',key,ref,' 
  // +
    // 'onVnodeBeforeMount,onVnodeMounted,' +
    // 'onVnodeBeforeUpdate,onVnodeUpdated,' +
    // 'onVnodeBeforeUnmount,onVnodeUnmounted'
)

export const isOn = key => /^on[A-Z]\w*$/.test(key)