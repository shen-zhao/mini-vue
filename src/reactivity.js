import { isObject } from './utils.js';

// targetMap <target keyDepMap>
// keyDepMap <key depSet>
// depSet [effect...]
const targetMap = new WeakMap();
const effectStack = [];
let activeEffect = null;

/**
 * 对象行为代理
 * @param {typeof object} target 
 * @returns Proxy
 */
export const reactive = (target) => {
  if (!isObject(target)) {
    return;
  }

  const proxy = new Proxy(target, {
    get(target, property, receiver) {
      track(target, property)
      const res = Reflect.get(target, property, receiver);
      reactive(res);

      return res;
    },
    set(target, property, value, receiver) {
      Reflect.set(target, property, value, receiver);
      trigger(target, property);
      return true;
    }
  });

  return proxy;
}

// 清除依赖
function cleanup(effect) {
  const { deps } = effect
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect)
    }
    deps.length = 0
  }
}

let uid = 0;
/**
 * 生成副作用
 * @param {Function} fn // getter
 * @param {Object} options 
 * @returns effect
 */
export const effect = (fn, options = {}) => {
  const effect = () => {
    try {
      if (!effectStack.includes(effect)) {
        cleanup(effect);
      }
      effectStack.push(effect);
      activeEffect = effect;
      fn();
    } finally {
      effectStack.pop();
      activeEffect = effectStack[effectStack.length - 1]
    }
  }

  effect.id = uid++;
  effect._isEffect = true;
  effect.allowRecurse = !!options.allowRecurse;
  effect.raw = fn;
  effect.deps = [];
  effect.options = options;

  if (!options.lazy) {
    effect();
  }

  return effect;
}

/**
 * 依赖追踪
 * @param {typeof object} target 
 * @param {*} property 
 * @returns 
 */
const track = (target, property) => {
  if (activeEffect === undefined) return;
  let depsMap = targetMap.get(target);

  if (!depsMap) {
    targetMap.set(target, depsMap = new Map());
  }

  let dep = depsMap.get(property);
  if (!dep) {
    depsMap.set(property, dep = new Set())
  }
  
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}

/**
 * 属性值代理修改触发effect
 * @param {typeof object} target 
 * @param {*} property 
 * @returns 
 */
const trigger = (target, property) => {
  const depsMap = targetMap.get(target);

  if (!depsMap) {
    return;
  }

  const dep = depsMap.get(property);
  if (!dep) {
    return;
  }
  const effects = new Set();
  dep.forEach(effect => {
    if (effect !== activeEffect || effect.allowRecurse) {
      effects.add(effect);
    }
  })

  effects.forEach(effect => {
    if (effect.options.schedule) {
      effect.options.schedule(effect);
    } else {
      effect();
    }
  })
}