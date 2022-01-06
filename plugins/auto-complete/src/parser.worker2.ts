import { getVal } from './utils.js'
onmessage = (message: any) => {
  console.log(getVal('xx: '))
  postMessage(`Hello ${message.data}`)
}
// const a = 1
