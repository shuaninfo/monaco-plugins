// https://www.cnblogs.com/oneweek/p/11236515.html
// https://blog.csdn.net/u014627807/article/details/109809378
module.exports = {
  // printWidth: 500,
  "semi": false, // 末尾添加分号
  "singleQuote": true,
  // 大括号内的首尾需要空格
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "insertPragma": false,
  // 使用默认的折行标准
  proseWrap: 'always',
  // 结尾处不加逗号
  "trailingComma": "none",
  "tabWidth": 2,
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 换行符使用 lf
  endOfLine: 'lf'
}
