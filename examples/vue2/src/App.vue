<template>
  <div id="app">
    <div id="monaco-container" class="monaco-eidort" style="width: 100%;height:500px;"></div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
import { get } from 'lodash-es';
import { monacoSqlAutocomplete } from '@shuaninfo/auto-complete'
export default {
  name: 'App',
  methods:{
    initEditor(){
      // 初始化编辑器，确保dom已经渲染
      this.editor = monaco.editor.create(document.getElementById('monaco-container'), {
          value:'SELECT aaa.account_aa from account aaa', //编辑器初始显示文字
          language:'sql',//语言支持自行查阅demo
          automaticLayout: true,//自动布局
      })
      monacoSqlAutocomplete(monaco, this.editor, {
        // 自定义表名
        onSuggestTableNames:(cursorInfo)=>{
          return Promise.resolve(
            ['dt2','dt', 'b2b', 'tmall', 'account'].map(name => {
              return {
                label: name,
                insertText: name,
                sortText: `A${name}`,
                kind: monaco.languages.CompletionItemKind.Folder,
              };
            }),
          );
        },
        // 自定义表字段
        onSuggestTableFields: (
          tableInfo,
          cursorValue,
          rootStatement,
        )=> {
          return Promise.resolve(
            // TODO: 表下面的字段, subnodes
            ['_customField','_aa', '_bb', '_cc']
              .map(eachName => {
                return get(tableInfo, 'namespace.value', '') + get(tableInfo, 'tableName.value', '') + eachName;
              })
              .map(fieldName => {
                return {
                  label: fieldName,
                  insertText: fieldName,
                  sortText: `B${fieldName}`,
                  kind: monaco.languages.CompletionItemKind.Field,
                };
              }),
          );
        },
        // 自定义方法名
        onSuggestFunctionName:(inputValue)=>{
          return Promise.resolve(
            ['custom_func','sum', 'count', 'cast'].map(each => {
              return {
                label: each,
                insertText: each,
                sortText: `C${each}`,
                kind: monaco.languages.CompletionItemKind.Function,
              };
            }),
          );
        },
        // 
      })
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
