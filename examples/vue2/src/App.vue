<template>
  <div id="app">
    <div id="monaco-container" class="monaco-eidort" style="width: 100%;height:500px;"></div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
import {monacoSqlAutocomplete}from '@shuaninfo/auto-complete'
import { mysqlParser } from '@shuaninfo/sql-parser';
const result = mysqlParser(`SELECT *
FROM bananas
WHERE color = 'red'`);
console.log('[app.vue] mysqlParser:', result)
export default {
  name: 'App',
  methods:{
    initEditor(){
      // 初始化编辑器，确保dom已经渲染
      this.editor = monaco.editor.create(document.getElementById('monaco-container'), {
          value:'', //编辑器初始显示文字
          language:'sql',//语言支持自行查阅demo
          automaticLayout: true,//自动布局
      })
      monacoSqlAutocomplete(monaco, this.editor)
    }
  },
  mounted(){
    this.initEditor();  
  }
}
</script>

<style>
html,body{
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: gray;
  margin-top: 60px;
}
.monaco-eidort{
  
}
</style>
