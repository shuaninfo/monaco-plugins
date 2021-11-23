var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// src/index.ts
__export(exports, {
  ChainNode: () => ChainNode,
  CreateParserOptions: () => CreateParserOptions,
  FunctionNode: () => FunctionNode,
  MAX_VISITER_CALL: () => MAX_VISITER_CALL,
  MatchNode: () => MatchNode,
  Parser: () => Parser,
  Scanner: () => Scanner,
  TreeNode: () => TreeNode,
  VisiterOption: () => VisiterOption,
  VisiterStore: () => VisiterStore,
  chain: () => chain,
  createParser: () => createParser,
  many: () => many,
  matchTokenType: () => matchTokenType,
  optional: () => optional,
  parserMap: () => parserMap,
  plus: () => plus
});

// src/chain.ts
var import_lodash = __toModule(require("lodash"));

// src/define.ts
var parserMap = new Map();
var MAX_VISITER_CALL = 1e6;
var Parser = class {
  rootChainNode = null;
  firstSet = new Map();
  firstOrFunctionSet = new Map();
  relatedSet = new Map();
};
var VisiterStore = class {
  constructor(scanner, parser) {
    this.scanner = scanner;
    this.parser = parser;
  }
  restChances = [];
  stop = false;
};
var VisiterOption = class {
  onCallVisiter;
  onVisiterNextNode;
  onSuccess;
  onFail;
  onMatchNode;
  generateAst = true;
  enableFirstSet = true;
};
var ChainNode = class {
  constructor(parentIndex) {
    this.parentIndex = parentIndex;
  }
  parentNode;
  childs = [];
  astResults = [];
  creatorFunction = null;
  functionName;
  solveAst = null;
};
var TreeNode = class {
  constructor(parentIndex) {
    this.parentIndex = parentIndex;
  }
  parentNode;
  childs = [];
};
var FunctionNode = class {
  constructor(chainFunction, parentIndex, parser) {
    this.chainFunction = chainFunction;
    this.parentIndex = parentIndex;
    this.parser = parser;
  }
  parentNode;
  run = () => {
    return this.chainFunction()(this.parentNode, this.chainFunction, this.parentIndex, this.parser);
  };
};
var MatchNode = class {
  constructor(matchFunction, matching, parentIndex) {
    this.matchFunction = matchFunction;
    this.matching = matching;
    this.parentIndex = parentIndex;
  }
  parentNode;
  run = (scanner, isCostToken = true) => {
    return this.matchFunction(scanner, isCostToken);
  };
};
var CreateParserOptions = class {
  cursorTokenExcludes = () => {
    return false;
  };
};

// src/match.ts
function equalWordOrIncludeWords(str, word) {
  if (typeof word === "string") {
    return judgeMatch(str, word);
  }
  return word.some((eachWord) => {
    return judgeMatch(str, eachWord);
  });
}
function judgeMatch(source, target) {
  if (source === null) {
    return false;
  }
  return (source && source.toLowerCase()) === (target && target.toLowerCase());
}
function matchToken(scanner, compare, isCostToken) {
  const token = scanner.read();
  if (!token) {
    return {
      token: null,
      match: false
    };
  }
  if (compare(token)) {
    if (isCostToken) {
      scanner.next();
    }
    return {
      token,
      match: true
    };
  }
  return {
    token,
    match: false
  };
}
function createMatch(fn, specialName) {
  return (arg) => {
    function foo() {
      return (scanner, isCostToken) => {
        return fn(scanner, arg, isCostToken);
      };
    }
    foo.parserName = "match";
    foo.displayName = specialName;
    return foo;
  };
}
var match = createMatch((scanner, word, isCostToken) => {
  return matchToken(scanner, (token) => {
    return equalWordOrIncludeWords(token.value, word);
  }, isCostToken);
});
var matchTokenType = (tokenType, opts = {}) => {
  const options = __spreadValues({ includes: [], excludes: [] }, opts);
  return createMatch((scanner, word, isCostToken) => {
    return matchToken(scanner, (token) => {
      if (options.includes.some((includeValue) => {
        return judgeMatch(includeValue, token.value);
      })) {
        return true;
      }
      if (options.excludes.some((includeValue) => {
        return judgeMatch(includeValue, token.value);
      })) {
        return false;
      }
      if (token.type !== tokenType) {
        return false;
      }
      return true;
    }, isCostToken);
  }, tokenType)();
};
var matchTrue = () => {
  return {
    token: null,
    match: true
  };
};
var matchFalse = () => {
  return {
    token: null,
    match: true
  };
};
var optional = (...elements) => {
  if (elements.length === 0) {
    throw Error("Must have arguments!");
  }
  return chain([
    chain(...elements)((ast) => {
      return elements.length === 1 ? ast[0] : ast;
    }),
    true
  ])((ast) => {
    return ast[0];
  });
};
var plus = (...elements) => {
  if (elements.length === 0) {
    throw Error("Must have arguments!");
  }
  const plusFunction = () => {
    return chain(chain(...elements)((ast) => {
      return elements.length === 1 ? ast[0] : ast;
    }), optional(plusFunction))((ast) => {
      if (ast[1]) {
        return [ast[0]].concat(ast[1]);
      }
      return [ast[0]];
    });
  };
  return plusFunction;
};
var many = (...elements) => {
  if (elements.length === 0) {
    throw Error("Must have arguments!");
  }
  return optional(plus(...elements));
};

// src/scanner.ts
var Scanner = class {
  tokens = [];
  index = 0;
  constructor(tokens, index = 0) {
    this.tokens = tokens.slice();
    this.index = index;
  }
  read = () => {
    const token = this.tokens[this.index];
    if (token) {
      return token;
    }
    return false;
  };
  next = () => {
    this.index += 1;
  };
  isEnd = () => {
    return this.index >= this.tokens.length;
  };
  getIndex = () => {
    return this.index;
  };
  setIndex = (index) => {
    this.index = index;
    return index;
  };
  getRestTokenCount = () => {
    return this.tokens.length - this.index - 1;
  };
  getNextByToken = (token) => {
    const currentTokenIndex = this.tokens.findIndex((eachToken) => {
      return eachToken === token;
    });
    if (currentTokenIndex > -1) {
      if (currentTokenIndex + 1 < this.tokens.length) {
        return this.tokens[currentTokenIndex + 1];
      }
      return null;
    }
    throw Error(`token ${token.value.toString()} not exist in scanner.`);
  };
  getTokenByCharacterIndex = (characterIndex) => {
    if (characterIndex === null) {
      return null;
    }
    for (const token of this.tokens) {
      if (characterIndex >= token.position[0] && characterIndex - 1 <= token.position[1]) {
        return token;
      }
    }
    return null;
  };
  getPrevTokenByCharacterIndex = (characterIndex) => {
    let prevToken = null;
    let prevTokenIndex = null;
    this.tokens.forEach((token, index) => {
      if (token.position[1] < characterIndex - 1) {
        prevToken = token;
        prevTokenIndex = index;
      }
    });
    return { prevToken, prevTokenIndex };
  };
  getNextTokenFromCharacterIndex = (characterIndex) => {
    for (const token of this.tokens) {
      if (token.position[0] > characterIndex) {
        return token;
      }
    }
    return null;
  };
  addToken = (token) => {
    const { prevToken, prevTokenIndex } = this.getPrevTokenByCharacterIndex(token.position[0]);
    if (prevToken) {
      this.tokens.splice(prevTokenIndex + 1, 0, token);
    } else {
      this.tokens.unshift(token);
    }
  };
};

// src/utils.ts
var compareIgnoreLowerCaseWhenString = (source, target) => {
  if (typeof source === "string" && typeof target === "string") {
    return source.toLowerCase() === target.toLowerCase();
  }
  return source === target;
};
function tailCallOptimize(f) {
  let value;
  let active = false;
  const accumulated = [];
  return function accumulator() {
    accumulated.push(arguments);
    if (!active) {
      active = true;
      while (accumulated.length) {
        value = f.apply(this, accumulated.shift());
      }
      active = false;
      return value;
    }
  };
}
function getPathByCursorIndexFromAst(obj, cursorIndex, path) {
  path = path || "";
  let fullpath = "";
  for (const key in obj) {
    if (obj[key] && obj[key].token === true && obj[key].position[0] <= cursorIndex && obj[key].position[1] + 1 >= cursorIndex) {
      if (path === "") {
        return key;
      }
      return `${path}.${key}`;
    }
    if (typeof obj[key] === "object") {
      fullpath = getPathByCursorIndexFromAst(obj[key], cursorIndex, path === "" ? key : `${path}.${key}`) || fullpath;
    }
  }
  return fullpath;
}

// src/chain.ts
var createNodeByElement = (element, parentNode, parentIndex, parser) => {
  if (element instanceof Array) {
    const treeNode = new TreeNode(parentIndex);
    treeNode.parentNode = parentNode;
    treeNode.childs = element.map((eachElement, childIndex) => {
      return createNodeByElement(eachElement, treeNode, childIndex, parser);
    });
    return treeNode;
  }
  if (typeof element === "string") {
    const matchNode = new MatchNode(match(element)(), {
      type: "string",
      value: element
    }, parentIndex);
    matchNode.parentNode = parentNode;
    return matchNode;
  }
  if (typeof element === "boolean") {
    if (element) {
      const trueMatchNode = new MatchNode(matchTrue, {
        type: "loose",
        value: true
      }, parentIndex);
      trueMatchNode.parentNode = parentNode;
      return trueMatchNode;
    }
    const falseMatchNode = new MatchNode(matchFalse, {
      type: "loose",
      value: false
    }, parentIndex);
    falseMatchNode.parentNode = parentNode;
    return falseMatchNode;
  }
  if (typeof element === "function") {
    if (element.parserName === "match") {
      const matchNode = new MatchNode(element(), {
        type: "special",
        value: element.displayName
      }, parentIndex);
      matchNode.parentNode = parentNode;
      return matchNode;
    }
    if (element.parserName === "chainNodeFactory") {
      const chainNode = element(parentNode, null, parentIndex, parser);
      return chainNode;
    }
    const functionNode = new FunctionNode(element, parentIndex, parser);
    functionNode.parentNode = parentNode;
    return functionNode;
  }
  throw Error(`unknow element in chain ${element}`);
};
var chain = (...elements) => {
  return (solveAst = (args) => {
    return args;
  }) => {
    const chainNodeFactory = (parentNode, creatorFunction, parentIndex = 0, parser) => {
      const chainNode = new ChainNode(parentIndex);
      chainNode.parentNode = parentNode;
      chainNode.creatorFunction = creatorFunction;
      chainNode.solveAst = solveAst;
      chainNode.childs = elements.map((element, index) => {
        return createNodeByElement(element, chainNode, index, parser);
      });
      if (creatorFunction) {
        generateFirstSet(chainNode, parser);
      }
      return chainNode;
    };
    chainNodeFactory.parserName = "chainNodeFactory";
    return chainNodeFactory;
  };
};
function getParser(root) {
  if (parserMap.has(root)) {
    return parserMap.get(root);
  }
  const parser = new Parser();
  parser.rootChainNode = root()(null, null, 0, parser);
  parserMap.set(root, parser);
  return parser;
}
function scannerAddCursorToken(scanner, cursorIndex, options) {
  let finalCursorIndex = cursorIndex;
  if (cursorIndex === null) {
    return { scanner, finalCursorIndex };
  }
  const cursorToken = scanner.getTokenByCharacterIndex(cursorIndex);
  if (!cursorToken) {
    scanner.addToken({
      type: "cursor",
      value: null,
      position: [cursorIndex, cursorIndex]
    });
  } else if (options.cursorTokenExcludes(cursorToken)) {
    scanner.addToken({
      type: "cursor",
      value: null,
      position: [cursorIndex + 1, cursorIndex + 1]
    });
    finalCursorIndex += 1;
  }
  return { scanner, finalCursorIndex };
}
var createParser = (root, lexer, options) => {
  return (text, cursorIndex = null) => {
    options = (0, import_lodash.defaults)(options || {}, new CreateParserOptions());
    const startTime = new Date();
    const tokens = lexer(text);
    const lexerTime = new Date();
    const originScanner = new Scanner(tokens);
    const { scanner, finalCursorIndex } = scannerAddCursorToken(new Scanner(tokens), cursorIndex, options);
    cursorIndex = finalCursorIndex;
    const parser = getParser(root);
    const cursorPrevToken = scanner.getPrevTokenByCharacterIndex(cursorIndex).prevToken;
    let cursorPrevNodes = cursorPrevToken === null ? [parser.rootChainNode] : [];
    let success = false;
    let ast = null;
    let callVisiterCount = 0;
    let callParentCount = 0;
    let lastMatchUnderShortestRestToken = null;
    newVisit({
      node: parser.rootChainNode,
      scanner: originScanner,
      visiterOption: {
        onCallVisiter: (_node, store) => {
          callVisiterCount += 1;
          if (callVisiterCount > MAX_VISITER_CALL) {
            store.stop = true;
          }
        },
        onVisiterNextNode: (_node, store) => {
          callParentCount += 1;
          if (callParentCount > MAX_VISITER_CALL) {
            store.stop = true;
          }
        },
        onMatchNode: (matchNode, store, currentVisiterOption) => {
          const matchResult = matchNode.run(store.scanner);
          if (!matchResult.match) {
            tryChances(matchNode, store, currentVisiterOption);
          } else {
            const restTokenCount = store.scanner.getRestTokenCount();
            if (!lastMatchUnderShortestRestToken || lastMatchUnderShortestRestToken && lastMatchUnderShortestRestToken.restTokenCount > restTokenCount) {
              lastMatchUnderShortestRestToken = {
                matchNode,
                token: matchResult.token,
                restTokenCount
              };
            }
            visitNextNodeFromParent(matchNode, store, currentVisiterOption, __spreadValues({
              token: true
            }, matchResult.token));
          }
        },
        onSuccess: () => {
          success = true;
        },
        onFail: (_node) => {
          success = false;
        }
      },
      parser
    });
    newVisit({
      node: parser.rootChainNode,
      scanner,
      visiterOption: {
        onCallVisiter: (_node, store) => {
          callVisiterCount += 1;
          if (callVisiterCount > MAX_VISITER_CALL) {
            store.stop = true;
          }
        },
        onVisiterNextNode: (_node, store) => {
          callParentCount += 1;
          if (callParentCount > MAX_VISITER_CALL) {
            store.stop = true;
          }
        },
        onSuccess: () => {
          ast = parser.rootChainNode.solveAst ? parser.rootChainNode.solveAst(parser.rootChainNode.astResults) : parser.rootChainNode.astResults;
        },
        onMatchNode: (matchNode, store, currentVisiterOption) => {
          const matchResult = matchNode.run(store.scanner);
          if (!matchResult.match) {
            tryChances(matchNode, store, currentVisiterOption);
          } else {
            if (cursorPrevToken !== null && matchResult.token === cursorPrevToken) {
              cursorPrevNodes.push(matchNode);
            }
            visitNextNodeFromParent(matchNode, store, currentVisiterOption, __spreadValues({
              token: true
            }, matchResult.token));
          }
        }
      },
      parser
    });
    cursorPrevNodes = (0, import_lodash.uniq)(cursorPrevNodes);
    let nextMatchNodes = cursorPrevNodes.reduce((all, cursorPrevNode) => {
      return all.concat(findNextMatchNodes(cursorPrevNode, parser));
    }, []);
    nextMatchNodes = (0, import_lodash.uniqBy)(nextMatchNodes, (each) => {
      return each.matching.type + each.matching.value;
    });
    const cursorNextToken = scanner.getNextTokenFromCharacterIndex(cursorIndex);
    if (cursorNextToken) {
      nextMatchNodes = nextMatchNodes.filter((nextMatchNode) => {
        return !compareIgnoreLowerCaseWhenString(nextMatchNode.matching.value, cursorNextToken.value);
      });
    }
    let error = null;
    if (!success) {
      const suggestions = (0, import_lodash.uniqBy)((lastMatchUnderShortestRestToken ? findNextMatchNodes(lastMatchUnderShortestRestToken.matchNode, parser) : findNextMatchNodes(parser.rootChainNode, parser)).map((each) => {
        return each.matching;
      }), (each) => {
        return each.type + each.value;
      });
      const errorToken = lastMatchUnderShortestRestToken && scanner.getNextByToken(lastMatchUnderShortestRestToken.token);
      if (errorToken) {
        error = {
          suggestions,
          token: errorToken,
          reason: "wrong"
        };
      } else {
        error = {
          suggestions,
          token: lastMatchUnderShortestRestToken ? lastMatchUnderShortestRestToken.token : null,
          reason: "incomplete"
        };
      }
    }
    const parserTime = new Date();
    const cursorKeyPath = getPathByCursorIndexFromAst(ast, cursorIndex).split(".");
    return {
      success,
      ast,
      cursorKeyPath: cursorKeyPath[0] === "" ? [] : cursorKeyPath,
      nextMatchings: nextMatchNodes.reverse().map((each) => {
        return each.matching;
      }).filter((each) => {
        return !!each.value;
      }),
      error,
      debugInfo: {
        tokens,
        callVisiterCount,
        costs: {
          lexer: lexerTime.getTime() - startTime.getTime(),
          parser: parserTime.getTime() - startTime.getTime()
        }
      }
    };
  };
};
function newVisit({
  node,
  scanner,
  visiterOption,
  parser
}) {
  const defaultVisiterOption = new VisiterOption();
  (0, import_lodash.defaults)(visiterOption, defaultVisiterOption);
  const newStore = new VisiterStore(scanner, parser);
  visit({ node, store: newStore, visiterOption, childIndex: 0 });
}
var visit = tailCallOptimize(({
  node,
  store,
  visiterOption,
  childIndex
}) => {
  if (store.stop) {
    fail(node, store, visiterOption);
    return;
  }
  if (!node) {
    throw Error("no node!");
  }
  if (visiterOption.onCallVisiter) {
    visiterOption.onCallVisiter(node, store);
  }
  if (node instanceof ChainNode) {
    if (firstSetUnMatch(node, store, visiterOption, childIndex)) {
      return;
    }
    visitChildNode({ node, store, visiterOption, childIndex });
  } else if (node instanceof TreeNode) {
    visitChildNode({ node, store, visiterOption, childIndex });
  } else if (node instanceof MatchNode) {
    if (node.matching.type === "loose") {
      if (node.matching.value === true) {
        visitNextNodeFromParent(node, store, visiterOption, null);
      } else {
        throw Error("Not support loose false!");
      }
    } else {
      visiterOption.onMatchNode(node, store, visiterOption);
    }
  } else if (node instanceof FunctionNode) {
    const functionName = node.chainFunction.name;
    const replacedNode = node.run();
    replacedNode.functionName = functionName;
    node.parentNode.childs[node.parentIndex] = replacedNode;
    visit({ node: replacedNode, store, visiterOption, childIndex: 0 });
  } else {
    throw Error(`Unexpected node type: ${node}`);
  }
});
function visitChildNode({
  node,
  store,
  visiterOption,
  childIndex
}) {
  if (node instanceof ChainNode) {
    const child = node.childs[childIndex];
    if (child) {
      visit({ node: child, store, visiterOption, childIndex: 0 });
    } else {
      visitNextNodeFromParent(node, store, visiterOption, visiterOption.generateAst ? node.solveAst(node.astResults) : null);
    }
  } else {
    const child = node.childs[childIndex];
    if (childIndex + 1 < node.childs.length) {
      addChances({
        node,
        store,
        visiterOption,
        tokenIndex: store.scanner.getIndex(),
        childIndex: childIndex + 1,
        addToNextMatchNodeFinders: true
      });
    }
    if (child) {
      visit({ node: child, store, visiterOption, childIndex: 0 });
    } else {
      throw Error("tree node unexpect end");
    }
  }
}
var visitNextNodeFromParent = tailCallOptimize((node, store, visiterOption, astValue) => {
  if (store.stop) {
    fail(node, store, visiterOption);
    return;
  }
  if (visiterOption.onVisiterNextNode) {
    visiterOption.onVisiterNextNode(node, store);
  }
  if (!node.parentNode) {
    return noNextNode(node, store, visiterOption);
  }
  if (node.parentNode instanceof ChainNode) {
    if (visiterOption.generateAst) {
      node.parentNode.astResults[node.parentIndex] = astValue;
    }
    visit({ node: node.parentNode, store, visiterOption, childIndex: node.parentIndex + 1 });
  } else if (node.parentNode instanceof TreeNode) {
    visitNextNodeFromParent(node.parentNode, store, visiterOption, astValue);
  } else {
    throw Error(`Unexpected parent node type: ${node.parentNode}`);
  }
});
function noNextNode(node, store, visiterOption) {
  if (store.scanner.isEnd()) {
    if (visiterOption.onSuccess) {
      visiterOption.onSuccess();
    }
  } else {
    tryChances(node, store, visiterOption);
  }
}
function addChances({
  node,
  store,
  tokenIndex,
  childIndex
}) {
  const chance = {
    node,
    tokenIndex,
    childIndex
  };
  store.restChances.push(chance);
}
function tryChances(node, store, visiterOption) {
  if (store.restChances.length === 0) {
    fail(node, store, visiterOption);
    return;
  }
  const nextChance = store.restChances.pop();
  store.scanner.setIndex(nextChance.tokenIndex);
  visit({ node: nextChance.node, store, visiterOption, childIndex: nextChance.childIndex });
}
function fail(node, _store = null, visiterOption) {
  if (visiterOption.onFail) {
    visiterOption.onFail(node);
  }
}
function findNextMatchNodes(node, parser) {
  const nextMatchNodes = [];
  let passCurrentNode = false;
  const visiterOption = {
    generateAst: false,
    enableFirstSet: false,
    onMatchNode: (matchNode, store, currentVisiterOption) => {
      if (matchNode === node && passCurrentNode === false) {
        passCurrentNode = true;
        visitNextNodeFromParent(matchNode, store, currentVisiterOption, null);
      } else {
        nextMatchNodes.push(matchNode);
      }
      tryChances(matchNode, store, currentVisiterOption);
    }
  };
  newVisit({ node, scanner: new Scanner([]), visiterOption, parser });
  return nextMatchNodes;
}
function firstSetUnMatch(node, store, visiterOption, childIndex) {
  if (visiterOption.enableFirstSet && node.creatorFunction && childIndex === 0 && store.parser.firstSet.has(node.creatorFunction)) {
    const firstMatchNodes = store.parser.firstSet.get(node.creatorFunction);
    if (!firstMatchNodes.some((firstMatchNode) => {
      return firstMatchNode.run(store.scanner, false).match;
    })) {
      tryChances(node, store, visiterOption);
      return true;
    }
    return false;
  }
}
function generateFirstSet(node, parser) {
  if (parser.firstSet.has(node.creatorFunction)) {
    return;
  }
  const firstMatchNodes = getFirstOrFunctionSet(node, node.creatorFunction, parser);
  parser.firstOrFunctionSet.set(node.creatorFunction, firstMatchNodes);
  solveFirstSet(node.creatorFunction, parser);
}
function getFirstOrFunctionSet(node, creatorFunction, parser) {
  if (node instanceof ChainNode) {
    if (node.childs[0]) {
      return getFirstOrFunctionSet(node.childs[0], creatorFunction, parser);
    }
  } else if (node instanceof TreeNode) {
    return node.childs.reduce((all, next) => {
      return all.concat(getFirstOrFunctionSet(next, creatorFunction, parser));
    }, []);
  } else if (node instanceof MatchNode) {
    return [node];
  } else if (node instanceof FunctionNode) {
    if (parser.relatedSet.has(node.chainFunction)) {
      parser.relatedSet.get(node.chainFunction).add(creatorFunction);
    } else {
      parser.relatedSet.set(node.chainFunction, new Set([creatorFunction]));
    }
    return [node.chainFunction];
  } else {
    throw Error(`Unexpected node: ${node}`);
  }
}
function solveFirstSet(creatorFunction, parser) {
  if (parser.firstSet.has(creatorFunction)) {
    return;
  }
  const firstMatchNodes = parser.firstOrFunctionSet.get(creatorFunction);
  const newFirstMatchNodes = firstMatchNodes.reduce((all, firstMatchNode) => {
    if (typeof firstMatchNode === "string") {
      if (parser.firstSet.has(firstMatchNode)) {
        all = all.concat(parser.firstSet.get(firstMatchNode));
      } else {
        all.push(firstMatchNode);
      }
    } else {
      all.push(firstMatchNode);
    }
    return all;
  }, []);
  parser.firstOrFunctionSet.set(creatorFunction, newFirstMatchNodes);
  if (newFirstMatchNodes.every((firstMatchNode) => {
    return firstMatchNode instanceof MatchNode;
  })) {
    parser.firstSet.set(creatorFunction, newFirstMatchNodes);
    if (parser.relatedSet.has(creatorFunction)) {
      const relatedFunctionNames = parser.relatedSet.get(creatorFunction);
      relatedFunctionNames.forEach(() => {
        return solveFirstSet;
      });
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChainNode,
  CreateParserOptions,
  FunctionNode,
  MAX_VISITER_CALL,
  MatchNode,
  Parser,
  Scanner,
  TreeNode,
  VisiterOption,
  VisiterStore,
  chain,
  createParser,
  many,
  matchTokenType,
  optional,
  parserMap,
  plus
});
