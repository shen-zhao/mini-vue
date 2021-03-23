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
  console.log(data.count);
  if (data.count < 100) {
    data.count++
  }
  // console.log('count', data.count);
  // effect(() => {
  //   console.log('age', data.age);
  // })
}, { allowRecurse: true });

// data.count++;

// setTimeout(() => {
//   data.count++;
// }, 2000)


