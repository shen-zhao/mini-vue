import { createApp, reactive, effect } from '../src/index.js';

const app = createApp({
  setup() {
    return 'hh'
  }
});

console.log(app);

app.mount('#root');


const data = reactive({
  count: 1,
  age: 18
});

effect(() => {
  console.log('count', data.count);
  effect(() => {
    console.log('age', data.age);
  })
});

data.count++;

setTimeout(() => {
  data.age++;
}, 2000)


