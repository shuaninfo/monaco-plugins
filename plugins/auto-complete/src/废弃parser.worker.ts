// 废弃 做测试使用
import { mysqlParser } from '@shuaninfo/sql-parser';
import { getVal } from './utils.js'
// import { get, find, filter } from 'lodash-es';
const ctx: Worker = self as any;
ctx.onmessage = (message: any) => {
  console.log('[work]#onmessage:', message.data)
  console.log(getVal('xx: 3333'))
  const xx = `SELECT * FROM bananas WHERE color = 'red'`
  const result = mysqlParser(xx)
  postMessage({
    text: '你好小红',
    xx,
    result
    // data: get({ a: '1' }, 'a'),
    // result: result
  })
}
