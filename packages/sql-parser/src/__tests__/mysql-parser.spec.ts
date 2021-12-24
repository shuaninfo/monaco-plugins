import * as fs from 'fs';
import * as path from 'path';

import { mysqlParser } from '../index'

describe('mysql-parser-demo', () => {
  it('', () => {
    const result = mysqlParser(`
      SELECT
      apple as "The Apple",
      pear The_Pear,
      orange AS TheOrange,
      pineapple whereKeyword
    FROM bananas AS b;
  `);
    console.log('result: ', result)
    return expect(true).toBe(result.success);
  })
})

describe('mysql-parser-all', () => {

  const sqlTests: {
    groupName: string;
    childs: {
      name: string;
      content: string;
    }[];
  }[] = [];

  const SQL_DIR = './mysql-sqls'

  const sqlGroups = fs.readdirSync(path.join(__dirname, SQL_DIR));

  sqlGroups.forEach(sqlGroup => {
    if (sqlGroup.startsWith('.')) {
      // 忽略.DS_Store .git 等文件/文件夹
      return true
    }
    const sqlTest = { groupName: sqlGroup, childs: [] as any };
    sqlTests.push(sqlTest);

    const eachSqlNames = fs.readdirSync(path.join(__dirname, SQL_DIR, sqlGroup));
    eachSqlNames.forEach(eachSqlName => {
      if (!eachSqlName.endsWith('.sql')) {
        return;
      }

      const sqlContent = fs.readFileSync(path.join(__dirname, SQL_DIR, sqlGroup, eachSqlName)).toString();
      const sqlDetail = {
        name: eachSqlName,
        content: sqlContent,
      };
      sqlTest.childs.push(sqlDetail);
    });
  });

  sqlTests.forEach(sqlTest => {
    sqlTest.childs.forEach(eachTest => {
      it(`${sqlTest.groupName}.${eachTest.name}`, () => {
        const result = mysqlParser(eachTest.content);
        expect(result.success).toBe(true);
      });
    });
  });
})