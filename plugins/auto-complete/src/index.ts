// @ts-nocheck
// const CustomWorkerClass = require('./parser.worker2.ts').default
// console.log(CustomWorkerClass)

// 支持wts和wjs
// @ts-nocheck
// import xx from 'web-worker:./parser.worker2.ts';
import Worker from 'web-worker(./parser.worker2.ts)';
const worker = new Worker()
console.log('worker: ', worker)
worker.onmessage = function (event) {
  console.log('[main]#onmessage: ' + event.data);
}
worker.postMessage('发送Hello World');
export const monacoSqlAutocomplete = (a, b) => {
  // console.log('monacoSqlAutocomplete(): ', a, b)
}
