/* eslint-disable no-useless-constructor */
import { get, upperCase } from 'lodash-es';
import { IMatching, IParseResult } from '@shuaninfo/parser';
// ITableInfo, reader, ICursorInfo
import { ITableInfo, ICompletionItem, IStatement, reader, ICursorInfo } from '@shuaninfo/sql-parser';
export { IParseResult, ICompletionItem, reader, ICursorInfo, ITableInfo }
export type IMonacoVersion = '0.19.3' | '0.30.1'

export type IParserType = 'mysql' | 'odps' | 'blink' | 'dsql' | 'grail' | 'emcsql';

export class DefaultOpts {
  public monacoEditorVersion: IMonacoVersion = '0.19.3';

  public parserType: IParserType = 'odps';

  public language = 'sql';

  constructor(private monaco: any) {
    //
  }

  public onParse = (_: IParseResult) => {
    //
  };

  public onSuggestTableNames?: (cursorInfo?: ICursorInfo<ITableInfo>) => Promise<ICompletionItem[]> = _ => {
    return Promise.resolve(
      // TODO: 表名
      ['dt', 'b2b', 'tmall', 'account'].map(name => {
        return {
          label: name,
          insertText: name,
          sortText: `A${name}`,
          kind: this.monaco.languages.CompletionItemKind.Folder,
        };
      }),
    );
  };

  public onSuggestTableFields?: (
    tableInfo?: ITableInfo,
    cursorValue?: string,
    rootStatement?: IStatement,
  ) => Promise<ICompletionItem[]> = tableInfo => {
    return Promise.resolve(
      // TODO: 表下面的字段, subnodes
      ['_aa', '_bb', '_cc']
        .map(eachName => {
          return get(tableInfo, 'namespace.value', '') + get(tableInfo, 'tableName.value', '') + eachName;
        })
        .map(fieldName => {
          return {
            label: fieldName,
            insertText: fieldName,
            sortText: `B${fieldName}`,
            kind: this.monaco.languages.CompletionItemKind.Field,
          };
        }),
    );
  };

  public pipeKeywords = (keywords: IMatching[]) => {
    return keywords
      .filter(matching => {
        return matching.type === 'string';
      })
      .map(matching => {
        const value = /[a-zA-Z]+/.test(matching.value.toString())
          ? upperCase(matching.value.toString())
          : matching.value.toString();
        return {
          label: value,
          insertText: value,
          documentation: 'documentation',
          detail: 'detail',
          kind: this.monaco.languages.CompletionItemKind.Keyword,
          sortText: `W${matching.value}`,
        };
      });
  };

  public onSuggestFunctionName?: (inputValue?: string) => Promise<ICompletionItem[]> = inputValue => {
    return Promise.resolve(
      // TODO: 自定义方法
      ['sum', 'count', 'cast'].map(each => {
        return {
          label: each,
          insertText: each,
          sortText: `C${each}`,
          kind: this.monaco.languages.CompletionItemKind.Function,
        };
      }),
    );
  };

  public onSuggestFieldGroup?: (tableNameOrAlias?: string) => ICompletionItem = tableNameOrAlias => {
    return {
      label: tableNameOrAlias,
      insertText: tableNameOrAlias,
      sortText: `D${tableNameOrAlias}`,
      kind: this.monaco.languages.CompletionItemKind.Folder,
    };
  };

  public onHoverTableField?: (fieldName?: string, extra?: ICompletionItem) => Promise<any> = (...args) => {
    return Promise.resolve([
      { value: 'onHoverTableField' },
      {
        value: `\`\`\`json\n${JSON.stringify(args, null, 2)}\n\`\`\``,
      },
    ]);
  };

  public onHoverTableName?: (cursorInfo?: ICursorInfo) => Promise<any> = (...args) => {
    return Promise.resolve([
      { value: 'onHoverTableName' },
      {
        value: `\`\`\`json\n${JSON.stringify(args, null, 2)}\n\`\`\``,
      },
    ]);
  };

  public onHoverFunctionName?: (functionName?: string) => Promise<any> = (...args) => {
    return Promise.resolve([
      { value: 'onHoverFunctionName' },
      {
        value: `\`\`\`json\n${JSON.stringify(args, null, 2)}\n\`\`\``,
      },
    ]);
  };
}
