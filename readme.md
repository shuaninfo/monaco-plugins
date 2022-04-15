# @shuaninfo/monaco-plugins

> fork: [ascoders/syntax-parser](https://github.com/ascoders/syntax-parser)



Github: https://github.com/shuaninfo/monaco-plugins

Gitee: https://gitee.com/anshuinfo/monaco-plugins





### 目录结构

```js
// monaco插件项目，使用yarn的workspaces管理，使用tsup打包。有些依赖包可能没有用到。
|- root
	|- examples					// 测试项目，可运行
  |- packages					// 基础包，工具包等，如：sql-parser
		|- parser
		|- sql-parser
	|- plugins					// 插件包，当前只有auto-complete
		|- auto-complete	// 自动补全插件
		|- xxx
```





### 插件列表

* monaco 自动补全
* 



```shell
git clone https://github.com/shuaninfo/monaco-plugins.git
cd monaco-plugins

yarn install

yarn dev
```



