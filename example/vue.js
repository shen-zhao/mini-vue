import { createApp, reactive, createVNode, createTextVNode } from '../src/index.js';

const app = createApp({
  setup() {
    let data = reactive({
      count: 0
    })

    let add = () => {
      data.count++
    }

    let decrease = () => {
      data.count--
    }

    return () => {
      return createVNode('div', {}, [
        createVNode('button', {
          onClick: (ev) => {
            console.log('add', ev)
            add()
          }
        }, [
          createTextVNode('+')
        ]),
        createTextVNode(` ${data.count}  `),
        createVNode('button', {
          onClick: (ev) => {
            console.log('decrease', ev)
            decrease()
          }
        }, [
          createTextVNode('-')
        ]),
      ])
    }
  }
});

app.mount('#root')
