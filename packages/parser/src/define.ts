import { IToken } from '@shuaninfo/lexer';
import { IMatch } from './match';
import { Scanner } from './scanner';
 
// tslint:disable:max-classes-per-file

export interface IParseResult {
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

export type FirstOrFunctionSet = MatchNode | ChainFunction;

export type IMatchFn = (scanner: Scanner, isCostToken: boolean) => IMatch;

// IToken | Array<IToken> | any return object from resolveAst().
export type IAst = IToken | any;

export type Node = MatchNode | FunctionNode | TreeNode | ChainNode;

export type ParentNode = TreeNode | ChainNode;

export interface IMatching {
  // loose not cost token, and result is fixed true of false.
  type: 'string' | 'loose' | 'special';
  value: string | boolean;
}

export type SingleElement = string | any;

export type IElement = SingleElement | SingleElement[];

export type IElements = IElement[];

export type ISolveAst = (astResult: IAst[]) => IAst;

export type Chain = (...elements: IElements) => (solveAst?: ISolveAst) => ChainNodeFactory;

export type ChainNodeFactory = (
  parentNode?: ParentNode,
  // If parent node is a function, here will get it's name.
  creatorFunction?: ChainFunction,
  parentIndex?: number,
  parser?: Parser,
) => ChainNode;

export type ChainFunction = () => ChainNodeFactory;

export interface IChance {
  node: ParentNode;
  childIndex: number;
  tokenIndex: number;
}

// ////////////////////////////////////// Const or Variables

export const parserMap = new Map<ChainFunction, Parser>();
export const MAX_VISITER_CALL = 1000000;

export class Parser {
    rootChainNode: ChainNode = null
 
    firstSet = new Map<ChainFunction, MatchNode[]>();

      firstOrFunctionSet = new Map<ChainFunction, FirstOrFunctionSet[]>();
  
    relatedSet = new Map<ChainFunction, Set<ChainFunction>>();
}

export class VisiterStore {
    restChances: IChance[] = [];

    stop = false;

  // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-parameter-properties
  constructor(  _scanner: Scanner,   _parser: Parser) {
    //
  }
}

export class VisiterOption {
    onCallVisiter?: (node?: Node, store?: VisiterStore) => void;

    onVisiterNextNode?: (node?: Node, store?: VisiterStore) => void;

    onSuccess?: () => void;

    onFail?: (lastNode?: Node) => void;

    onMatchNode: (matchNode: MatchNode, store: VisiterStore, visiterOption: VisiterOption) => void;

    generateAst?: boolean = true;

       enableFirstSet?: boolean = true;
}

export class ChainNode {
  parentNode: ParentNode;

  childs: Node[] = [];

  astResults?: IAst[] = [];

  // Eg: const foo = chain => chain()(), so the chain creatorFunction is 'foo'.
  creatorFunction: ChainFunction = null;

  // Only user function can have functionName.
  functionName: string;

  solveAst: ISolveAst = null;

  // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-parameter-properties
  constructor(_parentIndex: number) {
    //
  }
}

export class TreeNode {
  parentNode: ParentNode;

  childs: Node[] = [];

  // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-parameter-properties
  constructor(_parentIndex: number) {
    //
  }
}

export class FunctionNode {
  parentNode: ParentNode;

  // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-parameter-properties
  constructor(_chainFunction: ChainFunction, _parentIndex: number, _parser: Parser) {
    //
  }

  run = () => {
    // @ts-ignore
    return this.chainFunction()(this.parentNode, this.chainFunction, this.parentIndex, this.parser);
  };
}

export class MatchNode {
  parentNode: ParentNode;

  // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-parameter-properties
  constructor(private matchFunction: IMatchFn, _matching: IMatching, _parentIndex: number) {
    //
  }

  run = (scanner: Scanner, isCostToken = true) => {
    return this.matchFunction(scanner, isCostToken);
  };
}

export class CreateParserOptions {
  cursorTokenExcludes?: (token?: IToken) => boolean = () => {
    return false;
  };
}
