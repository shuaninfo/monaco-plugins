import * as fs from 'fs';
import * as path from 'path';
import { mysqlParser } from '../index';
const sqlTests: {
  groupName: string;
  childs: {
    name: string;
    content: string;
  }[];
}[] = [];
const sqlGroups = fs.readdirSync(path.join(__dirname, './sqls'));

sqlGroups.forEach(sqlGroup => {
  const sqlTest = { groupName: sqlGroup, childs: [] as any };
  sqlTests.push(sqlTest);

  const eachSqlNames = fs.readdirSync(path.join(__dirname, './sqls', sqlGroup));
  eachSqlNames.forEach(eachSqlName => {
    if (!eachSqlName.endsWith('.sql')) {
      return;
    }

    const sqlContent = fs.readFileSync(path.join(__dirname, './sqls', sqlGroup, eachSqlName)).toString();
    const sqlDetail = {
      name: eachSqlName,
      content: sqlContent,
    };
    sqlTest.childs.push(sqlDetail);
  });
});
describe('mysql-parser',()=>{
  sqlTests.forEach(sqlTest => {
    sqlTest.childs.forEach(eachTest => {
      test(`${sqlTest.groupName}.${eachTest.name}`, () => {
        const result = mysqlParser(eachTest.content);
        expect(result.success).toBe(true);
      });
    });
  });
})