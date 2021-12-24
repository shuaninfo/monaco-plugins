import { IParseResult, ICursorInfo, ITableInfo, ICompletionItem, IStatement, IMatching } from '@shuaninfo/sql-parser';

declare type IMonacoVersion = '0.13.2' | '0.15.6';
declare type IParserType = 'mysql' | 'odps' | 'blink' | 'dsql' | 'grail' | 'emcsql';
declare class DefaultOpts {
    private monaco;
    monacoEditorVersion: IMonacoVersion;
    parserType: IParserType;
    language: string;
    constructor(monaco: any);
    onParse: (_parseResult: IParseResult) => void;
    onSuggestTableNames?: (cursorInfo?: ICursorInfo<ITableInfo>) => Promise<ICompletionItem[]>;
    onSuggestTableFields?: (tableInfo?: ITableInfo, cursorValue?: string, rootStatement?: IStatement) => Promise<ICompletionItem[]>;
    pipeKeywords: (keywords: IMatching[]) => {
        label: string;
        insertText: string;
        documentation: string;
        detail: string;
        kind: any;
        sortText: string;
    }[];
    onSuggestFunctionName?: (inputValue?: string) => Promise<ICompletionItem[]>;
    onSuggestFieldGroup?: (tableNameOrAlias?: string) => ICompletionItem;
    onHoverTableField?: (fieldName?: string, extra?: ICompletionItem) => Promise<any>;
    onHoverTableName?: (cursorInfo?: ICursorInfo) => Promise<any>;
    onHoverFunctionName?: (functionName?: string) => Promise<any>;
}

declare function monacoSqlAutocomplete(monaco: any, editor: any, opts?: Partial<DefaultOpts>): void;

export { monacoSqlAutocomplete };
