import { createApp, reactive, createVNode, createTextVNode } from '../src/index.js';

const Title = {
  setup(props) {
    return () => {
      return createVNode('h1', {}, [
        createTextVNode(props.title)
      ])
    }
  }
}

const app = createApp({
  setup() {
    let data = reactive({
      count: 0,
      title: ''
    })

    let add = () => {
      data.count++
      data.count++
      data.count++
      data.count++
    }

    let decrease = () => {
      data.count--
    }

    let onChange = (e) => {
      console.log(e.target.value)
      data.title = e.target.value
    }

    return () => {
      console.log('render root', data.count)
      return createVNode('div', {}, [
        createVNode(Title, {
          title: data.title
        }),
        createVNode('input', {
          value: data.title,
          onInput: onChange
        }),
        createVNode('button', {
          style: {
            padding: '10px 20px'
          },
          onClick: (ev) => {
            add()
          }
        }, [
          createTextVNode('+')
        ]),
        createTextVNode(` ${data.count} `),
        createVNode('button', {
          style: {
            padding: '10px 20px'
          },
          onClick: (ev) => {
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
