import { IToken, Lexer } from '@shuaninfo/lexer';

declare class Scanner {
    private tokens;
    private index;
    constructor(tokens: IToken[], index?: number);
    read: () => false | IToken;
    next: () => void;
    isEnd: () => boolean;
    getIndex: () => number;
    setIndex: (index: number) => number;
    getRestTokenCount: () => number;
    getNextByToken: (token: IToken) => IToken;
    getTokenByCharacterIndex: (characterIndex: number) => IToken;
    getPrevTokenByCharacterIndex: (characterIndex: number) => {
        prevToken: IToken;
        prevTokenIndex: number;
    };
    getNextTokenFromCharacterIndex: (characterIndex: number) => IToken;
    addToken: (token: IToken) => void;
}

interface IMatch {
    token?: IToken;
    match: boolean;
}
interface IMatchTokenTypeOption {
    includes?: string[];
    excludes?: string[];
}
declare const matchTokenType: (tokenType: string, opts?: IMatchTokenTypeOption) => {
    (): (scanner: Scanner, isCostToken?: boolean) => IMatch;
    parserName: string;
    displayName: string;
};
declare const optional: (...elements: IElements) => ChainNodeFactory;
declare const plus: (...elements: IElements) => () => ChainNodeFactory;
declare const many: (...elements: IElements) => ChainNodeFactory;

interface IParseResult {
    success: boolean;
    ast: IAst;
    cursorKeyPath: string[];
    nextMatchings: IMatching[];
    error: {
        token: IToken;
        reason: 'wrong' | 'incomplete';
        suggestions: IMatching[];
    };
    debugInfo: {
        tokens: IToken[];
        callVisiterCount: number;
        costs: {
            lexer: number;
            parser: number;
        };
    };
}
declare type FirstOrFunctionSet = MatchNode | ChainFunction;
declare type IMatchFn = (scanner: Scanner, isCostToken: boolean) => IMatch;
declare type IAst = IToken | any;
declare type Node = MatchNode | FunctionNode | TreeNode | ChainNode;
declare type ParentNode = TreeNode | ChainNode;
interface IMatching {
    type: 'string' | 'loose' | 'special';
    value: string | boolean;
}
declare type SingleElement = string | any;
declare type IElement = SingleElement | SingleElement[];
declare type IElements = IElement[];
declare type ISolveAst = (astResult: IAst[]) => IAst;
declare type Chain = (...elements: IElements) => (solveAst?: ISolveAst) => ChainNodeFactory;
declare type ChainNodeFactory = (parentNode?: ParentNode, creatorFunction?: ChainFunction, parentIndex?: number, parser?: Parser) => ChainNode;
declare type ChainFunction = () => ChainNodeFactory;
interface IChance {
    node: ParentNode;
    childIndex: number;
    tokenIndex: number;
}
declare const parserMap: Map<ChainFunction, Parser>;
declare const MAX_VISITER_CALL = 1000000;
declare class Parser {
    rootChainNode: ChainNode;
    firstSet: Map<ChainFunction, MatchNode[]>;
    firstOrFunctionSet: Map<ChainFunction, FirstOrFunctionSet[]>;
    relatedSet: Map<ChainFunction, Set<ChainFunction>>;
}
declare class VisiterStore {
    scanner: Scanner;
    parser: Parser;
    restChances: IChance[];
    stop: boolean;
    constructor(scanner: Scanner, parser: Parser);
}
declare class VisiterOption {
    onCallVisiter?: (node?: Node, store?: VisiterStore) => void;
    onVisiterNextNode?: (node?: Node, store?: VisiterStore) => void;
    onSuccess?: () => void;
    onFail?: (lastNode?: Node) => void;
    onMatchNode: (matchNode: MatchNode, store: VisiterStore, visiterOption: VisiterOption) => void;
    generateAst?: boolean;
    enableFirstSet?: boolean;
}
declare class ChainNode {
    parentIndex: number;
    parentNode: ParentNode;
    childs: Node[];
    astResults?: IAst[];
    creatorFunction: ChainFunction;
    functionName: string;
    solveAst: ISolveAst;
    constructor(parentIndex: number);
}
declare class TreeNode {
    parentIndex: number;
    parentNode: ParentNode;
    childs: Node[];
    constructor(parentIndex: number);
}
declare class FunctionNode {
    chainFunction: ChainFunction;
    parentIndex: number;
    parser: Parser;
    parentNode: ParentNode;
    constructor(chainFunction: ChainFunction, parentIndex: number, parser: Parser);
    run: () => ChainNode;
}
declare class MatchNode {
    private matchFunction;
    matching: IMatching;
    parentIndex: number;
    parentNode: ParentNode;
    constructor(matchFunction: IMatchFn, matching: IMatching, parentIndex: number);
    run: (scanner: Scanner, isCostToken?: boolean) => IMatch;
}
declare class CreateParserOptions {
    cursorTokenExcludes?: (token?: IToken) => boolean;
}

declare const chain: Chain;
declare const createParser: <AST = {}>(root: ChainFunction, lexer: Lexer, options?: CreateParserOptions) => (text: string, cursorIndex?: number) => IParseResult;

export { Chain, ChainFunction, ChainNode, ChainNodeFactory, CreateParserOptions, FirstOrFunctionSet, FunctionNode, IAst, IChance, IElement, IElements, IMatchFn, IMatching, IParseResult, ISolveAst, MAX_VISITER_CALL, MatchNode, Node, ParentNode, Parser, Scanner, SingleElement, TreeNode, VisiterOption, VisiterStore, chain, createParser, many, matchTokenType, optional, parserMap, plus };
