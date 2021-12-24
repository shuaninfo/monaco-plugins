import { mysqlParser } from '@shuaninfo/sql-parser';

// const ctx2: Worker = self as any;

// export class ParserWorker {
//   ctx = ctx2;
//   constructor() {
//     this.ctx.onmessage = (event: any) => {
//       console.info('xxxxxx: event.data', event.data)
//       // this.ctx.postMessage('解析代码:...')
//       // this.ctx.postMessage(mysqlParser(event.data.text || '', event.data.index || 0));
//     };
//   }
// }

const ctx: Worker = self as any;
ctx.onmessage = event => {
  console.info('work 接收: ', event)
  // ctx.postMessage(mysqlParser(event.data.text || '', event.data.index || 0));
};

export default null as any
