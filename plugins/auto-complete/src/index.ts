// @ts-nocheck
// const CustomWorkerClass = require('./parser.worker2.ts').default
// console.log(CustomWorkerClass)

// 支持wts和wjs
// @ts-nocheck
// import xx from 'web-worker:./parser.worker2.ts';
import Worker from 'web-worker(./parser.worker2.ts)';
console.log('Worker: ', Worker)
const worker = new Worker()
console.log('worker: ', worker)
worker.onmessage = function (event) {
  console.log('-----worker Received message ' + event.data);
}
worker.postMessage('Hello World');
export const monacoSqlAutocomplete = (a, b) => {
  // console.log('monacoSqlAutocomplete(): ', a, b)
}
