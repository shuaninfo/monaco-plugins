import * as _shuaninfo_parser from '@shuaninfo/parser';
import { IToken } from '@shuaninfo/parser';
export { IMatching, IParseResult, IToken } from '@shuaninfo/parser';

declare type IStatements = IStatement[];
interface IStatement {
    type: 'statement' | 'identifier';
    variant: string;
}
interface ISelectStatement extends IStatement {
    from: IFrom;
    result: IResult[];
}
interface IResult extends IStatement {
    name: IToken;
    alias: IToken;
}
interface IFrom extends IStatement {
    sources: ISource[];
    where?: any;
    group?: any;
    having?: any;
}
interface ISource extends IStatement {
    name: ITableInfo & IStatement;
    alias: IToken;
}
interface ITableInfo {
    tableName: IToken;
    namespace: IToken;
}
interface ICompletionItem {
    label: string;
    kind?: string;
    sortText?: string;
    tableInfo?: ITableInfo;
    groupPickerName?: string;
    originFieldName?: string;
    detail?: string;
    documentation?: string;
}
declare type CursorType = 'tableField' | 'tableName' | 'namespace' | 'namespaceOne' | 'functionName' | 'tableFieldAfterGroup';
declare type ICursorInfo<T = {}> = {
    token: IToken;
    type: CursorType;
} & T;
declare type IGetFieldsByTableName = (tableName: ITableInfo, inputValue: string, rootStatement: IStatement) => Promise<ICompletionItem[]>;

declare function getCursorInfo(rootStatement: IStatements, keyPath: string[]): Promise<{
    token: _shuaninfo_parser.IToken;
    type: CursorType;
}>;
declare function findNearestStatement(rootStatement: IStatements, keyPath: string[], callback?: (value?: any) => boolean): ISelectStatement;
declare function getFieldsFromStatement(rootStatement: IStatements, cursorKeyPath: string[], getFieldsByTableName: IGetFieldsByTableName): Promise<ICompletionItem[]>;
declare function findFieldExtraInfo(rootStatement: IStatements, cursorInfo: ICursorInfo, getFieldsByTableName: IGetFieldsByTableName, fieldKeyPath: string[]): Promise<ICompletionItem>;

declare const reader_getCursorInfo: typeof getCursorInfo;
declare const reader_findNearestStatement: typeof findNearestStatement;
declare const reader_getFieldsFromStatement: typeof getFieldsFromStatement;
declare const reader_findFieldExtraInfo: typeof findFieldExtraInfo;
declare namespace reader {
  export {
    reader_getCursorInfo as getCursorInfo,
    reader_findNearestStatement as findNearestStatement,
    reader_getFieldsFromStatement as getFieldsFromStatement,
    reader_findFieldExtraInfo as findFieldExtraInfo,
  };
}

declare const mysqlParser: (text: string, cursorIndex?: number) => _shuaninfo_parser.IParseResult;

export { CursorType, ICompletionItem, ICursorInfo, IFrom, IGetFieldsByTableName, IResult, ISelectStatement, ISource, IStatement, IStatements, ITableInfo, mysqlParser, reader };
