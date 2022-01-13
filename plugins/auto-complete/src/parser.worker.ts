import { mysqlParser } from '@shuaninfo/sql-parser';

const ctx: Worker = self as any;
ctx.onmessage = event => {
  console.info('work 接收: ', event)
  // ctx.postMessage(mysqlParser(event.data.text || '', event.data.index || 0));
};

export default null as any
