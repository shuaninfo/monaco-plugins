// @ts-ignore
import Worker from 'web-worker(./web-worker/parser.ts)';
import { DefaultOpts, IMonacoVersion, IParserType, IParseResult, ICompletionItem, reader, ICursorInfo, ITableInfo } from './default-opts';
import { defaults, groupBy } from 'lodash-es';
export * from './languages/index'


const supportedMonacoEditorVersion = ['0.19.3'];
export const monacoSqlAutocomplete = (monaco: any, editor: any, opts?: Partial<DefaultOpts>) => {
  opts = defaults(opts || {}, new DefaultOpts(monaco));
  if (supportedMonacoEditorVersion.indexOf(opts.monacoEditorVersion) === -1) {
    throw Error(
      `monaco-editor version ${opts.monacoEditorVersion
      } is not allowed, only support ${supportedMonacoEditorVersion.join(' ')}`,
    );
  }
  let currentParserPromise: any = null;
  let editVersion = 0;
  // console.log('editor: ', editor, currentParserPromise, editVersion)

  editor.onDidChangeModelContent((_: any) => {
    editVersion++;
    const currentEditVersion = editVersion;
    currentParserPromise = new Promise(resolve => {
      setTimeout(() => {
        const model = editor.getModel();

        asyncParser(editor.getValue(), model.getOffsetAt(editor.getPosition()), opts.parserType).then(parseResult => {
          resolve(parseResult);

          if (currentEditVersion !== editVersion) {
            return;
          }

          opts.onParse(parseResult);

          if (parseResult.error) {
            const newReason =
              parseResult.error.reason === 'incomplete'
                ? `Incomplete, expect next input: \n${parseResult.error.suggestions
                  .map((each: any) => {
                    return each.value;
                  })
                  .join('\n')}`
                : `Wrong input, expect: \n${parseResult.error.suggestions
                  .map((each: any) => {
                    return each.value;
                  })
                  .join('\n')}`;

            const errorPosition = parseResult.error.token
              ? {
                startLineNumber: model.getPositionAt(parseResult.error.token.position[0]).lineNumber,
                startColumn: model.getPositionAt(parseResult.error.token.position[0]).column,
                endLineNumber: model.getPositionAt(parseResult.error.token.position[1]).lineNumber,
                endColumn: model.getPositionAt(parseResult.error.token.position[1]).column + 1,
              }
              : {
                startLineNumber: 0,
                startColumn: 0,
                endLineNumber: 0,
                endColumn: 0,
              };

            model.getPositionAt(parseResult.error.token);

            monaco.editor.setModelMarkers(model, opts.language, [
              {
                ...errorPosition,
                message: newReason,
                severity: getSeverityByVersion(monaco, opts.monacoEditorVersion),
              },
            ]);
          } else {
            monaco.editor.setModelMarkers(editor.getModel(), opts.language, []);
          }
        });
      });
    });
  })

  monaco.languages.registerCompletionItemProvider(opts.language, {
    triggerCharacters: ' $.:{}=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    provideCompletionItems: async () => {
      const currentEditVersion = editVersion;
      const parseResult: IParseResult = await currentParserPromise;

      if (currentEditVersion !== editVersion) {
        return returnCompletionItemsByVersion([], opts.monacoEditorVersion);
      }

      const cursorInfo = await reader.getCursorInfo(parseResult.ast, parseResult.cursorKeyPath);

      const parserSuggestion = opts.pipeKeywords(parseResult.nextMatchings);

      if (!cursorInfo) {
        return returnCompletionItemsByVersion(parserSuggestion, opts.monacoEditorVersion);
      }

      switch (cursorInfo.type) {
        case 'tableField':
          const cursorRootStatementFields = await reader.getFieldsFromStatement(
            parseResult.ast,
            parseResult.cursorKeyPath,
            opts.onSuggestTableFields,
          );

          // group.fieldName
          const groups = groupBy(
            cursorRootStatementFields.filter(cursorRootStatementField => {
              return cursorRootStatementField.groupPickerName !== null;
            }),
            'groupPickerName',
          );

          const functionNames = await opts.onSuggestFunctionName(cursorInfo.token.value);

          return returnCompletionItemsByVersion(
            cursorRootStatementFields
              .concat(parserSuggestion)
              .concat(functionNames)
              .concat(
                groups
                  ? Object.keys(groups).map(groupName => {
                    return opts.onSuggestFieldGroup(groupName);
                  })
                  : [],
              ),
            opts.monacoEditorVersion,
          );
        case 'tableFieldAfterGroup':
          // 字段 . 后面的部分
          const cursorRootStatementFieldsAfter = await reader.getFieldsFromStatement(
            parseResult.ast,
            parseResult.cursorKeyPath as any,
            opts.onSuggestTableFields,
          );

          return returnCompletionItemsByVersion(
            cursorRootStatementFieldsAfter
              .filter((cursorRootStatementField: any) => {
                return (
                  cursorRootStatementField.groupPickerName ===
                  (cursorInfo as ICursorInfo<{ groupName: string }>).groupName
                );
              })
              .concat(parserSuggestion),
            opts.monacoEditorVersion,
          );
        case 'tableName':
          const tableNames = await opts.onSuggestTableNames(cursorInfo as ICursorInfo<ITableInfo>);

          return returnCompletionItemsByVersion(tableNames.concat(parserSuggestion), opts.monacoEditorVersion);
        case 'functionName':
          return opts.onSuggestFunctionName(cursorInfo.token.value);
        default:
          return returnCompletionItemsByVersion(parserSuggestion, opts.monacoEditorVersion);
      }
    },
  });
  monaco.languages.registerHoverProvider(opts.language, {
    provideHover: async (model: any, position: any) => {
      const parseResult: IParseResult = await asyncParser(
        editor.getValue(),
        model.getOffsetAt(position),
        opts.parserType,
      );

      const cursorInfo = await reader.getCursorInfo(parseResult.ast, parseResult.cursorKeyPath);

      if (!cursorInfo) {
        return null as any;
      }

      let contents: any = [];

      switch (cursorInfo.type) {
        case 'tableField':
          const extra = await reader.findFieldExtraInfo(
            parseResult.ast,
            cursorInfo,
            opts.onSuggestTableFields,
            parseResult.cursorKeyPath,
          );
          contents = await opts.onHoverTableField(cursorInfo.token.value, extra);
          break;
        case 'tableFieldAfterGroup':
          const extraAfter = await reader.findFieldExtraInfo(
            parseResult.ast,
            cursorInfo,
            opts.onSuggestTableFields,
            parseResult.cursorKeyPath,
          );
          contents = await opts.onHoverTableField(cursorInfo.token.value, extraAfter);
          break;
        case 'tableName':
          contents = await opts.onHoverTableName(cursorInfo as ICursorInfo);
          break;
        case 'functionName':
          contents = await opts.onHoverFunctionName(cursorInfo.token.value);
          break;
        default:
      }

      return {
        range: monaco.Range.fromPositions(
          model.getPositionAt(cursorInfo.token.position[0]),
          model.getPositionAt(cursorInfo.token.position[1] + 1),
        ),
        contents,
      };
    },
  });
}


// 实例化一个 worker
const worker: Worker = new Worker();

let parserIndex = 0;

const asyncParser = async (text: string, index: number, parserType: IParserType) => {
  parserIndex++;
  const currentParserIndex = parserIndex;

  let resolve: any = null;
  let reject: any = null;

  const promise = new Promise((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  worker.postMessage({ text, index, parserType });

  worker.onmessage = (event: any) => {
    if (currentParserIndex === parserIndex) {
      resolve(event.data);
    } else {
      reject();
    }
  };

  return promise as Promise<IParseResult>;
};

function returnCompletionItemsByVersion(value: ICompletionItem[], monacoVersion: IMonacoVersion) {
  switch (monacoVersion) {
    case '0.19.3':
      return {
        suggestions: value,
      };
    default:
      throw Error('Not supported version');
  }
}

function getSeverityByVersion(monaco: any, monacoVersion: IMonacoVersion) {
  switch (monacoVersion) {
    case '0.19.3':
      return monaco.MarkerSeverity.Error;
    default:
      throw Error('Not supported version');
  }
}