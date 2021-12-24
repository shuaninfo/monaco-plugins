import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import { mysqlParser } from '@shuaninfo/sql-parser';
const result = mysqlParser(`SELECT *
FROM bananas
WHERE color = 'red'`);
console.log('result:', result)
new Vue({
  render: h => h(App),
}).$mount('#app')
