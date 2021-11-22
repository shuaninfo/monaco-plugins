interface IToken {
    type: string;
    value: string;
    position?: [number, number];
}

interface ILexerConfig {
    type: string;
    regexes: RegExp[];
    /**
     * Will match, by not add to token list.
     */
    ignore?: boolean;
}
declare type Lexer = (text: string) => IToken[];
declare const createLexer: (lexerConfig: ILexerConfig[]) => Lexer;

export { IToken, Lexer, createLexer };
