import { mysqlParser } from '@shuaninfo/sql-parser';

const ctx: Worker = self as any;
ctx.onmessage = (event: any) => {
  ctx.postMessage(mysqlParser(event.data.text, event.data.index));
}
