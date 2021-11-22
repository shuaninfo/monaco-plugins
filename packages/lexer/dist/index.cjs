var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/index.ts
__export(exports, {
  createLexer: () => createLexer
});
var Tokenizer = class {
  constructor(lexerConfig) {
    this.lexerConfig = lexerConfig;
  }
  tokenize(input) {
    const tokens = [];
    let token;
    let lastPosition = 0;
    while (input.length) {
      const result = this.getNextToken(input);
      if (!result || !result.token) {
        throw Error(`Lexer: Unexpected string "${input}".`);
      }
      token = result.token;
      if (!token.value) {
        throw Error(`Lexer: Regex parse error, please check your lexer config.`);
      }
      token.position = [lastPosition, lastPosition + token.value.length - 1];
      lastPosition += token.value.length;
      input = input.substring(token.value.length);
      if (!result.config.ignore) {
        tokens.push(token);
      }
    }
    return tokens;
  }
  getNextToken(input) {
    for (const eachLexer of this.lexerConfig) {
      for (const regex of eachLexer.regexes) {
        const token = this.getTokenOnFirstMatch({ input, type: eachLexer.type, regex });
        if (token) {
          return {
            token,
            config: eachLexer
          };
        }
      }
    }
    return null;
  }
  getTokenOnFirstMatch({ input, type, regex }) {
    const matches = input.match(regex);
    if (matches) {
      return { type, value: matches[1] };
    }
  }
};
var createLexer = (lexerConfig) => {
  return (text) => {
    return new Tokenizer(lexerConfig).tokenize(text);
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createLexer
});
