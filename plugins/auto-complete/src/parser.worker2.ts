import { getVal } from './utils.js'

const ctx: Worker = self as any;
ctx.onmessage = (message: any) => {
  console.log('---onmessage:', message.data)
  console.log(getVal('xx: '))
  postMessage(`Hello ${message.data}`)
}
