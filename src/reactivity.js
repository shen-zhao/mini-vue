const targetMap = new WeakMap();
const activeEffect = null;

export const reactive = (target) => {
  const proxy = new Proxy(target, {
    get(target, property, receiver) {

    }
  });

  return proxy;
}

const track = (target) => {

}