// @ts-ignore
import Worker from 'web-worker(./parser.worker.ts)';
const worker = new Worker()
worker.onmessage = function (event: any) {
  console.log('[main]#onmessage: ', event.data);
}
worker.postMessage('你好小明');
export const monacoSqlAutocomplete = (a: any, b: any) => {
  console.log('monacoSqlAutocomplete(): ', a, b)
}
