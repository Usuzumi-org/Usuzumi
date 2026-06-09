/* Usuzumi generated runtime. Edit ui/js/*.js, then run npm run build. */
(function () {
/* highlight.js engine */
var UsuzumiHighlightEngine = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/highlight.js/lib/core.js
  var require_core = __commonJS({
    "node_modules/highlight.js/lib/core.js"(exports, module) {
      function deepFreeze(obj) {
        if (obj instanceof Map) {
          obj.clear = obj.delete = obj.set = function() {
            throw new Error("map is read-only");
          };
        } else if (obj instanceof Set) {
          obj.add = obj.clear = obj.delete = function() {
            throw new Error("set is read-only");
          };
        }
        Object.freeze(obj);
        Object.getOwnPropertyNames(obj).forEach((name) => {
          const prop = obj[name];
          const type = typeof prop;
          if ((type === "object" || type === "function") && !Object.isFrozen(prop)) {
            deepFreeze(prop);
          }
        });
        return obj;
      }
      var Response = class {
        /**
         * @param {CompiledMode} mode
         */
        constructor(mode) {
          if (mode.data === void 0) mode.data = {};
          this.data = mode.data;
          this.isMatchIgnored = false;
        }
        ignoreMatch() {
          this.isMatchIgnored = true;
        }
      };
      function escapeHTML(value) {
        return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
      }
      function inherit$1(original, ...objects) {
        const result = /* @__PURE__ */ Object.create(null);
        for (const key in original) {
          result[key] = original[key];
        }
        objects.forEach(function(obj) {
          for (const key in obj) {
            result[key] = obj[key];
          }
        });
        return (
          /** @type {T} */
          result
        );
      }
      var SPAN_CLOSE = "</span>";
      var emitsWrappingTags = (node) => {
        return !!node.scope;
      };
      var scopeToCSSClass = (name, { prefix }) => {
        if (name.startsWith("language:")) {
          return name.replace("language:", "language-");
        }
        if (name.includes(".")) {
          const pieces = name.split(".");
          return [
            `${prefix}${pieces.shift()}`,
            ...pieces.map((x, i) => `${x}${"_".repeat(i + 1)}`)
          ].join(" ");
        }
        return `${prefix}${name}`;
      };
      var HTMLRenderer = class {
        /**
         * Creates a new HTMLRenderer
         *
         * @param {Tree} parseTree - the parse tree (must support `walk` API)
         * @param {{classPrefix: string}} options
         */
        constructor(parseTree, options) {
          this.buffer = "";
          this.classPrefix = options.classPrefix;
          parseTree.walk(this);
        }
        /**
         * Adds texts to the output stream
         *
         * @param {string} text */
        addText(text) {
          this.buffer += escapeHTML(text);
        }
        /**
         * Adds a node open to the output stream (if needed)
         *
         * @param {Node} node */
        openNode(node) {
          if (!emitsWrappingTags(node)) return;
          const className = scopeToCSSClass(
            node.scope,
            { prefix: this.classPrefix }
          );
          this.span(className);
        }
        /**
         * Adds a node close to the output stream (if needed)
         *
         * @param {Node} node */
        closeNode(node) {
          if (!emitsWrappingTags(node)) return;
          this.buffer += SPAN_CLOSE;
        }
        /**
         * returns the accumulated buffer
        */
        value() {
          return this.buffer;
        }
        // helpers
        /**
         * Builds a span element
         *
         * @param {string} className */
        span(className) {
          this.buffer += `<span class="${className}">`;
        }
      };
      var newNode = (opts = {}) => {
        const result = { children: [] };
        Object.assign(result, opts);
        return result;
      };
      var TokenTree = class _TokenTree {
        constructor() {
          this.rootNode = newNode();
          this.stack = [this.rootNode];
        }
        get top() {
          return this.stack[this.stack.length - 1];
        }
        get root() {
          return this.rootNode;
        }
        /** @param {Node} node */
        add(node) {
          this.top.children.push(node);
        }
        /** @param {string} scope */
        openNode(scope) {
          const node = newNode({ scope });
          this.add(node);
          this.stack.push(node);
        }
        closeNode() {
          if (this.stack.length > 1) {
            return this.stack.pop();
          }
          return void 0;
        }
        closeAllNodes() {
          while (this.closeNode()) ;
        }
        toJSON() {
          return JSON.stringify(this.rootNode, null, 4);
        }
        /**
         * @typedef { import("./html_renderer").Renderer } Renderer
         * @param {Renderer} builder
         */
        walk(builder) {
          return this.constructor._walk(builder, this.rootNode);
        }
        /**
         * @param {Renderer} builder
         * @param {Node} node
         */
        static _walk(builder, node) {
          if (typeof node === "string") {
            builder.addText(node);
          } else if (node.children) {
            builder.openNode(node);
            node.children.forEach((child) => this._walk(builder, child));
            builder.closeNode(node);
          }
          return builder;
        }
        /**
         * @param {Node} node
         */
        static _collapse(node) {
          if (typeof node === "string") return;
          if (!node.children) return;
          if (node.children.every((el) => typeof el === "string")) {
            node.children = [node.children.join("")];
          } else {
            node.children.forEach((child) => {
              _TokenTree._collapse(child);
            });
          }
        }
      };
      var TokenTreeEmitter = class extends TokenTree {
        /**
         * @param {*} options
         */
        constructor(options) {
          super();
          this.options = options;
        }
        /**
         * @param {string} text
         */
        addText(text) {
          if (text === "") {
            return;
          }
          this.add(text);
        }
        /** @param {string} scope */
        startScope(scope) {
          this.openNode(scope);
        }
        endScope() {
          this.closeNode();
        }
        /**
         * @param {Emitter & {root: DataNode}} emitter
         * @param {string} name
         */
        __addSublanguage(emitter, name) {
          const node = emitter.root;
          if (name) node.scope = `language:${name}`;
          this.add(node);
        }
        toHTML() {
          const renderer = new HTMLRenderer(this, this.options);
          return renderer.value();
        }
        finalize() {
          this.closeAllNodes();
          return true;
        }
      };
      function source(re) {
        if (!re) return null;
        if (typeof re === "string") return re;
        return re.source;
      }
      function lookahead(re) {
        return concat("(?=", re, ")");
      }
      function anyNumberOfTimes(re) {
        return concat("(?:", re, ")*");
      }
      function optional(re) {
        return concat("(?:", re, ")?");
      }
      function concat(...args) {
        const joined = args.map((x) => source(x)).join("");
        return joined;
      }
      function stripOptionsFromArgs(args) {
        const opts = args[args.length - 1];
        if (typeof opts === "object" && opts.constructor === Object) {
          args.splice(args.length - 1, 1);
          return opts;
        } else {
          return {};
        }
      }
      function either(...args) {
        const opts = stripOptionsFromArgs(args);
        const joined = "(" + (opts.capture ? "" : "?:") + args.map((x) => source(x)).join("|") + ")";
        return joined;
      }
      function countMatchGroups(re) {
        return new RegExp(re.toString() + "|").exec("").length - 1;
      }
      function startsWith(re, lexeme) {
        const match = re && re.exec(lexeme);
        return match && match.index === 0;
      }
      var BACKREF_RE = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
      function _rewriteBackreferences(regexps, { joinWith }) {
        let numCaptures = 0;
        return regexps.map((regex) => {
          numCaptures += 1;
          const offset = numCaptures;
          let re = source(regex);
          let out = "";
          while (re.length > 0) {
            const match = BACKREF_RE.exec(re);
            if (!match) {
              out += re;
              break;
            }
            out += re.substring(0, match.index);
            re = re.substring(match.index + match[0].length);
            if (match[0][0] === "\\" && match[1]) {
              out += "\\" + String(Number(match[1]) + offset);
            } else {
              out += match[0];
              if (match[0] === "(") {
                numCaptures++;
              }
            }
          }
          return out;
        }).map((re) => `(${re})`).join(joinWith);
      }
      var MATCH_NOTHING_RE = /\b\B/;
      var IDENT_RE3 = "[a-zA-Z]\\w*";
      var UNDERSCORE_IDENT_RE = "[a-zA-Z_]\\w*";
      var NUMBER_RE = "\\b\\d+(\\.\\d+)?";
      var C_NUMBER_RE = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";
      var BINARY_NUMBER_RE = "\\b(0b[01]+)";
      var RE_STARTERS_RE = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";
      var SHEBANG = (opts = {}) => {
        const beginShebang = /^#![ ]*\//;
        if (opts.binary) {
          opts.begin = concat(
            beginShebang,
            /.*\b/,
            opts.binary,
            /\b.*/
          );
        }
        return inherit$1({
          scope: "meta",
          begin: beginShebang,
          end: /$/,
          relevance: 0,
          /** @type {ModeCallback} */
          "on:begin": (m, resp) => {
            if (m.index !== 0) resp.ignoreMatch();
          }
        }, opts);
      };
      var BACKSLASH_ESCAPE = {
        begin: "\\\\[\\s\\S]",
        relevance: 0
      };
      var APOS_STRING_MODE = {
        scope: "string",
        begin: "'",
        end: "'",
        illegal: "\\n",
        contains: [BACKSLASH_ESCAPE]
      };
      var QUOTE_STRING_MODE = {
        scope: "string",
        begin: '"',
        end: '"',
        illegal: "\\n",
        contains: [BACKSLASH_ESCAPE]
      };
      var PHRASAL_WORDS_MODE = {
        begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
      };
      var COMMENT = function(begin, end, modeOptions = {}) {
        const mode = inherit$1(
          {
            scope: "comment",
            begin,
            end,
            contains: []
          },
          modeOptions
        );
        mode.contains.push({
          scope: "doctag",
          // hack to avoid the space from being included. the space is necessary to
          // match here to prevent the plain text rule below from gobbling up doctags
          begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
          end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
          excludeBegin: true,
          relevance: 0
        });
        const ENGLISH_WORD = either(
          // list of common 1 and 2 letter words in English
          "I",
          "a",
          "is",
          "so",
          "us",
          "to",
          "at",
          "if",
          "in",
          "it",
          "on",
          // note: this is not an exhaustive list of contractions, just popular ones
          /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
          // contractions - can't we'd they're let's, etc
          /[A-Za-z]+[-][a-z]+/,
          // `no-way`, etc.
          /[A-Za-z][a-z]{2,}/
          // allow capitalized words at beginning of sentences
        );
        mode.contains.push(
          {
            // TODO: how to include ", (, ) without breaking grammars that use these for
            // comment delimiters?
            // begin: /[ ]+([()"]?([A-Za-z'-]{3,}|is|a|I|so|us|[tT][oO]|at|if|in|it|on)[.]?[()":]?([.][ ]|[ ]|\))){3}/
            // ---
            // this tries to find sequences of 3 english words in a row (without any
            // "programming" type syntax) this gives us a strong signal that we've
            // TRULY found a comment - vs perhaps scanning with the wrong language.
            // It's possible to find something that LOOKS like the start of the
            // comment - but then if there is no readable text - good chance it is a
            // false match and not a comment.
            //
            // for a visual example please see:
            // https://github.com/highlightjs/highlight.js/issues/2827
            begin: concat(
              /[ ]+/,
              // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
              "(",
              ENGLISH_WORD,
              /[.]?[:]?([.][ ]|[ ])/,
              "){3}"
            )
            // look for 3 words in a row
          }
        );
        return mode;
      };
      var C_LINE_COMMENT_MODE = COMMENT("//", "$");
      var C_BLOCK_COMMENT_MODE = COMMENT("/\\*", "\\*/");
      var HASH_COMMENT_MODE = COMMENT("#", "$");
      var NUMBER_MODE = {
        scope: "number",
        begin: NUMBER_RE,
        relevance: 0
      };
      var C_NUMBER_MODE = {
        scope: "number",
        begin: C_NUMBER_RE,
        relevance: 0
      };
      var BINARY_NUMBER_MODE = {
        scope: "number",
        begin: BINARY_NUMBER_RE,
        relevance: 0
      };
      var REGEXP_MODE = {
        scope: "regexp",
        begin: /\/(?=[^/\n]*\/)/,
        end: /\/[gimuy]*/,
        contains: [
          BACKSLASH_ESCAPE,
          {
            begin: /\[/,
            end: /\]/,
            relevance: 0,
            contains: [BACKSLASH_ESCAPE]
          }
        ]
      };
      var TITLE_MODE = {
        scope: "title",
        begin: IDENT_RE3,
        relevance: 0
      };
      var UNDERSCORE_TITLE_MODE = {
        scope: "title",
        begin: UNDERSCORE_IDENT_RE,
        relevance: 0
      };
      var METHOD_GUARD = {
        // excludes method names from keyword processing
        begin: "\\.\\s*" + UNDERSCORE_IDENT_RE,
        relevance: 0
      };
      var END_SAME_AS_BEGIN = function(mode) {
        return Object.assign(
          mode,
          {
            /** @type {ModeCallback} */
            "on:begin": (m, resp) => {
              resp.data._beginMatch = m[1];
            },
            /** @type {ModeCallback} */
            "on:end": (m, resp) => {
              if (resp.data._beginMatch !== m[1]) resp.ignoreMatch();
            }
          }
        );
      };
      var MODES4 = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        APOS_STRING_MODE,
        BACKSLASH_ESCAPE,
        BINARY_NUMBER_MODE,
        BINARY_NUMBER_RE,
        COMMENT,
        C_BLOCK_COMMENT_MODE,
        C_LINE_COMMENT_MODE,
        C_NUMBER_MODE,
        C_NUMBER_RE,
        END_SAME_AS_BEGIN,
        HASH_COMMENT_MODE,
        IDENT_RE: IDENT_RE3,
        MATCH_NOTHING_RE,
        METHOD_GUARD,
        NUMBER_MODE,
        NUMBER_RE,
        PHRASAL_WORDS_MODE,
        QUOTE_STRING_MODE,
        REGEXP_MODE,
        RE_STARTERS_RE,
        SHEBANG,
        TITLE_MODE,
        UNDERSCORE_IDENT_RE,
        UNDERSCORE_TITLE_MODE
      });
      function skipIfHasPrecedingDot(match, response) {
        const before = match.input[match.index - 1];
        if (before === ".") {
          response.ignoreMatch();
        }
      }
      function scopeClassName(mode, _parent) {
        if (mode.className !== void 0) {
          mode.scope = mode.className;
          delete mode.className;
        }
      }
      function beginKeywords(mode, parent) {
        if (!parent) return;
        if (!mode.beginKeywords) return;
        mode.begin = "\\b(" + mode.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)";
        mode.__beforeBegin = skipIfHasPrecedingDot;
        mode.keywords = mode.keywords || mode.beginKeywords;
        delete mode.beginKeywords;
        if (mode.relevance === void 0) mode.relevance = 0;
      }
      function compileIllegal(mode, _parent) {
        if (!Array.isArray(mode.illegal)) return;
        mode.illegal = either(...mode.illegal);
      }
      function compileMatch(mode, _parent) {
        if (!mode.match) return;
        if (mode.begin || mode.end) throw new Error("begin & end are not supported with match");
        mode.begin = mode.match;
        delete mode.match;
      }
      function compileRelevance(mode, _parent) {
        if (mode.relevance === void 0) mode.relevance = 1;
      }
      var beforeMatchExt = (mode, parent) => {
        if (!mode.beforeMatch) return;
        if (mode.starts) throw new Error("beforeMatch cannot be used with starts");
        const originalMode = Object.assign({}, mode);
        Object.keys(mode).forEach((key) => {
          delete mode[key];
        });
        mode.keywords = originalMode.keywords;
        mode.begin = concat(originalMode.beforeMatch, lookahead(originalMode.begin));
        mode.starts = {
          relevance: 0,
          contains: [
            Object.assign(originalMode, { endsParent: true })
          ]
        };
        mode.relevance = 0;
        delete originalMode.beforeMatch;
      };
      var COMMON_KEYWORDS = [
        "of",
        "and",
        "for",
        "in",
        "not",
        "or",
        "if",
        "then",
        "parent",
        // common variable name
        "list",
        // common variable name
        "value"
        // common variable name
      ];
      var DEFAULT_KEYWORD_SCOPE = "keyword";
      function compileKeywords(rawKeywords, caseInsensitive, scopeName = DEFAULT_KEYWORD_SCOPE) {
        const compiledKeywords = /* @__PURE__ */ Object.create(null);
        if (typeof rawKeywords === "string") {
          compileList(scopeName, rawKeywords.split(" "));
        } else if (Array.isArray(rawKeywords)) {
          compileList(scopeName, rawKeywords);
        } else {
          Object.keys(rawKeywords).forEach(function(scopeName2) {
            Object.assign(
              compiledKeywords,
              compileKeywords(rawKeywords[scopeName2], caseInsensitive, scopeName2)
            );
          });
        }
        return compiledKeywords;
        function compileList(scopeName2, keywordList) {
          if (caseInsensitive) {
            keywordList = keywordList.map((x) => x.toLowerCase());
          }
          keywordList.forEach(function(keyword) {
            const pair = keyword.split("|");
            compiledKeywords[pair[0]] = [scopeName2, scoreForKeyword(pair[0], pair[1])];
          });
        }
      }
      function scoreForKeyword(keyword, providedScore) {
        if (providedScore) {
          return Number(providedScore);
        }
        return commonKeyword(keyword) ? 0 : 1;
      }
      function commonKeyword(keyword) {
        return COMMON_KEYWORDS.includes(keyword.toLowerCase());
      }
      var seenDeprecations = {};
      var error = (message) => {
        console.error(message);
      };
      var warn = (message, ...args) => {
        console.log(`WARN: ${message}`, ...args);
      };
      var deprecated = (version2, message) => {
        if (seenDeprecations[`${version2}/${message}`]) return;
        console.log(`Deprecated as of ${version2}. ${message}`);
        seenDeprecations[`${version2}/${message}`] = true;
      };
      var MultiClassError = new Error();
      function remapScopeNames(mode, regexes, { key }) {
        let offset = 0;
        const scopeNames = mode[key];
        const emit = {};
        const positions = {};
        for (let i = 1; i <= regexes.length; i++) {
          positions[i + offset] = scopeNames[i];
          emit[i + offset] = true;
          offset += countMatchGroups(regexes[i - 1]);
        }
        mode[key] = positions;
        mode[key]._emit = emit;
        mode[key]._multi = true;
      }
      function beginMultiClass(mode) {
        if (!Array.isArray(mode.begin)) return;
        if (mode.skip || mode.excludeBegin || mode.returnBegin) {
          error("skip, excludeBegin, returnBegin not compatible with beginScope: {}");
          throw MultiClassError;
        }
        if (typeof mode.beginScope !== "object" || mode.beginScope === null) {
          error("beginScope must be object");
          throw MultiClassError;
        }
        remapScopeNames(mode, mode.begin, { key: "beginScope" });
        mode.begin = _rewriteBackreferences(mode.begin, { joinWith: "" });
      }
      function endMultiClass(mode) {
        if (!Array.isArray(mode.end)) return;
        if (mode.skip || mode.excludeEnd || mode.returnEnd) {
          error("skip, excludeEnd, returnEnd not compatible with endScope: {}");
          throw MultiClassError;
        }
        if (typeof mode.endScope !== "object" || mode.endScope === null) {
          error("endScope must be object");
          throw MultiClassError;
        }
        remapScopeNames(mode, mode.end, { key: "endScope" });
        mode.end = _rewriteBackreferences(mode.end, { joinWith: "" });
      }
      function scopeSugar(mode) {
        if (mode.scope && typeof mode.scope === "object" && mode.scope !== null) {
          mode.beginScope = mode.scope;
          delete mode.scope;
        }
      }
      function MultiClass(mode) {
        scopeSugar(mode);
        if (typeof mode.beginScope === "string") {
          mode.beginScope = { _wrap: mode.beginScope };
        }
        if (typeof mode.endScope === "string") {
          mode.endScope = { _wrap: mode.endScope };
        }
        beginMultiClass(mode);
        endMultiClass(mode);
      }
      function compileLanguage(language) {
        function langRe(value, global) {
          return new RegExp(
            source(value),
            "m" + (language.case_insensitive ? "i" : "") + (language.unicodeRegex ? "u" : "") + (global ? "g" : "")
          );
        }
        class MultiRegex {
          constructor() {
            this.matchIndexes = {};
            this.regexes = [];
            this.matchAt = 1;
            this.position = 0;
          }
          // @ts-ignore
          addRule(re, opts) {
            opts.position = this.position++;
            this.matchIndexes[this.matchAt] = opts;
            this.regexes.push([opts, re]);
            this.matchAt += countMatchGroups(re) + 1;
          }
          compile() {
            if (this.regexes.length === 0) {
              this.exec = () => null;
            }
            const terminators = this.regexes.map((el) => el[1]);
            this.matcherRe = langRe(_rewriteBackreferences(terminators, { joinWith: "|" }), true);
            this.lastIndex = 0;
          }
          /** @param {string} s */
          exec(s) {
            this.matcherRe.lastIndex = this.lastIndex;
            const match = this.matcherRe.exec(s);
            if (!match) {
              return null;
            }
            const i = match.findIndex((el, i2) => i2 > 0 && el !== void 0);
            const matchData = this.matchIndexes[i];
            match.splice(0, i);
            return Object.assign(match, matchData);
          }
        }
        class ResumableMultiRegex {
          constructor() {
            this.rules = [];
            this.multiRegexes = [];
            this.count = 0;
            this.lastIndex = 0;
            this.regexIndex = 0;
          }
          // @ts-ignore
          getMatcher(index) {
            if (this.multiRegexes[index]) return this.multiRegexes[index];
            const matcher = new MultiRegex();
            this.rules.slice(index).forEach(([re, opts]) => matcher.addRule(re, opts));
            matcher.compile();
            this.multiRegexes[index] = matcher;
            return matcher;
          }
          resumingScanAtSamePosition() {
            return this.regexIndex !== 0;
          }
          considerAll() {
            this.regexIndex = 0;
          }
          // @ts-ignore
          addRule(re, opts) {
            this.rules.push([re, opts]);
            if (opts.type === "begin") this.count++;
          }
          /** @param {string} s */
          exec(s) {
            const m = this.getMatcher(this.regexIndex);
            m.lastIndex = this.lastIndex;
            let result = m.exec(s);
            if (this.resumingScanAtSamePosition()) {
              if (result && result.index === this.lastIndex) ;
              else {
                const m2 = this.getMatcher(0);
                m2.lastIndex = this.lastIndex + 1;
                result = m2.exec(s);
              }
            }
            if (result) {
              this.regexIndex += result.position + 1;
              if (this.regexIndex === this.count) {
                this.considerAll();
              }
            }
            return result;
          }
        }
        function buildModeRegex(mode) {
          const mm = new ResumableMultiRegex();
          mode.contains.forEach((term) => mm.addRule(term.begin, { rule: term, type: "begin" }));
          if (mode.terminatorEnd) {
            mm.addRule(mode.terminatorEnd, { type: "end" });
          }
          if (mode.illegal) {
            mm.addRule(mode.illegal, { type: "illegal" });
          }
          return mm;
        }
        function compileMode(mode, parent) {
          const cmode = (
            /** @type CompiledMode */
            mode
          );
          if (mode.isCompiled) return cmode;
          [
            scopeClassName,
            // do this early so compiler extensions generally don't have to worry about
            // the distinction between match/begin
            compileMatch,
            MultiClass,
            beforeMatchExt
          ].forEach((ext) => ext(mode, parent));
          language.compilerExtensions.forEach((ext) => ext(mode, parent));
          mode.__beforeBegin = null;
          [
            beginKeywords,
            // do this later so compiler extensions that come earlier have access to the
            // raw array if they wanted to perhaps manipulate it, etc.
            compileIllegal,
            // default to 1 relevance if not specified
            compileRelevance
          ].forEach((ext) => ext(mode, parent));
          mode.isCompiled = true;
          let keywordPattern = null;
          if (typeof mode.keywords === "object" && mode.keywords.$pattern) {
            mode.keywords = Object.assign({}, mode.keywords);
            keywordPattern = mode.keywords.$pattern;
            delete mode.keywords.$pattern;
          }
          keywordPattern = keywordPattern || /\w+/;
          if (mode.keywords) {
            mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);
          }
          cmode.keywordPatternRe = langRe(keywordPattern, true);
          if (parent) {
            if (!mode.begin) mode.begin = /\B|\b/;
            cmode.beginRe = langRe(cmode.begin);
            if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/;
            if (mode.end) cmode.endRe = langRe(cmode.end);
            cmode.terminatorEnd = source(cmode.end) || "";
            if (mode.endsWithParent && parent.terminatorEnd) {
              cmode.terminatorEnd += (mode.end ? "|" : "") + parent.terminatorEnd;
            }
          }
          if (mode.illegal) cmode.illegalRe = langRe(
            /** @type {RegExp | string} */
            mode.illegal
          );
          if (!mode.contains) mode.contains = [];
          mode.contains = [].concat(...mode.contains.map(function(c2) {
            return expandOrCloneMode(c2 === "self" ? mode : c2);
          }));
          mode.contains.forEach(function(c2) {
            compileMode(
              /** @type Mode */
              c2,
              cmode
            );
          });
          if (mode.starts) {
            compileMode(mode.starts, parent);
          }
          cmode.matcher = buildModeRegex(cmode);
          return cmode;
        }
        if (!language.compilerExtensions) language.compilerExtensions = [];
        if (language.contains && language.contains.includes("self")) {
          throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
        }
        language.classNameAliases = inherit$1(language.classNameAliases || {});
        return compileMode(
          /** @type Mode */
          language
        );
      }
      function dependencyOnParent(mode) {
        if (!mode) return false;
        return mode.endsWithParent || dependencyOnParent(mode.starts);
      }
      function expandOrCloneMode(mode) {
        if (mode.variants && !mode.cachedVariants) {
          mode.cachedVariants = mode.variants.map(function(variant) {
            return inherit$1(mode, { variants: null }, variant);
          });
        }
        if (mode.cachedVariants) {
          return mode.cachedVariants;
        }
        if (dependencyOnParent(mode)) {
          return inherit$1(mode, { starts: mode.starts ? inherit$1(mode.starts) : null });
        }
        if (Object.isFrozen(mode)) {
          return inherit$1(mode);
        }
        return mode;
      }
      var version = "11.11.1";
      var HTMLInjectionError = class extends Error {
        constructor(reason, html) {
          super(reason);
          this.name = "HTMLInjectionError";
          this.html = html;
        }
      };
      var escape = escapeHTML;
      var inherit = inherit$1;
      var NO_MATCH = /* @__PURE__ */ Symbol("nomatch");
      var MAX_KEYWORD_HITS = 7;
      var HLJS = function(hljs) {
        const languages = /* @__PURE__ */ Object.create(null);
        const aliases = /* @__PURE__ */ Object.create(null);
        const plugins = [];
        let SAFE_MODE = true;
        const LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
        const PLAINTEXT_LANGUAGE = { disableAutodetect: true, name: "Plain text", contains: [] };
        let options = {
          ignoreUnescapedHTML: false,
          throwUnescapedHTML: false,
          noHighlightRe: /^(no-?highlight)$/i,
          languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
          classPrefix: "hljs-",
          cssSelector: "pre code",
          languages: null,
          // beta configuration options, subject to change, welcome to discuss
          // https://github.com/highlightjs/highlight.js/issues/1086
          __emitter: TokenTreeEmitter
        };
        function shouldNotHighlight(languageName) {
          return options.noHighlightRe.test(languageName);
        }
        function blockLanguage(block) {
          let classes = block.className + " ";
          classes += block.parentNode ? block.parentNode.className : "";
          const match = options.languageDetectRe.exec(classes);
          if (match) {
            const language = getLanguage(match[1]);
            if (!language) {
              warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
              warn("Falling back to no-highlight mode for this block.", block);
            }
            return language ? match[1] : "no-highlight";
          }
          return classes.split(/\s+/).find((_class) => shouldNotHighlight(_class) || getLanguage(_class));
        }
        function highlight3(codeOrLanguageName, optionsOrCode, ignoreIllegals) {
          let code = "";
          let languageName = "";
          if (typeof optionsOrCode === "object") {
            code = codeOrLanguageName;
            ignoreIllegals = optionsOrCode.ignoreIllegals;
            languageName = optionsOrCode.language;
          } else {
            deprecated("10.7.0", "highlight(lang, code, ...args) has been deprecated.");
            deprecated("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277");
            languageName = codeOrLanguageName;
            code = optionsOrCode;
          }
          if (ignoreIllegals === void 0) {
            ignoreIllegals = true;
          }
          const context = {
            code,
            language: languageName
          };
          fire("before:highlight", context);
          const result = context.result ? context.result : _highlight(context.language, context.code, ignoreIllegals);
          result.code = context.code;
          fire("after:highlight", result);
          return result;
        }
        function _highlight(languageName, codeToHighlight, ignoreIllegals, continuation) {
          const keywordHits = /* @__PURE__ */ Object.create(null);
          function keywordData(mode, matchText) {
            return mode.keywords[matchText];
          }
          function processKeywords() {
            if (!top.keywords) {
              emitter.addText(modeBuffer);
              return;
            }
            let lastIndex = 0;
            top.keywordPatternRe.lastIndex = 0;
            let match = top.keywordPatternRe.exec(modeBuffer);
            let buf = "";
            while (match) {
              buf += modeBuffer.substring(lastIndex, match.index);
              const word = language.case_insensitive ? match[0].toLowerCase() : match[0];
              const data = keywordData(top, word);
              if (data) {
                const [kind, keywordRelevance] = data;
                emitter.addText(buf);
                buf = "";
                keywordHits[word] = (keywordHits[word] || 0) + 1;
                if (keywordHits[word] <= MAX_KEYWORD_HITS) relevance += keywordRelevance;
                if (kind.startsWith("_")) {
                  buf += match[0];
                } else {
                  const cssClass = language.classNameAliases[kind] || kind;
                  emitKeyword(match[0], cssClass);
                }
              } else {
                buf += match[0];
              }
              lastIndex = top.keywordPatternRe.lastIndex;
              match = top.keywordPatternRe.exec(modeBuffer);
            }
            buf += modeBuffer.substring(lastIndex);
            emitter.addText(buf);
          }
          function processSubLanguage() {
            if (modeBuffer === "") return;
            let result2 = null;
            if (typeof top.subLanguage === "string") {
              if (!languages[top.subLanguage]) {
                emitter.addText(modeBuffer);
                return;
              }
              result2 = _highlight(top.subLanguage, modeBuffer, true, continuations[top.subLanguage]);
              continuations[top.subLanguage] = /** @type {CompiledMode} */
              result2._top;
            } else {
              result2 = highlightAuto(modeBuffer, top.subLanguage.length ? top.subLanguage : null);
            }
            if (top.relevance > 0) {
              relevance += result2.relevance;
            }
            emitter.__addSublanguage(result2._emitter, result2.language);
          }
          function processBuffer() {
            if (top.subLanguage != null) {
              processSubLanguage();
            } else {
              processKeywords();
            }
            modeBuffer = "";
          }
          function emitKeyword(keyword, scope) {
            if (keyword === "") return;
            emitter.startScope(scope);
            emitter.addText(keyword);
            emitter.endScope();
          }
          function emitMultiClass(scope, match) {
            let i = 1;
            const max = match.length - 1;
            while (i <= max) {
              if (!scope._emit[i]) {
                i++;
                continue;
              }
              const klass = language.classNameAliases[scope[i]] || scope[i];
              const text = match[i];
              if (klass) {
                emitKeyword(text, klass);
              } else {
                modeBuffer = text;
                processKeywords();
                modeBuffer = "";
              }
              i++;
            }
          }
          function startNewMode(mode, match) {
            if (mode.scope && typeof mode.scope === "string") {
              emitter.openNode(language.classNameAliases[mode.scope] || mode.scope);
            }
            if (mode.beginScope) {
              if (mode.beginScope._wrap) {
                emitKeyword(modeBuffer, language.classNameAliases[mode.beginScope._wrap] || mode.beginScope._wrap);
                modeBuffer = "";
              } else if (mode.beginScope._multi) {
                emitMultiClass(mode.beginScope, match);
                modeBuffer = "";
              }
            }
            top = Object.create(mode, { parent: { value: top } });
            return top;
          }
          function endOfMode(mode, match, matchPlusRemainder) {
            let matched = startsWith(mode.endRe, matchPlusRemainder);
            if (matched) {
              if (mode["on:end"]) {
                const resp = new Response(mode);
                mode["on:end"](match, resp);
                if (resp.isMatchIgnored) matched = false;
              }
              if (matched) {
                while (mode.endsParent && mode.parent) {
                  mode = mode.parent;
                }
                return mode;
              }
            }
            if (mode.endsWithParent) {
              return endOfMode(mode.parent, match, matchPlusRemainder);
            }
          }
          function doIgnore(lexeme) {
            if (top.matcher.regexIndex === 0) {
              modeBuffer += lexeme[0];
              return 1;
            } else {
              resumeScanAtSamePosition = true;
              return 0;
            }
          }
          function doBeginMatch(match) {
            const lexeme = match[0];
            const newMode = match.rule;
            const resp = new Response(newMode);
            const beforeCallbacks = [newMode.__beforeBegin, newMode["on:begin"]];
            for (const cb of beforeCallbacks) {
              if (!cb) continue;
              cb(match, resp);
              if (resp.isMatchIgnored) return doIgnore(lexeme);
            }
            if (newMode.skip) {
              modeBuffer += lexeme;
            } else {
              if (newMode.excludeBegin) {
                modeBuffer += lexeme;
              }
              processBuffer();
              if (!newMode.returnBegin && !newMode.excludeBegin) {
                modeBuffer = lexeme;
              }
            }
            startNewMode(newMode, match);
            return newMode.returnBegin ? 0 : lexeme.length;
          }
          function doEndMatch(match) {
            const lexeme = match[0];
            const matchPlusRemainder = codeToHighlight.substring(match.index);
            const endMode = endOfMode(top, match, matchPlusRemainder);
            if (!endMode) {
              return NO_MATCH;
            }
            const origin = top;
            if (top.endScope && top.endScope._wrap) {
              processBuffer();
              emitKeyword(lexeme, top.endScope._wrap);
            } else if (top.endScope && top.endScope._multi) {
              processBuffer();
              emitMultiClass(top.endScope, match);
            } else if (origin.skip) {
              modeBuffer += lexeme;
            } else {
              if (!(origin.returnEnd || origin.excludeEnd)) {
                modeBuffer += lexeme;
              }
              processBuffer();
              if (origin.excludeEnd) {
                modeBuffer = lexeme;
              }
            }
            do {
              if (top.scope) {
                emitter.closeNode();
              }
              if (!top.skip && !top.subLanguage) {
                relevance += top.relevance;
              }
              top = top.parent;
            } while (top !== endMode.parent);
            if (endMode.starts) {
              startNewMode(endMode.starts, match);
            }
            return origin.returnEnd ? 0 : lexeme.length;
          }
          function processContinuations() {
            const list = [];
            for (let current = top; current !== language; current = current.parent) {
              if (current.scope) {
                list.unshift(current.scope);
              }
            }
            list.forEach((item) => emitter.openNode(item));
          }
          let lastMatch = {};
          function processLexeme(textBeforeMatch, match) {
            const lexeme = match && match[0];
            modeBuffer += textBeforeMatch;
            if (lexeme == null) {
              processBuffer();
              return 0;
            }
            if (lastMatch.type === "begin" && match.type === "end" && lastMatch.index === match.index && lexeme === "") {
              modeBuffer += codeToHighlight.slice(match.index, match.index + 1);
              if (!SAFE_MODE) {
                const err = new Error(`0 width match regex (${languageName})`);
                err.languageName = languageName;
                err.badRule = lastMatch.rule;
                throw err;
              }
              return 1;
            }
            lastMatch = match;
            if (match.type === "begin") {
              return doBeginMatch(match);
            } else if (match.type === "illegal" && !ignoreIllegals) {
              const err = new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.scope || "<unnamed>") + '"');
              err.mode = top;
              throw err;
            } else if (match.type === "end") {
              const processed = doEndMatch(match);
              if (processed !== NO_MATCH) {
                return processed;
              }
            }
            if (match.type === "illegal" && lexeme === "") {
              modeBuffer += "\n";
              return 1;
            }
            if (iterations > 1e5 && iterations > match.index * 3) {
              const err = new Error("potential infinite loop, way more iterations than matches");
              throw err;
            }
            modeBuffer += lexeme;
            return lexeme.length;
          }
          const language = getLanguage(languageName);
          if (!language) {
            error(LANGUAGE_NOT_FOUND.replace("{}", languageName));
            throw new Error('Unknown language: "' + languageName + '"');
          }
          const md = compileLanguage(language);
          let result = "";
          let top = continuation || md;
          const continuations = {};
          const emitter = new options.__emitter(options);
          processContinuations();
          let modeBuffer = "";
          let relevance = 0;
          let index = 0;
          let iterations = 0;
          let resumeScanAtSamePosition = false;
          try {
            if (!language.__emitTokens) {
              top.matcher.considerAll();
              for (; ; ) {
                iterations++;
                if (resumeScanAtSamePosition) {
                  resumeScanAtSamePosition = false;
                } else {
                  top.matcher.considerAll();
                }
                top.matcher.lastIndex = index;
                const match = top.matcher.exec(codeToHighlight);
                if (!match) break;
                const beforeMatch = codeToHighlight.substring(index, match.index);
                const processedCount = processLexeme(beforeMatch, match);
                index = match.index + processedCount;
              }
              processLexeme(codeToHighlight.substring(index));
            } else {
              language.__emitTokens(codeToHighlight, emitter);
            }
            emitter.finalize();
            result = emitter.toHTML();
            return {
              language: languageName,
              value: result,
              relevance,
              illegal: false,
              _emitter: emitter,
              _top: top
            };
          } catch (err) {
            if (err.message && err.message.includes("Illegal")) {
              return {
                language: languageName,
                value: escape(codeToHighlight),
                illegal: true,
                relevance: 0,
                _illegalBy: {
                  message: err.message,
                  index,
                  context: codeToHighlight.slice(index - 100, index + 100),
                  mode: err.mode,
                  resultSoFar: result
                },
                _emitter: emitter
              };
            } else if (SAFE_MODE) {
              return {
                language: languageName,
                value: escape(codeToHighlight),
                illegal: false,
                relevance: 0,
                errorRaised: err,
                _emitter: emitter,
                _top: top
              };
            } else {
              throw err;
            }
          }
        }
        function justTextHighlightResult(code) {
          const result = {
            value: escape(code),
            illegal: false,
            relevance: 0,
            _top: PLAINTEXT_LANGUAGE,
            _emitter: new options.__emitter(options)
          };
          result._emitter.addText(code);
          return result;
        }
        function highlightAuto(code, languageSubset) {
          languageSubset = languageSubset || options.languages || Object.keys(languages);
          const plaintext = justTextHighlightResult(code);
          const results = languageSubset.filter(getLanguage).filter(autoDetection).map(
            (name) => _highlight(name, code, false)
          );
          results.unshift(plaintext);
          const sorted = results.sort((a, b) => {
            if (a.relevance !== b.relevance) return b.relevance - a.relevance;
            if (a.language && b.language) {
              if (getLanguage(a.language).supersetOf === b.language) {
                return 1;
              } else if (getLanguage(b.language).supersetOf === a.language) {
                return -1;
              }
            }
            return 0;
          });
          const [best, secondBest] = sorted;
          const result = best;
          result.secondBest = secondBest;
          return result;
        }
        function updateClassName(element, currentLang, resultLang) {
          const language = currentLang && aliases[currentLang] || resultLang;
          element.classList.add("hljs");
          element.classList.add(`language-${language}`);
        }
        function highlightElement(element) {
          let node = null;
          const language = blockLanguage(element);
          if (shouldNotHighlight(language)) return;
          fire(
            "before:highlightElement",
            { el: element, language }
          );
          if (element.dataset.highlighted) {
            console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", element);
            return;
          }
          if (element.children.length > 0) {
            if (!options.ignoreUnescapedHTML) {
              console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk.");
              console.warn("https://github.com/highlightjs/highlight.js/wiki/security");
              console.warn("The element with unescaped HTML:");
              console.warn(element);
            }
            if (options.throwUnescapedHTML) {
              const err = new HTMLInjectionError(
                "One of your code blocks includes unescaped HTML.",
                element.innerHTML
              );
              throw err;
            }
          }
          node = element;
          const text = node.textContent;
          const result = language ? highlight3(text, { language, ignoreIllegals: true }) : highlightAuto(text);
          element.innerHTML = result.value;
          element.dataset.highlighted = "yes";
          updateClassName(element, language, result.language);
          element.result = {
            language: result.language,
            // TODO: remove with version 11.0
            re: result.relevance,
            relevance: result.relevance
          };
          if (result.secondBest) {
            element.secondBest = {
              language: result.secondBest.language,
              relevance: result.secondBest.relevance
            };
          }
          fire("after:highlightElement", { el: element, result, text });
        }
        function configure(userOptions) {
          options = inherit(options, userOptions);
        }
        const initHighlighting = () => {
          highlightAll();
          deprecated("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
        };
        function initHighlightingOnLoad() {
          highlightAll();
          deprecated("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
        }
        let wantsHighlight = false;
        function highlightAll() {
          function boot() {
            highlightAll();
          }
          if (document.readyState === "loading") {
            if (!wantsHighlight) {
              window.addEventListener("DOMContentLoaded", boot, false);
            }
            wantsHighlight = true;
            return;
          }
          const blocks = document.querySelectorAll(options.cssSelector);
          blocks.forEach(highlightElement);
        }
        function registerLanguage(languageName, languageDefinition) {
          let lang = null;
          try {
            lang = languageDefinition(hljs);
          } catch (error$1) {
            error("Language definition for '{}' could not be registered.".replace("{}", languageName));
            if (!SAFE_MODE) {
              throw error$1;
            } else {
              error(error$1);
            }
            lang = PLAINTEXT_LANGUAGE;
          }
          if (!lang.name) lang.name = languageName;
          languages[languageName] = lang;
          lang.rawDefinition = languageDefinition.bind(null, hljs);
          if (lang.aliases) {
            registerAliases(lang.aliases, { languageName });
          }
        }
        function unregisterLanguage(languageName) {
          delete languages[languageName];
          for (const alias of Object.keys(aliases)) {
            if (aliases[alias] === languageName) {
              delete aliases[alias];
            }
          }
        }
        function listLanguages2() {
          return Object.keys(languages);
        }
        function getLanguage(name) {
          name = (name || "").toLowerCase();
          return languages[name] || languages[aliases[name]];
        }
        function registerAliases(aliasList, { languageName }) {
          if (typeof aliasList === "string") {
            aliasList = [aliasList];
          }
          aliasList.forEach((alias) => {
            aliases[alias.toLowerCase()] = languageName;
          });
        }
        function autoDetection(name) {
          const lang = getLanguage(name);
          return lang && !lang.disableAutodetect;
        }
        function upgradePluginAPI(plugin) {
          if (plugin["before:highlightBlock"] && !plugin["before:highlightElement"]) {
            plugin["before:highlightElement"] = (data) => {
              plugin["before:highlightBlock"](
                Object.assign({ block: data.el }, data)
              );
            };
          }
          if (plugin["after:highlightBlock"] && !plugin["after:highlightElement"]) {
            plugin["after:highlightElement"] = (data) => {
              plugin["after:highlightBlock"](
                Object.assign({ block: data.el }, data)
              );
            };
          }
        }
        function addPlugin(plugin) {
          upgradePluginAPI(plugin);
          plugins.push(plugin);
        }
        function removePlugin(plugin) {
          const index = plugins.indexOf(plugin);
          if (index !== -1) {
            plugins.splice(index, 1);
          }
        }
        function fire(event, args) {
          const cb = event;
          plugins.forEach(function(plugin) {
            if (plugin[cb]) {
              plugin[cb](args);
            }
          });
        }
        function deprecateHighlightBlock(el) {
          deprecated("10.7.0", "highlightBlock will be removed entirely in v12.0");
          deprecated("10.7.0", "Please use highlightElement now.");
          return highlightElement(el);
        }
        Object.assign(hljs, {
          highlight: highlight3,
          highlightAuto,
          highlightAll,
          highlightElement,
          // TODO: Remove with v12 API
          highlightBlock: deprecateHighlightBlock,
          configure,
          initHighlighting,
          initHighlightingOnLoad,
          registerLanguage,
          unregisterLanguage,
          listLanguages: listLanguages2,
          getLanguage,
          registerAliases,
          autoDetection,
          inherit,
          addPlugin,
          removePlugin
        });
        hljs.debugMode = function() {
          SAFE_MODE = false;
        };
        hljs.safeMode = function() {
          SAFE_MODE = true;
        };
        hljs.versionString = version;
        hljs.regex = {
          concat,
          lookahead,
          either,
          optional,
          anyNumberOfTimes
        };
        for (const key in MODES4) {
          if (typeof MODES4[key] === "object") {
            deepFreeze(MODES4[key]);
          }
        }
        Object.assign(hljs, MODES4);
        return hljs;
      };
      var highlight2 = HLJS({});
      highlight2.newInstance = () => HLJS({});
      module.exports = highlight2;
      highlight2.HighlightJS = highlight2;
      highlight2.default = highlight2;
    }
  });

  // scripts/code-highlight-engine.entry.js
  var code_highlight_engine_entry_exports = {};
  __export(code_highlight_engine_entry_exports, {
    hasLanguage: () => hasLanguage,
    highlight: () => highlight,
    listLanguages: () => listLanguages
  });

  // node_modules/highlight.js/es/core.js
  var import_core = __toESM(require_core(), 1);
  var core_default = import_core.default;

  // node_modules/highlight.js/es/languages/bash.js
  function bash(hljs) {
    const regex = hljs.regex;
    const VAR = {};
    const BRACED_VAR = {
      begin: /\$\{/,
      end: /\}/,
      contains: [
        "self",
        {
          begin: /:-/,
          contains: [VAR]
        }
        // default values
      ]
    };
    Object.assign(VAR, {
      className: "variable",
      variants: [
        { begin: regex.concat(
          /\$[\w\d#@][\w\d_]*/,
          // negative look-ahead tries to avoid matching patterns that are not
          // Perl at all like $ident$, @ident@, etc.
          `(?![\\w\\d])(?![$])`
        ) },
        BRACED_VAR
      ]
    });
    const SUBST = {
      className: "subst",
      begin: /\$\(/,
      end: /\)/,
      contains: [hljs.BACKSLASH_ESCAPE]
    };
    const COMMENT = hljs.inherit(
      hljs.COMMENT(),
      {
        match: [
          /(^|\s)/,
          /#.*$/
        ],
        scope: {
          2: "comment"
        }
      }
    );
    const HERE_DOC = {
      begin: /<<-?\s*(?=\w+)/,
      starts: { contains: [
        hljs.END_SAME_AS_BEGIN({
          begin: /(\w+)/,
          end: /(\w+)/,
          className: "string"
        })
      ] }
    };
    const QUOTE_STRING = {
      className: "string",
      begin: /"/,
      end: /"/,
      contains: [
        hljs.BACKSLASH_ESCAPE,
        VAR,
        SUBST
      ]
    };
    SUBST.contains.push(QUOTE_STRING);
    const ESCAPED_QUOTE = {
      match: /\\"/
    };
    const APOS_STRING = {
      className: "string",
      begin: /'/,
      end: /'/
    };
    const ESCAPED_APOS = {
      match: /\\'/
    };
    const ARITHMETIC = {
      begin: /\$?\(\(/,
      end: /\)\)/,
      contains: [
        {
          begin: /\d+#[0-9a-f]+/,
          className: "number"
        },
        hljs.NUMBER_MODE,
        VAR
      ]
    };
    const SH_LIKE_SHELLS = [
      "fish",
      "bash",
      "zsh",
      "sh",
      "csh",
      "ksh",
      "tcsh",
      "dash",
      "scsh"
    ];
    const KNOWN_SHEBANG = hljs.SHEBANG({
      binary: `(${SH_LIKE_SHELLS.join("|")})`,
      relevance: 10
    });
    const FUNCTION = {
      className: "function",
      begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
      returnBegin: true,
      contains: [hljs.inherit(hljs.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
      relevance: 0
    };
    const KEYWORDS3 = [
      "if",
      "then",
      "else",
      "elif",
      "fi",
      "time",
      "for",
      "while",
      "until",
      "in",
      "do",
      "done",
      "case",
      "esac",
      "coproc",
      "function",
      "select"
    ];
    const LITERALS3 = [
      "true",
      "false"
    ];
    const PATH_MODE = { match: /(\/[a-z._-]+)+/ };
    const SHELL_BUILT_INS = [
      "break",
      "cd",
      "continue",
      "eval",
      "exec",
      "exit",
      "export",
      "getopts",
      "hash",
      "pwd",
      "readonly",
      "return",
      "shift",
      "test",
      "times",
      "trap",
      "umask",
      "unset"
    ];
    const BASH_BUILT_INS = [
      "alias",
      "bind",
      "builtin",
      "caller",
      "command",
      "declare",
      "echo",
      "enable",
      "help",
      "let",
      "local",
      "logout",
      "mapfile",
      "printf",
      "read",
      "readarray",
      "source",
      "sudo",
      "type",
      "typeset",
      "ulimit",
      "unalias"
    ];
    const ZSH_BUILT_INS = [
      "autoload",
      "bg",
      "bindkey",
      "bye",
      "cap",
      "chdir",
      "clone",
      "comparguments",
      "compcall",
      "compctl",
      "compdescribe",
      "compfiles",
      "compgroups",
      "compquote",
      "comptags",
      "comptry",
      "compvalues",
      "dirs",
      "disable",
      "disown",
      "echotc",
      "echoti",
      "emulate",
      "fc",
      "fg",
      "float",
      "functions",
      "getcap",
      "getln",
      "history",
      "integer",
      "jobs",
      "kill",
      "limit",
      "log",
      "noglob",
      "popd",
      "print",
      "pushd",
      "pushln",
      "rehash",
      "sched",
      "setcap",
      "setopt",
      "stat",
      "suspend",
      "ttyctl",
      "unfunction",
      "unhash",
      "unlimit",
      "unsetopt",
      "vared",
      "wait",
      "whence",
      "where",
      "which",
      "zcompile",
      "zformat",
      "zftp",
      "zle",
      "zmodload",
      "zparseopts",
      "zprof",
      "zpty",
      "zregexparse",
      "zsocket",
      "zstyle",
      "ztcp"
    ];
    const GNU_CORE_UTILS = [
      "chcon",
      "chgrp",
      "chown",
      "chmod",
      "cp",
      "dd",
      "df",
      "dir",
      "dircolors",
      "ln",
      "ls",
      "mkdir",
      "mkfifo",
      "mknod",
      "mktemp",
      "mv",
      "realpath",
      "rm",
      "rmdir",
      "shred",
      "sync",
      "touch",
      "truncate",
      "vdir",
      "b2sum",
      "base32",
      "base64",
      "cat",
      "cksum",
      "comm",
      "csplit",
      "cut",
      "expand",
      "fmt",
      "fold",
      "head",
      "join",
      "md5sum",
      "nl",
      "numfmt",
      "od",
      "paste",
      "ptx",
      "pr",
      "sha1sum",
      "sha224sum",
      "sha256sum",
      "sha384sum",
      "sha512sum",
      "shuf",
      "sort",
      "split",
      "sum",
      "tac",
      "tail",
      "tr",
      "tsort",
      "unexpand",
      "uniq",
      "wc",
      "arch",
      "basename",
      "chroot",
      "date",
      "dirname",
      "du",
      "echo",
      "env",
      "expr",
      "factor",
      // "false", // keyword literal already
      "groups",
      "hostid",
      "id",
      "link",
      "logname",
      "nice",
      "nohup",
      "nproc",
      "pathchk",
      "pinky",
      "printenv",
      "printf",
      "pwd",
      "readlink",
      "runcon",
      "seq",
      "sleep",
      "stat",
      "stdbuf",
      "stty",
      "tee",
      "test",
      "timeout",
      // "true", // keyword literal already
      "tty",
      "uname",
      "unlink",
      "uptime",
      "users",
      "who",
      "whoami",
      "yes"
    ];
    return {
      name: "Bash",
      aliases: [
        "sh",
        "zsh"
      ],
      keywords: {
        $pattern: /\b[a-z][a-z0-9._-]+\b/,
        keyword: KEYWORDS3,
        literal: LITERALS3,
        built_in: [
          ...SHELL_BUILT_INS,
          ...BASH_BUILT_INS,
          // Shell modifiers
          "set",
          "shopt",
          ...ZSH_BUILT_INS,
          ...GNU_CORE_UTILS
        ]
      },
      contains: [
        KNOWN_SHEBANG,
        // to catch known shells and boost relevancy
        hljs.SHEBANG(),
        // to catch unknown shells but still highlight the shebang
        FUNCTION,
        ARITHMETIC,
        COMMENT,
        HERE_DOC,
        PATH_MODE,
        QUOTE_STRING,
        ESCAPED_QUOTE,
        APOS_STRING,
        ESCAPED_APOS,
        VAR
      ]
    };
  }

  // node_modules/highlight.js/es/languages/c.js
  function c(hljs) {
    const regex = hljs.regex;
    const C_LINE_COMMENT_MODE = hljs.COMMENT("//", "$", { contains: [{ begin: /\\\n/ }] });
    const DECLTYPE_AUTO_RE = "decltype\\(auto\\)";
    const NAMESPACE_RE = "[a-zA-Z_]\\w*::";
    const TEMPLATE_ARGUMENT_RE = "<[^<>]+>";
    const FUNCTION_TYPE_RE = "(" + DECLTYPE_AUTO_RE + "|" + regex.optional(NAMESPACE_RE) + "[a-zA-Z_]\\w*" + regex.optional(TEMPLATE_ARGUMENT_RE) + ")";
    const TYPES3 = {
      className: "type",
      variants: [
        { begin: "\\b[a-z\\d_]*_t\\b" },
        { match: /\batomic_[a-z]{3,6}\b/ }
      ]
    };
    const CHARACTER_ESCAPES = "\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)";
    const STRINGS = {
      className: "string",
      variants: [
        {
          begin: '(u8?|U|L)?"',
          end: '"',
          illegal: "\\n",
          contains: [hljs.BACKSLASH_ESCAPE]
        },
        {
          begin: "(u8?|U|L)?'(" + CHARACTER_ESCAPES + "|.)",
          end: "'",
          illegal: "."
        },
        hljs.END_SAME_AS_BEGIN({
          begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
          end: /\)([^()\\ ]{0,16})"/
        })
      ]
    };
    const NUMBERS = {
      className: "number",
      variants: [
        { match: /\b(0b[01']+)/ },
        { match: /(-?)\b([\d']+(\.[\d']*)?|\.[\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)/ },
        { match: /(-?)\b(0[xX][a-fA-F0-9]+(?:'[a-fA-F0-9]+)*(?:\.[a-fA-F0-9]*(?:'[a-fA-F0-9]*)*)?(?:[pP][-+]?[0-9]+)?(l|L)?(u|U)?)/ },
        { match: /(-?)\b\d+(?:'\d+)*(?:\.\d*(?:'\d*)*)?(?:[eE][-+]?\d+)?/ }
      ],
      relevance: 0
    };
    const PREPROCESSOR = {
      className: "meta",
      begin: /#\s*[a-z]+\b/,
      end: /$/,
      keywords: { keyword: "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef elifdef elifndef include" },
      contains: [
        {
          begin: /\\\n/,
          relevance: 0
        },
        hljs.inherit(STRINGS, { className: "string" }),
        {
          className: "string",
          begin: /<.*?>/
        },
        C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE
      ]
    };
    const TITLE_MODE = {
      className: "title",
      begin: regex.optional(NAMESPACE_RE) + hljs.IDENT_RE,
      relevance: 0
    };
    const FUNCTION_TITLE = regex.optional(NAMESPACE_RE) + hljs.IDENT_RE + "\\s*\\(";
    const C_KEYWORDS = [
      "asm",
      "auto",
      "break",
      "case",
      "continue",
      "default",
      "do",
      "else",
      "enum",
      "extern",
      "for",
      "fortran",
      "goto",
      "if",
      "inline",
      "register",
      "restrict",
      "return",
      "sizeof",
      "typeof",
      "typeof_unqual",
      "struct",
      "switch",
      "typedef",
      "union",
      "volatile",
      "while",
      "_Alignas",
      "_Alignof",
      "_Atomic",
      "_Generic",
      "_Noreturn",
      "_Static_assert",
      "_Thread_local",
      // aliases
      "alignas",
      "alignof",
      "noreturn",
      "static_assert",
      "thread_local",
      // not a C keyword but is, for all intents and purposes, treated exactly like one.
      "_Pragma"
    ];
    const C_TYPES = [
      "float",
      "double",
      "signed",
      "unsigned",
      "int",
      "short",
      "long",
      "char",
      "void",
      "_Bool",
      "_BitInt",
      "_Complex",
      "_Imaginary",
      "_Decimal32",
      "_Decimal64",
      "_Decimal96",
      "_Decimal128",
      "_Decimal64x",
      "_Decimal128x",
      "_Float16",
      "_Float32",
      "_Float64",
      "_Float128",
      "_Float32x",
      "_Float64x",
      "_Float128x",
      // modifiers
      "const",
      "static",
      "constexpr",
      // aliases
      "complex",
      "bool",
      "imaginary"
    ];
    const KEYWORDS3 = {
      keyword: C_KEYWORDS,
      type: C_TYPES,
      literal: "true false NULL",
      // TODO: apply hinting work similar to what was done in cpp.js
      built_in: "std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr"
    };
    const EXPRESSION_CONTAINS = [
      PREPROCESSOR,
      TYPES3,
      C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      NUMBERS,
      STRINGS
    ];
    const EXPRESSION_CONTEXT = {
      // This mode covers expression context where we can't expect a function
      // definition and shouldn't highlight anything that looks like one:
      // `return some()`, `else if()`, `(x*sum(1, 2))`
      variants: [
        {
          begin: /=/,
          end: /;/
        },
        {
          begin: /\(/,
          end: /\)/
        },
        {
          beginKeywords: "new throw return else",
          end: /;/
        }
      ],
      keywords: KEYWORDS3,
      contains: EXPRESSION_CONTAINS.concat([
        {
          begin: /\(/,
          end: /\)/,
          keywords: KEYWORDS3,
          contains: EXPRESSION_CONTAINS.concat(["self"]),
          relevance: 0
        }
      ]),
      relevance: 0
    };
    const FUNCTION_DECLARATION = {
      begin: "(" + FUNCTION_TYPE_RE + "[\\*&\\s]+)+" + FUNCTION_TITLE,
      returnBegin: true,
      end: /[{;=]/,
      excludeEnd: true,
      keywords: KEYWORDS3,
      illegal: /[^\w\s\*&:<>.]/,
      contains: [
        {
          // to prevent it from being confused as the function title
          begin: DECLTYPE_AUTO_RE,
          keywords: KEYWORDS3,
          relevance: 0
        },
        {
          begin: FUNCTION_TITLE,
          returnBegin: true,
          contains: [hljs.inherit(TITLE_MODE, { className: "title.function" })],
          relevance: 0
        },
        // allow for multiple declarations, e.g.:
        // extern void f(int), g(char);
        {
          relevance: 0,
          match: /,/
        },
        {
          className: "params",
          begin: /\(/,
          end: /\)/,
          keywords: KEYWORDS3,
          relevance: 0,
          contains: [
            C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            STRINGS,
            NUMBERS,
            TYPES3,
            // Count matching parentheses.
            {
              begin: /\(/,
              end: /\)/,
              keywords: KEYWORDS3,
              relevance: 0,
              contains: [
                "self",
                C_LINE_COMMENT_MODE,
                hljs.C_BLOCK_COMMENT_MODE,
                STRINGS,
                NUMBERS,
                TYPES3
              ]
            }
          ]
        },
        TYPES3,
        C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        PREPROCESSOR
      ]
    };
    return {
      name: "C",
      aliases: ["h"],
      keywords: KEYWORDS3,
      // Until differentiations are added between `c` and `cpp`, `c` will
      // not be auto-detected to avoid auto-detect conflicts between C and C++
      disableAutodetect: true,
      illegal: "</",
      contains: [].concat(
        EXPRESSION_CONTEXT,
        FUNCTION_DECLARATION,
        EXPRESSION_CONTAINS,
        [
          PREPROCESSOR,
          {
            begin: hljs.IDENT_RE + "::",
            keywords: KEYWORDS3
          },
          {
            className: "class",
            beginKeywords: "enum class struct union",
            end: /[{;:<>=]/,
            contains: [
              { beginKeywords: "final class struct" },
              hljs.TITLE_MODE
            ]
          }
        ]
      ),
      exports: {
        preprocessor: PREPROCESSOR,
        strings: STRINGS,
        keywords: KEYWORDS3
      }
    };
  }

  // node_modules/highlight.js/es/languages/cpp.js
  function cpp(hljs) {
    const regex = hljs.regex;
    const C_LINE_COMMENT_MODE = hljs.COMMENT("//", "$", { contains: [{ begin: /\\\n/ }] });
    const DECLTYPE_AUTO_RE = "decltype\\(auto\\)";
    const NAMESPACE_RE = "[a-zA-Z_]\\w*::";
    const TEMPLATE_ARGUMENT_RE = "<[^<>]+>";
    const FUNCTION_TYPE_RE = "(?!struct)(" + DECLTYPE_AUTO_RE + "|" + regex.optional(NAMESPACE_RE) + "[a-zA-Z_]\\w*" + regex.optional(TEMPLATE_ARGUMENT_RE) + ")";
    const CPP_PRIMITIVE_TYPES = {
      className: "type",
      begin: "\\b[a-z\\d_]*_t\\b"
    };
    const CHARACTER_ESCAPES = "\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)";
    const STRINGS = {
      className: "string",
      variants: [
        {
          begin: '(u8?|U|L)?"',
          end: '"',
          illegal: "\\n",
          contains: [hljs.BACKSLASH_ESCAPE]
        },
        {
          begin: "(u8?|U|L)?'(" + CHARACTER_ESCAPES + "|.)",
          end: "'",
          illegal: "."
        },
        hljs.END_SAME_AS_BEGIN({
          begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
          end: /\)([^()\\ ]{0,16})"/
        })
      ]
    };
    const NUMBERS = {
      className: "number",
      variants: [
        // Floating-point literal.
        {
          begin: "[+-]?(?:(?:[0-9](?:'?[0-9])*\\.(?:[0-9](?:'?[0-9])*)?|\\.[0-9](?:'?[0-9])*)(?:[Ee][+-]?[0-9](?:'?[0-9])*)?|[0-9](?:'?[0-9])*[Ee][+-]?[0-9](?:'?[0-9])*|0[Xx](?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*(?:\\.(?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)?)?|\\.[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)[Pp][+-]?[0-9](?:'?[0-9])*)(?:[Ff](?:16|32|64|128)?|(BF|bf)16|[Ll]|)"
        },
        // Integer literal.
        {
          begin: "[+-]?\\b(?:0[Bb][01](?:'?[01])*|0[Xx][0-9A-Fa-f](?:'?[0-9A-Fa-f])*|0(?:'?[0-7])*|[1-9](?:'?[0-9])*)(?:[Uu](?:LL?|ll?)|[Uu][Zz]?|(?:LL?|ll?)[Uu]?|[Zz][Uu]|)"
          // Note: there are user-defined literal suffixes too, but perhaps having the custom suffix not part of the
          // literal highlight actually makes it stand out more.
        }
      ],
      relevance: 0
    };
    const PREPROCESSOR = {
      className: "meta",
      begin: /#\s*[a-z]+\b/,
      end: /$/,
      keywords: { keyword: "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include" },
      contains: [
        {
          begin: /\\\n/,
          relevance: 0
        },
        hljs.inherit(STRINGS, { className: "string" }),
        {
          className: "string",
          begin: /<.*?>/
        },
        C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE
      ]
    };
    const TITLE_MODE = {
      className: "title",
      begin: regex.optional(NAMESPACE_RE) + hljs.IDENT_RE,
      relevance: 0
    };
    const FUNCTION_TITLE = regex.optional(NAMESPACE_RE) + hljs.IDENT_RE + "\\s*\\(";
    const RESERVED_KEYWORDS = [
      "alignas",
      "alignof",
      "and",
      "and_eq",
      "asm",
      "atomic_cancel",
      "atomic_commit",
      "atomic_noexcept",
      "auto",
      "bitand",
      "bitor",
      "break",
      "case",
      "catch",
      "class",
      "co_await",
      "co_return",
      "co_yield",
      "compl",
      "concept",
      "const_cast|10",
      "consteval",
      "constexpr",
      "constinit",
      "continue",
      "decltype",
      "default",
      "delete",
      "do",
      "dynamic_cast|10",
      "else",
      "enum",
      "explicit",
      "export",
      "extern",
      "false",
      "final",
      "for",
      "friend",
      "goto",
      "if",
      "import",
      "inline",
      "module",
      "mutable",
      "namespace",
      "new",
      "noexcept",
      "not",
      "not_eq",
      "nullptr",
      "operator",
      "or",
      "or_eq",
      "override",
      "private",
      "protected",
      "public",
      "reflexpr",
      "register",
      "reinterpret_cast|10",
      "requires",
      "return",
      "sizeof",
      "static_assert",
      "static_cast|10",
      "struct",
      "switch",
      "synchronized",
      "template",
      "this",
      "thread_local",
      "throw",
      "transaction_safe",
      "transaction_safe_dynamic",
      "true",
      "try",
      "typedef",
      "typeid",
      "typename",
      "union",
      "using",
      "virtual",
      "volatile",
      "while",
      "xor",
      "xor_eq"
    ];
    const RESERVED_TYPES = [
      "bool",
      "char",
      "char16_t",
      "char32_t",
      "char8_t",
      "double",
      "float",
      "int",
      "long",
      "short",
      "void",
      "wchar_t",
      "unsigned",
      "signed",
      "const",
      "static"
    ];
    const TYPE_HINTS = [
      "any",
      "auto_ptr",
      "barrier",
      "binary_semaphore",
      "bitset",
      "complex",
      "condition_variable",
      "condition_variable_any",
      "counting_semaphore",
      "deque",
      "false_type",
      "flat_map",
      "flat_set",
      "future",
      "imaginary",
      "initializer_list",
      "istringstream",
      "jthread",
      "latch",
      "lock_guard",
      "multimap",
      "multiset",
      "mutex",
      "optional",
      "ostringstream",
      "packaged_task",
      "pair",
      "promise",
      "priority_queue",
      "queue",
      "recursive_mutex",
      "recursive_timed_mutex",
      "scoped_lock",
      "set",
      "shared_future",
      "shared_lock",
      "shared_mutex",
      "shared_timed_mutex",
      "shared_ptr",
      "stack",
      "string_view",
      "stringstream",
      "timed_mutex",
      "thread",
      "true_type",
      "tuple",
      "unique_lock",
      "unique_ptr",
      "unordered_map",
      "unordered_multimap",
      "unordered_multiset",
      "unordered_set",
      "variant",
      "vector",
      "weak_ptr",
      "wstring",
      "wstring_view"
    ];
    const FUNCTION_HINTS = [
      "abort",
      "abs",
      "acos",
      "apply",
      "as_const",
      "asin",
      "atan",
      "atan2",
      "calloc",
      "ceil",
      "cerr",
      "cin",
      "clog",
      "cos",
      "cosh",
      "cout",
      "declval",
      "endl",
      "exchange",
      "exit",
      "exp",
      "fabs",
      "floor",
      "fmod",
      "forward",
      "fprintf",
      "fputs",
      "free",
      "frexp",
      "fscanf",
      "future",
      "invoke",
      "isalnum",
      "isalpha",
      "iscntrl",
      "isdigit",
      "isgraph",
      "islower",
      "isprint",
      "ispunct",
      "isspace",
      "isupper",
      "isxdigit",
      "labs",
      "launder",
      "ldexp",
      "log",
      "log10",
      "make_pair",
      "make_shared",
      "make_shared_for_overwrite",
      "make_tuple",
      "make_unique",
      "malloc",
      "memchr",
      "memcmp",
      "memcpy",
      "memset",
      "modf",
      "move",
      "pow",
      "printf",
      "putchar",
      "puts",
      "realloc",
      "scanf",
      "sin",
      "sinh",
      "snprintf",
      "sprintf",
      "sqrt",
      "sscanf",
      "std",
      "stderr",
      "stdin",
      "stdout",
      "strcat",
      "strchr",
      "strcmp",
      "strcpy",
      "strcspn",
      "strlen",
      "strncat",
      "strncmp",
      "strncpy",
      "strpbrk",
      "strrchr",
      "strspn",
      "strstr",
      "swap",
      "tan",
      "tanh",
      "terminate",
      "to_underlying",
      "tolower",
      "toupper",
      "vfprintf",
      "visit",
      "vprintf",
      "vsprintf"
    ];
    const LITERALS3 = [
      "NULL",
      "false",
      "nullopt",
      "nullptr",
      "true"
    ];
    const BUILT_IN = ["_Pragma"];
    const CPP_KEYWORDS = {
      type: RESERVED_TYPES,
      keyword: RESERVED_KEYWORDS,
      literal: LITERALS3,
      built_in: BUILT_IN,
      _type_hints: TYPE_HINTS
    };
    const FUNCTION_DISPATCH = {
      className: "function.dispatch",
      relevance: 0,
      keywords: {
        // Only for relevance, not highlighting.
        _hint: FUNCTION_HINTS
      },
      begin: regex.concat(
        /\b/,
        /(?!decltype)/,
        /(?!if)/,
        /(?!for)/,
        /(?!switch)/,
        /(?!while)/,
        hljs.IDENT_RE,
        regex.lookahead(/(<[^<>]+>|)\s*\(/)
      )
    };
    const EXPRESSION_CONTAINS = [
      FUNCTION_DISPATCH,
      PREPROCESSOR,
      CPP_PRIMITIVE_TYPES,
      C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      NUMBERS,
      STRINGS
    ];
    const EXPRESSION_CONTEXT = {
      // This mode covers expression context where we can't expect a function
      // definition and shouldn't highlight anything that looks like one:
      // `return some()`, `else if()`, `(x*sum(1, 2))`
      variants: [
        {
          begin: /=/,
          end: /;/
        },
        {
          begin: /\(/,
          end: /\)/
        },
        {
          beginKeywords: "new throw return else",
          end: /;/
        }
      ],
      keywords: CPP_KEYWORDS,
      contains: EXPRESSION_CONTAINS.concat([
        {
          begin: /\(/,
          end: /\)/,
          keywords: CPP_KEYWORDS,
          contains: EXPRESSION_CONTAINS.concat(["self"]),
          relevance: 0
        }
      ]),
      relevance: 0
    };
    const FUNCTION_DECLARATION = {
      className: "function",
      begin: "(" + FUNCTION_TYPE_RE + "[\\*&\\s]+)+" + FUNCTION_TITLE,
      returnBegin: true,
      end: /[{;=]/,
      excludeEnd: true,
      keywords: CPP_KEYWORDS,
      illegal: /[^\w\s\*&:<>.]/,
      contains: [
        {
          // to prevent it from being confused as the function title
          begin: DECLTYPE_AUTO_RE,
          keywords: CPP_KEYWORDS,
          relevance: 0
        },
        {
          begin: FUNCTION_TITLE,
          returnBegin: true,
          contains: [TITLE_MODE],
          relevance: 0
        },
        // needed because we do not have look-behind on the below rule
        // to prevent it from grabbing the final : in a :: pair
        {
          begin: /::/,
          relevance: 0
        },
        // initializers
        {
          begin: /:/,
          endsWithParent: true,
          contains: [
            STRINGS,
            NUMBERS
          ]
        },
        // allow for multiple declarations, e.g.:
        // extern void f(int), g(char);
        {
          relevance: 0,
          match: /,/
        },
        {
          className: "params",
          begin: /\(/,
          end: /\)/,
          keywords: CPP_KEYWORDS,
          relevance: 0,
          contains: [
            C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            STRINGS,
            NUMBERS,
            CPP_PRIMITIVE_TYPES,
            // Count matching parentheses.
            {
              begin: /\(/,
              end: /\)/,
              keywords: CPP_KEYWORDS,
              relevance: 0,
              contains: [
                "self",
                C_LINE_COMMENT_MODE,
                hljs.C_BLOCK_COMMENT_MODE,
                STRINGS,
                NUMBERS,
                CPP_PRIMITIVE_TYPES
              ]
            }
          ]
        },
        CPP_PRIMITIVE_TYPES,
        C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        PREPROCESSOR
      ]
    };
    return {
      name: "C++",
      aliases: [
        "cc",
        "c++",
        "h++",
        "hpp",
        "hh",
        "hxx",
        "cxx"
      ],
      keywords: CPP_KEYWORDS,
      illegal: "</",
      classNameAliases: { "function.dispatch": "built_in" },
      contains: [].concat(
        EXPRESSION_CONTEXT,
        FUNCTION_DECLARATION,
        FUNCTION_DISPATCH,
        EXPRESSION_CONTAINS,
        [
          PREPROCESSOR,
          {
            // containers: ie, `vector <int> rooms (9);`
            begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array|tuple|optional|variant|function|flat_map|flat_set)\\s*<(?!<)",
            end: ">",
            keywords: CPP_KEYWORDS,
            contains: [
              "self",
              CPP_PRIMITIVE_TYPES
            ]
          },
          {
            begin: hljs.IDENT_RE + "::",
            keywords: CPP_KEYWORDS
          },
          {
            match: [
              // extra complexity to deal with `enum class` and `enum struct`
              /\b(?:enum(?:\s+(?:class|struct))?|class|struct|union)/,
              /\s+/,
              /\w+/
            ],
            className: {
              1: "keyword",
              3: "title.class"
            }
          }
        ]
      )
    };
  }

  // node_modules/highlight.js/es/languages/csharp.js
  function csharp(hljs) {
    const BUILT_IN_KEYWORDS = [
      "bool",
      "byte",
      "char",
      "decimal",
      "delegate",
      "double",
      "dynamic",
      "enum",
      "float",
      "int",
      "long",
      "nint",
      "nuint",
      "object",
      "sbyte",
      "short",
      "string",
      "ulong",
      "uint",
      "ushort"
    ];
    const FUNCTION_MODIFIERS = [
      "public",
      "private",
      "protected",
      "static",
      "internal",
      "protected",
      "abstract",
      "async",
      "extern",
      "override",
      "unsafe",
      "virtual",
      "new",
      "sealed",
      "partial"
    ];
    const LITERAL_KEYWORDS = [
      "default",
      "false",
      "null",
      "true"
    ];
    const NORMAL_KEYWORDS = [
      "abstract",
      "as",
      "base",
      "break",
      "case",
      "catch",
      "class",
      "const",
      "continue",
      "do",
      "else",
      "event",
      "explicit",
      "extern",
      "finally",
      "fixed",
      "for",
      "foreach",
      "goto",
      "if",
      "implicit",
      "in",
      "interface",
      "internal",
      "is",
      "lock",
      "namespace",
      "new",
      "operator",
      "out",
      "override",
      "params",
      "private",
      "protected",
      "public",
      "readonly",
      "record",
      "ref",
      "return",
      "scoped",
      "sealed",
      "sizeof",
      "stackalloc",
      "static",
      "struct",
      "switch",
      "this",
      "throw",
      "try",
      "typeof",
      "unchecked",
      "unsafe",
      "using",
      "virtual",
      "void",
      "volatile",
      "while"
    ];
    const CONTEXTUAL_KEYWORDS = [
      "add",
      "alias",
      "and",
      "ascending",
      "args",
      "async",
      "await",
      "by",
      "descending",
      "dynamic",
      "equals",
      "file",
      "from",
      "get",
      "global",
      "group",
      "init",
      "into",
      "join",
      "let",
      "nameof",
      "not",
      "notnull",
      "on",
      "or",
      "orderby",
      "partial",
      "record",
      "remove",
      "required",
      "scoped",
      "select",
      "set",
      "unmanaged",
      "value|0",
      "var",
      "when",
      "where",
      "with",
      "yield"
    ];
    const KEYWORDS3 = {
      keyword: NORMAL_KEYWORDS.concat(CONTEXTUAL_KEYWORDS),
      built_in: BUILT_IN_KEYWORDS,
      literal: LITERAL_KEYWORDS
    };
    const TITLE_MODE = hljs.inherit(hljs.TITLE_MODE, { begin: "[a-zA-Z](\\.?\\w)*" });
    const NUMBERS = {
      className: "number",
      variants: [
        { begin: "\\b(0b[01']+)" },
        { begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)" },
        { begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)" }
      ],
      relevance: 0
    };
    const RAW_STRING = {
      className: "string",
      begin: /"""("*)(?!")(.|\n)*?"""\1/,
      relevance: 1
    };
    const VERBATIM_STRING = {
      className: "string",
      begin: '@"',
      end: '"',
      contains: [{ begin: '""' }]
    };
    const VERBATIM_STRING_NO_LF = hljs.inherit(VERBATIM_STRING, { illegal: /\n/ });
    const SUBST = {
      className: "subst",
      begin: /\{/,
      end: /\}/,
      keywords: KEYWORDS3
    };
    const SUBST_NO_LF = hljs.inherit(SUBST, { illegal: /\n/ });
    const INTERPOLATED_STRING = {
      className: "string",
      begin: /\$"/,
      end: '"',
      illegal: /\n/,
      contains: [
        { begin: /\{\{/ },
        { begin: /\}\}/ },
        hljs.BACKSLASH_ESCAPE,
        SUBST_NO_LF
      ]
    };
    const INTERPOLATED_VERBATIM_STRING = {
      className: "string",
      begin: /\$@"/,
      end: '"',
      contains: [
        { begin: /\{\{/ },
        { begin: /\}\}/ },
        { begin: '""' },
        SUBST
      ]
    };
    const INTERPOLATED_VERBATIM_STRING_NO_LF = hljs.inherit(INTERPOLATED_VERBATIM_STRING, {
      illegal: /\n/,
      contains: [
        { begin: /\{\{/ },
        { begin: /\}\}/ },
        { begin: '""' },
        SUBST_NO_LF
      ]
    });
    SUBST.contains = [
      INTERPOLATED_VERBATIM_STRING,
      INTERPOLATED_STRING,
      VERBATIM_STRING,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      NUMBERS,
      hljs.C_BLOCK_COMMENT_MODE
    ];
    SUBST_NO_LF.contains = [
      INTERPOLATED_VERBATIM_STRING_NO_LF,
      INTERPOLATED_STRING,
      VERBATIM_STRING_NO_LF,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      NUMBERS,
      hljs.inherit(hljs.C_BLOCK_COMMENT_MODE, { illegal: /\n/ })
    ];
    const STRING = { variants: [
      RAW_STRING,
      INTERPOLATED_VERBATIM_STRING,
      INTERPOLATED_STRING,
      VERBATIM_STRING,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE
    ] };
    const GENERIC_MODIFIER = {
      begin: "<",
      end: ">",
      contains: [
        { beginKeywords: "in out" },
        TITLE_MODE
      ]
    };
    const TYPE_IDENT_RE = hljs.IDENT_RE + "(<" + hljs.IDENT_RE + "(\\s*,\\s*" + hljs.IDENT_RE + ")*>)?(\\[\\])?";
    const AT_IDENTIFIER = {
      // prevents expressions like `@class` from incorrect flagging
      // `class` as a keyword
      begin: "@" + hljs.IDENT_RE,
      relevance: 0
    };
    return {
      name: "C#",
      aliases: [
        "cs",
        "c#"
      ],
      keywords: KEYWORDS3,
      illegal: /::/,
      contains: [
        hljs.COMMENT(
          "///",
          "$",
          {
            returnBegin: true,
            contains: [
              {
                className: "doctag",
                variants: [
                  {
                    begin: "///",
                    relevance: 0
                  },
                  { begin: "<!--|-->" },
                  {
                    begin: "</?",
                    end: ">"
                  }
                ]
              }
            ]
          }
        ),
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        {
          className: "meta",
          begin: "#",
          end: "$",
          keywords: { keyword: "if else elif endif define undef warning error line region endregion pragma checksum" }
        },
        STRING,
        NUMBERS,
        {
          beginKeywords: "class interface",
          relevance: 0,
          end: /[{;=]/,
          illegal: /[^\s:,]/,
          contains: [
            { beginKeywords: "where class" },
            TITLE_MODE,
            GENERIC_MODIFIER,
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE
          ]
        },
        {
          beginKeywords: "namespace",
          relevance: 0,
          end: /[{;=]/,
          illegal: /[^\s:]/,
          contains: [
            TITLE_MODE,
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE
          ]
        },
        {
          beginKeywords: "record",
          relevance: 0,
          end: /[{;=]/,
          illegal: /[^\s:]/,
          contains: [
            TITLE_MODE,
            GENERIC_MODIFIER,
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE
          ]
        },
        {
          // [Attributes("")]
          className: "meta",
          begin: "^\\s*\\[(?=[\\w])",
          excludeBegin: true,
          end: "\\]",
          excludeEnd: true,
          contains: [
            {
              className: "string",
              begin: /"/,
              end: /"/
            }
          ]
        },
        {
          // Expression keywords prevent 'keyword Name(...)' from being
          // recognized as a function definition
          beginKeywords: "new return throw await else",
          relevance: 0
        },
        {
          className: "function",
          begin: "(" + TYPE_IDENT_RE + "\\s+)+" + hljs.IDENT_RE + "\\s*(<[^=]+>\\s*)?\\(",
          returnBegin: true,
          end: /\s*[{;=]/,
          excludeEnd: true,
          keywords: KEYWORDS3,
          contains: [
            // prevents these from being highlighted `title`
            {
              beginKeywords: FUNCTION_MODIFIERS.join(" "),
              relevance: 0
            },
            {
              begin: hljs.IDENT_RE + "\\s*(<[^=]+>\\s*)?\\(",
              returnBegin: true,
              contains: [
                hljs.TITLE_MODE,
                GENERIC_MODIFIER
              ],
              relevance: 0
            },
            { match: /\(\)/ },
            {
              className: "params",
              begin: /\(/,
              end: /\)/,
              excludeBegin: true,
              excludeEnd: true,
              keywords: KEYWORDS3,
              relevance: 0,
              contains: [
                STRING,
                NUMBERS,
                hljs.C_BLOCK_COMMENT_MODE
              ]
            },
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE
          ]
        },
        AT_IDENTIFIER
      ]
    };
  }

  // node_modules/highlight.js/es/languages/css.js
  var MODES = (hljs) => {
    return {
      IMPORTANT: {
        scope: "meta",
        begin: "!important"
      },
      BLOCK_COMMENT: hljs.C_BLOCK_COMMENT_MODE,
      HEXCOLOR: {
        scope: "number",
        begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
      },
      FUNCTION_DISPATCH: {
        className: "built_in",
        begin: /[\w-]+(?=\()/
      },
      ATTRIBUTE_SELECTOR_MODE: {
        scope: "selector-attr",
        begin: /\[/,
        end: /\]/,
        illegal: "$",
        contains: [
          hljs.APOS_STRING_MODE,
          hljs.QUOTE_STRING_MODE
        ]
      },
      CSS_NUMBER_MODE: {
        scope: "number",
        begin: hljs.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
        relevance: 0
      },
      CSS_VARIABLE: {
        className: "attr",
        begin: /--[A-Za-z_][A-Za-z0-9_-]*/
      }
    };
  };
  var HTML_TAGS = [
    "a",
    "abbr",
    "address",
    "article",
    "aside",
    "audio",
    "b",
    "blockquote",
    "body",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "dd",
    "del",
    "details",
    "dfn",
    "div",
    "dl",
    "dt",
    "em",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hgroup",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "legend",
    "li",
    "main",
    "mark",
    "menu",
    "nav",
    "object",
    "ol",
    "optgroup",
    "option",
    "p",
    "picture",
    "q",
    "quote",
    "samp",
    "section",
    "select",
    "source",
    "span",
    "strong",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "tr",
    "ul",
    "var",
    "video"
  ];
  var SVG_TAGS = [
    "defs",
    "g",
    "marker",
    "mask",
    "pattern",
    "svg",
    "switch",
    "symbol",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feFlood",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMorphology",
    "feOffset",
    "feSpecularLighting",
    "feTile",
    "feTurbulence",
    "linearGradient",
    "radialGradient",
    "stop",
    "circle",
    "ellipse",
    "image",
    "line",
    "path",
    "polygon",
    "polyline",
    "rect",
    "text",
    "use",
    "textPath",
    "tspan",
    "foreignObject",
    "clipPath"
  ];
  var TAGS = [
    ...HTML_TAGS,
    ...SVG_TAGS
  ];
  var MEDIA_FEATURES = [
    "any-hover",
    "any-pointer",
    "aspect-ratio",
    "color",
    "color-gamut",
    "color-index",
    "device-aspect-ratio",
    "device-height",
    "device-width",
    "display-mode",
    "forced-colors",
    "grid",
    "height",
    "hover",
    "inverted-colors",
    "monochrome",
    "orientation",
    "overflow-block",
    "overflow-inline",
    "pointer",
    "prefers-color-scheme",
    "prefers-contrast",
    "prefers-reduced-motion",
    "prefers-reduced-transparency",
    "resolution",
    "scan",
    "scripting",
    "update",
    "width",
    // TODO: find a better solution?
    "min-width",
    "max-width",
    "min-height",
    "max-height"
  ].sort().reverse();
  var PSEUDO_CLASSES = [
    "active",
    "any-link",
    "blank",
    "checked",
    "current",
    "default",
    "defined",
    "dir",
    // dir()
    "disabled",
    "drop",
    "empty",
    "enabled",
    "first",
    "first-child",
    "first-of-type",
    "fullscreen",
    "future",
    "focus",
    "focus-visible",
    "focus-within",
    "has",
    // has()
    "host",
    // host or host()
    "host-context",
    // host-context()
    "hover",
    "indeterminate",
    "in-range",
    "invalid",
    "is",
    // is()
    "lang",
    // lang()
    "last-child",
    "last-of-type",
    "left",
    "link",
    "local-link",
    "not",
    // not()
    "nth-child",
    // nth-child()
    "nth-col",
    // nth-col()
    "nth-last-child",
    // nth-last-child()
    "nth-last-col",
    // nth-last-col()
    "nth-last-of-type",
    //nth-last-of-type()
    "nth-of-type",
    //nth-of-type()
    "only-child",
    "only-of-type",
    "optional",
    "out-of-range",
    "past",
    "placeholder-shown",
    "read-only",
    "read-write",
    "required",
    "right",
    "root",
    "scope",
    "target",
    "target-within",
    "user-invalid",
    "valid",
    "visited",
    "where"
    // where()
  ].sort().reverse();
  var PSEUDO_ELEMENTS = [
    "after",
    "backdrop",
    "before",
    "cue",
    "cue-region",
    "first-letter",
    "first-line",
    "grammar-error",
    "marker",
    "part",
    "placeholder",
    "selection",
    "slotted",
    "spelling-error"
  ].sort().reverse();
  var ATTRIBUTES = [
    "accent-color",
    "align-content",
    "align-items",
    "align-self",
    "alignment-baseline",
    "all",
    "anchor-name",
    "animation",
    "animation-composition",
    "animation-delay",
    "animation-direction",
    "animation-duration",
    "animation-fill-mode",
    "animation-iteration-count",
    "animation-name",
    "animation-play-state",
    "animation-range",
    "animation-range-end",
    "animation-range-start",
    "animation-timeline",
    "animation-timing-function",
    "appearance",
    "aspect-ratio",
    "backdrop-filter",
    "backface-visibility",
    "background",
    "background-attachment",
    "background-blend-mode",
    "background-clip",
    "background-color",
    "background-image",
    "background-origin",
    "background-position",
    "background-position-x",
    "background-position-y",
    "background-repeat",
    "background-size",
    "baseline-shift",
    "block-size",
    "border",
    "border-block",
    "border-block-color",
    "border-block-end",
    "border-block-end-color",
    "border-block-end-style",
    "border-block-end-width",
    "border-block-start",
    "border-block-start-color",
    "border-block-start-style",
    "border-block-start-width",
    "border-block-style",
    "border-block-width",
    "border-bottom",
    "border-bottom-color",
    "border-bottom-left-radius",
    "border-bottom-right-radius",
    "border-bottom-style",
    "border-bottom-width",
    "border-collapse",
    "border-color",
    "border-end-end-radius",
    "border-end-start-radius",
    "border-image",
    "border-image-outset",
    "border-image-repeat",
    "border-image-slice",
    "border-image-source",
    "border-image-width",
    "border-inline",
    "border-inline-color",
    "border-inline-end",
    "border-inline-end-color",
    "border-inline-end-style",
    "border-inline-end-width",
    "border-inline-start",
    "border-inline-start-color",
    "border-inline-start-style",
    "border-inline-start-width",
    "border-inline-style",
    "border-inline-width",
    "border-left",
    "border-left-color",
    "border-left-style",
    "border-left-width",
    "border-radius",
    "border-right",
    "border-right-color",
    "border-right-style",
    "border-right-width",
    "border-spacing",
    "border-start-end-radius",
    "border-start-start-radius",
    "border-style",
    "border-top",
    "border-top-color",
    "border-top-left-radius",
    "border-top-right-radius",
    "border-top-style",
    "border-top-width",
    "border-width",
    "bottom",
    "box-align",
    "box-decoration-break",
    "box-direction",
    "box-flex",
    "box-flex-group",
    "box-lines",
    "box-ordinal-group",
    "box-orient",
    "box-pack",
    "box-shadow",
    "box-sizing",
    "break-after",
    "break-before",
    "break-inside",
    "caption-side",
    "caret-color",
    "clear",
    "clip",
    "clip-path",
    "clip-rule",
    "color",
    "color-interpolation",
    "color-interpolation-filters",
    "color-profile",
    "color-rendering",
    "color-scheme",
    "column-count",
    "column-fill",
    "column-gap",
    "column-rule",
    "column-rule-color",
    "column-rule-style",
    "column-rule-width",
    "column-span",
    "column-width",
    "columns",
    "contain",
    "contain-intrinsic-block-size",
    "contain-intrinsic-height",
    "contain-intrinsic-inline-size",
    "contain-intrinsic-size",
    "contain-intrinsic-width",
    "container",
    "container-name",
    "container-type",
    "content",
    "content-visibility",
    "counter-increment",
    "counter-reset",
    "counter-set",
    "cue",
    "cue-after",
    "cue-before",
    "cursor",
    "cx",
    "cy",
    "direction",
    "display",
    "dominant-baseline",
    "empty-cells",
    "enable-background",
    "field-sizing",
    "fill",
    "fill-opacity",
    "fill-rule",
    "filter",
    "flex",
    "flex-basis",
    "flex-direction",
    "flex-flow",
    "flex-grow",
    "flex-shrink",
    "flex-wrap",
    "float",
    "flood-color",
    "flood-opacity",
    "flow",
    "font",
    "font-display",
    "font-family",
    "font-feature-settings",
    "font-kerning",
    "font-language-override",
    "font-optical-sizing",
    "font-palette",
    "font-size",
    "font-size-adjust",
    "font-smooth",
    "font-smoothing",
    "font-stretch",
    "font-style",
    "font-synthesis",
    "font-synthesis-position",
    "font-synthesis-small-caps",
    "font-synthesis-style",
    "font-synthesis-weight",
    "font-variant",
    "font-variant-alternates",
    "font-variant-caps",
    "font-variant-east-asian",
    "font-variant-emoji",
    "font-variant-ligatures",
    "font-variant-numeric",
    "font-variant-position",
    "font-variation-settings",
    "font-weight",
    "forced-color-adjust",
    "gap",
    "glyph-orientation-horizontal",
    "glyph-orientation-vertical",
    "grid",
    "grid-area",
    "grid-auto-columns",
    "grid-auto-flow",
    "grid-auto-rows",
    "grid-column",
    "grid-column-end",
    "grid-column-start",
    "grid-gap",
    "grid-row",
    "grid-row-end",
    "grid-row-start",
    "grid-template",
    "grid-template-areas",
    "grid-template-columns",
    "grid-template-rows",
    "hanging-punctuation",
    "height",
    "hyphenate-character",
    "hyphenate-limit-chars",
    "hyphens",
    "icon",
    "image-orientation",
    "image-rendering",
    "image-resolution",
    "ime-mode",
    "initial-letter",
    "initial-letter-align",
    "inline-size",
    "inset",
    "inset-area",
    "inset-block",
    "inset-block-end",
    "inset-block-start",
    "inset-inline",
    "inset-inline-end",
    "inset-inline-start",
    "isolation",
    "justify-content",
    "justify-items",
    "justify-self",
    "kerning",
    "left",
    "letter-spacing",
    "lighting-color",
    "line-break",
    "line-height",
    "line-height-step",
    "list-style",
    "list-style-image",
    "list-style-position",
    "list-style-type",
    "margin",
    "margin-block",
    "margin-block-end",
    "margin-block-start",
    "margin-bottom",
    "margin-inline",
    "margin-inline-end",
    "margin-inline-start",
    "margin-left",
    "margin-right",
    "margin-top",
    "margin-trim",
    "marker",
    "marker-end",
    "marker-mid",
    "marker-start",
    "marks",
    "mask",
    "mask-border",
    "mask-border-mode",
    "mask-border-outset",
    "mask-border-repeat",
    "mask-border-slice",
    "mask-border-source",
    "mask-border-width",
    "mask-clip",
    "mask-composite",
    "mask-image",
    "mask-mode",
    "mask-origin",
    "mask-position",
    "mask-repeat",
    "mask-size",
    "mask-type",
    "masonry-auto-flow",
    "math-depth",
    "math-shift",
    "math-style",
    "max-block-size",
    "max-height",
    "max-inline-size",
    "max-width",
    "min-block-size",
    "min-height",
    "min-inline-size",
    "min-width",
    "mix-blend-mode",
    "nav-down",
    "nav-index",
    "nav-left",
    "nav-right",
    "nav-up",
    "none",
    "normal",
    "object-fit",
    "object-position",
    "offset",
    "offset-anchor",
    "offset-distance",
    "offset-path",
    "offset-position",
    "offset-rotate",
    "opacity",
    "order",
    "orphans",
    "outline",
    "outline-color",
    "outline-offset",
    "outline-style",
    "outline-width",
    "overflow",
    "overflow-anchor",
    "overflow-block",
    "overflow-clip-margin",
    "overflow-inline",
    "overflow-wrap",
    "overflow-x",
    "overflow-y",
    "overlay",
    "overscroll-behavior",
    "overscroll-behavior-block",
    "overscroll-behavior-inline",
    "overscroll-behavior-x",
    "overscroll-behavior-y",
    "padding",
    "padding-block",
    "padding-block-end",
    "padding-block-start",
    "padding-bottom",
    "padding-inline",
    "padding-inline-end",
    "padding-inline-start",
    "padding-left",
    "padding-right",
    "padding-top",
    "page",
    "page-break-after",
    "page-break-before",
    "page-break-inside",
    "paint-order",
    "pause",
    "pause-after",
    "pause-before",
    "perspective",
    "perspective-origin",
    "place-content",
    "place-items",
    "place-self",
    "pointer-events",
    "position",
    "position-anchor",
    "position-visibility",
    "print-color-adjust",
    "quotes",
    "r",
    "resize",
    "rest",
    "rest-after",
    "rest-before",
    "right",
    "rotate",
    "row-gap",
    "ruby-align",
    "ruby-position",
    "scale",
    "scroll-behavior",
    "scroll-margin",
    "scroll-margin-block",
    "scroll-margin-block-end",
    "scroll-margin-block-start",
    "scroll-margin-bottom",
    "scroll-margin-inline",
    "scroll-margin-inline-end",
    "scroll-margin-inline-start",
    "scroll-margin-left",
    "scroll-margin-right",
    "scroll-margin-top",
    "scroll-padding",
    "scroll-padding-block",
    "scroll-padding-block-end",
    "scroll-padding-block-start",
    "scroll-padding-bottom",
    "scroll-padding-inline",
    "scroll-padding-inline-end",
    "scroll-padding-inline-start",
    "scroll-padding-left",
    "scroll-padding-right",
    "scroll-padding-top",
    "scroll-snap-align",
    "scroll-snap-stop",
    "scroll-snap-type",
    "scroll-timeline",
    "scroll-timeline-axis",
    "scroll-timeline-name",
    "scrollbar-color",
    "scrollbar-gutter",
    "scrollbar-width",
    "shape-image-threshold",
    "shape-margin",
    "shape-outside",
    "shape-rendering",
    "speak",
    "speak-as",
    "src",
    // @font-face
    "stop-color",
    "stop-opacity",
    "stroke",
    "stroke-dasharray",
    "stroke-dashoffset",
    "stroke-linecap",
    "stroke-linejoin",
    "stroke-miterlimit",
    "stroke-opacity",
    "stroke-width",
    "tab-size",
    "table-layout",
    "text-align",
    "text-align-all",
    "text-align-last",
    "text-anchor",
    "text-combine-upright",
    "text-decoration",
    "text-decoration-color",
    "text-decoration-line",
    "text-decoration-skip",
    "text-decoration-skip-ink",
    "text-decoration-style",
    "text-decoration-thickness",
    "text-emphasis",
    "text-emphasis-color",
    "text-emphasis-position",
    "text-emphasis-style",
    "text-indent",
    "text-justify",
    "text-orientation",
    "text-overflow",
    "text-rendering",
    "text-shadow",
    "text-size-adjust",
    "text-transform",
    "text-underline-offset",
    "text-underline-position",
    "text-wrap",
    "text-wrap-mode",
    "text-wrap-style",
    "timeline-scope",
    "top",
    "touch-action",
    "transform",
    "transform-box",
    "transform-origin",
    "transform-style",
    "transition",
    "transition-behavior",
    "transition-delay",
    "transition-duration",
    "transition-property",
    "transition-timing-function",
    "translate",
    "unicode-bidi",
    "user-modify",
    "user-select",
    "vector-effect",
    "vertical-align",
    "view-timeline",
    "view-timeline-axis",
    "view-timeline-inset",
    "view-timeline-name",
    "view-transition-name",
    "visibility",
    "voice-balance",
    "voice-duration",
    "voice-family",
    "voice-pitch",
    "voice-range",
    "voice-rate",
    "voice-stress",
    "voice-volume",
    "white-space",
    "white-space-collapse",
    "widows",
    "width",
    "will-change",
    "word-break",
    "word-spacing",
    "word-wrap",
    "writing-mode",
    "x",
    "y",
    "z-index",
    "zoom"
  ].sort().reverse();
  function css(hljs) {
    const regex = hljs.regex;
    const modes = MODES(hljs);
    const VENDOR_PREFIX = { begin: /-(webkit|moz|ms|o)-(?=[a-z])/ };
    const AT_MODIFIERS = "and or not only";
    const AT_PROPERTY_RE = /@-?\w[\w]*(-\w+)*/;
    const IDENT_RE3 = "[a-zA-Z-][a-zA-Z0-9_-]*";
    const STRINGS = [
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE
    ];
    return {
      name: "CSS",
      case_insensitive: true,
      illegal: /[=|'\$]/,
      keywords: { keyframePosition: "from to" },
      classNameAliases: {
        // for visual continuity with `tag {}` and because we
        // don't have a great class for this?
        keyframePosition: "selector-tag"
      },
      contains: [
        modes.BLOCK_COMMENT,
        VENDOR_PREFIX,
        // to recognize keyframe 40% etc which are outside the scope of our
        // attribute value mode
        modes.CSS_NUMBER_MODE,
        {
          className: "selector-id",
          begin: /#[A-Za-z0-9_-]+/,
          relevance: 0
        },
        {
          className: "selector-class",
          begin: "\\." + IDENT_RE3,
          relevance: 0
        },
        modes.ATTRIBUTE_SELECTOR_MODE,
        {
          className: "selector-pseudo",
          variants: [
            { begin: ":(" + PSEUDO_CLASSES.join("|") + ")" },
            { begin: ":(:)?(" + PSEUDO_ELEMENTS.join("|") + ")" }
          ]
        },
        // we may actually need this (12/2020)
        // { // pseudo-selector params
        //   begin: /\(/,
        //   end: /\)/,
        //   contains: [ hljs.CSS_NUMBER_MODE ]
        // },
        modes.CSS_VARIABLE,
        {
          className: "attribute",
          begin: "\\b(" + ATTRIBUTES.join("|") + ")\\b"
        },
        // attribute values
        {
          begin: /:/,
          end: /[;}{]/,
          contains: [
            modes.BLOCK_COMMENT,
            modes.HEXCOLOR,
            modes.IMPORTANT,
            modes.CSS_NUMBER_MODE,
            ...STRINGS,
            // needed to highlight these as strings and to avoid issues with
            // illegal characters that might be inside urls that would tigger the
            // languages illegal stack
            {
              begin: /(url|data-uri)\(/,
              end: /\)/,
              relevance: 0,
              // from keywords
              keywords: { built_in: "url data-uri" },
              contains: [
                ...STRINGS,
                {
                  className: "string",
                  // any character other than `)` as in `url()` will be the start
                  // of a string, which ends with `)` (from the parent mode)
                  begin: /[^)]/,
                  endsWithParent: true,
                  excludeEnd: true
                }
              ]
            },
            modes.FUNCTION_DISPATCH
          ]
        },
        {
          begin: regex.lookahead(/@/),
          end: "[{;]",
          relevance: 0,
          illegal: /:/,
          // break on Less variables @var: ...
          contains: [
            {
              className: "keyword",
              begin: AT_PROPERTY_RE
            },
            {
              begin: /\s/,
              endsWithParent: true,
              excludeEnd: true,
              relevance: 0,
              keywords: {
                $pattern: /[a-z-]+/,
                keyword: AT_MODIFIERS,
                attribute: MEDIA_FEATURES.join(" ")
              },
              contains: [
                {
                  begin: /[a-z-]+(?=:)/,
                  className: "attribute"
                },
                ...STRINGS,
                modes.CSS_NUMBER_MODE
              ]
            }
          ]
        },
        {
          className: "selector-tag",
          begin: "\\b(" + TAGS.join("|") + ")\\b"
        }
      ]
    };
  }

  // node_modules/highlight.js/es/languages/diff.js
  function diff(hljs) {
    const regex = hljs.regex;
    return {
      name: "Diff",
      aliases: ["patch"],
      contains: [
        {
          className: "meta",
          relevance: 10,
          match: regex.either(
            /^@@ +-\d+,\d+ +\+\d+,\d+ +@@/,
            /^\*\*\* +\d+,\d+ +\*\*\*\*$/,
            /^--- +\d+,\d+ +----$/
          )
        },
        {
          className: "comment",
          variants: [
            {
              begin: regex.either(
                /Index: /,
                /^index/,
                /={3,}/,
                /^-{3}/,
                /^\*{3} /,
                /^\+{3}/,
                /^diff --git/
              ),
              end: /$/
            },
            { match: /^\*{15}$/ }
          ]
        },
        {
          className: "addition",
          begin: /^\+/,
          end: /$/
        },
        {
          className: "deletion",
          begin: /^-/,
          end: /$/
        },
        {
          className: "addition",
          begin: /^!/,
          end: /$/
        }
      ]
    };
  }

  // node_modules/highlight.js/es/languages/dockerfile.js
  function dockerfile(hljs) {
    const KEYWORDS3 = [
      "from",
      "maintainer",
      "expose",
      "env",
      "arg",
      "user",
      "onbuild",
      "stopsignal"
    ];
    return {
      name: "Dockerfile",
      aliases: ["docker"],
      case_insensitive: true,
      keywords: KEYWORDS3,
      contains: [
        hljs.HASH_COMMENT_MODE,
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        hljs.NUMBER_MODE,
        {
          beginKeywords: "run cmd entrypoint volume add copy workdir label healthcheck shell",
          starts: {
            end: /[^\\]$/,
            subLanguage: "bash"
          }
        }
      ],
      illegal: "</"
    };
  }

  // node_modules/highlight.js/es/languages/go.js
  function go(hljs) {
    const LITERALS3 = [
      "true",
      "false",
      "iota",
      "nil"
    ];
    const BUILT_INS3 = [
      "append",
      "cap",
      "close",
      "complex",
      "copy",
      "imag",
      "len",
      "make",
      "new",
      "panic",
      "print",
      "println",
      "real",
      "recover",
      "delete"
    ];
    const TYPES3 = [
      "bool",
      "byte",
      "complex64",
      "complex128",
      "error",
      "float32",
      "float64",
      "int8",
      "int16",
      "int32",
      "int64",
      "string",
      "uint8",
      "uint16",
      "uint32",
      "uint64",
      "int",
      "uint",
      "uintptr",
      "rune"
    ];
    const KWS = [
      "break",
      "case",
      "chan",
      "const",
      "continue",
      "default",
      "defer",
      "else",
      "fallthrough",
      "for",
      "func",
      "go",
      "goto",
      "if",
      "import",
      "interface",
      "map",
      "package",
      "range",
      "return",
      "select",
      "struct",
      "switch",
      "type",
      "var"
    ];
    const KEYWORDS3 = {
      keyword: KWS,
      type: TYPES3,
      literal: LITERALS3,
      built_in: BUILT_INS3
    };
    return {
      name: "Go",
      aliases: ["golang"],
      keywords: KEYWORDS3,
      illegal: "</",
      contains: [
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        {
          className: "string",
          variants: [
            hljs.QUOTE_STRING_MODE,
            hljs.APOS_STRING_MODE,
            {
              begin: "`",
              end: "`"
            }
          ]
        },
        {
          className: "number",
          variants: [
            {
              match: /-?\b0[xX]\.[a-fA-F0-9](_?[a-fA-F0-9])*[pP][+-]?\d(_?\d)*i?/,
              // hex without a present digit before . (making a digit afterwards required)
              relevance: 0
            },
            {
              match: /-?\b0[xX](_?[a-fA-F0-9])+((\.([a-fA-F0-9](_?[a-fA-F0-9])*)?)?[pP][+-]?\d(_?\d)*)?i?/,
              // hex with a present digit before . (making a digit afterwards optional)
              relevance: 0
            },
            {
              match: /-?\b0[oO](_?[0-7])*i?/,
              // leading 0o octal
              relevance: 0
            },
            {
              match: /-?\.\d(_?\d)*([eE][+-]?\d(_?\d)*)?i?/,
              // decimal without a present digit before . (making a digit afterwards required)
              relevance: 0
            },
            {
              match: /-?\b\d(_?\d)*(\.(\d(_?\d)*)?)?([eE][+-]?\d(_?\d)*)?i?/,
              // decimal with a present digit before . (making a digit afterwards optional)
              relevance: 0
            }
          ]
        },
        {
          begin: /:=/
          // relevance booster
        },
        {
          className: "function",
          beginKeywords: "func",
          end: "\\s*(\\{|$)",
          excludeEnd: true,
          contains: [
            hljs.TITLE_MODE,
            {
              className: "params",
              begin: /\(/,
              end: /\)/,
              endsParent: true,
              keywords: KEYWORDS3,
              illegal: /["']/
            }
          ]
        }
      ]
    };
  }

  // node_modules/highlight.js/es/languages/http.js
  function http(hljs) {
    const regex = hljs.regex;
    const VERSION = "HTTP/([32]|1\\.[01])";
    const HEADER_NAME = /[A-Za-z][A-Za-z0-9-]*/;
    const HEADER = {
      className: "attribute",
      begin: regex.concat("^", HEADER_NAME, "(?=\\:\\s)"),
      starts: { contains: [
        {
          className: "punctuation",
          begin: /: /,
          relevance: 0,
          starts: {
            end: "$",
            relevance: 0
          }
        }
      ] }
    };
    const HEADERS_AND_BODY = [
      HEADER,
      {
        begin: "\\n\\n",
        starts: {
          subLanguage: [],
          endsWithParent: true
        }
      }
    ];
    return {
      name: "HTTP",
      aliases: ["https"],
      illegal: /\S/,
      contains: [
        // response
        {
          begin: "^(?=" + VERSION + " \\d{3})",
          end: /$/,
          contains: [
            {
              className: "meta",
              begin: VERSION
            },
            {
              className: "number",
              begin: "\\b\\d{3}\\b"
            }
          ],
          starts: {
            end: /\b\B/,
            illegal: /\S/,
            contains: HEADERS_AND_BODY
          }
        },
        // request
        {
          begin: "(?=^[A-Z]+ (.*?) " + VERSION + "$)",
          end: /$/,
          contains: [
            {
              className: "string",
              begin: " ",
              end: " ",
              excludeBegin: true,
              excludeEnd: true
            },
            {
              className: "meta",
              begin: VERSION
            },
            {
              className: "keyword",
              begin: "[A-Z]+"
            }
          ],
          starts: {
            end: /\b\B/,
            illegal: /\S/,
            contains: HEADERS_AND_BODY
          }
        },
        // to allow headers to work even without a preamble
        hljs.inherit(HEADER, { relevance: 0 })
      ]
    };
  }

  // node_modules/highlight.js/es/languages/ini.js
  function ini(hljs) {
    const regex = hljs.regex;
    const NUMBERS = {
      className: "number",
      relevance: 0,
      variants: [
        { begin: /([+-]+)?[\d]+_[\d_]+/ },
        { begin: hljs.NUMBER_RE }
      ]
    };
    const COMMENTS = hljs.COMMENT();
    COMMENTS.variants = [
      {
        begin: /;/,
        end: /$/
      },
      {
        begin: /#/,
        end: /$/
      }
    ];
    const VARIABLES = {
      className: "variable",
      variants: [
        { begin: /\$[\w\d"][\w\d_]*/ },
        { begin: /\$\{(.*?)\}/ }
      ]
    };
    const LITERALS3 = {
      className: "literal",
      begin: /\bon|off|true|false|yes|no\b/
    };
    const STRINGS = {
      className: "string",
      contains: [hljs.BACKSLASH_ESCAPE],
      variants: [
        {
          begin: "'''",
          end: "'''",
          relevance: 10
        },
        {
          begin: '"""',
          end: '"""',
          relevance: 10
        },
        {
          begin: '"',
          end: '"'
        },
        {
          begin: "'",
          end: "'"
        }
      ]
    };
    const ARRAY = {
      begin: /\[/,
      end: /\]/,
      contains: [
        COMMENTS,
        LITERALS3,
        VARIABLES,
        STRINGS,
        NUMBERS,
        "self"
      ],
      relevance: 0
    };
    const BARE_KEY = /[A-Za-z0-9_-]+/;
    const QUOTED_KEY_DOUBLE_QUOTE = /"(\\"|[^"])*"/;
    const QUOTED_KEY_SINGLE_QUOTE = /'[^']*'/;
    const ANY_KEY = regex.either(
      BARE_KEY,
      QUOTED_KEY_DOUBLE_QUOTE,
      QUOTED_KEY_SINGLE_QUOTE
    );
    const DOTTED_KEY = regex.concat(
      ANY_KEY,
      "(\\s*\\.\\s*",
      ANY_KEY,
      ")*",
      regex.lookahead(/\s*=\s*[^#\s]/)
    );
    return {
      name: "TOML, also INI",
      aliases: ["toml"],
      case_insensitive: true,
      illegal: /\S/,
      contains: [
        COMMENTS,
        {
          className: "section",
          begin: /\[+/,
          end: /\]+/
        },
        {
          begin: DOTTED_KEY,
          className: "attr",
          starts: {
            end: /$/,
            contains: [
              COMMENTS,
              ARRAY,
              LITERALS3,
              VARIABLES,
              STRINGS,
              NUMBERS
            ]
          }
        }
      ]
    };
  }

  // node_modules/highlight.js/es/languages/java.js
  var decimalDigits = "[0-9](_*[0-9])*";
  var frac = `\\.(${decimalDigits})`;
  var hexDigits = "[0-9a-fA-F](_*[0-9a-fA-F])*";
  var NUMERIC = {
    className: "number",
    variants: [
      // DecimalFloatingPointLiteral
      // including ExponentPart
      { begin: `(\\b(${decimalDigits})((${frac})|\\.)?|(${frac}))[eE][+-]?(${decimalDigits})[fFdD]?\\b` },
      // excluding ExponentPart
      { begin: `\\b(${decimalDigits})((${frac})[fFdD]?\\b|\\.([fFdD]\\b)?)` },
      { begin: `(${frac})[fFdD]?\\b` },
      { begin: `\\b(${decimalDigits})[fFdD]\\b` },
      // HexadecimalFloatingPointLiteral
      { begin: `\\b0[xX]((${hexDigits})\\.?|(${hexDigits})?\\.(${hexDigits}))[pP][+-]?(${decimalDigits})[fFdD]?\\b` },
      // DecimalIntegerLiteral
      { begin: "\\b(0|[1-9](_*[0-9])*)[lL]?\\b" },
      // HexIntegerLiteral
      { begin: `\\b0[xX](${hexDigits})[lL]?\\b` },
      // OctalIntegerLiteral
      { begin: "\\b0(_*[0-7])*[lL]?\\b" },
      // BinaryIntegerLiteral
      { begin: "\\b0[bB][01](_*[01])*[lL]?\\b" }
    ],
    relevance: 0
  };
  function recurRegex(re, substitution, depth) {
    if (depth === -1) return "";
    return re.replace(substitution, (_) => {
      return recurRegex(re, substitution, depth - 1);
    });
  }
  function java(hljs) {
    const regex = hljs.regex;
    const JAVA_IDENT_RE = "[\xC0-\u02B8a-zA-Z_$][\xC0-\u02B8a-zA-Z_$0-9]*";
    const GENERIC_IDENT_RE = JAVA_IDENT_RE + recurRegex("(?:<" + JAVA_IDENT_RE + "~~~(?:\\s*,\\s*" + JAVA_IDENT_RE + "~~~)*>)?", /~~~/g, 2);
    const MAIN_KEYWORDS = [
      "synchronized",
      "abstract",
      "private",
      "var",
      "static",
      "if",
      "const ",
      "for",
      "while",
      "strictfp",
      "finally",
      "protected",
      "import",
      "native",
      "final",
      "void",
      "enum",
      "else",
      "break",
      "transient",
      "catch",
      "instanceof",
      "volatile",
      "case",
      "assert",
      "package",
      "default",
      "public",
      "try",
      "switch",
      "continue",
      "throws",
      "protected",
      "public",
      "private",
      "module",
      "requires",
      "exports",
      "do",
      "sealed",
      "yield",
      "permits",
      "goto",
      "when"
    ];
    const BUILT_INS3 = [
      "super",
      "this"
    ];
    const LITERALS3 = [
      "false",
      "true",
      "null"
    ];
    const TYPES3 = [
      "char",
      "boolean",
      "long",
      "float",
      "int",
      "byte",
      "short",
      "double"
    ];
    const KEYWORDS3 = {
      keyword: MAIN_KEYWORDS,
      literal: LITERALS3,
      type: TYPES3,
      built_in: BUILT_INS3
    };
    const ANNOTATION = {
      className: "meta",
      begin: "@" + JAVA_IDENT_RE,
      contains: [
        {
          begin: /\(/,
          end: /\)/,
          contains: ["self"]
          // allow nested () inside our annotation
        }
      ]
    };
    const PARAMS = {
      className: "params",
      begin: /\(/,
      end: /\)/,
      keywords: KEYWORDS3,
      relevance: 0,
      contains: [hljs.C_BLOCK_COMMENT_MODE],
      endsParent: true
    };
    return {
      name: "Java",
      aliases: ["jsp"],
      keywords: KEYWORDS3,
      illegal: /<\/|#/,
      contains: [
        hljs.COMMENT(
          "/\\*\\*",
          "\\*/",
          {
            relevance: 0,
            contains: [
              {
                // eat up @'s in emails to prevent them to be recognized as doctags
                begin: /\w+@/,
                relevance: 0
              },
              {
                className: "doctag",
                begin: "@[A-Za-z]+"
              }
            ]
          }
        ),
        // relevance boost
        {
          begin: /import java\.[a-z]+\./,
          keywords: "import",
          relevance: 2
        },
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        {
          begin: /"""/,
          end: /"""/,
          className: "string",
          contains: [hljs.BACKSLASH_ESCAPE]
        },
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        {
          match: [
            /\b(?:class|interface|enum|extends|implements|new)/,
            /\s+/,
            JAVA_IDENT_RE
          ],
          className: {
            1: "keyword",
            3: "title.class"
          }
        },
        {
          // Exceptions for hyphenated keywords
          match: /non-sealed/,
          scope: "keyword"
        },
        {
          begin: [
            regex.concat(/(?!else)/, JAVA_IDENT_RE),
            /\s+/,
            JAVA_IDENT_RE,
            /\s+/,
            /=(?!=)/
          ],
          className: {
            1: "type",
            3: "variable",
            5: "operator"
          }
        },
        {
          begin: [
            /record/,
            /\s+/,
            JAVA_IDENT_RE
          ],
          className: {
            1: "keyword",
            3: "title.class"
          },
          contains: [
            PARAMS,
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE
          ]
        },
        {
          // Expression keywords prevent 'keyword Name(...)' from being
          // recognized as a function definition
          beginKeywords: "new throw return else",
          relevance: 0
        },
        {
          begin: [
            "(?:" + GENERIC_IDENT_RE + "\\s+)",
            hljs.UNDERSCORE_IDENT_RE,
            /\s*(?=\()/
          ],
          className: { 2: "title.function" },
          keywords: KEYWORDS3,
          contains: [
            {
              className: "params",
              begin: /\(/,
              end: /\)/,
              keywords: KEYWORDS3,
              relevance: 0,
              contains: [
                ANNOTATION,
                hljs.APOS_STRING_MODE,
                hljs.QUOTE_STRING_MODE,
                NUMERIC,
                hljs.C_BLOCK_COMMENT_MODE
              ]
            },
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE
          ]
        },
        NUMERIC,
        ANNOTATION
      ]
    };
  }

  // node_modules/highlight.js/es/languages/javascript.js
  var IDENT_RE = "[A-Za-z$_][0-9A-Za-z$_]*";
  var KEYWORDS = [
    "as",
    // for exports
    "in",
    "of",
    "if",
    "for",
    "while",
    "finally",
    "var",
    "new",
    "function",
    "do",
    "return",
    "void",
    "else",
    "break",
    "catch",
    "instanceof",
    "with",
    "throw",
    "case",
    "default",
    "try",
    "switch",
    "continue",
    "typeof",
    "delete",
    "let",
    "yield",
    "const",
    "class",
    // JS handles these with a special rule
    // "get",
    // "set",
    "debugger",
    "async",
    "await",
    "static",
    "import",
    "from",
    "export",
    "extends",
    // It's reached stage 3, which is "recommended for implementation":
    "using"
  ];
  var LITERALS = [
    "true",
    "false",
    "null",
    "undefined",
    "NaN",
    "Infinity"
  ];
  var TYPES = [
    // Fundamental objects
    "Object",
    "Function",
    "Boolean",
    "Symbol",
    // numbers and dates
    "Math",
    "Date",
    "Number",
    "BigInt",
    // text
    "String",
    "RegExp",
    // Indexed collections
    "Array",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Int32Array",
    "Uint16Array",
    "Uint32Array",
    "BigInt64Array",
    "BigUint64Array",
    // Keyed collections
    "Set",
    "Map",
    "WeakSet",
    "WeakMap",
    // Structured data
    "ArrayBuffer",
    "SharedArrayBuffer",
    "Atomics",
    "DataView",
    "JSON",
    // Control abstraction objects
    "Promise",
    "Generator",
    "GeneratorFunction",
    "AsyncFunction",
    // Reflection
    "Reflect",
    "Proxy",
    // Internationalization
    "Intl",
    // WebAssembly
    "WebAssembly"
  ];
  var ERROR_TYPES = [
    "Error",
    "EvalError",
    "InternalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError"
  ];
  var BUILT_IN_GLOBALS = [
    "setInterval",
    "setTimeout",
    "clearInterval",
    "clearTimeout",
    "require",
    "exports",
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "escape",
    "unescape"
  ];
  var BUILT_IN_VARIABLES = [
    "arguments",
    "this",
    "super",
    "console",
    "window",
    "document",
    "localStorage",
    "sessionStorage",
    "module",
    "global"
    // Node.js
  ];
  var BUILT_INS = [].concat(
    BUILT_IN_GLOBALS,
    TYPES,
    ERROR_TYPES
  );
  function javascript(hljs) {
    const regex = hljs.regex;
    const hasClosingTag = (match, { after }) => {
      const tag = "</" + match[0].slice(1);
      const pos = match.input.indexOf(tag, after);
      return pos !== -1;
    };
    const IDENT_RE$1 = IDENT_RE;
    const FRAGMENT = {
      begin: "<>",
      end: "</>"
    };
    const XML_SELF_CLOSING = /<[A-Za-z0-9\\._:-]+\s*\/>/;
    const XML_TAG = {
      begin: /<[A-Za-z0-9\\._:-]+/,
      end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
      /**
       * @param {RegExpMatchArray} match
       * @param {CallbackResponse} response
       */
      isTrulyOpeningTag: (match, response) => {
        const afterMatchIndex = match[0].length + match.index;
        const nextChar = match.input[afterMatchIndex];
        if (
          // HTML should not include another raw `<` inside a tag
          // nested type?
          // `<Array<Array<number>>`, etc.
          nextChar === "<" || // the , gives away that this is not HTML
          // `<T, A extends keyof T, V>`
          nextChar === ","
        ) {
          response.ignoreMatch();
          return;
        }
        if (nextChar === ">") {
          if (!hasClosingTag(match, { after: afterMatchIndex })) {
            response.ignoreMatch();
          }
        }
        let m;
        const afterMatch = match.input.substring(afterMatchIndex);
        if (m = afterMatch.match(/^\s*=/)) {
          response.ignoreMatch();
          return;
        }
        if (m = afterMatch.match(/^\s+extends\s+/)) {
          if (m.index === 0) {
            response.ignoreMatch();
            return;
          }
        }
      }
    };
    const KEYWORDS$1 = {
      $pattern: IDENT_RE,
      keyword: KEYWORDS,
      literal: LITERALS,
      built_in: BUILT_INS,
      "variable.language": BUILT_IN_VARIABLES
    };
    const decimalDigits2 = "[0-9](_?[0-9])*";
    const frac2 = `\\.(${decimalDigits2})`;
    const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
    const NUMBER = {
      className: "number",
      variants: [
        // DecimalLiteral
        { begin: `(\\b(${decimalInteger})((${frac2})|\\.)?|(${frac2}))[eE][+-]?(${decimalDigits2})\\b` },
        { begin: `\\b(${decimalInteger})\\b((${frac2})\\b|\\.)?|(${frac2})\\b` },
        // DecimalBigIntegerLiteral
        { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },
        // NonDecimalIntegerLiteral
        { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
        { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
        { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
        // LegacyOctalIntegerLiteral (does not include underscore separators)
        // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
        { begin: "\\b0[0-7]+n?\\b" }
      ],
      relevance: 0
    };
    const SUBST = {
      className: "subst",
      begin: "\\$\\{",
      end: "\\}",
      keywords: KEYWORDS$1,
      contains: []
      // defined later
    };
    const HTML_TEMPLATE = {
      begin: ".?html`",
      end: "",
      starts: {
        end: "`",
        returnEnd: false,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ],
        subLanguage: "xml"
      }
    };
    const CSS_TEMPLATE = {
      begin: ".?css`",
      end: "",
      starts: {
        end: "`",
        returnEnd: false,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ],
        subLanguage: "css"
      }
    };
    const GRAPHQL_TEMPLATE = {
      begin: ".?gql`",
      end: "",
      starts: {
        end: "`",
        returnEnd: false,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ],
        subLanguage: "graphql"
      }
    };
    const TEMPLATE_STRING = {
      className: "string",
      begin: "`",
      end: "`",
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ]
    };
    const JSDOC_COMMENT = hljs.COMMENT(
      /\/\*\*(?!\/)/,
      "\\*/",
      {
        relevance: 0,
        contains: [
          {
            begin: "(?=@[A-Za-z]+)",
            relevance: 0,
            contains: [
              {
                className: "doctag",
                begin: "@[A-Za-z]+"
              },
              {
                className: "type",
                begin: "\\{",
                end: "\\}",
                excludeEnd: true,
                excludeBegin: true,
                relevance: 0
              },
              {
                className: "variable",
                begin: IDENT_RE$1 + "(?=\\s*(-)|$)",
                endsParent: true,
                relevance: 0
              },
              // eat spaces (not newlines) so we can find
              // types or variables
              {
                begin: /(?=[^\n])\s/,
                relevance: 0
              }
            ]
          }
        ]
      }
    );
    const COMMENT = {
      className: "comment",
      variants: [
        JSDOC_COMMENT,
        hljs.C_BLOCK_COMMENT_MODE,
        hljs.C_LINE_COMMENT_MODE
      ]
    };
    const SUBST_INTERNALS = [
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      HTML_TEMPLATE,
      CSS_TEMPLATE,
      GRAPHQL_TEMPLATE,
      TEMPLATE_STRING,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      NUMBER
      // This is intentional:
      // See https://github.com/highlightjs/highlight.js/issues/3288
      // hljs.REGEXP_MODE
    ];
    SUBST.contains = SUBST_INTERNALS.concat({
      // we need to pair up {} inside our subst to prevent
      // it from ending too early by matching another }
      begin: /\{/,
      end: /\}/,
      keywords: KEYWORDS$1,
      contains: [
        "self"
      ].concat(SUBST_INTERNALS)
    });
    const SUBST_AND_COMMENTS = [].concat(COMMENT, SUBST.contains);
    const PARAMS_CONTAINS = SUBST_AND_COMMENTS.concat([
      // eat recursive parens in sub expressions
      {
        begin: /(\s*)\(/,
        end: /\)/,
        keywords: KEYWORDS$1,
        contains: ["self"].concat(SUBST_AND_COMMENTS)
      }
    ]);
    const PARAMS = {
      className: "params",
      // convert this to negative lookbehind in v12
      begin: /(\s*)\(/,
      // to match the parms with
      end: /\)/,
      excludeBegin: true,
      excludeEnd: true,
      keywords: KEYWORDS$1,
      contains: PARAMS_CONTAINS
    };
    const CLASS_OR_EXTENDS = {
      variants: [
        // class Car extends vehicle
        {
          match: [
            /class/,
            /\s+/,
            IDENT_RE$1,
            /\s+/,
            /extends/,
            /\s+/,
            regex.concat(IDENT_RE$1, "(", regex.concat(/\./, IDENT_RE$1), ")*")
          ],
          scope: {
            1: "keyword",
            3: "title.class",
            5: "keyword",
            7: "title.class.inherited"
          }
        },
        // class Car
        {
          match: [
            /class/,
            /\s+/,
            IDENT_RE$1
          ],
          scope: {
            1: "keyword",
            3: "title.class"
          }
        }
      ]
    };
    const CLASS_REFERENCE = {
      relevance: 0,
      match: regex.either(
        // Hard coded exceptions
        /\bJSON/,
        // Float32Array, OutT
        /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
        // CSSFactory, CSSFactoryT
        /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
        // FPs, FPsT
        /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
        // P
        // single letters are not highlighted
        // BLAH
        // this will be flagged as a UPPER_CASE_CONSTANT instead
      ),
      className: "title.class",
      keywords: {
        _: [
          // se we still get relevance credit for JS library classes
          ...TYPES,
          ...ERROR_TYPES
        ]
      }
    };
    const USE_STRICT = {
      label: "use_strict",
      className: "meta",
      relevance: 10,
      begin: /^\s*['"]use (strict|asm)['"]/
    };
    const FUNCTION_DEFINITION = {
      variants: [
        {
          match: [
            /function/,
            /\s+/,
            IDENT_RE$1,
            /(?=\s*\()/
          ]
        },
        // anonymous function
        {
          match: [
            /function/,
            /\s*(?=\()/
          ]
        }
      ],
      className: {
        1: "keyword",
        3: "title.function"
      },
      label: "func.def",
      contains: [PARAMS],
      illegal: /%/
    };
    const UPPER_CASE_CONSTANT = {
      relevance: 0,
      match: /\b[A-Z][A-Z_0-9]+\b/,
      className: "variable.constant"
    };
    function noneOf(list) {
      return regex.concat("(?!", list.join("|"), ")");
    }
    const FUNCTION_CALL = {
      match: regex.concat(
        /\b/,
        noneOf([
          ...BUILT_IN_GLOBALS,
          "super",
          "import"
        ].map((x) => `${x}\\s*\\(`)),
        IDENT_RE$1,
        regex.lookahead(/\s*\(/)
      ),
      className: "title.function",
      relevance: 0
    };
    const PROPERTY_ACCESS = {
      begin: regex.concat(/\./, regex.lookahead(
        regex.concat(IDENT_RE$1, /(?![0-9A-Za-z$_(])/)
      )),
      end: IDENT_RE$1,
      excludeBegin: true,
      keywords: "prototype",
      className: "property",
      relevance: 0
    };
    const GETTER_OR_SETTER = {
      match: [
        /get|set/,
        /\s+/,
        IDENT_RE$1,
        /(?=\()/
      ],
      className: {
        1: "keyword",
        3: "title.function"
      },
      contains: [
        {
          // eat to avoid empty params
          begin: /\(\)/
        },
        PARAMS
      ]
    };
    const FUNC_LEAD_IN_RE = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + hljs.UNDERSCORE_IDENT_RE + ")\\s*=>";
    const FUNCTION_VARIABLE = {
      match: [
        /const|var|let/,
        /\s+/,
        IDENT_RE$1,
        /\s*/,
        /=\s*/,
        /(async\s*)?/,
        // async is optional
        regex.lookahead(FUNC_LEAD_IN_RE)
      ],
      keywords: "async",
      className: {
        1: "keyword",
        3: "title.function"
      },
      contains: [
        PARAMS
      ]
    };
    return {
      name: "JavaScript",
      aliases: ["js", "jsx", "mjs", "cjs"],
      keywords: KEYWORDS$1,
      // this will be extended by TypeScript
      exports: { PARAMS_CONTAINS, CLASS_REFERENCE },
      illegal: /#(?![$_A-z])/,
      contains: [
        hljs.SHEBANG({
          label: "shebang",
          binary: "node",
          relevance: 5
        }),
        USE_STRICT,
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        HTML_TEMPLATE,
        CSS_TEMPLATE,
        GRAPHQL_TEMPLATE,
        TEMPLATE_STRING,
        COMMENT,
        // Skip numbers when they are part of a variable name
        { match: /\$\d+/ },
        NUMBER,
        CLASS_REFERENCE,
        {
          scope: "attr",
          match: IDENT_RE$1 + regex.lookahead(":"),
          relevance: 0
        },
        FUNCTION_VARIABLE,
        {
          // "value" container
          begin: "(" + hljs.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
          keywords: "return throw case",
          relevance: 0,
          contains: [
            COMMENT,
            hljs.REGEXP_MODE,
            {
              className: "function",
              // we have to count the parens to make sure we actually have the
              // correct bounding ( ) before the =>.  There could be any number of
              // sub-expressions inside also surrounded by parens.
              begin: FUNC_LEAD_IN_RE,
              returnBegin: true,
              end: "\\s*=>",
              contains: [
                {
                  className: "params",
                  variants: [
                    {
                      begin: hljs.UNDERSCORE_IDENT_RE,
                      relevance: 0
                    },
                    {
                      className: null,
                      begin: /\(\s*\)/,
                      skip: true
                    },
                    {
                      begin: /(\s*)\(/,
                      end: /\)/,
                      excludeBegin: true,
                      excludeEnd: true,
                      keywords: KEYWORDS$1,
                      contains: PARAMS_CONTAINS
                    }
                  ]
                }
              ]
            },
            {
              // could be a comma delimited list of params to a function call
              begin: /,/,
              relevance: 0
            },
            {
              match: /\s+/,
              relevance: 0
            },
            {
              // JSX
              variants: [
                { begin: FRAGMENT.begin, end: FRAGMENT.end },
                { match: XML_SELF_CLOSING },
                {
                  begin: XML_TAG.begin,
                  // we carefully check the opening tag to see if it truly
                  // is a tag and not a false positive
                  "on:begin": XML_TAG.isTrulyOpeningTag,
                  end: XML_TAG.end
                }
              ],
              subLanguage: "xml",
              contains: [
                {
                  begin: XML_TAG.begin,
                  end: XML_TAG.end,
                  skip: true,
                  contains: ["self"]
                }
              ]
            }
          ]
        },
        FUNCTION_DEFINITION,
        {
          // prevent this from getting swallowed up by function
          // since they appear "function like"
          beginKeywords: "while if switch catch for"
        },
        {
          // we have to count the parens to make sure we actually have the correct
          // bounding ( ).  There could be any number of sub-expressions inside
          // also surrounded by parens.
          begin: "\\b(?!function)" + hljs.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
          // end parens
          returnBegin: true,
          label: "func.def",
          contains: [
            PARAMS,
            hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1, className: "title.function" })
          ]
        },
        // catch ... so it won't trigger the property rule below
        {
          match: /\.\.\./,
          relevance: 0
        },
        PROPERTY_ACCESS,
        // hack: prevents detection of keywords in some circumstances
        // .keyword()
        // $keyword = x
        {
          match: "\\$" + IDENT_RE$1,
          relevance: 0
        },
        {
          match: [/\bconstructor(?=\s*\()/],
          className: { 1: "title.function" },
          contains: [PARAMS]
        },
        FUNCTION_CALL,
        UPPER_CASE_CONSTANT,
        CLASS_OR_EXTENDS,
        GETTER_OR_SETTER,
        {
          match: /\$[(.]/
          // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
        }
      ]
    };
  }

  // node_modules/highlight.js/es/languages/json.js
  function json(hljs) {
    const ATTRIBUTE = {
      className: "attr",
      begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
      relevance: 1.01
    };
    const PUNCTUATION = {
      match: /[{}[\],:]/,
      className: "punctuation",
      relevance: 0
    };
    const LITERALS3 = [
      "true",
      "false",
      "null"
    ];
    const LITERALS_MODE = {
      scope: "literal",
      beginKeywords: LITERALS3.join(" ")
    };
    return {
      name: "JSON",
      aliases: ["jsonc"],
      keywords: {
        literal: LITERALS3
      },
      contains: [
        ATTRIBUTE,
        PUNCTUATION,
        hljs.QUOTE_STRING_MODE,
        LITERALS_MODE,
        hljs.C_NUMBER_MODE,
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE
      ],
      illegal: "\\S"
    };
  }

  // node_modules/highlight.js/es/languages/less.js
  var MODES2 = (hljs) => {
    return {
      IMPORTANT: {
        scope: "meta",
        begin: "!important"
      },
      BLOCK_COMMENT: hljs.C_BLOCK_COMMENT_MODE,
      HEXCOLOR: {
        scope: "number",
        begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
      },
      FUNCTION_DISPATCH: {
        className: "built_in",
        begin: /[\w-]+(?=\()/
      },
      ATTRIBUTE_SELECTOR_MODE: {
        scope: "selector-attr",
        begin: /\[/,
        end: /\]/,
        illegal: "$",
        contains: [
          hljs.APOS_STRING_MODE,
          hljs.QUOTE_STRING_MODE
        ]
      },
      CSS_NUMBER_MODE: {
        scope: "number",
        begin: hljs.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
        relevance: 0
      },
      CSS_VARIABLE: {
        className: "attr",
        begin: /--[A-Za-z_][A-Za-z0-9_-]*/
      }
    };
  };
  var HTML_TAGS2 = [
    "a",
    "abbr",
    "address",
    "article",
    "aside",
    "audio",
    "b",
    "blockquote",
    "body",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "dd",
    "del",
    "details",
    "dfn",
    "div",
    "dl",
    "dt",
    "em",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hgroup",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "legend",
    "li",
    "main",
    "mark",
    "menu",
    "nav",
    "object",
    "ol",
    "optgroup",
    "option",
    "p",
    "picture",
    "q",
    "quote",
    "samp",
    "section",
    "select",
    "source",
    "span",
    "strong",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "tr",
    "ul",
    "var",
    "video"
  ];
  var SVG_TAGS2 = [
    "defs",
    "g",
    "marker",
    "mask",
    "pattern",
    "svg",
    "switch",
    "symbol",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feFlood",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMorphology",
    "feOffset",
    "feSpecularLighting",
    "feTile",
    "feTurbulence",
    "linearGradient",
    "radialGradient",
    "stop",
    "circle",
    "ellipse",
    "image",
    "line",
    "path",
    "polygon",
    "polyline",
    "rect",
    "text",
    "use",
    "textPath",
    "tspan",
    "foreignObject",
    "clipPath"
  ];
  var TAGS2 = [
    ...HTML_TAGS2,
    ...SVG_TAGS2
  ];
  var MEDIA_FEATURES2 = [
    "any-hover",
    "any-pointer",
    "aspect-ratio",
    "color",
    "color-gamut",
    "color-index",
    "device-aspect-ratio",
    "device-height",
    "device-width",
    "display-mode",
    "forced-colors",
    "grid",
    "height",
    "hover",
    "inverted-colors",
    "monochrome",
    "orientation",
    "overflow-block",
    "overflow-inline",
    "pointer",
    "prefers-color-scheme",
    "prefers-contrast",
    "prefers-reduced-motion",
    "prefers-reduced-transparency",
    "resolution",
    "scan",
    "scripting",
    "update",
    "width",
    // TODO: find a better solution?
    "min-width",
    "max-width",
    "min-height",
    "max-height"
  ].sort().reverse();
  var PSEUDO_CLASSES2 = [
    "active",
    "any-link",
    "blank",
    "checked",
    "current",
    "default",
    "defined",
    "dir",
    // dir()
    "disabled",
    "drop",
    "empty",
    "enabled",
    "first",
    "first-child",
    "first-of-type",
    "fullscreen",
    "future",
    "focus",
    "focus-visible",
    "focus-within",
    "has",
    // has()
    "host",
    // host or host()
    "host-context",
    // host-context()
    "hover",
    "indeterminate",
    "in-range",
    "invalid",
    "is",
    // is()
    "lang",
    // lang()
    "last-child",
    "last-of-type",
    "left",
    "link",
    "local-link",
    "not",
    // not()
    "nth-child",
    // nth-child()
    "nth-col",
    // nth-col()
    "nth-last-child",
    // nth-last-child()
    "nth-last-col",
    // nth-last-col()
    "nth-last-of-type",
    //nth-last-of-type()
    "nth-of-type",
    //nth-of-type()
    "only-child",
    "only-of-type",
    "optional",
    "out-of-range",
    "past",
    "placeholder-shown",
    "read-only",
    "read-write",
    "required",
    "right",
    "root",
    "scope",
    "target",
    "target-within",
    "user-invalid",
    "valid",
    "visited",
    "where"
    // where()
  ].sort().reverse();
  var PSEUDO_ELEMENTS2 = [
    "after",
    "backdrop",
    "before",
    "cue",
    "cue-region",
    "first-letter",
    "first-line",
    "grammar-error",
    "marker",
    "part",
    "placeholder",
    "selection",
    "slotted",
    "spelling-error"
  ].sort().reverse();
  var ATTRIBUTES2 = [
    "accent-color",
    "align-content",
    "align-items",
    "align-self",
    "alignment-baseline",
    "all",
    "anchor-name",
    "animation",
    "animation-composition",
    "animation-delay",
    "animation-direction",
    "animation-duration",
    "animation-fill-mode",
    "animation-iteration-count",
    "animation-name",
    "animation-play-state",
    "animation-range",
    "animation-range-end",
    "animation-range-start",
    "animation-timeline",
    "animation-timing-function",
    "appearance",
    "aspect-ratio",
    "backdrop-filter",
    "backface-visibility",
    "background",
    "background-attachment",
    "background-blend-mode",
    "background-clip",
    "background-color",
    "background-image",
    "background-origin",
    "background-position",
    "background-position-x",
    "background-position-y",
    "background-repeat",
    "background-size",
    "baseline-shift",
    "block-size",
    "border",
    "border-block",
    "border-block-color",
    "border-block-end",
    "border-block-end-color",
    "border-block-end-style",
    "border-block-end-width",
    "border-block-start",
    "border-block-start-color",
    "border-block-start-style",
    "border-block-start-width",
    "border-block-style",
    "border-block-width",
    "border-bottom",
    "border-bottom-color",
    "border-bottom-left-radius",
    "border-bottom-right-radius",
    "border-bottom-style",
    "border-bottom-width",
    "border-collapse",
    "border-color",
    "border-end-end-radius",
    "border-end-start-radius",
    "border-image",
    "border-image-outset",
    "border-image-repeat",
    "border-image-slice",
    "border-image-source",
    "border-image-width",
    "border-inline",
    "border-inline-color",
    "border-inline-end",
    "border-inline-end-color",
    "border-inline-end-style",
    "border-inline-end-width",
    "border-inline-start",
    "border-inline-start-color",
    "border-inline-start-style",
    "border-inline-start-width",
    "border-inline-style",
    "border-inline-width",
    "border-left",
    "border-left-color",
    "border-left-style",
    "border-left-width",
    "border-radius",
    "border-right",
    "border-right-color",
    "border-right-style",
    "border-right-width",
    "border-spacing",
    "border-start-end-radius",
    "border-start-start-radius",
    "border-style",
    "border-top",
    "border-top-color",
    "border-top-left-radius",
    "border-top-right-radius",
    "border-top-style",
    "border-top-width",
    "border-width",
    "bottom",
    "box-align",
    "box-decoration-break",
    "box-direction",
    "box-flex",
    "box-flex-group",
    "box-lines",
    "box-ordinal-group",
    "box-orient",
    "box-pack",
    "box-shadow",
    "box-sizing",
    "break-after",
    "break-before",
    "break-inside",
    "caption-side",
    "caret-color",
    "clear",
    "clip",
    "clip-path",
    "clip-rule",
    "color",
    "color-interpolation",
    "color-interpolation-filters",
    "color-profile",
    "color-rendering",
    "color-scheme",
    "column-count",
    "column-fill",
    "column-gap",
    "column-rule",
    "column-rule-color",
    "column-rule-style",
    "column-rule-width",
    "column-span",
    "column-width",
    "columns",
    "contain",
    "contain-intrinsic-block-size",
    "contain-intrinsic-height",
    "contain-intrinsic-inline-size",
    "contain-intrinsic-size",
    "contain-intrinsic-width",
    "container",
    "container-name",
    "container-type",
    "content",
    "content-visibility",
    "counter-increment",
    "counter-reset",
    "counter-set",
    "cue",
    "cue-after",
    "cue-before",
    "cursor",
    "cx",
    "cy",
    "direction",
    "display",
    "dominant-baseline",
    "empty-cells",
    "enable-background",
    "field-sizing",
    "fill",
    "fill-opacity",
    "fill-rule",
    "filter",
    "flex",
    "flex-basis",
    "flex-direction",
    "flex-flow",
    "flex-grow",
    "flex-shrink",
    "flex-wrap",
    "float",
    "flood-color",
    "flood-opacity",
    "flow",
    "font",
    "font-display",
    "font-family",
    "font-feature-settings",
    "font-kerning",
    "font-language-override",
    "font-optical-sizing",
    "font-palette",
    "font-size",
    "font-size-adjust",
    "font-smooth",
    "font-smoothing",
    "font-stretch",
    "font-style",
    "font-synthesis",
    "font-synthesis-position",
    "font-synthesis-small-caps",
    "font-synthesis-style",
    "font-synthesis-weight",
    "font-variant",
    "font-variant-alternates",
    "font-variant-caps",
    "font-variant-east-asian",
    "font-variant-emoji",
    "font-variant-ligatures",
    "font-variant-numeric",
    "font-variant-position",
    "font-variation-settings",
    "font-weight",
    "forced-color-adjust",
    "gap",
    "glyph-orientation-horizontal",
    "glyph-orientation-vertical",
    "grid",
    "grid-area",
    "grid-auto-columns",
    "grid-auto-flow",
    "grid-auto-rows",
    "grid-column",
    "grid-column-end",
    "grid-column-start",
    "grid-gap",
    "grid-row",
    "grid-row-end",
    "grid-row-start",
    "grid-template",
    "grid-template-areas",
    "grid-template-columns",
    "grid-template-rows",
    "hanging-punctuation",
    "height",
    "hyphenate-character",
    "hyphenate-limit-chars",
    "hyphens",
    "icon",
    "image-orientation",
    "image-rendering",
    "image-resolution",
    "ime-mode",
    "initial-letter",
    "initial-letter-align",
    "inline-size",
    "inset",
    "inset-area",
    "inset-block",
    "inset-block-end",
    "inset-block-start",
    "inset-inline",
    "inset-inline-end",
    "inset-inline-start",
    "isolation",
    "justify-content",
    "justify-items",
    "justify-self",
    "kerning",
    "left",
    "letter-spacing",
    "lighting-color",
    "line-break",
    "line-height",
    "line-height-step",
    "list-style",
    "list-style-image",
    "list-style-position",
    "list-style-type",
    "margin",
    "margin-block",
    "margin-block-end",
    "margin-block-start",
    "margin-bottom",
    "margin-inline",
    "margin-inline-end",
    "margin-inline-start",
    "margin-left",
    "margin-right",
    "margin-top",
    "margin-trim",
    "marker",
    "marker-end",
    "marker-mid",
    "marker-start",
    "marks",
    "mask",
    "mask-border",
    "mask-border-mode",
    "mask-border-outset",
    "mask-border-repeat",
    "mask-border-slice",
    "mask-border-source",
    "mask-border-width",
    "mask-clip",
    "mask-composite",
    "mask-image",
    "mask-mode",
    "mask-origin",
    "mask-position",
    "mask-repeat",
    "mask-size",
    "mask-type",
    "masonry-auto-flow",
    "math-depth",
    "math-shift",
    "math-style",
    "max-block-size",
    "max-height",
    "max-inline-size",
    "max-width",
    "min-block-size",
    "min-height",
    "min-inline-size",
    "min-width",
    "mix-blend-mode",
    "nav-down",
    "nav-index",
    "nav-left",
    "nav-right",
    "nav-up",
    "none",
    "normal",
    "object-fit",
    "object-position",
    "offset",
    "offset-anchor",
    "offset-distance",
    "offset-path",
    "offset-position",
    "offset-rotate",
    "opacity",
    "order",
    "orphans",
    "outline",
    "outline-color",
    "outline-offset",
    "outline-style",
    "outline-width",
    "overflow",
    "overflow-anchor",
    "overflow-block",
    "overflow-clip-margin",
    "overflow-inline",
    "overflow-wrap",
    "overflow-x",
    "overflow-y",
    "overlay",
    "overscroll-behavior",
    "overscroll-behavior-block",
    "overscroll-behavior-inline",
    "overscroll-behavior-x",
    "overscroll-behavior-y",
    "padding",
    "padding-block",
    "padding-block-end",
    "padding-block-start",
    "padding-bottom",
    "padding-inline",
    "padding-inline-end",
    "padding-inline-start",
    "padding-left",
    "padding-right",
    "padding-top",
    "page",
    "page-break-after",
    "page-break-before",
    "page-break-inside",
    "paint-order",
    "pause",
    "pause-after",
    "pause-before",
    "perspective",
    "perspective-origin",
    "place-content",
    "place-items",
    "place-self",
    "pointer-events",
    "position",
    "position-anchor",
    "position-visibility",
    "print-color-adjust",
    "quotes",
    "r",
    "resize",
    "rest",
    "rest-after",
    "rest-before",
    "right",
    "rotate",
    "row-gap",
    "ruby-align",
    "ruby-position",
    "scale",
    "scroll-behavior",
    "scroll-margin",
    "scroll-margin-block",
    "scroll-margin-block-end",
    "scroll-margin-block-start",
    "scroll-margin-bottom",
    "scroll-margin-inline",
    "scroll-margin-inline-end",
    "scroll-margin-inline-start",
    "scroll-margin-left",
    "scroll-margin-right",
    "scroll-margin-top",
    "scroll-padding",
    "scroll-padding-block",
    "scroll-padding-block-end",
    "scroll-padding-block-start",
    "scroll-padding-bottom",
    "scroll-padding-inline",
    "scroll-padding-inline-end",
    "scroll-padding-inline-start",
    "scroll-padding-left",
    "scroll-padding-right",
    "scroll-padding-top",
    "scroll-snap-align",
    "scroll-snap-stop",
    "scroll-snap-type",
    "scroll-timeline",
    "scroll-timeline-axis",
    "scroll-timeline-name",
    "scrollbar-color",
    "scrollbar-gutter",
    "scrollbar-width",
    "shape-image-threshold",
    "shape-margin",
    "shape-outside",
    "shape-rendering",
    "speak",
    "speak-as",
    "src",
    // @font-face
    "stop-color",
    "stop-opacity",
    "stroke",
    "stroke-dasharray",
    "stroke-dashoffset",
    "stroke-linecap",
    "stroke-linejoin",
    "stroke-miterlimit",
    "stroke-opacity",
    "stroke-width",
    "tab-size",
    "table-layout",
    "text-align",
    "text-align-all",
    "text-align-last",
    "text-anchor",
    "text-combine-upright",
    "text-decoration",
    "text-decoration-color",
    "text-decoration-line",
    "text-decoration-skip",
    "text-decoration-skip-ink",
    "text-decoration-style",
    "text-decoration-thickness",
    "text-emphasis",
    "text-emphasis-color",
    "text-emphasis-position",
    "text-emphasis-style",
    "text-indent",
    "text-justify",
    "text-orientation",
    "text-overflow",
    "text-rendering",
    "text-shadow",
    "text-size-adjust",
    "text-transform",
    "text-underline-offset",
    "text-underline-position",
    "text-wrap",
    "text-wrap-mode",
    "text-wrap-style",
    "timeline-scope",
    "top",
    "touch-action",
    "transform",
    "transform-box",
    "transform-origin",
    "transform-style",
    "transition",
    "transition-behavior",
    "transition-delay",
    "transition-duration",
    "transition-property",
    "transition-timing-function",
    "translate",
    "unicode-bidi",
    "user-modify",
    "user-select",
    "vector-effect",
    "vertical-align",
    "view-timeline",
    "view-timeline-axis",
    "view-timeline-inset",
    "view-timeline-name",
    "view-transition-name",
    "visibility",
    "voice-balance",
    "voice-duration",
    "voice-family",
    "voice-pitch",
    "voice-range",
    "voice-rate",
    "voice-stress",
    "voice-volume",
    "white-space",
    "white-space-collapse",
    "widows",
    "width",
    "will-change",
    "word-break",
    "word-spacing",
    "word-wrap",
    "writing-mode",
    "x",
    "y",
    "z-index",
    "zoom"
  ].sort().reverse();
  var PSEUDO_SELECTORS = PSEUDO_CLASSES2.concat(PSEUDO_ELEMENTS2).sort().reverse();
  function less(hljs) {
    const modes = MODES2(hljs);
    const PSEUDO_SELECTORS$1 = PSEUDO_SELECTORS;
    const AT_MODIFIERS = "and or not only";
    const IDENT_RE3 = "[\\w-]+";
    const INTERP_IDENT_RE = "(" + IDENT_RE3 + "|@\\{" + IDENT_RE3 + "\\})";
    const RULES = [];
    const VALUE_MODES = [];
    const STRING_MODE = function(c2) {
      return {
        // Less strings are not multiline (also include '~' for more consistent coloring of "escaped" strings)
        className: "string",
        begin: "~?" + c2 + ".*?" + c2
      };
    };
    const IDENT_MODE = function(name, begin, relevance) {
      return {
        className: name,
        begin,
        relevance
      };
    };
    const AT_KEYWORDS = {
      $pattern: /[a-z-]+/,
      keyword: AT_MODIFIERS,
      attribute: MEDIA_FEATURES2.join(" ")
    };
    const PARENS_MODE = {
      // used only to properly balance nested parens inside mixin call, def. arg list
      begin: "\\(",
      end: "\\)",
      contains: VALUE_MODES,
      keywords: AT_KEYWORDS,
      relevance: 0
    };
    VALUE_MODES.push(
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      STRING_MODE("'"),
      STRING_MODE('"'),
      modes.CSS_NUMBER_MODE,
      // fixme: it does not include dot for numbers like .5em :(
      {
        begin: "(url|data-uri)\\(",
        starts: {
          className: "string",
          end: "[\\)\\n]",
          excludeEnd: true
        }
      },
      modes.HEXCOLOR,
      PARENS_MODE,
      IDENT_MODE("variable", "@@?" + IDENT_RE3, 10),
      IDENT_MODE("variable", "@\\{" + IDENT_RE3 + "\\}"),
      IDENT_MODE("built_in", "~?`[^`]*?`"),
      // inline javascript (or whatever host language) *multiline* string
      {
        // @media features (it’s here to not duplicate things in AT_RULE_MODE with extra PARENS_MODE overriding):
        className: "attribute",
        begin: IDENT_RE3 + "\\s*:",
        end: ":",
        returnBegin: true,
        excludeEnd: true
      },
      modes.IMPORTANT,
      { beginKeywords: "and not" },
      modes.FUNCTION_DISPATCH
    );
    const VALUE_WITH_RULESETS = VALUE_MODES.concat({
      begin: /\{/,
      end: /\}/,
      contains: RULES
    });
    const MIXIN_GUARD_MODE = {
      beginKeywords: "when",
      endsWithParent: true,
      contains: [{ beginKeywords: "and not" }].concat(VALUE_MODES)
      // using this form to override VALUE’s 'function' match
    };
    const RULE_MODE = {
      begin: INTERP_IDENT_RE + "\\s*:",
      returnBegin: true,
      end: /[;}]/,
      relevance: 0,
      contains: [
        { begin: /-(webkit|moz|ms|o)-/ },
        modes.CSS_VARIABLE,
        {
          className: "attribute",
          begin: "\\b(" + ATTRIBUTES2.join("|") + ")\\b",
          end: /(?=:)/,
          starts: {
            endsWithParent: true,
            illegal: "[<=$]",
            relevance: 0,
            contains: VALUE_MODES
          }
        }
      ]
    };
    const AT_RULE_MODE = {
      className: "keyword",
      begin: "@(import|media|charset|font-face|(-[a-z]+-)?keyframes|supports|document|namespace|page|viewport|host)\\b",
      starts: {
        end: "[;{}]",
        keywords: AT_KEYWORDS,
        returnEnd: true,
        contains: VALUE_MODES,
        relevance: 0
      }
    };
    const VAR_RULE_MODE = {
      className: "variable",
      variants: [
        // using more strict pattern for higher relevance to increase chances of Less detection.
        // this is *the only* Less specific statement used in most of the sources, so...
        // (we’ll still often loose to the css-parser unless there's '//' comment,
        // simply because 1 variable just can't beat 99 properties :)
        {
          begin: "@" + IDENT_RE3 + "\\s*:",
          relevance: 15
        },
        { begin: "@" + IDENT_RE3 }
      ],
      starts: {
        end: "[;}]",
        returnEnd: true,
        contains: VALUE_WITH_RULESETS
      }
    };
    const SELECTOR_MODE = {
      // first parse unambiguous selectors (i.e. those not starting with tag)
      // then fall into the scary lookahead-discriminator variant.
      // this mode also handles mixin definitions and calls
      variants: [
        {
          begin: "[\\.#:&\\[>]",
          end: "[;{}]"
          // mixin calls end with ';'
        },
        {
          begin: INTERP_IDENT_RE,
          end: /\{/
        }
      ],
      returnBegin: true,
      returnEnd: true,
      illegal: `[<='$"]`,
      relevance: 0,
      contains: [
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        MIXIN_GUARD_MODE,
        IDENT_MODE("keyword", "all\\b"),
        IDENT_MODE("variable", "@\\{" + IDENT_RE3 + "\\}"),
        // otherwise it’s identified as tag
        {
          begin: "\\b(" + TAGS2.join("|") + ")\\b",
          className: "selector-tag"
        },
        modes.CSS_NUMBER_MODE,
        IDENT_MODE("selector-tag", INTERP_IDENT_RE, 0),
        IDENT_MODE("selector-id", "#" + INTERP_IDENT_RE),
        IDENT_MODE("selector-class", "\\." + INTERP_IDENT_RE, 0),
        IDENT_MODE("selector-tag", "&", 0),
        modes.ATTRIBUTE_SELECTOR_MODE,
        {
          className: "selector-pseudo",
          begin: ":(" + PSEUDO_CLASSES2.join("|") + ")"
        },
        {
          className: "selector-pseudo",
          begin: ":(:)?(" + PSEUDO_ELEMENTS2.join("|") + ")"
        },
        {
          begin: /\(/,
          end: /\)/,
          relevance: 0,
          contains: VALUE_WITH_RULESETS
        },
        // argument list of parametric mixins
        { begin: "!important" },
        // eat !important after mixin call or it will be colored as tag
        modes.FUNCTION_DISPATCH
      ]
    };
    const PSEUDO_SELECTOR_MODE = {
      begin: IDENT_RE3 + `:(:)?(${PSEUDO_SELECTORS$1.join("|")})`,
      returnBegin: true,
      contains: [SELECTOR_MODE]
    };
    RULES.push(
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      AT_RULE_MODE,
      VAR_RULE_MODE,
      PSEUDO_SELECTOR_MODE,
      RULE_MODE,
      SELECTOR_MODE,
      MIXIN_GUARD_MODE,
      modes.FUNCTION_DISPATCH
    );
    return {
      name: "Less",
      case_insensitive: true,
      illegal: `[=>'/<($"]`,
      contains: RULES
    };
  }

  // node_modules/highlight.js/es/languages/markdown.js
  function markdown(hljs) {
    const regex = hljs.regex;
    const INLINE_HTML = {
      begin: /<\/?[A-Za-z_]/,
      end: ">",
      subLanguage: "xml",
      relevance: 0
    };
    const HORIZONTAL_RULE = {
      begin: "^[-\\*]{3,}",
      end: "$"
    };
    const CODE = {
      className: "code",
      variants: [
        // TODO: fix to allow these to work with sublanguage also
        { begin: "(`{3,})[^`](.|\\n)*?\\1`*[ ]*" },
        { begin: "(~{3,})[^~](.|\\n)*?\\1~*[ ]*" },
        // needed to allow markdown as a sublanguage to work
        {
          begin: "```",
          end: "```+[ ]*$"
        },
        {
          begin: "~~~",
          end: "~~~+[ ]*$"
        },
        { begin: "`.+?`" },
        {
          begin: "(?=^( {4}|\\t))",
          // use contains to gobble up multiple lines to allow the block to be whatever size
          // but only have a single open/close tag vs one per line
          contains: [
            {
              begin: "^( {4}|\\t)",
              end: "(\\n)$"
            }
          ],
          relevance: 0
        }
      ]
    };
    const LIST = {
      className: "bullet",
      begin: "^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)",
      end: "\\s+",
      excludeEnd: true
    };
    const LINK_REFERENCE = {
      begin: /^\[[^\n]+\]:/,
      returnBegin: true,
      contains: [
        {
          className: "symbol",
          begin: /\[/,
          end: /\]/,
          excludeBegin: true,
          excludeEnd: true
        },
        {
          className: "link",
          begin: /:\s*/,
          end: /$/,
          excludeBegin: true
        }
      ]
    };
    const URL_SCHEME = /[A-Za-z][A-Za-z0-9+.-]*/;
    const LINK = {
      variants: [
        // too much like nested array access in so many languages
        // to have any real relevance
        {
          begin: /\[.+?\]\[.*?\]/,
          relevance: 0
        },
        // popular internet URLs
        {
          begin: /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
          relevance: 2
        },
        {
          begin: regex.concat(/\[.+?\]\(/, URL_SCHEME, /:\/\/.*?\)/),
          relevance: 2
        },
        // relative urls
        {
          begin: /\[.+?\]\([./?&#].*?\)/,
          relevance: 1
        },
        // whatever else, lower relevance (might not be a link at all)
        {
          begin: /\[.*?\]\(.*?\)/,
          relevance: 0
        }
      ],
      returnBegin: true,
      contains: [
        {
          // empty strings for alt or link text
          match: /\[(?=\])/
        },
        {
          className: "string",
          relevance: 0,
          begin: "\\[",
          end: "\\]",
          excludeBegin: true,
          returnEnd: true
        },
        {
          className: "link",
          relevance: 0,
          begin: "\\]\\(",
          end: "\\)",
          excludeBegin: true,
          excludeEnd: true
        },
        {
          className: "symbol",
          relevance: 0,
          begin: "\\]\\[",
          end: "\\]",
          excludeBegin: true,
          excludeEnd: true
        }
      ]
    };
    const BOLD = {
      className: "strong",
      contains: [],
      // defined later
      variants: [
        {
          begin: /_{2}(?!\s)/,
          end: /_{2}/
        },
        {
          begin: /\*{2}(?!\s)/,
          end: /\*{2}/
        }
      ]
    };
    const ITALIC = {
      className: "emphasis",
      contains: [],
      // defined later
      variants: [
        {
          begin: /\*(?![*\s])/,
          end: /\*/
        },
        {
          begin: /_(?![_\s])/,
          end: /_/,
          relevance: 0
        }
      ]
    };
    const BOLD_WITHOUT_ITALIC = hljs.inherit(BOLD, { contains: [] });
    const ITALIC_WITHOUT_BOLD = hljs.inherit(ITALIC, { contains: [] });
    BOLD.contains.push(ITALIC_WITHOUT_BOLD);
    ITALIC.contains.push(BOLD_WITHOUT_ITALIC);
    let CONTAINABLE = [
      INLINE_HTML,
      LINK
    ];
    [
      BOLD,
      ITALIC,
      BOLD_WITHOUT_ITALIC,
      ITALIC_WITHOUT_BOLD
    ].forEach((m) => {
      m.contains = m.contains.concat(CONTAINABLE);
    });
    CONTAINABLE = CONTAINABLE.concat(BOLD, ITALIC);
    const HEADER = {
      className: "section",
      variants: [
        {
          begin: "^#{1,6}",
          end: "$",
          contains: CONTAINABLE
        },
        {
          begin: "(?=^.+?\\n[=-]{2,}$)",
          contains: [
            { begin: "^[=-]*$" },
            {
              begin: "^",
              end: "\\n",
              contains: CONTAINABLE
            }
          ]
        }
      ]
    };
    const BLOCKQUOTE = {
      className: "quote",
      begin: "^>\\s+",
      contains: CONTAINABLE,
      end: "$"
    };
    const ENTITY = {
      //https://spec.commonmark.org/0.31.2/#entity-references
      scope: "literal",
      match: /&([a-zA-Z0-9]+|#[0-9]{1,7}|#[Xx][0-9a-fA-F]{1,6});/
    };
    return {
      name: "Markdown",
      aliases: [
        "md",
        "mkdown",
        "mkd"
      ],
      contains: [
        HEADER,
        INLINE_HTML,
        LIST,
        BOLD,
        ITALIC,
        BLOCKQUOTE,
        CODE,
        HORIZONTAL_RULE,
        LINK,
        LINK_REFERENCE,
        ENTITY
      ]
    };
  }

  // node_modules/highlight.js/es/languages/nginx.js
  function nginx(hljs) {
    const regex = hljs.regex;
    const VAR = {
      className: "variable",
      variants: [
        { begin: /\$\d+/ },
        { begin: /\$\{\w+\}/ },
        { begin: regex.concat(/[$@]/, hljs.UNDERSCORE_IDENT_RE) }
      ]
    };
    const LITERALS3 = [
      "on",
      "off",
      "yes",
      "no",
      "true",
      "false",
      "none",
      "blocked",
      "debug",
      "info",
      "notice",
      "warn",
      "error",
      "crit",
      "select",
      "break",
      "last",
      "permanent",
      "redirect",
      "kqueue",
      "rtsig",
      "epoll",
      "poll",
      "/dev/poll"
    ];
    const DEFAULT = {
      endsWithParent: true,
      keywords: {
        $pattern: /[a-z_]{2,}|\/dev\/poll/,
        literal: LITERALS3
      },
      relevance: 0,
      illegal: "=>",
      contains: [
        hljs.HASH_COMMENT_MODE,
        {
          className: "string",
          contains: [
            hljs.BACKSLASH_ESCAPE,
            VAR
          ],
          variants: [
            {
              begin: /"/,
              end: /"/
            },
            {
              begin: /'/,
              end: /'/
            }
          ]
        },
        // this swallows entire URLs to avoid detecting numbers within
        {
          begin: "([a-z]+):/",
          end: "\\s",
          endsWithParent: true,
          excludeEnd: true,
          contains: [VAR]
        },
        {
          className: "regexp",
          contains: [
            hljs.BACKSLASH_ESCAPE,
            VAR
          ],
          variants: [
            {
              begin: "\\s\\^",
              end: "\\s|\\{|;",
              returnEnd: true
            },
            // regexp locations (~, ~*)
            {
              begin: "~\\*?\\s+",
              end: "\\s|\\{|;",
              returnEnd: true
            },
            // *.example.com
            { begin: "\\*(\\.[a-z\\-]+)+" },
            // sub.example.*
            { begin: "([a-z\\-]+\\.)+\\*" }
          ]
        },
        // IP
        {
          className: "number",
          begin: "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?\\b"
        },
        // units
        {
          className: "number",
          begin: "\\b\\d+[kKmMgGdshdwy]?\\b",
          relevance: 0
        },
        VAR
      ]
    };
    return {
      name: "Nginx config",
      aliases: ["nginxconf"],
      contains: [
        hljs.HASH_COMMENT_MODE,
        {
          beginKeywords: "upstream location",
          end: /;|\{/,
          contains: DEFAULT.contains,
          keywords: { section: "upstream location" }
        },
        {
          className: "section",
          begin: regex.concat(hljs.UNDERSCORE_IDENT_RE + regex.lookahead(/\s+\{/)),
          relevance: 0
        },
        {
          begin: regex.lookahead(hljs.UNDERSCORE_IDENT_RE + "\\s"),
          end: ";|\\{",
          contains: [
            {
              className: "attribute",
              begin: hljs.UNDERSCORE_IDENT_RE,
              starts: DEFAULT
            }
          ],
          relevance: 0
        }
      ],
      illegal: "[^\\s\\}\\{]"
    };
  }

  // node_modules/highlight.js/es/languages/php.js
  function php(hljs) {
    const regex = hljs.regex;
    const NOT_PERL_ETC = /(?![A-Za-z0-9])(?![$])/;
    const IDENT_RE3 = regex.concat(
      /[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/,
      NOT_PERL_ETC
    );
    const PASCAL_CASE_CLASS_NAME_RE = regex.concat(
      /(\\?[A-Z][a-z0-9_\x7f-\xff]+|\\?[A-Z]+(?=[A-Z][a-z0-9_\x7f-\xff])){1,}/,
      NOT_PERL_ETC
    );
    const UPCASE_NAME_RE = regex.concat(
      /[A-Z]+/,
      NOT_PERL_ETC
    );
    const VARIABLE = {
      scope: "variable",
      match: "\\$+" + IDENT_RE3
    };
    const PREPROCESSOR = {
      scope: "meta",
      variants: [
        { begin: /<\?php/, relevance: 10 },
        // boost for obvious PHP
        { begin: /<\?=/ },
        // less relevant per PSR-1 which says not to use short-tags
        { begin: /<\?/, relevance: 0.1 },
        { begin: /\?>/ }
        // end php tag
      ]
    };
    const SUBST = {
      scope: "subst",
      variants: [
        { begin: /\$\w+/ },
        {
          begin: /\{\$/,
          end: /\}/
        }
      ]
    };
    const SINGLE_QUOTED = hljs.inherit(hljs.APOS_STRING_MODE, { illegal: null });
    const DOUBLE_QUOTED = hljs.inherit(hljs.QUOTE_STRING_MODE, {
      illegal: null,
      contains: hljs.QUOTE_STRING_MODE.contains.concat(SUBST)
    });
    const HEREDOC = {
      begin: /<<<[ \t]*(?:(\w+)|"(\w+)")\n/,
      end: /[ \t]*(\w+)\b/,
      contains: hljs.QUOTE_STRING_MODE.contains.concat(SUBST),
      "on:begin": (m, resp) => {
        resp.data._beginMatch = m[1] || m[2];
      },
      "on:end": (m, resp) => {
        if (resp.data._beginMatch !== m[1]) resp.ignoreMatch();
      }
    };
    const NOWDOC = hljs.END_SAME_AS_BEGIN({
      begin: /<<<[ \t]*'(\w+)'\n/,
      end: /[ \t]*(\w+)\b/
    });
    const WHITESPACE = "[ 	\n]";
    const STRING = {
      scope: "string",
      variants: [
        DOUBLE_QUOTED,
        SINGLE_QUOTED,
        HEREDOC,
        NOWDOC
      ]
    };
    const NUMBER = {
      scope: "number",
      variants: [
        { begin: `\\b0[bB][01]+(?:_[01]+)*\\b` },
        // Binary w/ underscore support
        { begin: `\\b0[oO][0-7]+(?:_[0-7]+)*\\b` },
        // Octals w/ underscore support
        { begin: `\\b0[xX][\\da-fA-F]+(?:_[\\da-fA-F]+)*\\b` },
        // Hex w/ underscore support
        // Decimals w/ underscore support, with optional fragments and scientific exponent (e) suffix.
        { begin: `(?:\\b\\d+(?:_\\d+)*(\\.(?:\\d+(?:_\\d+)*))?|\\B\\.\\d+)(?:[eE][+-]?\\d+)?` }
      ],
      relevance: 0
    };
    const LITERALS3 = [
      "false",
      "null",
      "true"
    ];
    const KWS = [
      // Magic constants:
      // <https://www.php.net/manual/en/language.constants.predefined.php>
      "__CLASS__",
      "__DIR__",
      "__FILE__",
      "__FUNCTION__",
      "__COMPILER_HALT_OFFSET__",
      "__LINE__",
      "__METHOD__",
      "__NAMESPACE__",
      "__TRAIT__",
      // Function that look like language construct or language construct that look like function:
      // List of keywords that may not require parenthesis
      "die",
      "echo",
      "exit",
      "include",
      "include_once",
      "print",
      "require",
      "require_once",
      // These are not language construct (function) but operate on the currently-executing function and can access the current symbol table
      // 'compact extract func_get_arg func_get_args func_num_args get_called_class get_parent_class ' +
      // Other keywords:
      // <https://www.php.net/manual/en/reserved.php>
      // <https://www.php.net/manual/en/language.types.type-juggling.php>
      "array",
      "abstract",
      "and",
      "as",
      "binary",
      "bool",
      "boolean",
      "break",
      "callable",
      "case",
      "catch",
      "class",
      "clone",
      "const",
      "continue",
      "declare",
      "default",
      "do",
      "double",
      "else",
      "elseif",
      "empty",
      "enddeclare",
      "endfor",
      "endforeach",
      "endif",
      "endswitch",
      "endwhile",
      "enum",
      "eval",
      "extends",
      "final",
      "finally",
      "float",
      "for",
      "foreach",
      "from",
      "global",
      "goto",
      "if",
      "implements",
      "instanceof",
      "insteadof",
      "int",
      "integer",
      "interface",
      "isset",
      "iterable",
      "list",
      "match|0",
      "mixed",
      "new",
      "never",
      "object",
      "or",
      "private",
      "protected",
      "public",
      "readonly",
      "real",
      "return",
      "string",
      "switch",
      "throw",
      "trait",
      "try",
      "unset",
      "use",
      "var",
      "void",
      "while",
      "xor",
      "yield"
    ];
    const BUILT_INS3 = [
      // Standard PHP library:
      // <https://www.php.net/manual/en/book.spl.php>
      "Error|0",
      "AppendIterator",
      "ArgumentCountError",
      "ArithmeticError",
      "ArrayIterator",
      "ArrayObject",
      "AssertionError",
      "BadFunctionCallException",
      "BadMethodCallException",
      "CachingIterator",
      "CallbackFilterIterator",
      "CompileError",
      "Countable",
      "DirectoryIterator",
      "DivisionByZeroError",
      "DomainException",
      "EmptyIterator",
      "ErrorException",
      "Exception",
      "FilesystemIterator",
      "FilterIterator",
      "GlobIterator",
      "InfiniteIterator",
      "InvalidArgumentException",
      "IteratorIterator",
      "LengthException",
      "LimitIterator",
      "LogicException",
      "MultipleIterator",
      "NoRewindIterator",
      "OutOfBoundsException",
      "OutOfRangeException",
      "OuterIterator",
      "OverflowException",
      "ParentIterator",
      "ParseError",
      "RangeException",
      "RecursiveArrayIterator",
      "RecursiveCachingIterator",
      "RecursiveCallbackFilterIterator",
      "RecursiveDirectoryIterator",
      "RecursiveFilterIterator",
      "RecursiveIterator",
      "RecursiveIteratorIterator",
      "RecursiveRegexIterator",
      "RecursiveTreeIterator",
      "RegexIterator",
      "RuntimeException",
      "SeekableIterator",
      "SplDoublyLinkedList",
      "SplFileInfo",
      "SplFileObject",
      "SplFixedArray",
      "SplHeap",
      "SplMaxHeap",
      "SplMinHeap",
      "SplObjectStorage",
      "SplObserver",
      "SplPriorityQueue",
      "SplQueue",
      "SplStack",
      "SplSubject",
      "SplTempFileObject",
      "TypeError",
      "UnderflowException",
      "UnexpectedValueException",
      "UnhandledMatchError",
      // Reserved interfaces:
      // <https://www.php.net/manual/en/reserved.interfaces.php>
      "ArrayAccess",
      "BackedEnum",
      "Closure",
      "Fiber",
      "Generator",
      "Iterator",
      "IteratorAggregate",
      "Serializable",
      "Stringable",
      "Throwable",
      "Traversable",
      "UnitEnum",
      "WeakReference",
      "WeakMap",
      // Reserved classes:
      // <https://www.php.net/manual/en/reserved.classes.php>
      "Directory",
      "__PHP_Incomplete_Class",
      "parent",
      "php_user_filter",
      "self",
      "static",
      "stdClass"
    ];
    const dualCase = (items) => {
      const result = [];
      items.forEach((item) => {
        result.push(item);
        if (item.toLowerCase() === item) {
          result.push(item.toUpperCase());
        } else {
          result.push(item.toLowerCase());
        }
      });
      return result;
    };
    const KEYWORDS3 = {
      keyword: KWS,
      literal: dualCase(LITERALS3),
      built_in: BUILT_INS3
    };
    const normalizeKeywords = (items) => {
      return items.map((item) => {
        return item.replace(/\|\d+$/, "");
      });
    };
    const CONSTRUCTOR_CALL = { variants: [
      {
        match: [
          /new/,
          regex.concat(WHITESPACE, "+"),
          // to prevent built ins from being confused as the class constructor call
          regex.concat("(?!", normalizeKeywords(BUILT_INS3).join("\\b|"), "\\b)"),
          PASCAL_CASE_CLASS_NAME_RE
        ],
        scope: {
          1: "keyword",
          4: "title.class"
        }
      }
    ] };
    const CONSTANT_REFERENCE = regex.concat(IDENT_RE3, "\\b(?!\\()");
    const LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON = { variants: [
      {
        match: [
          regex.concat(
            /::/,
            regex.lookahead(/(?!class\b)/)
          ),
          CONSTANT_REFERENCE
        ],
        scope: { 2: "variable.constant" }
      },
      {
        match: [
          /::/,
          /class/
        ],
        scope: { 2: "variable.language" }
      },
      {
        match: [
          PASCAL_CASE_CLASS_NAME_RE,
          regex.concat(
            /::/,
            regex.lookahead(/(?!class\b)/)
          ),
          CONSTANT_REFERENCE
        ],
        scope: {
          1: "title.class",
          3: "variable.constant"
        }
      },
      {
        match: [
          PASCAL_CASE_CLASS_NAME_RE,
          regex.concat(
            "::",
            regex.lookahead(/(?!class\b)/)
          )
        ],
        scope: { 1: "title.class" }
      },
      {
        match: [
          PASCAL_CASE_CLASS_NAME_RE,
          /::/,
          /class/
        ],
        scope: {
          1: "title.class",
          3: "variable.language"
        }
      }
    ] };
    const NAMED_ARGUMENT = {
      scope: "attr",
      match: regex.concat(IDENT_RE3, regex.lookahead(":"), regex.lookahead(/(?!::)/))
    };
    const PARAMS_MODE = {
      relevance: 0,
      begin: /\(/,
      end: /\)/,
      keywords: KEYWORDS3,
      contains: [
        NAMED_ARGUMENT,
        VARIABLE,
        LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON,
        hljs.C_BLOCK_COMMENT_MODE,
        STRING,
        NUMBER,
        CONSTRUCTOR_CALL
      ]
    };
    const FUNCTION_INVOKE = {
      relevance: 0,
      match: [
        /\b/,
        // to prevent keywords from being confused as the function title
        regex.concat("(?!fn\\b|function\\b|", normalizeKeywords(KWS).join("\\b|"), "|", normalizeKeywords(BUILT_INS3).join("\\b|"), "\\b)"),
        IDENT_RE3,
        regex.concat(WHITESPACE, "*"),
        regex.lookahead(/(?=\()/)
      ],
      scope: { 3: "title.function.invoke" },
      contains: [PARAMS_MODE]
    };
    PARAMS_MODE.contains.push(FUNCTION_INVOKE);
    const ATTRIBUTE_CONTAINS = [
      NAMED_ARGUMENT,
      LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON,
      hljs.C_BLOCK_COMMENT_MODE,
      STRING,
      NUMBER,
      CONSTRUCTOR_CALL
    ];
    const ATTRIBUTES4 = {
      begin: regex.concat(
        /#\[\s*\\?/,
        regex.either(
          PASCAL_CASE_CLASS_NAME_RE,
          UPCASE_NAME_RE
        )
      ),
      beginScope: "meta",
      end: /]/,
      endScope: "meta",
      keywords: {
        literal: LITERALS3,
        keyword: [
          "new",
          "array"
        ]
      },
      contains: [
        {
          begin: /\[/,
          end: /]/,
          keywords: {
            literal: LITERALS3,
            keyword: [
              "new",
              "array"
            ]
          },
          contains: [
            "self",
            ...ATTRIBUTE_CONTAINS
          ]
        },
        ...ATTRIBUTE_CONTAINS,
        {
          scope: "meta",
          variants: [
            { match: PASCAL_CASE_CLASS_NAME_RE },
            { match: UPCASE_NAME_RE }
          ]
        }
      ]
    };
    return {
      case_insensitive: false,
      keywords: KEYWORDS3,
      contains: [
        ATTRIBUTES4,
        hljs.HASH_COMMENT_MODE,
        hljs.COMMENT("//", "$"),
        hljs.COMMENT(
          "/\\*",
          "\\*/",
          { contains: [
            {
              scope: "doctag",
              match: "@[A-Za-z]+"
            }
          ] }
        ),
        {
          match: /__halt_compiler\(\);/,
          keywords: "__halt_compiler",
          starts: {
            scope: "comment",
            end: hljs.MATCH_NOTHING_RE,
            contains: [
              {
                match: /\?>/,
                scope: "meta",
                endsParent: true
              }
            ]
          }
        },
        PREPROCESSOR,
        {
          scope: "variable.language",
          match: /\$this\b/
        },
        VARIABLE,
        FUNCTION_INVOKE,
        LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON,
        {
          match: [
            /const/,
            /\s/,
            IDENT_RE3
          ],
          scope: {
            1: "keyword",
            3: "variable.constant"
          }
        },
        CONSTRUCTOR_CALL,
        {
          scope: "function",
          relevance: 0,
          beginKeywords: "fn function",
          end: /[;{]/,
          excludeEnd: true,
          illegal: "[$%\\[]",
          contains: [
            { beginKeywords: "use" },
            hljs.UNDERSCORE_TITLE_MODE,
            {
              begin: "=>",
              // No markup, just a relevance booster
              endsParent: true
            },
            {
              scope: "params",
              begin: "\\(",
              end: "\\)",
              excludeBegin: true,
              excludeEnd: true,
              keywords: KEYWORDS3,
              contains: [
                "self",
                ATTRIBUTES4,
                VARIABLE,
                LEFT_AND_RIGHT_SIDE_OF_DOUBLE_COLON,
                hljs.C_BLOCK_COMMENT_MODE,
                STRING,
                NUMBER
              ]
            }
          ]
        },
        {
          scope: "class",
          variants: [
            {
              beginKeywords: "enum",
              illegal: /[($"]/
            },
            {
              beginKeywords: "class interface trait",
              illegal: /[:($"]/
            }
          ],
          relevance: 0,
          end: /\{/,
          excludeEnd: true,
          contains: [
            { beginKeywords: "extends implements" },
            hljs.UNDERSCORE_TITLE_MODE
          ]
        },
        // both use and namespace still use "old style" rules (vs multi-match)
        // because the namespace name can include `\` and we still want each
        // element to be treated as its own *individual* title
        {
          beginKeywords: "namespace",
          relevance: 0,
          end: ";",
          illegal: /[.']/,
          contains: [hljs.inherit(hljs.UNDERSCORE_TITLE_MODE, { scope: "title.class" })]
        },
        {
          beginKeywords: "use",
          relevance: 0,
          end: ";",
          contains: [
            // TODO: title.function vs title.class
            {
              match: /\b(as|const|function)\b/,
              scope: "keyword"
            },
            // TODO: could be title.class or title.function
            hljs.UNDERSCORE_TITLE_MODE
          ]
        },
        STRING,
        NUMBER
      ]
    };
  }

  // node_modules/highlight.js/es/languages/powershell.js
  function powershell(hljs) {
    const TYPES3 = [
      "string",
      "char",
      "byte",
      "int",
      "long",
      "bool",
      "decimal",
      "single",
      "double",
      "DateTime",
      "xml",
      "array",
      "hashtable",
      "void"
    ];
    const VALID_VERBS = "Add|Clear|Close|Copy|Enter|Exit|Find|Format|Get|Hide|Join|Lock|Move|New|Open|Optimize|Pop|Push|Redo|Remove|Rename|Reset|Resize|Search|Select|Set|Show|Skip|Split|Step|Switch|Undo|Unlock|Watch|Backup|Checkpoint|Compare|Compress|Convert|ConvertFrom|ConvertTo|Dismount|Edit|Expand|Export|Group|Import|Initialize|Limit|Merge|Mount|Out|Publish|Restore|Save|Sync|Unpublish|Update|Approve|Assert|Build|Complete|Confirm|Deny|Deploy|Disable|Enable|Install|Invoke|Register|Request|Restart|Resume|Start|Stop|Submit|Suspend|Uninstall|Unregister|Wait|Debug|Measure|Ping|Repair|Resolve|Test|Trace|Connect|Disconnect|Read|Receive|Send|Write|Block|Grant|Protect|Revoke|Unblock|Unprotect|Use|ForEach|Sort|Tee|Where";
    const COMPARISON_OPERATORS = "-and|-as|-band|-bnot|-bor|-bxor|-casesensitive|-ccontains|-ceq|-cge|-cgt|-cle|-clike|-clt|-cmatch|-cne|-cnotcontains|-cnotlike|-cnotmatch|-contains|-creplace|-csplit|-eq|-exact|-f|-file|-ge|-gt|-icontains|-ieq|-ige|-igt|-ile|-ilike|-ilt|-imatch|-in|-ine|-inotcontains|-inotlike|-inotmatch|-ireplace|-is|-isnot|-isplit|-join|-le|-like|-lt|-match|-ne|-not|-notcontains|-notin|-notlike|-notmatch|-or|-regex|-replace|-shl|-shr|-split|-wildcard|-xor";
    const KEYWORDS3 = {
      $pattern: /-?[A-z\.\-]+\b/,
      keyword: "if else foreach return do while until elseif begin for trap data dynamicparam end break throw param continue finally in switch exit filter try process catch hidden static parameter",
      // "echo" relevance has been set to 0 to avoid auto-detect conflicts with shell transcripts
      built_in: "ac asnp cat cd CFS chdir clc clear clhy cli clp cls clv cnsn compare copy cp cpi cpp curl cvpa dbp del diff dir dnsn ebp echo|0 epal epcsv epsn erase etsn exsn fc fhx fl ft fw gal gbp gc gcb gci gcm gcs gdr gerr ghy gi gin gjb gl gm gmo gp gps gpv group gsn gsnp gsv gtz gu gv gwmi h history icm iex ihy ii ipal ipcsv ipmo ipsn irm ise iwmi iwr kill lp ls man md measure mi mount move mp mv nal ndr ni nmo npssc nsn nv ogv oh popd ps pushd pwd r rbp rcjb rcsn rd rdr ren ri rjb rm rmdir rmo rni rnp rp rsn rsnp rujb rv rvpa rwmi sajb sal saps sasv sbp sc scb select set shcm si sl sleep sls sort sp spjb spps spsv start stz sujb sv swmi tee trcm type wget where wjb write"
      // TODO: 'validate[A-Z]+' can't work in keywords
    };
    const TITLE_NAME_RE = /\w[\w\d]*((-)[\w\d]+)*/;
    const BACKTICK_ESCAPE = {
      begin: "`[\\s\\S]",
      relevance: 0
    };
    const VAR = {
      className: "variable",
      variants: [
        { begin: /\$\B/ },
        {
          className: "keyword",
          begin: /\$this/
        },
        { begin: /\$[\w\d][\w\d_:]*/ }
      ]
    };
    const LITERAL = {
      className: "literal",
      begin: /\$(null|true|false)\b/
    };
    const QUOTE_STRING = {
      className: "string",
      variants: [
        {
          begin: /"/,
          end: /"/
        },
        {
          begin: /@"/,
          end: /^"@/
        }
      ],
      contains: [
        BACKTICK_ESCAPE,
        VAR,
        {
          className: "variable",
          begin: /\$[A-z]/,
          end: /[^A-z]/
        }
      ]
    };
    const APOS_STRING = {
      className: "string",
      variants: [
        {
          begin: /'/,
          end: /'/
        },
        {
          begin: /@'/,
          end: /^'@/
        }
      ]
    };
    const PS_HELPTAGS = {
      className: "doctag",
      variants: [
        /* no paramater help tags */
        { begin: /\.(synopsis|description|example|inputs|outputs|notes|link|component|role|functionality)/ },
        /* one parameter help tags */
        { begin: /\.(parameter|forwardhelptargetname|forwardhelpcategory|remotehelprunspace|externalhelp)\s+\S+/ }
      ]
    };
    const PS_COMMENT = hljs.inherit(
      hljs.COMMENT(null, null),
      {
        variants: [
          /* single-line comment */
          {
            begin: /#/,
            end: /$/
          },
          /* multi-line comment */
          {
            begin: /<#/,
            end: /#>/
          }
        ],
        contains: [PS_HELPTAGS]
      }
    );
    const CMDLETS = {
      className: "built_in",
      variants: [{ begin: "(".concat(VALID_VERBS, ")+(-)[\\w\\d]+") }]
    };
    const PS_CLASS = {
      className: "class",
      beginKeywords: "class enum",
      end: /\s*[{]/,
      excludeEnd: true,
      relevance: 0,
      contains: [hljs.TITLE_MODE]
    };
    const PS_FUNCTION = {
      className: "function",
      begin: /function\s+/,
      end: /\s*\{|$/,
      excludeEnd: true,
      returnBegin: true,
      relevance: 0,
      contains: [
        {
          begin: "function",
          relevance: 0,
          className: "keyword"
        },
        {
          className: "title",
          begin: TITLE_NAME_RE,
          relevance: 0
        },
        {
          begin: /\(/,
          end: /\)/,
          className: "params",
          relevance: 0,
          contains: [VAR]
        }
        // CMDLETS
      ]
    };
    const PS_USING = {
      begin: /using\s/,
      end: /$/,
      returnBegin: true,
      contains: [
        QUOTE_STRING,
        APOS_STRING,
        {
          className: "keyword",
          begin: /(using|assembly|command|module|namespace|type)/
        }
      ]
    };
    const PS_ARGUMENTS = { variants: [
      // PS literals are pretty verbose so it's a good idea to accent them a bit.
      {
        className: "operator",
        begin: "(".concat(COMPARISON_OPERATORS, ")\\b")
      },
      {
        className: "literal",
        begin: /(-){1,2}[\w\d-]+/,
        relevance: 0
      }
    ] };
    const HASH_SIGNS = {
      className: "selector-tag",
      begin: /@\B/,
      relevance: 0
    };
    const PS_METHODS = {
      className: "function",
      begin: /\[.*\]\s*[\w]+[ ]??\(/,
      end: /$/,
      returnBegin: true,
      relevance: 0,
      contains: [
        {
          className: "keyword",
          begin: "(".concat(
            KEYWORDS3.keyword.toString().replace(
              /\s/g,
              "|"
            ),
            ")\\b"
          ),
          endsParent: true,
          relevance: 0
        },
        hljs.inherit(hljs.TITLE_MODE, { endsParent: true })
      ]
    };
    const GENTLEMANS_SET = [
      // STATIC_MEMBER,
      PS_METHODS,
      PS_COMMENT,
      BACKTICK_ESCAPE,
      hljs.NUMBER_MODE,
      QUOTE_STRING,
      APOS_STRING,
      // PS_NEW_OBJECT_TYPE,
      CMDLETS,
      VAR,
      LITERAL,
      HASH_SIGNS
    ];
    const PS_TYPE = {
      begin: /\[/,
      end: /\]/,
      excludeBegin: true,
      excludeEnd: true,
      relevance: 0,
      contains: [].concat(
        "self",
        GENTLEMANS_SET,
        {
          begin: "(" + TYPES3.join("|") + ")",
          className: "built_in",
          relevance: 0
        },
        {
          className: "type",
          begin: /[\.\w\d]+/,
          relevance: 0
        }
      )
    };
    PS_METHODS.contains.unshift(PS_TYPE);
    return {
      name: "PowerShell",
      aliases: [
        "pwsh",
        "ps",
        "ps1"
      ],
      case_insensitive: true,
      keywords: KEYWORDS3,
      contains: GENTLEMANS_SET.concat(
        PS_CLASS,
        PS_FUNCTION,
        PS_USING,
        PS_ARGUMENTS,
        PS_TYPE
      )
    };
  }

  // node_modules/highlight.js/es/languages/python.js
  function python(hljs) {
    const regex = hljs.regex;
    const IDENT_RE3 = /[\p{XID_Start}_]\p{XID_Continue}*/u;
    const RESERVED_WORDS = [
      "and",
      "as",
      "assert",
      "async",
      "await",
      "break",
      "case",
      "class",
      "continue",
      "def",
      "del",
      "elif",
      "else",
      "except",
      "finally",
      "for",
      "from",
      "global",
      "if",
      "import",
      "in",
      "is",
      "lambda",
      "match",
      "nonlocal|10",
      "not",
      "or",
      "pass",
      "raise",
      "return",
      "try",
      "while",
      "with",
      "yield"
    ];
    const BUILT_INS3 = [
      "__import__",
      "abs",
      "all",
      "any",
      "ascii",
      "bin",
      "bool",
      "breakpoint",
      "bytearray",
      "bytes",
      "callable",
      "chr",
      "classmethod",
      "compile",
      "complex",
      "delattr",
      "dict",
      "dir",
      "divmod",
      "enumerate",
      "eval",
      "exec",
      "filter",
      "float",
      "format",
      "frozenset",
      "getattr",
      "globals",
      "hasattr",
      "hash",
      "help",
      "hex",
      "id",
      "input",
      "int",
      "isinstance",
      "issubclass",
      "iter",
      "len",
      "list",
      "locals",
      "map",
      "max",
      "memoryview",
      "min",
      "next",
      "object",
      "oct",
      "open",
      "ord",
      "pow",
      "print",
      "property",
      "range",
      "repr",
      "reversed",
      "round",
      "set",
      "setattr",
      "slice",
      "sorted",
      "staticmethod",
      "str",
      "sum",
      "super",
      "tuple",
      "type",
      "vars",
      "zip"
    ];
    const LITERALS3 = [
      "__debug__",
      "Ellipsis",
      "False",
      "None",
      "NotImplemented",
      "True"
    ];
    const TYPES3 = [
      "Any",
      "Callable",
      "Coroutine",
      "Dict",
      "List",
      "Literal",
      "Generic",
      "Optional",
      "Sequence",
      "Set",
      "Tuple",
      "Type",
      "Union"
    ];
    const KEYWORDS3 = {
      $pattern: /[A-Za-z]\w+|__\w+__/,
      keyword: RESERVED_WORDS,
      built_in: BUILT_INS3,
      literal: LITERALS3,
      type: TYPES3
    };
    const PROMPT = {
      className: "meta",
      begin: /^(>>>|\.\.\.) /
    };
    const SUBST = {
      className: "subst",
      begin: /\{/,
      end: /\}/,
      keywords: KEYWORDS3,
      illegal: /#/
    };
    const LITERAL_BRACKET = {
      begin: /\{\{/,
      relevance: 0
    };
    const STRING = {
      className: "string",
      contains: [hljs.BACKSLASH_ESCAPE],
      variants: [
        {
          begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
          end: /'''/,
          contains: [
            hljs.BACKSLASH_ESCAPE,
            PROMPT
          ],
          relevance: 10
        },
        {
          begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
          end: /"""/,
          contains: [
            hljs.BACKSLASH_ESCAPE,
            PROMPT
          ],
          relevance: 10
        },
        {
          begin: /([fF][rR]|[rR][fF]|[fF])'''/,
          end: /'''/,
          contains: [
            hljs.BACKSLASH_ESCAPE,
            PROMPT,
            LITERAL_BRACKET,
            SUBST
          ]
        },
        {
          begin: /([fF][rR]|[rR][fF]|[fF])"""/,
          end: /"""/,
          contains: [
            hljs.BACKSLASH_ESCAPE,
            PROMPT,
            LITERAL_BRACKET,
            SUBST
          ]
        },
        {
          begin: /([uU]|[rR])'/,
          end: /'/,
          relevance: 10
        },
        {
          begin: /([uU]|[rR])"/,
          end: /"/,
          relevance: 10
        },
        {
          begin: /([bB]|[bB][rR]|[rR][bB])'/,
          end: /'/
        },
        {
          begin: /([bB]|[bB][rR]|[rR][bB])"/,
          end: /"/
        },
        {
          begin: /([fF][rR]|[rR][fF]|[fF])'/,
          end: /'/,
          contains: [
            hljs.BACKSLASH_ESCAPE,
            LITERAL_BRACKET,
            SUBST
          ]
        },
        {
          begin: /([fF][rR]|[rR][fF]|[fF])"/,
          end: /"/,
          contains: [
            hljs.BACKSLASH_ESCAPE,
            LITERAL_BRACKET,
            SUBST
          ]
        },
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE
      ]
    };
    const digitpart = "[0-9](_?[0-9])*";
    const pointfloat = `(\\b(${digitpart}))?\\.(${digitpart})|\\b(${digitpart})\\.`;
    const lookahead = `\\b|${RESERVED_WORDS.join("|")}`;
    const NUMBER = {
      className: "number",
      relevance: 0,
      variants: [
        // exponentfloat, pointfloat
        // https://docs.python.org/3.9/reference/lexical_analysis.html#floating-point-literals
        // optionally imaginary
        // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
        // Note: no leading \b because floats can start with a decimal point
        // and we don't want to mishandle e.g. `fn(.5)`,
        // no trailing \b for pointfloat because it can end with a decimal point
        // and we don't want to mishandle e.g. `0..hex()`; this should be safe
        // because both MUST contain a decimal point and so cannot be confused with
        // the interior part of an identifier
        {
          begin: `(\\b(${digitpart})|(${pointfloat}))[eE][+-]?(${digitpart})[jJ]?(?=${lookahead})`
        },
        {
          begin: `(${pointfloat})[jJ]?`
        },
        // decinteger, bininteger, octinteger, hexinteger
        // https://docs.python.org/3.9/reference/lexical_analysis.html#integer-literals
        // optionally "long" in Python 2
        // https://docs.python.org/2.7/reference/lexical_analysis.html#integer-and-long-integer-literals
        // decinteger is optionally imaginary
        // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
        {
          begin: `\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${lookahead})`
        },
        {
          begin: `\\b0[bB](_?[01])+[lL]?(?=${lookahead})`
        },
        {
          begin: `\\b0[oO](_?[0-7])+[lL]?(?=${lookahead})`
        },
        {
          begin: `\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${lookahead})`
        },
        // imagnumber (digitpart-based)
        // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
        {
          begin: `\\b(${digitpart})[jJ](?=${lookahead})`
        }
      ]
    };
    const COMMENT_TYPE = {
      className: "comment",
      begin: regex.lookahead(/# type:/),
      end: /$/,
      keywords: KEYWORDS3,
      contains: [
        {
          // prevent keywords from coloring `type`
          begin: /# type:/
        },
        // comment within a datatype comment includes no keywords
        {
          begin: /#/,
          end: /\b\B/,
          endsWithParent: true
        }
      ]
    };
    const PARAMS = {
      className: "params",
      variants: [
        // Exclude params in functions without params
        {
          className: "",
          begin: /\(\s*\)/,
          skip: true
        },
        {
          begin: /\(/,
          end: /\)/,
          excludeBegin: true,
          excludeEnd: true,
          keywords: KEYWORDS3,
          contains: [
            "self",
            PROMPT,
            NUMBER,
            STRING,
            hljs.HASH_COMMENT_MODE
          ]
        }
      ]
    };
    SUBST.contains = [
      STRING,
      NUMBER,
      PROMPT
    ];
    return {
      name: "Python",
      aliases: [
        "py",
        "gyp",
        "ipython"
      ],
      unicodeRegex: true,
      keywords: KEYWORDS3,
      illegal: /(<\/|\?)|=>/,
      contains: [
        PROMPT,
        NUMBER,
        {
          // very common convention
          scope: "variable.language",
          match: /\bself\b/
        },
        {
          // eat "if" prior to string so that it won't accidentally be
          // labeled as an f-string
          beginKeywords: "if",
          relevance: 0
        },
        { match: /\bor\b/, scope: "keyword" },
        STRING,
        COMMENT_TYPE,
        hljs.HASH_COMMENT_MODE,
        {
          match: [
            /\bdef/,
            /\s+/,
            IDENT_RE3
          ],
          scope: {
            1: "keyword",
            3: "title.function"
          },
          contains: [PARAMS]
        },
        {
          variants: [
            {
              match: [
                /\bclass/,
                /\s+/,
                IDENT_RE3,
                /\s*/,
                /\(\s*/,
                IDENT_RE3,
                /\s*\)/
              ]
            },
            {
              match: [
                /\bclass/,
                /\s+/,
                IDENT_RE3
              ]
            }
          ],
          scope: {
            1: "keyword",
            3: "title.class",
            6: "title.class.inherited"
          }
        },
        {
          className: "meta",
          begin: /^[\t ]*@/,
          end: /(?=#)|$/,
          contains: [
            NUMBER,
            PARAMS,
            STRING
          ]
        }
      ]
    };
  }

  // node_modules/highlight.js/es/languages/ruby.js
  function ruby(hljs) {
    const regex = hljs.regex;
    const RUBY_METHOD_RE = "([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)";
    const CLASS_NAME_RE = regex.either(
      /\b([A-Z]+[a-z0-9]+)+/,
      // ends in caps
      /\b([A-Z]+[a-z0-9]+)+[A-Z]+/
    );
    const CLASS_NAME_WITH_NAMESPACE_RE = regex.concat(CLASS_NAME_RE, /(::\w+)*/);
    const PSEUDO_KWS = [
      "include",
      "extend",
      "prepend",
      "public",
      "private",
      "protected",
      "raise",
      "throw"
    ];
    const RUBY_KEYWORDS = {
      "variable.constant": [
        "__FILE__",
        "__LINE__",
        "__ENCODING__"
      ],
      "variable.language": [
        "self",
        "super"
      ],
      keyword: [
        "alias",
        "and",
        "begin",
        "BEGIN",
        "break",
        "case",
        "class",
        "defined",
        "do",
        "else",
        "elsif",
        "end",
        "END",
        "ensure",
        "for",
        "if",
        "in",
        "module",
        "next",
        "not",
        "or",
        "redo",
        "require",
        "rescue",
        "retry",
        "return",
        "then",
        "undef",
        "unless",
        "until",
        "when",
        "while",
        "yield",
        ...PSEUDO_KWS
      ],
      built_in: [
        "proc",
        "lambda",
        "attr_accessor",
        "attr_reader",
        "attr_writer",
        "define_method",
        "private_constant",
        "module_function"
      ],
      literal: [
        "true",
        "false",
        "nil"
      ]
    };
    const YARDOCTAG = {
      className: "doctag",
      begin: "@[A-Za-z]+"
    };
    const IRB_OBJECT = {
      begin: "#<",
      end: ">"
    };
    const COMMENT_MODES = [
      hljs.COMMENT(
        "#",
        "$",
        { contains: [YARDOCTAG] }
      ),
      hljs.COMMENT(
        "^=begin",
        "^=end",
        {
          contains: [YARDOCTAG],
          relevance: 10
        }
      ),
      hljs.COMMENT("^__END__", hljs.MATCH_NOTHING_RE)
    ];
    const SUBST = {
      className: "subst",
      begin: /#\{/,
      end: /\}/,
      keywords: RUBY_KEYWORDS
    };
    const STRING = {
      className: "string",
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ],
      variants: [
        {
          begin: /'/,
          end: /'/
        },
        {
          begin: /"/,
          end: /"/
        },
        {
          begin: /`/,
          end: /`/
        },
        {
          begin: /%[qQwWx]?\(/,
          end: /\)/
        },
        {
          begin: /%[qQwWx]?\[/,
          end: /\]/
        },
        {
          begin: /%[qQwWx]?\{/,
          end: /\}/
        },
        {
          begin: /%[qQwWx]?</,
          end: />/
        },
        {
          begin: /%[qQwWx]?\//,
          end: /\//
        },
        {
          begin: /%[qQwWx]?%/,
          end: /%/
        },
        {
          begin: /%[qQwWx]?-/,
          end: /-/
        },
        {
          begin: /%[qQwWx]?\|/,
          end: /\|/
        },
        // in the following expressions, \B in the beginning suppresses recognition of ?-sequences
        // where ? is the last character of a preceding identifier, as in: `func?4`
        { begin: /\B\?(\\\d{1,3})/ },
        { begin: /\B\?(\\x[A-Fa-f0-9]{1,2})/ },
        { begin: /\B\?(\\u\{?[A-Fa-f0-9]{1,6}\}?)/ },
        { begin: /\B\?(\\M-\\C-|\\M-\\c|\\c\\M-|\\M-|\\C-\\M-)[\x20-\x7e]/ },
        { begin: /\B\?\\(c|C-)[\x20-\x7e]/ },
        { begin: /\B\?\\?\S/ },
        // heredocs
        {
          // this guard makes sure that we have an entire heredoc and not a false
          // positive (auto-detect, etc.)
          begin: regex.concat(
            /<<[-~]?'?/,
            regex.lookahead(/(\w+)(?=\W)[^\n]*\n(?:[^\n]*\n)*?\s*\1\b/)
          ),
          contains: [
            hljs.END_SAME_AS_BEGIN({
              begin: /(\w+)/,
              end: /(\w+)/,
              contains: [
                hljs.BACKSLASH_ESCAPE,
                SUBST
              ]
            })
          ]
        }
      ]
    };
    const decimal = "[1-9](_?[0-9])*|0";
    const digits = "[0-9](_?[0-9])*";
    const NUMBER = {
      className: "number",
      relevance: 0,
      variants: [
        // decimal integer/float, optionally exponential or rational, optionally imaginary
        { begin: `\\b(${decimal})(\\.(${digits}))?([eE][+-]?(${digits})|r)?i?\\b` },
        // explicit decimal/binary/octal/hexadecimal integer,
        // optionally rational and/or imaginary
        { begin: "\\b0[dD][0-9](_?[0-9])*r?i?\\b" },
        { begin: "\\b0[bB][0-1](_?[0-1])*r?i?\\b" },
        { begin: "\\b0[oO][0-7](_?[0-7])*r?i?\\b" },
        { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*r?i?\\b" },
        // 0-prefixed implicit octal integer, optionally rational and/or imaginary
        { begin: "\\b0(_?[0-7])+r?i?\\b" }
      ]
    };
    const PARAMS = {
      variants: [
        {
          match: /\(\)/
        },
        {
          className: "params",
          begin: /\(/,
          end: /(?=\))/,
          excludeBegin: true,
          endsParent: true,
          keywords: RUBY_KEYWORDS
        }
      ]
    };
    const INCLUDE_EXTEND = {
      match: [
        /(include|extend)\s+/,
        CLASS_NAME_WITH_NAMESPACE_RE
      ],
      scope: {
        2: "title.class"
      },
      keywords: RUBY_KEYWORDS
    };
    const CLASS_DEFINITION = {
      variants: [
        {
          match: [
            /class\s+/,
            CLASS_NAME_WITH_NAMESPACE_RE,
            /\s+<\s+/,
            CLASS_NAME_WITH_NAMESPACE_RE
          ]
        },
        {
          match: [
            /\b(class|module)\s+/,
            CLASS_NAME_WITH_NAMESPACE_RE
          ]
        }
      ],
      scope: {
        2: "title.class",
        4: "title.class.inherited"
      },
      keywords: RUBY_KEYWORDS
    };
    const UPPER_CASE_CONSTANT = {
      relevance: 0,
      match: /\b[A-Z][A-Z_0-9]+\b/,
      className: "variable.constant"
    };
    const METHOD_DEFINITION = {
      match: [
        /def/,
        /\s+/,
        RUBY_METHOD_RE
      ],
      scope: {
        1: "keyword",
        3: "title.function"
      },
      contains: [
        PARAMS
      ]
    };
    const OBJECT_CREATION = {
      relevance: 0,
      match: [
        CLASS_NAME_WITH_NAMESPACE_RE,
        /\.new[. (]/
      ],
      scope: {
        1: "title.class"
      }
    };
    const CLASS_REFERENCE = {
      relevance: 0,
      match: CLASS_NAME_RE,
      scope: "title.class"
    };
    const RUBY_DEFAULT_CONTAINS = [
      STRING,
      CLASS_DEFINITION,
      INCLUDE_EXTEND,
      OBJECT_CREATION,
      UPPER_CASE_CONSTANT,
      CLASS_REFERENCE,
      METHOD_DEFINITION,
      {
        // swallow namespace qualifiers before symbols
        begin: hljs.IDENT_RE + "::"
      },
      {
        className: "symbol",
        begin: hljs.UNDERSCORE_IDENT_RE + "(!|\\?)?:",
        relevance: 0
      },
      {
        className: "symbol",
        begin: ":(?!\\s)",
        contains: [
          STRING,
          { begin: RUBY_METHOD_RE }
        ],
        relevance: 0
      },
      NUMBER,
      {
        // negative-look forward attempts to prevent false matches like:
        // @ident@ or $ident$ that might indicate this is not ruby at all
        className: "variable",
        begin: `(\\$\\W)|((\\$|@@?)(\\w+))(?=[^@$?])(?![A-Za-z])(?![@$?'])`
      },
      {
        className: "params",
        begin: /\|(?!=)/,
        end: /\|/,
        excludeBegin: true,
        excludeEnd: true,
        relevance: 0,
        // this could be a lot of things (in other languages) other than params
        keywords: RUBY_KEYWORDS
      },
      {
        // regexp container
        begin: "(" + hljs.RE_STARTERS_RE + "|unless)\\s*",
        keywords: "unless",
        contains: [
          {
            className: "regexp",
            contains: [
              hljs.BACKSLASH_ESCAPE,
              SUBST
            ],
            illegal: /\n/,
            variants: [
              {
                begin: "/",
                end: "/[a-z]*"
              },
              {
                begin: /%r\{/,
                end: /\}[a-z]*/
              },
              {
                begin: "%r\\(",
                end: "\\)[a-z]*"
              },
              {
                begin: "%r!",
                end: "![a-z]*"
              },
              {
                begin: "%r\\[",
                end: "\\][a-z]*"
              }
            ]
          }
        ].concat(IRB_OBJECT, COMMENT_MODES),
        relevance: 0
      }
    ].concat(IRB_OBJECT, COMMENT_MODES);
    SUBST.contains = RUBY_DEFAULT_CONTAINS;
    PARAMS.contains = RUBY_DEFAULT_CONTAINS;
    const SIMPLE_PROMPT = "[>?]>";
    const DEFAULT_PROMPT = "[\\w#]+\\(\\w+\\):\\d+:\\d+[>*]";
    const RVM_PROMPT = "(\\w+-)?\\d+\\.\\d+\\.\\d+(p\\d+)?[^\\d][^>]+>";
    const IRB_DEFAULT = [
      {
        begin: /^\s*=>/,
        starts: {
          end: "$",
          contains: RUBY_DEFAULT_CONTAINS
        }
      },
      {
        className: "meta.prompt",
        begin: "^(" + SIMPLE_PROMPT + "|" + DEFAULT_PROMPT + "|" + RVM_PROMPT + ")(?=[ ])",
        starts: {
          end: "$",
          keywords: RUBY_KEYWORDS,
          contains: RUBY_DEFAULT_CONTAINS
        }
      }
    ];
    COMMENT_MODES.unshift(IRB_OBJECT);
    return {
      name: "Ruby",
      aliases: [
        "rb",
        "gemspec",
        "podspec",
        "thor",
        "irb"
      ],
      keywords: RUBY_KEYWORDS,
      illegal: /\/\*/,
      contains: [hljs.SHEBANG({ binary: "ruby" })].concat(IRB_DEFAULT).concat(COMMENT_MODES).concat(RUBY_DEFAULT_CONTAINS)
    };
  }

  // node_modules/highlight.js/es/languages/rust.js
  function rust(hljs) {
    const regex = hljs.regex;
    const RAW_IDENTIFIER = /(r#)?/;
    const UNDERSCORE_IDENT_RE = regex.concat(RAW_IDENTIFIER, hljs.UNDERSCORE_IDENT_RE);
    const IDENT_RE3 = regex.concat(RAW_IDENTIFIER, hljs.IDENT_RE);
    const FUNCTION_INVOKE = {
      className: "title.function.invoke",
      relevance: 0,
      begin: regex.concat(
        /\b/,
        /(?!let|for|while|if|else|match\b)/,
        IDENT_RE3,
        regex.lookahead(/\s*\(/)
      )
    };
    const NUMBER_SUFFIX = "([ui](8|16|32|64|128|size)|f(32|64))?";
    const KEYWORDS3 = [
      "abstract",
      "as",
      "async",
      "await",
      "become",
      "box",
      "break",
      "const",
      "continue",
      "crate",
      "do",
      "dyn",
      "else",
      "enum",
      "extern",
      "false",
      "final",
      "fn",
      "for",
      "if",
      "impl",
      "in",
      "let",
      "loop",
      "macro",
      "match",
      "mod",
      "move",
      "mut",
      "override",
      "priv",
      "pub",
      "ref",
      "return",
      "self",
      "Self",
      "static",
      "struct",
      "super",
      "trait",
      "true",
      "try",
      "type",
      "typeof",
      "union",
      "unsafe",
      "unsized",
      "use",
      "virtual",
      "where",
      "while",
      "yield"
    ];
    const LITERALS3 = [
      "true",
      "false",
      "Some",
      "None",
      "Ok",
      "Err"
    ];
    const BUILTINS = [
      // functions
      "drop ",
      // traits
      "Copy",
      "Send",
      "Sized",
      "Sync",
      "Drop",
      "Fn",
      "FnMut",
      "FnOnce",
      "ToOwned",
      "Clone",
      "Debug",
      "PartialEq",
      "PartialOrd",
      "Eq",
      "Ord",
      "AsRef",
      "AsMut",
      "Into",
      "From",
      "Default",
      "Iterator",
      "Extend",
      "IntoIterator",
      "DoubleEndedIterator",
      "ExactSizeIterator",
      "SliceConcatExt",
      "ToString",
      // macros
      "assert!",
      "assert_eq!",
      "bitflags!",
      "bytes!",
      "cfg!",
      "col!",
      "concat!",
      "concat_idents!",
      "debug_assert!",
      "debug_assert_eq!",
      "env!",
      "eprintln!",
      "panic!",
      "file!",
      "format!",
      "format_args!",
      "include_bytes!",
      "include_str!",
      "line!",
      "local_data_key!",
      "module_path!",
      "option_env!",
      "print!",
      "println!",
      "select!",
      "stringify!",
      "try!",
      "unimplemented!",
      "unreachable!",
      "vec!",
      "write!",
      "writeln!",
      "macro_rules!",
      "assert_ne!",
      "debug_assert_ne!"
    ];
    const TYPES3 = [
      "i8",
      "i16",
      "i32",
      "i64",
      "i128",
      "isize",
      "u8",
      "u16",
      "u32",
      "u64",
      "u128",
      "usize",
      "f32",
      "f64",
      "str",
      "char",
      "bool",
      "Box",
      "Option",
      "Result",
      "String",
      "Vec"
    ];
    return {
      name: "Rust",
      aliases: ["rs"],
      keywords: {
        $pattern: hljs.IDENT_RE + "!?",
        type: TYPES3,
        keyword: KEYWORDS3,
        literal: LITERALS3,
        built_in: BUILTINS
      },
      illegal: "</",
      contains: [
        hljs.C_LINE_COMMENT_MODE,
        hljs.COMMENT("/\\*", "\\*/", { contains: ["self"] }),
        hljs.inherit(hljs.QUOTE_STRING_MODE, {
          begin: /b?"/,
          illegal: null
        }),
        {
          className: "symbol",
          // negative lookahead to avoid matching `'`
          begin: /'[a-zA-Z_][a-zA-Z0-9_]*(?!')/
        },
        {
          scope: "string",
          variants: [
            { begin: /b?r(#*)"(.|\n)*?"\1(?!#)/ },
            {
              begin: /b?'/,
              end: /'/,
              contains: [
                {
                  scope: "char.escape",
                  match: /\\('|\w|x\w{2}|u\w{4}|U\w{8})/
                }
              ]
            }
          ]
        },
        {
          className: "number",
          variants: [
            { begin: "\\b0b([01_]+)" + NUMBER_SUFFIX },
            { begin: "\\b0o([0-7_]+)" + NUMBER_SUFFIX },
            { begin: "\\b0x([A-Fa-f0-9_]+)" + NUMBER_SUFFIX },
            { begin: "\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)" + NUMBER_SUFFIX }
          ],
          relevance: 0
        },
        {
          begin: [
            /fn/,
            /\s+/,
            UNDERSCORE_IDENT_RE
          ],
          className: {
            1: "keyword",
            3: "title.function"
          }
        },
        {
          className: "meta",
          begin: "#!?\\[",
          end: "\\]",
          contains: [
            {
              className: "string",
              begin: /"/,
              end: /"/,
              contains: [
                hljs.BACKSLASH_ESCAPE
              ]
            }
          ]
        },
        {
          begin: [
            /let/,
            /\s+/,
            /(?:mut\s+)?/,
            UNDERSCORE_IDENT_RE
          ],
          className: {
            1: "keyword",
            3: "keyword",
            4: "variable"
          }
        },
        // must come before impl/for rule later
        {
          begin: [
            /for/,
            /\s+/,
            UNDERSCORE_IDENT_RE,
            /\s+/,
            /in/
          ],
          className: {
            1: "keyword",
            3: "variable",
            5: "keyword"
          }
        },
        {
          begin: [
            /type/,
            /\s+/,
            UNDERSCORE_IDENT_RE
          ],
          className: {
            1: "keyword",
            3: "title.class"
          }
        },
        {
          begin: [
            /(?:trait|enum|struct|union|impl|for)/,
            /\s+/,
            UNDERSCORE_IDENT_RE
          ],
          className: {
            1: "keyword",
            3: "title.class"
          }
        },
        {
          begin: hljs.IDENT_RE + "::",
          keywords: {
            keyword: "Self",
            built_in: BUILTINS,
            type: TYPES3
          }
        },
        {
          className: "punctuation",
          begin: "->"
        },
        FUNCTION_INVOKE
      ]
    };
  }

  // node_modules/highlight.js/es/languages/scss.js
  var MODES3 = (hljs) => {
    return {
      IMPORTANT: {
        scope: "meta",
        begin: "!important"
      },
      BLOCK_COMMENT: hljs.C_BLOCK_COMMENT_MODE,
      HEXCOLOR: {
        scope: "number",
        begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
      },
      FUNCTION_DISPATCH: {
        className: "built_in",
        begin: /[\w-]+(?=\()/
      },
      ATTRIBUTE_SELECTOR_MODE: {
        scope: "selector-attr",
        begin: /\[/,
        end: /\]/,
        illegal: "$",
        contains: [
          hljs.APOS_STRING_MODE,
          hljs.QUOTE_STRING_MODE
        ]
      },
      CSS_NUMBER_MODE: {
        scope: "number",
        begin: hljs.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
        relevance: 0
      },
      CSS_VARIABLE: {
        className: "attr",
        begin: /--[A-Za-z_][A-Za-z0-9_-]*/
      }
    };
  };
  var HTML_TAGS3 = [
    "a",
    "abbr",
    "address",
    "article",
    "aside",
    "audio",
    "b",
    "blockquote",
    "body",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "dd",
    "del",
    "details",
    "dfn",
    "div",
    "dl",
    "dt",
    "em",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hgroup",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "legend",
    "li",
    "main",
    "mark",
    "menu",
    "nav",
    "object",
    "ol",
    "optgroup",
    "option",
    "p",
    "picture",
    "q",
    "quote",
    "samp",
    "section",
    "select",
    "source",
    "span",
    "strong",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "tr",
    "ul",
    "var",
    "video"
  ];
  var SVG_TAGS3 = [
    "defs",
    "g",
    "marker",
    "mask",
    "pattern",
    "svg",
    "switch",
    "symbol",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feFlood",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMorphology",
    "feOffset",
    "feSpecularLighting",
    "feTile",
    "feTurbulence",
    "linearGradient",
    "radialGradient",
    "stop",
    "circle",
    "ellipse",
    "image",
    "line",
    "path",
    "polygon",
    "polyline",
    "rect",
    "text",
    "use",
    "textPath",
    "tspan",
    "foreignObject",
    "clipPath"
  ];
  var TAGS3 = [
    ...HTML_TAGS3,
    ...SVG_TAGS3
  ];
  var MEDIA_FEATURES3 = [
    "any-hover",
    "any-pointer",
    "aspect-ratio",
    "color",
    "color-gamut",
    "color-index",
    "device-aspect-ratio",
    "device-height",
    "device-width",
    "display-mode",
    "forced-colors",
    "grid",
    "height",
    "hover",
    "inverted-colors",
    "monochrome",
    "orientation",
    "overflow-block",
    "overflow-inline",
    "pointer",
    "prefers-color-scheme",
    "prefers-contrast",
    "prefers-reduced-motion",
    "prefers-reduced-transparency",
    "resolution",
    "scan",
    "scripting",
    "update",
    "width",
    // TODO: find a better solution?
    "min-width",
    "max-width",
    "min-height",
    "max-height"
  ].sort().reverse();
  var PSEUDO_CLASSES3 = [
    "active",
    "any-link",
    "blank",
    "checked",
    "current",
    "default",
    "defined",
    "dir",
    // dir()
    "disabled",
    "drop",
    "empty",
    "enabled",
    "first",
    "first-child",
    "first-of-type",
    "fullscreen",
    "future",
    "focus",
    "focus-visible",
    "focus-within",
    "has",
    // has()
    "host",
    // host or host()
    "host-context",
    // host-context()
    "hover",
    "indeterminate",
    "in-range",
    "invalid",
    "is",
    // is()
    "lang",
    // lang()
    "last-child",
    "last-of-type",
    "left",
    "link",
    "local-link",
    "not",
    // not()
    "nth-child",
    // nth-child()
    "nth-col",
    // nth-col()
    "nth-last-child",
    // nth-last-child()
    "nth-last-col",
    // nth-last-col()
    "nth-last-of-type",
    //nth-last-of-type()
    "nth-of-type",
    //nth-of-type()
    "only-child",
    "only-of-type",
    "optional",
    "out-of-range",
    "past",
    "placeholder-shown",
    "read-only",
    "read-write",
    "required",
    "right",
    "root",
    "scope",
    "target",
    "target-within",
    "user-invalid",
    "valid",
    "visited",
    "where"
    // where()
  ].sort().reverse();
  var PSEUDO_ELEMENTS3 = [
    "after",
    "backdrop",
    "before",
    "cue",
    "cue-region",
    "first-letter",
    "first-line",
    "grammar-error",
    "marker",
    "part",
    "placeholder",
    "selection",
    "slotted",
    "spelling-error"
  ].sort().reverse();
  var ATTRIBUTES3 = [
    "accent-color",
    "align-content",
    "align-items",
    "align-self",
    "alignment-baseline",
    "all",
    "anchor-name",
    "animation",
    "animation-composition",
    "animation-delay",
    "animation-direction",
    "animation-duration",
    "animation-fill-mode",
    "animation-iteration-count",
    "animation-name",
    "animation-play-state",
    "animation-range",
    "animation-range-end",
    "animation-range-start",
    "animation-timeline",
    "animation-timing-function",
    "appearance",
    "aspect-ratio",
    "backdrop-filter",
    "backface-visibility",
    "background",
    "background-attachment",
    "background-blend-mode",
    "background-clip",
    "background-color",
    "background-image",
    "background-origin",
    "background-position",
    "background-position-x",
    "background-position-y",
    "background-repeat",
    "background-size",
    "baseline-shift",
    "block-size",
    "border",
    "border-block",
    "border-block-color",
    "border-block-end",
    "border-block-end-color",
    "border-block-end-style",
    "border-block-end-width",
    "border-block-start",
    "border-block-start-color",
    "border-block-start-style",
    "border-block-start-width",
    "border-block-style",
    "border-block-width",
    "border-bottom",
    "border-bottom-color",
    "border-bottom-left-radius",
    "border-bottom-right-radius",
    "border-bottom-style",
    "border-bottom-width",
    "border-collapse",
    "border-color",
    "border-end-end-radius",
    "border-end-start-radius",
    "border-image",
    "border-image-outset",
    "border-image-repeat",
    "border-image-slice",
    "border-image-source",
    "border-image-width",
    "border-inline",
    "border-inline-color",
    "border-inline-end",
    "border-inline-end-color",
    "border-inline-end-style",
    "border-inline-end-width",
    "border-inline-start",
    "border-inline-start-color",
    "border-inline-start-style",
    "border-inline-start-width",
    "border-inline-style",
    "border-inline-width",
    "border-left",
    "border-left-color",
    "border-left-style",
    "border-left-width",
    "border-radius",
    "border-right",
    "border-right-color",
    "border-right-style",
    "border-right-width",
    "border-spacing",
    "border-start-end-radius",
    "border-start-start-radius",
    "border-style",
    "border-top",
    "border-top-color",
    "border-top-left-radius",
    "border-top-right-radius",
    "border-top-style",
    "border-top-width",
    "border-width",
    "bottom",
    "box-align",
    "box-decoration-break",
    "box-direction",
    "box-flex",
    "box-flex-group",
    "box-lines",
    "box-ordinal-group",
    "box-orient",
    "box-pack",
    "box-shadow",
    "box-sizing",
    "break-after",
    "break-before",
    "break-inside",
    "caption-side",
    "caret-color",
    "clear",
    "clip",
    "clip-path",
    "clip-rule",
    "color",
    "color-interpolation",
    "color-interpolation-filters",
    "color-profile",
    "color-rendering",
    "color-scheme",
    "column-count",
    "column-fill",
    "column-gap",
    "column-rule",
    "column-rule-color",
    "column-rule-style",
    "column-rule-width",
    "column-span",
    "column-width",
    "columns",
    "contain",
    "contain-intrinsic-block-size",
    "contain-intrinsic-height",
    "contain-intrinsic-inline-size",
    "contain-intrinsic-size",
    "contain-intrinsic-width",
    "container",
    "container-name",
    "container-type",
    "content",
    "content-visibility",
    "counter-increment",
    "counter-reset",
    "counter-set",
    "cue",
    "cue-after",
    "cue-before",
    "cursor",
    "cx",
    "cy",
    "direction",
    "display",
    "dominant-baseline",
    "empty-cells",
    "enable-background",
    "field-sizing",
    "fill",
    "fill-opacity",
    "fill-rule",
    "filter",
    "flex",
    "flex-basis",
    "flex-direction",
    "flex-flow",
    "flex-grow",
    "flex-shrink",
    "flex-wrap",
    "float",
    "flood-color",
    "flood-opacity",
    "flow",
    "font",
    "font-display",
    "font-family",
    "font-feature-settings",
    "font-kerning",
    "font-language-override",
    "font-optical-sizing",
    "font-palette",
    "font-size",
    "font-size-adjust",
    "font-smooth",
    "font-smoothing",
    "font-stretch",
    "font-style",
    "font-synthesis",
    "font-synthesis-position",
    "font-synthesis-small-caps",
    "font-synthesis-style",
    "font-synthesis-weight",
    "font-variant",
    "font-variant-alternates",
    "font-variant-caps",
    "font-variant-east-asian",
    "font-variant-emoji",
    "font-variant-ligatures",
    "font-variant-numeric",
    "font-variant-position",
    "font-variation-settings",
    "font-weight",
    "forced-color-adjust",
    "gap",
    "glyph-orientation-horizontal",
    "glyph-orientation-vertical",
    "grid",
    "grid-area",
    "grid-auto-columns",
    "grid-auto-flow",
    "grid-auto-rows",
    "grid-column",
    "grid-column-end",
    "grid-column-start",
    "grid-gap",
    "grid-row",
    "grid-row-end",
    "grid-row-start",
    "grid-template",
    "grid-template-areas",
    "grid-template-columns",
    "grid-template-rows",
    "hanging-punctuation",
    "height",
    "hyphenate-character",
    "hyphenate-limit-chars",
    "hyphens",
    "icon",
    "image-orientation",
    "image-rendering",
    "image-resolution",
    "ime-mode",
    "initial-letter",
    "initial-letter-align",
    "inline-size",
    "inset",
    "inset-area",
    "inset-block",
    "inset-block-end",
    "inset-block-start",
    "inset-inline",
    "inset-inline-end",
    "inset-inline-start",
    "isolation",
    "justify-content",
    "justify-items",
    "justify-self",
    "kerning",
    "left",
    "letter-spacing",
    "lighting-color",
    "line-break",
    "line-height",
    "line-height-step",
    "list-style",
    "list-style-image",
    "list-style-position",
    "list-style-type",
    "margin",
    "margin-block",
    "margin-block-end",
    "margin-block-start",
    "margin-bottom",
    "margin-inline",
    "margin-inline-end",
    "margin-inline-start",
    "margin-left",
    "margin-right",
    "margin-top",
    "margin-trim",
    "marker",
    "marker-end",
    "marker-mid",
    "marker-start",
    "marks",
    "mask",
    "mask-border",
    "mask-border-mode",
    "mask-border-outset",
    "mask-border-repeat",
    "mask-border-slice",
    "mask-border-source",
    "mask-border-width",
    "mask-clip",
    "mask-composite",
    "mask-image",
    "mask-mode",
    "mask-origin",
    "mask-position",
    "mask-repeat",
    "mask-size",
    "mask-type",
    "masonry-auto-flow",
    "math-depth",
    "math-shift",
    "math-style",
    "max-block-size",
    "max-height",
    "max-inline-size",
    "max-width",
    "min-block-size",
    "min-height",
    "min-inline-size",
    "min-width",
    "mix-blend-mode",
    "nav-down",
    "nav-index",
    "nav-left",
    "nav-right",
    "nav-up",
    "none",
    "normal",
    "object-fit",
    "object-position",
    "offset",
    "offset-anchor",
    "offset-distance",
    "offset-path",
    "offset-position",
    "offset-rotate",
    "opacity",
    "order",
    "orphans",
    "outline",
    "outline-color",
    "outline-offset",
    "outline-style",
    "outline-width",
    "overflow",
    "overflow-anchor",
    "overflow-block",
    "overflow-clip-margin",
    "overflow-inline",
    "overflow-wrap",
    "overflow-x",
    "overflow-y",
    "overlay",
    "overscroll-behavior",
    "overscroll-behavior-block",
    "overscroll-behavior-inline",
    "overscroll-behavior-x",
    "overscroll-behavior-y",
    "padding",
    "padding-block",
    "padding-block-end",
    "padding-block-start",
    "padding-bottom",
    "padding-inline",
    "padding-inline-end",
    "padding-inline-start",
    "padding-left",
    "padding-right",
    "padding-top",
    "page",
    "page-break-after",
    "page-break-before",
    "page-break-inside",
    "paint-order",
    "pause",
    "pause-after",
    "pause-before",
    "perspective",
    "perspective-origin",
    "place-content",
    "place-items",
    "place-self",
    "pointer-events",
    "position",
    "position-anchor",
    "position-visibility",
    "print-color-adjust",
    "quotes",
    "r",
    "resize",
    "rest",
    "rest-after",
    "rest-before",
    "right",
    "rotate",
    "row-gap",
    "ruby-align",
    "ruby-position",
    "scale",
    "scroll-behavior",
    "scroll-margin",
    "scroll-margin-block",
    "scroll-margin-block-end",
    "scroll-margin-block-start",
    "scroll-margin-bottom",
    "scroll-margin-inline",
    "scroll-margin-inline-end",
    "scroll-margin-inline-start",
    "scroll-margin-left",
    "scroll-margin-right",
    "scroll-margin-top",
    "scroll-padding",
    "scroll-padding-block",
    "scroll-padding-block-end",
    "scroll-padding-block-start",
    "scroll-padding-bottom",
    "scroll-padding-inline",
    "scroll-padding-inline-end",
    "scroll-padding-inline-start",
    "scroll-padding-left",
    "scroll-padding-right",
    "scroll-padding-top",
    "scroll-snap-align",
    "scroll-snap-stop",
    "scroll-snap-type",
    "scroll-timeline",
    "scroll-timeline-axis",
    "scroll-timeline-name",
    "scrollbar-color",
    "scrollbar-gutter",
    "scrollbar-width",
    "shape-image-threshold",
    "shape-margin",
    "shape-outside",
    "shape-rendering",
    "speak",
    "speak-as",
    "src",
    // @font-face
    "stop-color",
    "stop-opacity",
    "stroke",
    "stroke-dasharray",
    "stroke-dashoffset",
    "stroke-linecap",
    "stroke-linejoin",
    "stroke-miterlimit",
    "stroke-opacity",
    "stroke-width",
    "tab-size",
    "table-layout",
    "text-align",
    "text-align-all",
    "text-align-last",
    "text-anchor",
    "text-combine-upright",
    "text-decoration",
    "text-decoration-color",
    "text-decoration-line",
    "text-decoration-skip",
    "text-decoration-skip-ink",
    "text-decoration-style",
    "text-decoration-thickness",
    "text-emphasis",
    "text-emphasis-color",
    "text-emphasis-position",
    "text-emphasis-style",
    "text-indent",
    "text-justify",
    "text-orientation",
    "text-overflow",
    "text-rendering",
    "text-shadow",
    "text-size-adjust",
    "text-transform",
    "text-underline-offset",
    "text-underline-position",
    "text-wrap",
    "text-wrap-mode",
    "text-wrap-style",
    "timeline-scope",
    "top",
    "touch-action",
    "transform",
    "transform-box",
    "transform-origin",
    "transform-style",
    "transition",
    "transition-behavior",
    "transition-delay",
    "transition-duration",
    "transition-property",
    "transition-timing-function",
    "translate",
    "unicode-bidi",
    "user-modify",
    "user-select",
    "vector-effect",
    "vertical-align",
    "view-timeline",
    "view-timeline-axis",
    "view-timeline-inset",
    "view-timeline-name",
    "view-transition-name",
    "visibility",
    "voice-balance",
    "voice-duration",
    "voice-family",
    "voice-pitch",
    "voice-range",
    "voice-rate",
    "voice-stress",
    "voice-volume",
    "white-space",
    "white-space-collapse",
    "widows",
    "width",
    "will-change",
    "word-break",
    "word-spacing",
    "word-wrap",
    "writing-mode",
    "x",
    "y",
    "z-index",
    "zoom"
  ].sort().reverse();
  function scss(hljs) {
    const modes = MODES3(hljs);
    const PSEUDO_ELEMENTS$1 = PSEUDO_ELEMENTS3;
    const PSEUDO_CLASSES$1 = PSEUDO_CLASSES3;
    const AT_IDENTIFIER = "@[a-z-]+";
    const AT_MODIFIERS = "and or not only";
    const IDENT_RE3 = "[a-zA-Z-][a-zA-Z0-9_-]*";
    const VARIABLE = {
      className: "variable",
      begin: "(\\$" + IDENT_RE3 + ")\\b",
      relevance: 0
    };
    return {
      name: "SCSS",
      case_insensitive: true,
      illegal: "[=/|']",
      contains: [
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        // to recognize keyframe 40% etc which are outside the scope of our
        // attribute value mode
        modes.CSS_NUMBER_MODE,
        {
          className: "selector-id",
          begin: "#[A-Za-z0-9_-]+",
          relevance: 0
        },
        {
          className: "selector-class",
          begin: "\\.[A-Za-z0-9_-]+",
          relevance: 0
        },
        modes.ATTRIBUTE_SELECTOR_MODE,
        {
          className: "selector-tag",
          begin: "\\b(" + TAGS3.join("|") + ")\\b",
          // was there, before, but why?
          relevance: 0
        },
        {
          className: "selector-pseudo",
          begin: ":(" + PSEUDO_CLASSES$1.join("|") + ")"
        },
        {
          className: "selector-pseudo",
          begin: ":(:)?(" + PSEUDO_ELEMENTS$1.join("|") + ")"
        },
        VARIABLE,
        {
          // pseudo-selector params
          begin: /\(/,
          end: /\)/,
          contains: [modes.CSS_NUMBER_MODE]
        },
        modes.CSS_VARIABLE,
        {
          className: "attribute",
          begin: "\\b(" + ATTRIBUTES3.join("|") + ")\\b"
        },
        { begin: "\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b" },
        {
          begin: /:/,
          end: /[;}{]/,
          relevance: 0,
          contains: [
            modes.BLOCK_COMMENT,
            VARIABLE,
            modes.HEXCOLOR,
            modes.CSS_NUMBER_MODE,
            hljs.QUOTE_STRING_MODE,
            hljs.APOS_STRING_MODE,
            modes.IMPORTANT,
            modes.FUNCTION_DISPATCH
          ]
        },
        // matching these here allows us to treat them more like regular CSS
        // rules so everything between the {} gets regular rule highlighting,
        // which is what we want for page and font-face
        {
          begin: "@(page|font-face)",
          keywords: {
            $pattern: AT_IDENTIFIER,
            keyword: "@page @font-face"
          }
        },
        {
          begin: "@",
          end: "[{;]",
          returnBegin: true,
          keywords: {
            $pattern: /[a-z-]+/,
            keyword: AT_MODIFIERS,
            attribute: MEDIA_FEATURES3.join(" ")
          },
          contains: [
            {
              begin: AT_IDENTIFIER,
              className: "keyword"
            },
            {
              begin: /[a-z-]+(?=:)/,
              className: "attribute"
            },
            VARIABLE,
            hljs.QUOTE_STRING_MODE,
            hljs.APOS_STRING_MODE,
            modes.HEXCOLOR,
            modes.CSS_NUMBER_MODE
          ]
        },
        modes.FUNCTION_DISPATCH
      ]
    };
  }

  // node_modules/highlight.js/es/languages/shell.js
  function shell(hljs) {
    return {
      name: "Shell Session",
      aliases: [
        "console",
        "shellsession"
      ],
      contains: [
        {
          className: "meta.prompt",
          // We cannot add \s (spaces) in the regular expression otherwise it will be too broad and produce unexpected result.
          // For instance, in the following example, it would match "echo /path/to/home >" as a prompt:
          // echo /path/to/home > t.exe
          begin: /^\s{0,3}[/~\w\d[\]()@-]*[>%$#][ ]?/,
          starts: {
            end: /[^\\](?=\s*$)/,
            subLanguage: "bash"
          }
        }
      ]
    };
  }

  // node_modules/highlight.js/es/languages/sql.js
  function sql(hljs) {
    const regex = hljs.regex;
    const COMMENT_MODE = hljs.COMMENT("--", "$");
    const STRING = {
      scope: "string",
      variants: [
        {
          begin: /'/,
          end: /'/,
          contains: [{ match: /''/ }]
        }
      ]
    };
    const QUOTED_IDENTIFIER = {
      begin: /"/,
      end: /"/,
      contains: [{ match: /""/ }]
    };
    const LITERALS3 = [
      "true",
      "false",
      // Not sure it's correct to call NULL literal, and clauses like IS [NOT] NULL look strange that way.
      // "null",
      "unknown"
    ];
    const MULTI_WORD_TYPES = [
      "double precision",
      "large object",
      "with timezone",
      "without timezone"
    ];
    const TYPES3 = [
      "bigint",
      "binary",
      "blob",
      "boolean",
      "char",
      "character",
      "clob",
      "date",
      "dec",
      "decfloat",
      "decimal",
      "float",
      "int",
      "integer",
      "interval",
      "nchar",
      "nclob",
      "national",
      "numeric",
      "real",
      "row",
      "smallint",
      "time",
      "timestamp",
      "varchar",
      "varying",
      // modifier (character varying)
      "varbinary"
    ];
    const NON_RESERVED_WORDS = [
      "add",
      "asc",
      "collation",
      "desc",
      "final",
      "first",
      "last",
      "view"
    ];
    const RESERVED_WORDS = [
      "abs",
      "acos",
      "all",
      "allocate",
      "alter",
      "and",
      "any",
      "are",
      "array",
      "array_agg",
      "array_max_cardinality",
      "as",
      "asensitive",
      "asin",
      "asymmetric",
      "at",
      "atan",
      "atomic",
      "authorization",
      "avg",
      "begin",
      "begin_frame",
      "begin_partition",
      "between",
      "bigint",
      "binary",
      "blob",
      "boolean",
      "both",
      "by",
      "call",
      "called",
      "cardinality",
      "cascaded",
      "case",
      "cast",
      "ceil",
      "ceiling",
      "char",
      "char_length",
      "character",
      "character_length",
      "check",
      "classifier",
      "clob",
      "close",
      "coalesce",
      "collate",
      "collect",
      "column",
      "commit",
      "condition",
      "connect",
      "constraint",
      "contains",
      "convert",
      "copy",
      "corr",
      "corresponding",
      "cos",
      "cosh",
      "count",
      "covar_pop",
      "covar_samp",
      "create",
      "cross",
      "cube",
      "cume_dist",
      "current",
      "current_catalog",
      "current_date",
      "current_default_transform_group",
      "current_path",
      "current_role",
      "current_row",
      "current_schema",
      "current_time",
      "current_timestamp",
      "current_path",
      "current_role",
      "current_transform_group_for_type",
      "current_user",
      "cursor",
      "cycle",
      "date",
      "day",
      "deallocate",
      "dec",
      "decimal",
      "decfloat",
      "declare",
      "default",
      "define",
      "delete",
      "dense_rank",
      "deref",
      "describe",
      "deterministic",
      "disconnect",
      "distinct",
      "double",
      "drop",
      "dynamic",
      "each",
      "element",
      "else",
      "empty",
      "end",
      "end_frame",
      "end_partition",
      "end-exec",
      "equals",
      "escape",
      "every",
      "except",
      "exec",
      "execute",
      "exists",
      "exp",
      "external",
      "extract",
      "false",
      "fetch",
      "filter",
      "first_value",
      "float",
      "floor",
      "for",
      "foreign",
      "frame_row",
      "free",
      "from",
      "full",
      "function",
      "fusion",
      "get",
      "global",
      "grant",
      "group",
      "grouping",
      "groups",
      "having",
      "hold",
      "hour",
      "identity",
      "in",
      "indicator",
      "initial",
      "inner",
      "inout",
      "insensitive",
      "insert",
      "int",
      "integer",
      "intersect",
      "intersection",
      "interval",
      "into",
      "is",
      "join",
      "json_array",
      "json_arrayagg",
      "json_exists",
      "json_object",
      "json_objectagg",
      "json_query",
      "json_table",
      "json_table_primitive",
      "json_value",
      "lag",
      "language",
      "large",
      "last_value",
      "lateral",
      "lead",
      "leading",
      "left",
      "like",
      "like_regex",
      "listagg",
      "ln",
      "local",
      "localtime",
      "localtimestamp",
      "log",
      "log10",
      "lower",
      "match",
      "match_number",
      "match_recognize",
      "matches",
      "max",
      "member",
      "merge",
      "method",
      "min",
      "minute",
      "mod",
      "modifies",
      "module",
      "month",
      "multiset",
      "national",
      "natural",
      "nchar",
      "nclob",
      "new",
      "no",
      "none",
      "normalize",
      "not",
      "nth_value",
      "ntile",
      "null",
      "nullif",
      "numeric",
      "octet_length",
      "occurrences_regex",
      "of",
      "offset",
      "old",
      "omit",
      "on",
      "one",
      "only",
      "open",
      "or",
      "order",
      "out",
      "outer",
      "over",
      "overlaps",
      "overlay",
      "parameter",
      "partition",
      "pattern",
      "per",
      "percent",
      "percent_rank",
      "percentile_cont",
      "percentile_disc",
      "period",
      "portion",
      "position",
      "position_regex",
      "power",
      "precedes",
      "precision",
      "prepare",
      "primary",
      "procedure",
      "ptf",
      "range",
      "rank",
      "reads",
      "real",
      "recursive",
      "ref",
      "references",
      "referencing",
      "regr_avgx",
      "regr_avgy",
      "regr_count",
      "regr_intercept",
      "regr_r2",
      "regr_slope",
      "regr_sxx",
      "regr_sxy",
      "regr_syy",
      "release",
      "result",
      "return",
      "returns",
      "revoke",
      "right",
      "rollback",
      "rollup",
      "row",
      "row_number",
      "rows",
      "running",
      "savepoint",
      "scope",
      "scroll",
      "search",
      "second",
      "seek",
      "select",
      "sensitive",
      "session_user",
      "set",
      "show",
      "similar",
      "sin",
      "sinh",
      "skip",
      "smallint",
      "some",
      "specific",
      "specifictype",
      "sql",
      "sqlexception",
      "sqlstate",
      "sqlwarning",
      "sqrt",
      "start",
      "static",
      "stddev_pop",
      "stddev_samp",
      "submultiset",
      "subset",
      "substring",
      "substring_regex",
      "succeeds",
      "sum",
      "symmetric",
      "system",
      "system_time",
      "system_user",
      "table",
      "tablesample",
      "tan",
      "tanh",
      "then",
      "time",
      "timestamp",
      "timezone_hour",
      "timezone_minute",
      "to",
      "trailing",
      "translate",
      "translate_regex",
      "translation",
      "treat",
      "trigger",
      "trim",
      "trim_array",
      "true",
      "truncate",
      "uescape",
      "union",
      "unique",
      "unknown",
      "unnest",
      "update",
      "upper",
      "user",
      "using",
      "value",
      "values",
      "value_of",
      "var_pop",
      "var_samp",
      "varbinary",
      "varchar",
      "varying",
      "versioning",
      "when",
      "whenever",
      "where",
      "width_bucket",
      "window",
      "with",
      "within",
      "without",
      "year"
    ];
    const RESERVED_FUNCTIONS = [
      "abs",
      "acos",
      "array_agg",
      "asin",
      "atan",
      "avg",
      "cast",
      "ceil",
      "ceiling",
      "coalesce",
      "corr",
      "cos",
      "cosh",
      "count",
      "covar_pop",
      "covar_samp",
      "cume_dist",
      "dense_rank",
      "deref",
      "element",
      "exp",
      "extract",
      "first_value",
      "floor",
      "json_array",
      "json_arrayagg",
      "json_exists",
      "json_object",
      "json_objectagg",
      "json_query",
      "json_table",
      "json_table_primitive",
      "json_value",
      "lag",
      "last_value",
      "lead",
      "listagg",
      "ln",
      "log",
      "log10",
      "lower",
      "max",
      "min",
      "mod",
      "nth_value",
      "ntile",
      "nullif",
      "percent_rank",
      "percentile_cont",
      "percentile_disc",
      "position",
      "position_regex",
      "power",
      "rank",
      "regr_avgx",
      "regr_avgy",
      "regr_count",
      "regr_intercept",
      "regr_r2",
      "regr_slope",
      "regr_sxx",
      "regr_sxy",
      "regr_syy",
      "row_number",
      "sin",
      "sinh",
      "sqrt",
      "stddev_pop",
      "stddev_samp",
      "substring",
      "substring_regex",
      "sum",
      "tan",
      "tanh",
      "translate",
      "translate_regex",
      "treat",
      "trim",
      "trim_array",
      "unnest",
      "upper",
      "value_of",
      "var_pop",
      "var_samp",
      "width_bucket"
    ];
    const POSSIBLE_WITHOUT_PARENS = [
      "current_catalog",
      "current_date",
      "current_default_transform_group",
      "current_path",
      "current_role",
      "current_schema",
      "current_transform_group_for_type",
      "current_user",
      "session_user",
      "system_time",
      "system_user",
      "current_time",
      "localtime",
      "current_timestamp",
      "localtimestamp"
    ];
    const COMBOS = [
      "create table",
      "insert into",
      "primary key",
      "foreign key",
      "not null",
      "alter table",
      "add constraint",
      "grouping sets",
      "on overflow",
      "character set",
      "respect nulls",
      "ignore nulls",
      "nulls first",
      "nulls last",
      "depth first",
      "breadth first"
    ];
    const FUNCTIONS = RESERVED_FUNCTIONS;
    const KEYWORDS3 = [
      ...RESERVED_WORDS,
      ...NON_RESERVED_WORDS
    ].filter((keyword) => {
      return !RESERVED_FUNCTIONS.includes(keyword);
    });
    const VARIABLE = {
      scope: "variable",
      match: /@[a-z0-9][a-z0-9_]*/
    };
    const OPERATOR = {
      scope: "operator",
      match: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
      relevance: 0
    };
    const FUNCTION_CALL = {
      match: regex.concat(/\b/, regex.either(...FUNCTIONS), /\s*\(/),
      relevance: 0,
      keywords: { built_in: FUNCTIONS }
    };
    function kws_to_regex(list) {
      return regex.concat(
        /\b/,
        regex.either(...list.map((kw) => {
          return kw.replace(/\s+/, "\\s+");
        })),
        /\b/
      );
    }
    const MULTI_WORD_KEYWORDS = {
      scope: "keyword",
      match: kws_to_regex(COMBOS),
      relevance: 0
    };
    function reduceRelevancy(list, {
      exceptions,
      when
    } = {}) {
      const qualifyFn = when;
      exceptions = exceptions || [];
      return list.map((item) => {
        if (item.match(/\|\d+$/) || exceptions.includes(item)) {
          return item;
        } else if (qualifyFn(item)) {
          return `${item}|0`;
        } else {
          return item;
        }
      });
    }
    return {
      name: "SQL",
      case_insensitive: true,
      // does not include {} or HTML tags `</`
      illegal: /[{}]|<\//,
      keywords: {
        $pattern: /\b[\w\.]+/,
        keyword: reduceRelevancy(KEYWORDS3, { when: (x) => x.length < 3 }),
        literal: LITERALS3,
        type: TYPES3,
        built_in: POSSIBLE_WITHOUT_PARENS
      },
      contains: [
        {
          scope: "type",
          match: kws_to_regex(MULTI_WORD_TYPES)
        },
        MULTI_WORD_KEYWORDS,
        FUNCTION_CALL,
        VARIABLE,
        STRING,
        QUOTED_IDENTIFIER,
        hljs.C_NUMBER_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
        COMMENT_MODE,
        OPERATOR
      ]
    };
  }

  // node_modules/highlight.js/es/languages/typescript.js
  var IDENT_RE2 = "[A-Za-z$_][0-9A-Za-z$_]*";
  var KEYWORDS2 = [
    "as",
    // for exports
    "in",
    "of",
    "if",
    "for",
    "while",
    "finally",
    "var",
    "new",
    "function",
    "do",
    "return",
    "void",
    "else",
    "break",
    "catch",
    "instanceof",
    "with",
    "throw",
    "case",
    "default",
    "try",
    "switch",
    "continue",
    "typeof",
    "delete",
    "let",
    "yield",
    "const",
    "class",
    // JS handles these with a special rule
    // "get",
    // "set",
    "debugger",
    "async",
    "await",
    "static",
    "import",
    "from",
    "export",
    "extends",
    // It's reached stage 3, which is "recommended for implementation":
    "using"
  ];
  var LITERALS2 = [
    "true",
    "false",
    "null",
    "undefined",
    "NaN",
    "Infinity"
  ];
  var TYPES2 = [
    // Fundamental objects
    "Object",
    "Function",
    "Boolean",
    "Symbol",
    // numbers and dates
    "Math",
    "Date",
    "Number",
    "BigInt",
    // text
    "String",
    "RegExp",
    // Indexed collections
    "Array",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Int32Array",
    "Uint16Array",
    "Uint32Array",
    "BigInt64Array",
    "BigUint64Array",
    // Keyed collections
    "Set",
    "Map",
    "WeakSet",
    "WeakMap",
    // Structured data
    "ArrayBuffer",
    "SharedArrayBuffer",
    "Atomics",
    "DataView",
    "JSON",
    // Control abstraction objects
    "Promise",
    "Generator",
    "GeneratorFunction",
    "AsyncFunction",
    // Reflection
    "Reflect",
    "Proxy",
    // Internationalization
    "Intl",
    // WebAssembly
    "WebAssembly"
  ];
  var ERROR_TYPES2 = [
    "Error",
    "EvalError",
    "InternalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError"
  ];
  var BUILT_IN_GLOBALS2 = [
    "setInterval",
    "setTimeout",
    "clearInterval",
    "clearTimeout",
    "require",
    "exports",
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "escape",
    "unescape"
  ];
  var BUILT_IN_VARIABLES2 = [
    "arguments",
    "this",
    "super",
    "console",
    "window",
    "document",
    "localStorage",
    "sessionStorage",
    "module",
    "global"
    // Node.js
  ];
  var BUILT_INS2 = [].concat(
    BUILT_IN_GLOBALS2,
    TYPES2,
    ERROR_TYPES2
  );
  function javascript2(hljs) {
    const regex = hljs.regex;
    const hasClosingTag = (match, { after }) => {
      const tag = "</" + match[0].slice(1);
      const pos = match.input.indexOf(tag, after);
      return pos !== -1;
    };
    const IDENT_RE$1 = IDENT_RE2;
    const FRAGMENT = {
      begin: "<>",
      end: "</>"
    };
    const XML_SELF_CLOSING = /<[A-Za-z0-9\\._:-]+\s*\/>/;
    const XML_TAG = {
      begin: /<[A-Za-z0-9\\._:-]+/,
      end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
      /**
       * @param {RegExpMatchArray} match
       * @param {CallbackResponse} response
       */
      isTrulyOpeningTag: (match, response) => {
        const afterMatchIndex = match[0].length + match.index;
        const nextChar = match.input[afterMatchIndex];
        if (
          // HTML should not include another raw `<` inside a tag
          // nested type?
          // `<Array<Array<number>>`, etc.
          nextChar === "<" || // the , gives away that this is not HTML
          // `<T, A extends keyof T, V>`
          nextChar === ","
        ) {
          response.ignoreMatch();
          return;
        }
        if (nextChar === ">") {
          if (!hasClosingTag(match, { after: afterMatchIndex })) {
            response.ignoreMatch();
          }
        }
        let m;
        const afterMatch = match.input.substring(afterMatchIndex);
        if (m = afterMatch.match(/^\s*=/)) {
          response.ignoreMatch();
          return;
        }
        if (m = afterMatch.match(/^\s+extends\s+/)) {
          if (m.index === 0) {
            response.ignoreMatch();
            return;
          }
        }
      }
    };
    const KEYWORDS$1 = {
      $pattern: IDENT_RE2,
      keyword: KEYWORDS2,
      literal: LITERALS2,
      built_in: BUILT_INS2,
      "variable.language": BUILT_IN_VARIABLES2
    };
    const decimalDigits2 = "[0-9](_?[0-9])*";
    const frac2 = `\\.(${decimalDigits2})`;
    const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
    const NUMBER = {
      className: "number",
      variants: [
        // DecimalLiteral
        { begin: `(\\b(${decimalInteger})((${frac2})|\\.)?|(${frac2}))[eE][+-]?(${decimalDigits2})\\b` },
        { begin: `\\b(${decimalInteger})\\b((${frac2})\\b|\\.)?|(${frac2})\\b` },
        // DecimalBigIntegerLiteral
        { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },
        // NonDecimalIntegerLiteral
        { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
        { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
        { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
        // LegacyOctalIntegerLiteral (does not include underscore separators)
        // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
        { begin: "\\b0[0-7]+n?\\b" }
      ],
      relevance: 0
    };
    const SUBST = {
      className: "subst",
      begin: "\\$\\{",
      end: "\\}",
      keywords: KEYWORDS$1,
      contains: []
      // defined later
    };
    const HTML_TEMPLATE = {
      begin: ".?html`",
      end: "",
      starts: {
        end: "`",
        returnEnd: false,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ],
        subLanguage: "xml"
      }
    };
    const CSS_TEMPLATE = {
      begin: ".?css`",
      end: "",
      starts: {
        end: "`",
        returnEnd: false,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ],
        subLanguage: "css"
      }
    };
    const GRAPHQL_TEMPLATE = {
      begin: ".?gql`",
      end: "",
      starts: {
        end: "`",
        returnEnd: false,
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ],
        subLanguage: "graphql"
      }
    };
    const TEMPLATE_STRING = {
      className: "string",
      begin: "`",
      end: "`",
      contains: [
        hljs.BACKSLASH_ESCAPE,
        SUBST
      ]
    };
    const JSDOC_COMMENT = hljs.COMMENT(
      /\/\*\*(?!\/)/,
      "\\*/",
      {
        relevance: 0,
        contains: [
          {
            begin: "(?=@[A-Za-z]+)",
            relevance: 0,
            contains: [
              {
                className: "doctag",
                begin: "@[A-Za-z]+"
              },
              {
                className: "type",
                begin: "\\{",
                end: "\\}",
                excludeEnd: true,
                excludeBegin: true,
                relevance: 0
              },
              {
                className: "variable",
                begin: IDENT_RE$1 + "(?=\\s*(-)|$)",
                endsParent: true,
                relevance: 0
              },
              // eat spaces (not newlines) so we can find
              // types or variables
              {
                begin: /(?=[^\n])\s/,
                relevance: 0
              }
            ]
          }
        ]
      }
    );
    const COMMENT = {
      className: "comment",
      variants: [
        JSDOC_COMMENT,
        hljs.C_BLOCK_COMMENT_MODE,
        hljs.C_LINE_COMMENT_MODE
      ]
    };
    const SUBST_INTERNALS = [
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      HTML_TEMPLATE,
      CSS_TEMPLATE,
      GRAPHQL_TEMPLATE,
      TEMPLATE_STRING,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      NUMBER
      // This is intentional:
      // See https://github.com/highlightjs/highlight.js/issues/3288
      // hljs.REGEXP_MODE
    ];
    SUBST.contains = SUBST_INTERNALS.concat({
      // we need to pair up {} inside our subst to prevent
      // it from ending too early by matching another }
      begin: /\{/,
      end: /\}/,
      keywords: KEYWORDS$1,
      contains: [
        "self"
      ].concat(SUBST_INTERNALS)
    });
    const SUBST_AND_COMMENTS = [].concat(COMMENT, SUBST.contains);
    const PARAMS_CONTAINS = SUBST_AND_COMMENTS.concat([
      // eat recursive parens in sub expressions
      {
        begin: /(\s*)\(/,
        end: /\)/,
        keywords: KEYWORDS$1,
        contains: ["self"].concat(SUBST_AND_COMMENTS)
      }
    ]);
    const PARAMS = {
      className: "params",
      // convert this to negative lookbehind in v12
      begin: /(\s*)\(/,
      // to match the parms with
      end: /\)/,
      excludeBegin: true,
      excludeEnd: true,
      keywords: KEYWORDS$1,
      contains: PARAMS_CONTAINS
    };
    const CLASS_OR_EXTENDS = {
      variants: [
        // class Car extends vehicle
        {
          match: [
            /class/,
            /\s+/,
            IDENT_RE$1,
            /\s+/,
            /extends/,
            /\s+/,
            regex.concat(IDENT_RE$1, "(", regex.concat(/\./, IDENT_RE$1), ")*")
          ],
          scope: {
            1: "keyword",
            3: "title.class",
            5: "keyword",
            7: "title.class.inherited"
          }
        },
        // class Car
        {
          match: [
            /class/,
            /\s+/,
            IDENT_RE$1
          ],
          scope: {
            1: "keyword",
            3: "title.class"
          }
        }
      ]
    };
    const CLASS_REFERENCE = {
      relevance: 0,
      match: regex.either(
        // Hard coded exceptions
        /\bJSON/,
        // Float32Array, OutT
        /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
        // CSSFactory, CSSFactoryT
        /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
        // FPs, FPsT
        /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
        // P
        // single letters are not highlighted
        // BLAH
        // this will be flagged as a UPPER_CASE_CONSTANT instead
      ),
      className: "title.class",
      keywords: {
        _: [
          // se we still get relevance credit for JS library classes
          ...TYPES2,
          ...ERROR_TYPES2
        ]
      }
    };
    const USE_STRICT = {
      label: "use_strict",
      className: "meta",
      relevance: 10,
      begin: /^\s*['"]use (strict|asm)['"]/
    };
    const FUNCTION_DEFINITION = {
      variants: [
        {
          match: [
            /function/,
            /\s+/,
            IDENT_RE$1,
            /(?=\s*\()/
          ]
        },
        // anonymous function
        {
          match: [
            /function/,
            /\s*(?=\()/
          ]
        }
      ],
      className: {
        1: "keyword",
        3: "title.function"
      },
      label: "func.def",
      contains: [PARAMS],
      illegal: /%/
    };
    const UPPER_CASE_CONSTANT = {
      relevance: 0,
      match: /\b[A-Z][A-Z_0-9]+\b/,
      className: "variable.constant"
    };
    function noneOf(list) {
      return regex.concat("(?!", list.join("|"), ")");
    }
    const FUNCTION_CALL = {
      match: regex.concat(
        /\b/,
        noneOf([
          ...BUILT_IN_GLOBALS2,
          "super",
          "import"
        ].map((x) => `${x}\\s*\\(`)),
        IDENT_RE$1,
        regex.lookahead(/\s*\(/)
      ),
      className: "title.function",
      relevance: 0
    };
    const PROPERTY_ACCESS = {
      begin: regex.concat(/\./, regex.lookahead(
        regex.concat(IDENT_RE$1, /(?![0-9A-Za-z$_(])/)
      )),
      end: IDENT_RE$1,
      excludeBegin: true,
      keywords: "prototype",
      className: "property",
      relevance: 0
    };
    const GETTER_OR_SETTER = {
      match: [
        /get|set/,
        /\s+/,
        IDENT_RE$1,
        /(?=\()/
      ],
      className: {
        1: "keyword",
        3: "title.function"
      },
      contains: [
        {
          // eat to avoid empty params
          begin: /\(\)/
        },
        PARAMS
      ]
    };
    const FUNC_LEAD_IN_RE = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + hljs.UNDERSCORE_IDENT_RE + ")\\s*=>";
    const FUNCTION_VARIABLE = {
      match: [
        /const|var|let/,
        /\s+/,
        IDENT_RE$1,
        /\s*/,
        /=\s*/,
        /(async\s*)?/,
        // async is optional
        regex.lookahead(FUNC_LEAD_IN_RE)
      ],
      keywords: "async",
      className: {
        1: "keyword",
        3: "title.function"
      },
      contains: [
        PARAMS
      ]
    };
    return {
      name: "JavaScript",
      aliases: ["js", "jsx", "mjs", "cjs"],
      keywords: KEYWORDS$1,
      // this will be extended by TypeScript
      exports: { PARAMS_CONTAINS, CLASS_REFERENCE },
      illegal: /#(?![$_A-z])/,
      contains: [
        hljs.SHEBANG({
          label: "shebang",
          binary: "node",
          relevance: 5
        }),
        USE_STRICT,
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        HTML_TEMPLATE,
        CSS_TEMPLATE,
        GRAPHQL_TEMPLATE,
        TEMPLATE_STRING,
        COMMENT,
        // Skip numbers when they are part of a variable name
        { match: /\$\d+/ },
        NUMBER,
        CLASS_REFERENCE,
        {
          scope: "attr",
          match: IDENT_RE$1 + regex.lookahead(":"),
          relevance: 0
        },
        FUNCTION_VARIABLE,
        {
          // "value" container
          begin: "(" + hljs.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
          keywords: "return throw case",
          relevance: 0,
          contains: [
            COMMENT,
            hljs.REGEXP_MODE,
            {
              className: "function",
              // we have to count the parens to make sure we actually have the
              // correct bounding ( ) before the =>.  There could be any number of
              // sub-expressions inside also surrounded by parens.
              begin: FUNC_LEAD_IN_RE,
              returnBegin: true,
              end: "\\s*=>",
              contains: [
                {
                  className: "params",
                  variants: [
                    {
                      begin: hljs.UNDERSCORE_IDENT_RE,
                      relevance: 0
                    },
                    {
                      className: null,
                      begin: /\(\s*\)/,
                      skip: true
                    },
                    {
                      begin: /(\s*)\(/,
                      end: /\)/,
                      excludeBegin: true,
                      excludeEnd: true,
                      keywords: KEYWORDS$1,
                      contains: PARAMS_CONTAINS
                    }
                  ]
                }
              ]
            },
            {
              // could be a comma delimited list of params to a function call
              begin: /,/,
              relevance: 0
            },
            {
              match: /\s+/,
              relevance: 0
            },
            {
              // JSX
              variants: [
                { begin: FRAGMENT.begin, end: FRAGMENT.end },
                { match: XML_SELF_CLOSING },
                {
                  begin: XML_TAG.begin,
                  // we carefully check the opening tag to see if it truly
                  // is a tag and not a false positive
                  "on:begin": XML_TAG.isTrulyOpeningTag,
                  end: XML_TAG.end
                }
              ],
              subLanguage: "xml",
              contains: [
                {
                  begin: XML_TAG.begin,
                  end: XML_TAG.end,
                  skip: true,
                  contains: ["self"]
                }
              ]
            }
          ]
        },
        FUNCTION_DEFINITION,
        {
          // prevent this from getting swallowed up by function
          // since they appear "function like"
          beginKeywords: "while if switch catch for"
        },
        {
          // we have to count the parens to make sure we actually have the correct
          // bounding ( ).  There could be any number of sub-expressions inside
          // also surrounded by parens.
          begin: "\\b(?!function)" + hljs.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
          // end parens
          returnBegin: true,
          label: "func.def",
          contains: [
            PARAMS,
            hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1, className: "title.function" })
          ]
        },
        // catch ... so it won't trigger the property rule below
        {
          match: /\.\.\./,
          relevance: 0
        },
        PROPERTY_ACCESS,
        // hack: prevents detection of keywords in some circumstances
        // .keyword()
        // $keyword = x
        {
          match: "\\$" + IDENT_RE$1,
          relevance: 0
        },
        {
          match: [/\bconstructor(?=\s*\()/],
          className: { 1: "title.function" },
          contains: [PARAMS]
        },
        FUNCTION_CALL,
        UPPER_CASE_CONSTANT,
        CLASS_OR_EXTENDS,
        GETTER_OR_SETTER,
        {
          match: /\$[(.]/
          // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
        }
      ]
    };
  }
  function typescript(hljs) {
    const regex = hljs.regex;
    const tsLanguage = javascript2(hljs);
    const IDENT_RE$1 = IDENT_RE2;
    const TYPES3 = [
      "any",
      "void",
      "number",
      "boolean",
      "string",
      "object",
      "never",
      "symbol",
      "bigint",
      "unknown"
    ];
    const NAMESPACE = {
      begin: [
        /namespace/,
        /\s+/,
        hljs.IDENT_RE
      ],
      beginScope: {
        1: "keyword",
        3: "title.class"
      }
    };
    const INTERFACE = {
      beginKeywords: "interface",
      end: /\{/,
      excludeEnd: true,
      keywords: {
        keyword: "interface extends",
        built_in: TYPES3
      },
      contains: [tsLanguage.exports.CLASS_REFERENCE]
    };
    const USE_STRICT = {
      className: "meta",
      relevance: 10,
      begin: /^\s*['"]use strict['"]/
    };
    const TS_SPECIFIC_KEYWORDS = [
      "type",
      // "namespace",
      "interface",
      "public",
      "private",
      "protected",
      "implements",
      "declare",
      "abstract",
      "readonly",
      "enum",
      "override",
      "satisfies"
    ];
    const KEYWORDS$1 = {
      $pattern: IDENT_RE2,
      keyword: KEYWORDS2.concat(TS_SPECIFIC_KEYWORDS),
      literal: LITERALS2,
      built_in: BUILT_INS2.concat(TYPES3),
      "variable.language": BUILT_IN_VARIABLES2
    };
    const DECORATOR = {
      className: "meta",
      begin: "@" + IDENT_RE$1
    };
    const swapMode = (mode, label, replacement) => {
      const indx = mode.contains.findIndex((m) => m.label === label);
      if (indx === -1) {
        throw new Error("can not find mode to replace");
      }
      mode.contains.splice(indx, 1, replacement);
    };
    Object.assign(tsLanguage.keywords, KEYWORDS$1);
    tsLanguage.exports.PARAMS_CONTAINS.push(DECORATOR);
    const ATTRIBUTE_HIGHLIGHT = tsLanguage.contains.find((c2) => c2.scope === "attr");
    const OPTIONAL_KEY_OR_ARGUMENT = Object.assign(
      {},
      ATTRIBUTE_HIGHLIGHT,
      { match: regex.concat(IDENT_RE$1, regex.lookahead(/\s*\?:/)) }
    );
    tsLanguage.exports.PARAMS_CONTAINS.push([
      tsLanguage.exports.CLASS_REFERENCE,
      // class reference for highlighting the params types
      ATTRIBUTE_HIGHLIGHT,
      // highlight the params key
      OPTIONAL_KEY_OR_ARGUMENT
      // Added for optional property assignment highlighting
    ]);
    tsLanguage.contains = tsLanguage.contains.concat([
      DECORATOR,
      NAMESPACE,
      INTERFACE,
      OPTIONAL_KEY_OR_ARGUMENT
      // Added for optional property assignment highlighting
    ]);
    swapMode(tsLanguage, "shebang", hljs.SHEBANG());
    swapMode(tsLanguage, "use_strict", USE_STRICT);
    const functionDeclaration = tsLanguage.contains.find((m) => m.label === "func.def");
    functionDeclaration.relevance = 0;
    Object.assign(tsLanguage, {
      name: "TypeScript",
      aliases: [
        "ts",
        "tsx",
        "mts",
        "cts"
      ]
    });
    return tsLanguage;
  }

  // node_modules/highlight.js/es/languages/xml.js
  function xml(hljs) {
    const regex = hljs.regex;
    const TAG_NAME_RE = regex.concat(/[\p{L}_]/u, regex.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u);
    const XML_IDENT_RE = /[\p{L}0-9._:-]+/u;
    const XML_ENTITIES = {
      className: "symbol",
      begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
    };
    const XML_META_KEYWORDS = {
      begin: /\s/,
      contains: [
        {
          className: "keyword",
          begin: /#?[a-z_][a-z1-9_-]+/,
          illegal: /\n/
        }
      ]
    };
    const XML_META_PAR_KEYWORDS = hljs.inherit(XML_META_KEYWORDS, {
      begin: /\(/,
      end: /\)/
    });
    const APOS_META_STRING_MODE = hljs.inherit(hljs.APOS_STRING_MODE, { className: "string" });
    const QUOTE_META_STRING_MODE = hljs.inherit(hljs.QUOTE_STRING_MODE, { className: "string" });
    const TAG_INTERNALS = {
      endsWithParent: true,
      illegal: /</,
      relevance: 0,
      contains: [
        {
          className: "attr",
          begin: XML_IDENT_RE,
          relevance: 0
        },
        {
          begin: /=\s*/,
          relevance: 0,
          contains: [
            {
              className: "string",
              endsParent: true,
              variants: [
                {
                  begin: /"/,
                  end: /"/,
                  contains: [XML_ENTITIES]
                },
                {
                  begin: /'/,
                  end: /'/,
                  contains: [XML_ENTITIES]
                },
                { begin: /[^\s"'=<>`]+/ }
              ]
            }
          ]
        }
      ]
    };
    return {
      name: "HTML, XML",
      aliases: [
        "html",
        "xhtml",
        "rss",
        "atom",
        "xjb",
        "xsd",
        "xsl",
        "plist",
        "wsf",
        "svg"
      ],
      case_insensitive: true,
      unicodeRegex: true,
      contains: [
        {
          className: "meta",
          begin: /<![a-z]/,
          end: />/,
          relevance: 10,
          contains: [
            XML_META_KEYWORDS,
            QUOTE_META_STRING_MODE,
            APOS_META_STRING_MODE,
            XML_META_PAR_KEYWORDS,
            {
              begin: /\[/,
              end: /\]/,
              contains: [
                {
                  className: "meta",
                  begin: /<![a-z]/,
                  end: />/,
                  contains: [
                    XML_META_KEYWORDS,
                    XML_META_PAR_KEYWORDS,
                    QUOTE_META_STRING_MODE,
                    APOS_META_STRING_MODE
                  ]
                }
              ]
            }
          ]
        },
        hljs.COMMENT(
          /<!--/,
          /-->/,
          { relevance: 10 }
        ),
        {
          begin: /<!\[CDATA\[/,
          end: /\]\]>/,
          relevance: 10
        },
        XML_ENTITIES,
        // xml processing instructions
        {
          className: "meta",
          end: /\?>/,
          variants: [
            {
              begin: /<\?xml/,
              relevance: 10,
              contains: [
                QUOTE_META_STRING_MODE
              ]
            },
            {
              begin: /<\?[a-z][a-z0-9]+/
            }
          ]
        },
        {
          className: "tag",
          /*
          The lookahead pattern (?=...) ensures that 'begin' only matches
          '<style' as a single word, followed by a whitespace or an
          ending bracket.
          */
          begin: /<style(?=\s|>)/,
          end: />/,
          keywords: { name: "style" },
          contains: [TAG_INTERNALS],
          starts: {
            end: /<\/style>/,
            returnEnd: true,
            subLanguage: [
              "css",
              "xml"
            ]
          }
        },
        {
          className: "tag",
          // See the comment in the <style tag about the lookahead pattern
          begin: /<script(?=\s|>)/,
          end: />/,
          keywords: { name: "script" },
          contains: [TAG_INTERNALS],
          starts: {
            end: /<\/script>/,
            returnEnd: true,
            subLanguage: [
              "javascript",
              "handlebars",
              "xml"
            ]
          }
        },
        // we need this for now for jSX
        {
          className: "tag",
          begin: /<>|<\/>/
        },
        // open tag
        {
          className: "tag",
          begin: regex.concat(
            /</,
            regex.lookahead(regex.concat(
              TAG_NAME_RE,
              // <tag/>
              // <tag>
              // <tag ...
              regex.either(/\/>/, />/, /\s/)
            ))
          ),
          end: /\/?>/,
          contains: [
            {
              className: "name",
              begin: TAG_NAME_RE,
              relevance: 0,
              starts: TAG_INTERNALS
            }
          ]
        },
        // close tag
        {
          className: "tag",
          begin: regex.concat(
            /<\//,
            regex.lookahead(regex.concat(
              TAG_NAME_RE,
              />/
            ))
          ),
          contains: [
            {
              className: "name",
              begin: TAG_NAME_RE,
              relevance: 0
            },
            {
              begin: />/,
              relevance: 0,
              endsParent: true
            }
          ]
        }
      ]
    };
  }

  // node_modules/highlight.js/es/languages/yaml.js
  function yaml(hljs) {
    const LITERALS3 = "true false yes no null";
    const URI_CHARACTERS = "[\\w#;/?:@&=+$,.~*'()[\\]]+";
    const KEY = {
      className: "attr",
      variants: [
        // added brackets support and special char support
        { begin: /[\w*@][\w*@ :()\./-]*:(?=[ \t]|$)/ },
        {
          // double quoted keys - with brackets and special char support
          begin: /"[\w*@][\w*@ :()\./-]*":(?=[ \t]|$)/
        },
        {
          // single quoted keys - with brackets and special char support
          begin: /'[\w*@][\w*@ :()\./-]*':(?=[ \t]|$)/
        }
      ]
    };
    const TEMPLATE_VARIABLES = {
      className: "template-variable",
      variants: [
        {
          // jinja templates Ansible
          begin: /\{\{/,
          end: /\}\}/
        },
        {
          // Ruby i18n
          begin: /%\{/,
          end: /\}/
        }
      ]
    };
    const SINGLE_QUOTE_STRING = {
      className: "string",
      relevance: 0,
      begin: /'/,
      end: /'/,
      contains: [
        {
          match: /''/,
          scope: "char.escape",
          relevance: 0
        }
      ]
    };
    const STRING = {
      className: "string",
      relevance: 0,
      variants: [
        {
          begin: /"/,
          end: /"/
        },
        { begin: /\S+/ }
      ],
      contains: [
        hljs.BACKSLASH_ESCAPE,
        TEMPLATE_VARIABLES
      ]
    };
    const CONTAINER_STRING = hljs.inherit(STRING, { variants: [
      {
        begin: /'/,
        end: /'/,
        contains: [
          {
            begin: /''/,
            relevance: 0
          }
        ]
      },
      {
        begin: /"/,
        end: /"/
      },
      { begin: /[^\s,{}[\]]+/ }
    ] });
    const DATE_RE = "[0-9]{4}(-[0-9][0-9]){0,2}";
    const TIME_RE = "([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?";
    const FRACTION_RE = "(\\.[0-9]*)?";
    const ZONE_RE = "([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?";
    const TIMESTAMP = {
      className: "number",
      begin: "\\b" + DATE_RE + TIME_RE + FRACTION_RE + ZONE_RE + "\\b"
    };
    const VALUE_CONTAINER = {
      end: ",",
      endsWithParent: true,
      excludeEnd: true,
      keywords: LITERALS3,
      relevance: 0
    };
    const OBJECT = {
      begin: /\{/,
      end: /\}/,
      contains: [VALUE_CONTAINER],
      illegal: "\\n",
      relevance: 0
    };
    const ARRAY = {
      begin: "\\[",
      end: "\\]",
      contains: [VALUE_CONTAINER],
      illegal: "\\n",
      relevance: 0
    };
    const MODES4 = [
      KEY,
      {
        className: "meta",
        begin: "^---\\s*$",
        relevance: 10
      },
      {
        // multi line string
        // Blocks start with a | or > followed by a newline
        //
        // Indentation of subsequent lines must be the same to
        // be considered part of the block
        className: "string",
        begin: "[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"
      },
      {
        // Ruby/Rails erb
        begin: "<%[%=-]?",
        end: "[%-]?%>",
        subLanguage: "ruby",
        excludeBegin: true,
        excludeEnd: true,
        relevance: 0
      },
      {
        // named tags
        className: "type",
        begin: "!\\w+!" + URI_CHARACTERS
      },
      // https://yaml.org/spec/1.2/spec.html#id2784064
      {
        // verbatim tags
        className: "type",
        begin: "!<" + URI_CHARACTERS + ">"
      },
      {
        // primary tags
        className: "type",
        begin: "!" + URI_CHARACTERS
      },
      {
        // secondary tags
        className: "type",
        begin: "!!" + URI_CHARACTERS
      },
      {
        // fragment id &ref
        className: "meta",
        begin: "&" + hljs.UNDERSCORE_IDENT_RE + "$"
      },
      {
        // fragment reference *ref
        className: "meta",
        begin: "\\*" + hljs.UNDERSCORE_IDENT_RE + "$"
      },
      {
        // array listing
        className: "bullet",
        // TODO: remove |$ hack when we have proper look-ahead support
        begin: "-(?=[ ]|$)",
        relevance: 0
      },
      hljs.HASH_COMMENT_MODE,
      {
        beginKeywords: LITERALS3,
        keywords: { literal: LITERALS3 }
      },
      TIMESTAMP,
      // numbers are any valid C-style number that
      // sit isolated from other words
      {
        className: "number",
        begin: hljs.C_NUMBER_RE + "\\b",
        relevance: 0
      },
      OBJECT,
      ARRAY,
      SINGLE_QUOTE_STRING,
      STRING
    ];
    const VALUE_MODES = [...MODES4];
    VALUE_MODES.pop();
    VALUE_MODES.push(CONTAINER_STRING);
    VALUE_CONTAINER.contains = VALUE_MODES;
    return {
      name: "YAML",
      case_insensitive: true,
      aliases: ["yml"],
      contains: MODES4
    };
  }

  // scripts/code-highlight-engine.entry.js
  var languageModules = [
    ["bash", bash, ["sh", "zsh"]],
    ["c", c, ["h"]],
    ["cpp", cpp, ["cc", "c++", "cxx", "hpp"]],
    ["csharp", csharp, ["cs"]],
    ["css", css],
    ["diff", diff, ["patch"]],
    ["dockerfile", dockerfile, ["docker"]],
    ["go", go, ["golang"]],
    ["http", http],
    ["ini", ini, ["conf", "toml"]],
    ["java", java],
    ["javascript", javascript, ["js", "jsx", "mjs", "cjs"]],
    ["json", json, ["jsonc"]],
    ["less", less],
    ["markdown", markdown, ["md"]],
    ["nginx", nginx],
    ["php", php],
    ["powershell", powershell, ["ps", "ps1"]],
    ["python", python, ["py"]],
    ["ruby", ruby, ["rb"]],
    ["rust", rust, ["rs"]],
    ["scss", scss],
    ["shell", shell, ["console", "terminal"]],
    ["sql", sql],
    ["typescript", typescript, ["ts", "tsx"]],
    ["xml", xml, ["html", "xhtml", "svg"]],
    ["yaml", yaml, ["yml"]]
  ];
  var registeredLanguages = [];
  languageModules.forEach(([name, language, aliases = []]) => {
    core_default.registerLanguage(name, language);
    registeredLanguages.push(name);
    if (aliases.length) core_default.registerAliases(aliases, { languageName: name });
  });
  function highlight(source, language = "") {
    const code = String(source ?? "");
    if (!code) {
      return { value: "", language: language || "", relevance: 0 };
    }
    try {
      if (language && core_default.getLanguage(language)) {
        const result2 = core_default.highlight(code, { language, ignoreIllegals: true });
        return {
          value: result2.value,
          language: result2.language || language,
          relevance: result2.relevance || 0
        };
      }
      const result = core_default.highlightAuto(code, registeredLanguages);
      return {
        value: result.value,
        language: result.language || "",
        relevance: result.relevance || 0
      };
    } catch (_) {
      return { value: "", language: language || "", relevance: 0 };
    }
  }
  function hasLanguage(language) {
    return Boolean(language && core_default.getLanguage(language));
  }
  function listLanguages() {
    return [...registeredLanguages];
  }
  return __toCommonJS(code_highlight_engine_entry_exports);
})();

/* ui/js/core.js */
if (typeof window === 'undefined' || typeof document === 'undefined') return;

  let selectCounter = 0;
  let activeDialog = null;
  let activeDialogTrigger = null;
  const selectCloseTimers = new WeakMap();
  const languageSelectCloseTimers = new WeakMap();
  const disclosureCloseTimers = new WeakMap();
  const dialogCloseTimers = new WeakMap();
  const toastCloseTimers = new WeakMap();
  const menuCloseTimers = new WeakMap();
  const popoverCloseTimers = new WeakMap();
  const menuActiveTriggers = new WeakMap();
  const hoverCardCloseTimers = new WeakMap();
  const hoverCardOpenTimers = new WeakMap();
  const indicatorInstantTimers = new WeakMap();
  const codeCopyDefaultContent = new WeakMap();
  const comboboxSelectionInputs = new WeakSet();
  const autoInitObservers = new WeakMap();
  const panelNavHashListeners = new WeakMap();
  const tooltipNodes = new WeakMap();
  const dialogTriggers = new WeakMap();
  const activePointerDrags = new Map();
  const dialogStack = [];
  let themeMediaQuery = null;
  let resizeListener = null;
  let dialogIsolationState = null;
  let dialogScrollLockState = null;

  const storage = {
    get(key) {
      try {
        return window.localStorage.getItem(key);
      } catch (_) {
        return null;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch (_) {
        /* localStorage can be unavailable in embedded previews. */
      }
    }
  };

  function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.append(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      return Promise.resolve();
    } finally {
      textarea.remove();
    }
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopyText(text));
    }
    return fallbackCopyText(text);
  }

  function queryAll(root, selector) {
    const scope = root || document;
    const matchesRoot = scope instanceof Element && scope.matches(selector) ? [scope] : [];
    return [...matchesRoot, ...scope.querySelectorAll(selector)];
  }

  function markInitialized(element, key) {
    const flag = `uzu${key}Initialized`;
    if (element.dataset[flag] === 'true') return false;
    element.dataset[flag] = 'true';
    return true;
  }

  function syncRootClass() {
    document.documentElement.classList.toggle('uzu-root', document.body && document.body.classList.contains('uzu-app'));
  }

  function getThemeRoot(trigger) {
    try {
      return document.querySelector(trigger.dataset.uzuThemeTarget) || document.documentElement;
    } catch (_) {
      return document.documentElement;
    }
  }

  function getThemeKey(root, trigger) {
    return root.dataset.uzuThemeKey || trigger?.dataset.uzuThemeKey || document.documentElement.dataset.uzuThemeKey || '';
  }

  function getThemeMode(value) {
    return ['auto', 'light', 'dark'].includes(value) ? value : '';
  }

  function getResolvedTheme(value) {
    return ['light', 'dark'].includes(value) ? value : '';
  }

  function getPreferredTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function resolveTheme(mode) {
    return mode === 'auto' ? getPreferredTheme() : mode;
  }

  function syncThemeToggles(root) {
    const mode = getThemeMode(root.getAttribute('data-theme-mode')) || getResolvedTheme(root.getAttribute('data-theme')) || 'light';
    const theme = getResolvedTheme(root.getAttribute('data-theme')) || resolveTheme(mode);
    queryAll(document, '[data-uzu-theme-toggle]').forEach((toggle) => {
      const target = getThemeRoot(toggle);
      if (target === root) {
        toggle.classList.toggle('is-auto', mode === 'auto');
        toggle.classList.toggle('is-dark', theme === 'dark');
        toggle.setAttribute('aria-label', `Theme: ${mode}, currently ${theme}`);
      }
    });
  }

  function applyTheme(root, mode, key, persist = true) {
    const themeMode = getThemeMode(mode) || 'light';
    const theme = resolveTheme(themeMode);
    root.setAttribute('data-theme-mode', themeMode);
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-uzu-theme', theme);
    if (persist && key) storage.set(key, themeMode);
    syncThemeToggles(root);
  }

  function getInitialThemeMode(root, key) {
    const saved = getThemeMode(key ? storage.get(key) : '');
    if (saved) return saved;
    const currentMode = getThemeMode(root.getAttribute('data-theme-mode'));
    if (currentMode) return currentMode;
    if (root.dataset.uzuThemeKey) return 'auto';
    return getResolvedTheme(root.getAttribute('data-theme')) || getPreferredTheme();
  }

  function getNextThemeMode(mode) {
    if (mode === 'light') return 'dark';
    if (mode === 'dark') return 'auto';
    return 'light';
  }

  function handleThemePreferenceChange() {
    const roots = new Set([document.documentElement]);
    queryAll(document, '[data-uzu-theme-toggle]').forEach((toggle) => {
      roots.add(getThemeRoot(toggle));
    });
    roots.forEach((root) => {
      if (getThemeMode(root.getAttribute('data-theme-mode')) === 'auto') {
        applyTheme(root, 'auto', getThemeKey(root), false);
      }
    });
  }

  function initThemePreferenceListener() {
    const media = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (!media || document.documentElement.dataset.uzuThemeMediaListener === 'true') return;
    themeMediaQuery = media;
    if (media.addEventListener) {
      media.addEventListener('change', handleThemePreferenceChange);
    } else if (media.addListener) {
      media.addListener(handleThemePreferenceChange);
    }
    document.documentElement.dataset.uzuThemeMediaListener = 'true';
  }

  function initThemeToggles(root = document) {
    queryAll(root, '[data-uzu-theme-toggle]').forEach((toggle) => {
      const themeRoot = getThemeRoot(toggle);
      const key = getThemeKey(themeRoot, toggle);
      const savedMode = getThemeMode(key ? storage.get(key) : '');
      if (savedMode) {
        applyTheme(themeRoot, savedMode, key, false);
      } else if (themeRoot.hasAttribute('data-theme-mode')) {
        syncThemeToggles(themeRoot);
      } else {
        applyTheme(themeRoot, getInitialThemeMode(themeRoot, key), key);
      }
      if (!markInitialized(toggle, 'ThemeToggle')) return;
      toggle.addEventListener('click', () => {
        const current = getThemeMode(themeRoot.getAttribute('data-theme-mode')) || getResolvedTheme(themeRoot.getAttribute('data-theme')) || 'light';
        applyTheme(themeRoot, getNextThemeMode(current), key);
      });
    });
    initThemePreferenceListener();
  }

  function getLanguageRoot(control) {
    try {
      const target = control?.dataset.uzuLanguageTarget || '';
      return target ? document.querySelector(target) || document.documentElement : document.documentElement;
    } catch (_) {
      return document.documentElement;
    }
  }

  function getLanguageKey(root, control) {
    if (control?.hasAttribute('data-uzu-language-key')) return control.dataset.uzuLanguageKey || '';
    if (root?.hasAttribute?.('data-uzu-language-key')) return root.dataset.uzuLanguageKey || '';
    if (document.documentElement.hasAttribute('data-uzu-language-key')) return document.documentElement.dataset.uzuLanguageKey || '';
    return 'usuzumi-language';
  }

  function normalizeLanguage(value, fallback = 'zh') {
    const language = String(value || '').trim();
    return language || fallback;
  }

  function parseLanguageValues(value) {
    return String(value || '').split(/[\s,]+/).map((item) => item.trim()).filter(Boolean);
  }

  function getDefaultLanguageHtmlLang(language) {
    return language === 'zh' ? 'zh-CN' : language;
  }

  function getLanguageSelectTrigger(select) {
    return select.querySelector('[data-uzu-language-trigger], .uzu-language-trigger');
  }

  function getLanguageSelectMenu(select) {
    return select.querySelector('[data-uzu-language-menu], .uzu-language-menu');
  }

  function getLanguageOptions(select) {
    return getScopedControls(select, '[data-uzu-language-option], .uzu-language-option', '[data-uzu-language-select]');
  }

  function getLanguageOptionValue(option) {
    return normalizeLanguage(option.dataset.uzuLanguageValue ?? option.dataset.value ?? option.getAttribute('lang') ?? option.textContent);
  }

  function getLanguageOptionLabel(option) {
    return (option.dataset.uzuLanguageLabel || option.textContent || getLanguageOptionValue(option)).trim();
  }

  function getLanguageOptionHtmlLang(option, language = getLanguageOptionValue(option)) {
    return normalizeLanguage(option.dataset.uzuLanguageHtmlLang || option.getAttribute('lang') || getDefaultLanguageHtmlLang(language), getDefaultLanguageHtmlLang(language));
  }

  function getLanguageSelectHtmlLang(select, language) {
    const option = getLanguageOptions(select).find((item) => getLanguageOptionValue(item) === language);
    return option ? getLanguageOptionHtmlLang(option, language) : getDefaultLanguageHtmlLang(language);
  }

  function getSelectedLanguageOption(select, language) {
    const options = getLanguageOptions(select);
    return options.find((option) => getLanguageOptionValue(option) === language)
      || options.find((option) => option.classList.contains('is-selected') || option.getAttribute('aria-selected') === 'true')
      || options[0]
      || null;
  }

  function getInitialLanguage(root, key, select = null) {
    const optionValues = select ? getLanguageOptions(select).map(getLanguageOptionValue) : [];
    const selectedOption = select ? getSelectedLanguageOption(select, '') : null;
    const candidates = [
      key ? storage.get(key) : '',
      root.getAttribute('data-language'),
      root.getAttribute('data-uzu-lang'),
      select?.dataset.uzuLanguageDefault,
      selectedOption ? getLanguageOptionValue(selectedOption) : '',
      optionValues[0],
      'zh'
    ].map((value) => normalizeLanguage(value, '')).filter(Boolean);
    return candidates.find((value) => !optionValues.length || optionValues.includes(value)) || candidates[0] || 'zh';
  }

  function isNestedLanguageRoot(root, element) {
    const nestedRoot = element.closest('[data-uzu-language-root]');
    return Boolean(nestedRoot && nestedRoot !== root);
  }

  function syncLanguageContent(root, language) {
    queryAll(root, '[data-lang]').forEach((element) => {
      if (isNestedLanguageRoot(root, element)) return;
      const values = parseLanguageValues(element.getAttribute('data-lang'));
      const hidden = values.length > 0 && !values.includes(language);
      element.toggleAttribute('data-uzu-language-hidden', hidden);
    });
  }

  function getClosestLanguageRoot(element) {
    if (!(element instanceof Element)) return document.documentElement;
    return element.closest('[data-uzu-language-root], [data-language], [data-uzu-lang]') || document.documentElement;
  }

  function initLanguageRoots(root = document) {
    const roots = new Set();
    if (root === document) roots.add(document.documentElement);
    if (root instanceof Element && (root.hasAttribute('data-language') || root.hasAttribute('data-uzu-lang'))) roots.add(root);
    queryAll(root, '[data-language], [data-uzu-lang]').forEach((item) => roots.add(item));
    queryAll(root, '[data-lang]').forEach((item) => roots.add(getClosestLanguageRoot(item)));
    roots.forEach((languageRoot) => {
      if (languageRoot !== document.documentElement) languageRoot.setAttribute('data-uzu-language-root', '');
    });
    roots.forEach((languageRoot) => {
      const language = normalizeLanguage(languageRoot.getAttribute('data-language') || languageRoot.getAttribute('data-uzu-lang'));
      syncLanguageContent(languageRoot, language);
    });
  }

  function syncLanguageSelect(select, language) {
    const trigger = getLanguageSelectTrigger(select);
    const options = getLanguageOptions(select);
    const selected = options.find((option) => getLanguageOptionValue(option) === language) || null;
    select.dataset.uzuLanguageValue = language;
    options.forEach((option) => {
      const isSelected = option === selected;
      option.classList.toggle('is-selected', isSelected);
      option.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      option.setAttribute('tabindex', '-1');
    });
    if (trigger) {
      const label = selected ? getLanguageOptionLabel(selected) : language;
      trigger.dataset.uzuLanguageValue = language;
      trigger.setAttribute('aria-label', trigger.dataset.uzuLanguageLabel || `Language: ${label}`);
    }
  }

  function syncLanguageControls(root, language) {
    queryAll(document, '[data-uzu-language-select]').forEach((select) => {
      if (getLanguageRoot(select) === root) syncLanguageSelect(select, language);
    });
  }

  function applyLanguage(root, language, key, htmlLang) {
    const nextLanguage = normalizeLanguage(language);
    root.toggleAttribute('data-uzu-language-root', root !== document.documentElement);
    root.setAttribute('data-language', nextLanguage);
    root.setAttribute('data-uzu-lang', nextLanguage);
    root.setAttribute('lang', normalizeLanguage(htmlLang, getDefaultLanguageHtmlLang(nextLanguage)));
    if (key) storage.set(key, nextLanguage);
    syncLanguageContent(root, nextLanguage);
    syncLanguageControls(root, nextLanguage);
    refreshStateIndicators(root, true);
    queueIndicatorRefresh(root, true);
  }

  function focusLanguageOption(select, index) {
    const options = getEnabledControls(getLanguageOptions(select));
    if (!options.length) return null;
    const nextIndex = (index + options.length) % options.length;
    options.forEach((option, optionIndex) => {
      const active = optionIndex === nextIndex;
      option.classList.toggle('is-active', active);
      option.setAttribute('tabindex', active ? '0' : '-1');
    });
    options[nextIndex].focus();
    return options[nextIndex];
  }

  function openLanguageSelect(select, options = {}) {
    const trigger = getLanguageSelectTrigger(select);
    const menu = getLanguageSelectMenu(select);
    if (!trigger || !menu) return;
    if (select.classList.contains('is-open')) return;
    const timer = languageSelectCloseTimers.get(select);
    if (timer) {
      window.clearTimeout(timer);
      languageSelectCloseTimers.delete(select);
    }
    closeOpenLanguageSelects(select);
    menu.hidden = false;
    select.classList.remove('is-closing');
    select.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    queueDisclosureHeightRefresh(menu);
    if (options.focus !== false) {
      const enabled = getEnabledControls(getLanguageOptions(select));
      const selectedIndex = Math.max(0, enabled.findIndex((option) => option.classList.contains('is-selected') || option.getAttribute('aria-selected') === 'true'));
      focusLanguageOption(select, selectedIndex);
    }
  }

  function closeLanguageSelect(select, options = {}) {
    const trigger = getLanguageSelectTrigger(select);
    const menu = getLanguageSelectMenu(select);
    if (!menu || select.classList.contains('is-closing') || (!select.classList.contains('is-open') && menu.hidden)) return;
    const timer = languageSelectCloseTimers.get(select);
    if (timer) window.clearTimeout(timer);
    select.classList.remove('is-open');
    select.classList.add('is-closing');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    getLanguageOptions(select).forEach((option) => {
      option.classList.remove('is-active');
      option.setAttribute('tabindex', '-1');
    });
    const finish = () => {
      select.classList.remove('is-closing');
      menu.hidden = true;
      languageSelectCloseTimers.delete(select);
      if (options.restoreFocus && trigger && typeof trigger.focus === 'function') trigger.focus();
    };
    const closeTimer = scheduleAfterAnimation([menu], finish);
    if (closeTimer) languageSelectCloseTimers.set(select, closeTimer);
  }

  function closeOpenLanguageSelects(except = null) {
    let count = 0;
    queryAll(document, '[data-uzu-language-select].is-open').forEach((select) => {
      if (select !== except) {
        count += 1;
        closeLanguageSelect(select);
      }
    });
    return count;
  }

  function emitLanguageChange(select, root, language, option, previousLanguage, key) {
    select.dispatchEvent(new CustomEvent('uzu-language-change', {
      bubbles: true,
      detail: {
        language,
        previousLanguage,
        htmlLang: root.getAttribute('lang') || '',
        key,
        option,
        select,
        root
      }
    }));
  }

  function chooseLanguageOption(select, option) {
    const languageRoot = getLanguageRoot(select);
    const key = getLanguageKey(languageRoot, select);
    const previousLanguage = languageRoot.getAttribute('data-language') || '';
    const language = getLanguageOptionValue(option);
    applyLanguage(languageRoot, language, key, getLanguageOptionHtmlLang(option, language));
    closeLanguageSelect(select, { restoreFocus: true });
    if (language !== previousLanguage) emitLanguageChange(select, languageRoot, language, option, previousLanguage, key);
  }

  function handleLanguageOptionKeydown(event, select, option) {
    const options = getEnabledControls(getLanguageOptions(select));
    const index = Math.max(0, options.indexOf(option));
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusLanguageOption(select, index + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusLanguageOption(select, index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusLanguageOption(select, 0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusLanguageOption(select, options.length - 1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeLanguageSelect(select, { restoreFocus: true });
    } else if (event.key === 'Tab') {
      closeLanguageSelect(select);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      chooseLanguageOption(select, option);
    }
  }

  function initLanguageSelects(root = document) {
    initLanguageRoots(root);
    queryAll(root, '[data-uzu-language-select]').forEach((select) => {
      const trigger = getLanguageSelectTrigger(select);
      const menu = getLanguageSelectMenu(select);
      const options = getLanguageOptions(select);
      if (!trigger || !menu || !options.length) return;
      const selectId = ensureId(select, 'uzu-language-select');
      const menuId = ensureId(menu, `${selectId}-menu`);
      const languageRoot = getLanguageRoot(select);
      const key = getLanguageKey(languageRoot, select);
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', select.classList.contains('is-open') ? 'true' : 'false');
      trigger.setAttribute('aria-controls', menuId);
      menu.setAttribute('role', menu.getAttribute('role') || 'listbox');
      if (!select.classList.contains('is-open')) menu.hidden = true;
      options.forEach((option, index) => {
        ensureId(option, `${selectId}-option-${index + 1}`);
        option.setAttribute('role', option.getAttribute('role') || 'option');
        option.setAttribute('tabindex', '-1');
      });
      const initial = getInitialLanguage(languageRoot, key, select);
      applyLanguage(languageRoot, initial, key, getLanguageSelectHtmlLang(select, initial));
      if (!markInitialized(select, 'LanguageSelect')) return;
      trigger.addEventListener('click', (event) => {
        if (isControlDisabled(trigger)) return;
        event.preventDefault();
        if (select.classList.contains('is-open')) closeLanguageSelect(select, { restoreFocus: true });
        else openLanguageSelect(select);
      });
      trigger.addEventListener('keydown', (event) => {
        if (isControlDisabled(trigger)) return;
        if (['ArrowDown', 'Enter', ' '].includes(event.key)) {
          event.preventDefault();
          openLanguageSelect(select);
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          openLanguageSelect(select, { focus: false });
          focusLanguageOption(select, getEnabledControls(getLanguageOptions(select)).length - 1);
        }
      });
      select.addEventListener('click', (event) => {
        const option = getScopedEventControl(event, '[data-uzu-language-option], .uzu-language-option', select, '[data-uzu-language-select]');
        if (!option || isControlDisabled(option)) return;
        event.preventDefault();
        chooseLanguageOption(select, option);
      });
      select.addEventListener('keydown', (event) => {
        const option = getScopedEventControl(event, '[data-uzu-language-option], .uzu-language-option', select, '[data-uzu-language-select]');
        if (option) handleLanguageOptionKeydown(event, select, option);
        else if (event.key === 'Escape') {
          event.preventDefault();
          closeLanguageSelect(select, { restoreFocus: true });
        }
      });
    });
  }

/* ui/js/control-utils.js */
function isControlDisabled(control) {
    return control.disabled || control.getAttribute('aria-disabled') === 'true' || control.classList.contains('is-disabled');
  }

  function getControlValue(control, datasetKey) {
    return control.dataset[datasetKey] ?? control.dataset.value ?? control.textContent.trim();
  }

  function getTabPanel(tab) {
    const target = tab.dataset.uzuTabTarget;
    if (target) {
      try {
        return document.querySelector(target);
      } catch (_) {
        return null;
      }
    }
    const panelId = tab.getAttribute('aria-controls');
    return panelId ? document.getElementById(panelId) : null;
  }

  function getEnabledControls(controls) {
    return controls.filter((control) => !isControlDisabled(control));
  }

  function getScopedControls(root, controlSelector, rootSelector) {
    return [...root.querySelectorAll(controlSelector)].filter((control) => control.closest(rootSelector) === root);
  }

  function getScopedEventControl(event, controlSelector, root, rootSelector) {
    if (!(event.target instanceof Element)) return null;
    const control = event.target.closest(controlSelector);
    return control && control.closest(rootSelector) === root ? control : null;
  }

  function moveActiveControl(controls, current, direction) {
    const enabled = getEnabledControls(controls);
    if (!enabled.length) return null;
    const currentIndex = Math.max(0, enabled.indexOf(current));
    return enabled[(currentIndex + direction + enabled.length) % enabled.length];
  }

  function parseTimeValue(value) {
    const item = String(value || '').trim();
    if (!item || item === '0s') return 0;
    return item.endsWith('ms') ? Number.parseFloat(item) : Number.parseFloat(item) * 1000;
  }

  function getAnimationDuration(element) {
    if (!element) return 0;
    const style = window.getComputedStyle(element);
    const durations = style.animationDuration.split(',').map(parseTimeValue);
    const delays = style.animationDelay.split(',').map(parseTimeValue);
    return Math.max(0, ...durations.map((duration, index) => duration + (delays[index] || 0)));
  }

  function scheduleAfterAnimation(elements, callback) {
    const duration = Math.max(0, ...elements.map(getAnimationDuration));
    if (!duration) {
      callback();
      return null;
    }
    return window.setTimeout(callback, duration + 30);
  }

  function holdIndicatorInstant(root) {
    root.dataset.uzuIndicatorInstant = 'true';
    if (indicatorInstantTimers.has(root)) window.clearTimeout(indicatorInstantTimers.get(root));
    indicatorInstantTimers.set(root, window.setTimeout(() => {
      delete root.dataset.uzuIndicatorInstant;
      indicatorInstantTimers.delete(root);
    }, 120));
  }

  function setControlIndicator(root, control, prefix, instant = false) {
    if (!control || !root.isConnected || control.offsetWidth <= 0 || control.offsetHeight <= 0) {
      root.dataset[prefix === 'tabs' ? 'uzuTabsIndicator' : 'uzuSegmentedIndicator'] = 'false';
      return;
    }
    if (instant) holdIndicatorInstant(root);
    const cssPrefix = prefix === 'tabs' ? 'uzu-tabs' : 'uzu-segmented';
    root.style.setProperty(`--${cssPrefix}-indicator-x`, `${control.offsetLeft}px`);
    root.style.setProperty(`--${cssPrefix}-indicator-width`, `${control.offsetWidth}px`);
    root.style.setProperty(`--${cssPrefix}-indicator-opacity`, '1');
    if (prefix === 'tabs') {
      root.style.setProperty('--uzu-tabs-indicator-y', `${control.offsetTop + control.offsetHeight - 1}px`);
      root.dataset.uzuTabsIndicator = 'true';
    } else {
      root.style.setProperty('--uzu-segmented-indicator-y', `${control.offsetTop}px`);
      root.style.setProperty('--uzu-segmented-indicator-height', `${control.offsetHeight}px`);
      root.dataset.uzuSegmentedIndicator = 'true';
    }
  }

  function refreshStateIndicators(root = document, instant = false) {
    queryAll(root, '[data-uzu-tabs]').forEach((tabsRoot) => {
      const activeTab = getScopedControls(tabsRoot, '.uzu-tab', '[data-uzu-tabs]')
        .find((tab) => tab.classList.contains('is-active') || tab.getAttribute('aria-selected') === 'true');
      if (activeTab) setControlIndicator(tabsRoot, activeTab, 'tabs', instant);
    });
    queryAll(root, '[data-uzu-segmented]').forEach((segmented) => {
      const activeSegment = getScopedControls(segmented, '.uzu-segment', '[data-uzu-segmented]')
        .find((segment) => segment.classList.contains('is-active') || segment.getAttribute('aria-pressed') === 'true');
      if (activeSegment) setControlIndicator(segmented, activeSegment, 'segmented', instant);
    });
  }

  function queueIndicatorRefresh(root = document, instant = false) {
    window.requestAnimationFrame(() => refreshStateIndicators(root, instant));
  }

/* ui/js/select-tabs.js */
function closeSelect(select) {
    if (select.classList.contains('is-closing') || !select.classList.contains('is-open')) return;
    select.classList.remove('is-open');
    select.classList.add('is-closing');
    queryAll(select, '[data-uzu-select-option]').forEach((option) => {
      option.classList.remove('is-active');
      option.setAttribute('tabindex', '-1');
    });
    const trigger = select.querySelector('[data-uzu-select-trigger]');
    if (trigger) {
      const selected = select.querySelector('[data-uzu-select-option].is-selected');
      trigger.setAttribute('aria-expanded', 'false');
      if (selected && selected.id) {
        trigger.setAttribute('aria-activedescendant', selected.id);
      } else {
        trigger.removeAttribute('aria-activedescendant');
      }
    }
    const menu = select.querySelector('[role="listbox"]');
    const finish = () => {
      select.classList.remove('is-closing');
      selectCloseTimers.delete(select);
    };
    const timer = scheduleAfterAnimation([menu].filter(Boolean), finish);
    if (timer) selectCloseTimers.set(select, timer);
  }

  function ensureId(element, prefix) {
    if (!element.id) {
      selectCounter += 1;
      element.id = `${prefix}-${selectCounter}`;
    }
    return element.id;
  }

  function focusSelectOption(select, index) {
    const options = queryAll(select, '[data-uzu-select-option]');
    const trigger = select.querySelector('[data-uzu-select-trigger]');
    if (!options.length) return;
    const nextIndex = (index + options.length) % options.length;
    options.forEach((option, optionIndex) => {
      const isActive = optionIndex === nextIndex;
      option.classList.toggle('is-active', isActive);
      option.setAttribute('tabindex', isActive ? '0' : '-1');
    });
    if (trigger && options[nextIndex].id) {
      trigger.setAttribute('aria-activedescendant', options[nextIndex].id);
    }
    options[nextIndex].focus();
  }

  function openSelect(select, focusIndex) {
    const trigger = select.querySelector('[data-uzu-select-trigger]');
    const options = queryAll(select, '[data-uzu-select-option]');
    const existingTimer = selectCloseTimers.get(select);
    if (existingTimer) {
      window.clearTimeout(existingTimer);
      selectCloseTimers.delete(select);
    }
    select.classList.remove('is-closing');
    select.classList.add('is-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    queueDisclosureHeightRefresh(select);
    const selectedIndex = options.findIndex((option) => option.classList.contains('is-selected'));
    focusSelectOption(select, focusIndex ?? (selectedIndex >= 0 ? selectedIndex : 0));
  }

  function getSelectOptionLabelNodes(option) {
    const nodes = [...option.childNodes].filter((node) => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim();
      return node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('data-lang');
    });
    return nodes.length ? nodes : [document.createTextNode(option.textContent.trim())];
  }

  function syncSelectTriggerLabel(trigger, option) {
    const labelRoot = trigger.querySelector('[data-uzu-select-label]') || trigger;
    labelRoot.replaceChildren(...getSelectOptionLabelNodes(option).map((node) => node.cloneNode(true)));
  }

  function getSelectOptionValue(option) {
    return option.dataset.uzuSelectValue ?? option.dataset.value ?? option.textContent.trim();
  }

  function getSelectOptionLabel(option) {
    return option.textContent.trim();
  }

  function getSelectInput(select) {
    let input = select.querySelector('input[type="hidden"][data-uzu-select-input]');
    const name = select.dataset.uzuSelectName || select.getAttribute('name') || input?.name || '';
    if (!input && name) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.setAttribute('data-uzu-select-input', '');
      select.append(input);
    }
    if (input && name) input.name = name;
    return input;
  }

  function syncSelectValue(select, option) {
    const value = getSelectOptionValue(option);
    const trigger = select.querySelector('[data-uzu-select-trigger]');
    const input = getSelectInput(select);
    select.dataset.uzuSelectValue = value;
    if (trigger) trigger.dataset.uzuSelectValue = value;
    if (input) input.value = value;
    return value;
  }

  function emitSelectChange(select, option, value) {
    select.dispatchEvent(new CustomEvent('uzu-select-change', {
      bubbles: true,
      detail: {
        value,
        label: getSelectOptionLabel(option),
        option,
        select
      }
    }));
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function chooseSelectOption(select, option) {
    const trigger = select.querySelector('[data-uzu-select-trigger]');
    const options = queryAll(select, '[data-uzu-select-option]');
    const previousValue = select.dataset.uzuSelectValue || getSelectInput(select)?.value || '';
    options.forEach((item) => {
      item.classList.remove('is-selected');
      item.setAttribute('aria-selected', 'false');
    });
    option.classList.add('is-selected');
    option.setAttribute('aria-selected', 'true');
    const value = syncSelectValue(select, option);
    if (trigger) {
      syncSelectTriggerLabel(trigger, option);
      closeSelect(select);
      trigger.focus();
    }
    if (value !== previousValue) emitSelectChange(select, option, value);
  }

  function initSelects(root = document) {
    queryAll(root, '[data-uzu-select]').forEach((select) => {
      const trigger = select.querySelector('[data-uzu-select-trigger]');
      const options = queryAll(select, '[data-uzu-select-option]');
      const menu = select.querySelector('[role="listbox"]');
      if (!trigger || !options.length) return;

      const selectId = ensureId(select, 'uzu-select');
      const menuId = menu ? ensureId(menu, `${selectId}-menu`) : '';
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');
      if (menuId) trigger.setAttribute('aria-controls', menuId);
      options.forEach((option, index) => {
        ensureId(option, `${selectId}-option-${index + 1}`);
        option.setAttribute('tabindex', '-1');
        option.setAttribute('aria-selected', option.classList.contains('is-selected') ? 'true' : 'false');
      });
      const selected = options.find((option) => option.classList.contains('is-selected'));
      if (selected) {
        trigger.setAttribute('aria-activedescendant', selected.id);
        syncSelectValue(select, selected);
      }

      if (!markInitialized(select, 'Select')) return;

      trigger.addEventListener('click', () => {
        if (trigger.disabled || trigger.getAttribute('aria-disabled') === 'true') return;
        if (select.classList.contains('is-open')) {
          closeSelect(select);
        } else {
          const selectedIndex = options.findIndex((option) => option.classList.contains('is-selected'));
          openSelect(select, selectedIndex >= 0 ? selectedIndex : 0);
        }
      });

      trigger.addEventListener('keydown', (event) => {
        if (trigger.disabled || trigger.getAttribute('aria-disabled') === 'true') return;
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
          event.preventDefault();
          const selectedIndex = options.findIndex((option) => option.classList.contains('is-selected'));
          const startIndex = event.key === 'ArrowUp' ? (selectedIndex >= 0 ? selectedIndex - 1 : options.length - 1) : (selectedIndex >= 0 ? selectedIndex : 0);
          openSelect(select, startIndex);
        }
      });

      options.forEach((option) => {
        option.addEventListener('mouseenter', () => {
          focusSelectOption(select, options.indexOf(option));
        });

        option.addEventListener('click', () => {
          chooseSelectOption(select, option);
        });

        option.addEventListener('keydown', (event) => {
          const currentIndex = options.indexOf(option);
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            focusSelectOption(select, currentIndex + 1);
          } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            focusSelectOption(select, currentIndex - 1);
          } else if (event.key === 'Home') {
            event.preventDefault();
            focusSelectOption(select, 0);
          } else if (event.key === 'End') {
            event.preventDefault();
            focusSelectOption(select, options.length - 1);
          } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            chooseSelectOption(select, option);
          } else if (event.key === 'Escape') {
            event.preventDefault();
            closeSelect(select);
            trigger.focus();
          }
        });
      });

      select.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          closeSelect(select);
          trigger.focus();
        }
      });
    });
  }

/* ui/js/tabs-segmented.js */
function syncTabsState(tabsRoot, activeTab, emit = true) {
    const tabs = getScopedControls(tabsRoot, '.uzu-tab', '[data-uzu-tabs]');
    const enabled = getEnabledControls(tabs);
    const nextTab = activeTab && !isControlDisabled(activeTab) ? activeTab : enabled[0];
    if (!nextTab) return;
    const previousValue = tabsRoot.dataset.uzuTabsValue || '';
    const value = getControlValue(nextTab, 'uzuTabValue');
    let panel = null;

    if (!tabsRoot.hasAttribute('role')) tabsRoot.setAttribute('role', 'tablist');
    tabs.forEach((tab, index) => {
      const isActive = tab === nextTab;
      const tabPanel = getTabPanel(tab);
      if (tabPanel) {
        const panelId = tabPanel.id || ensureId(tabPanel, `${tabsRoot.id || 'uzu-tabs'}-panel-${index + 1}`);
        const tabId = tab.id || ensureId(tab, `${tabsRoot.id || 'uzu-tabs'}-tab-${index + 1}`);
        tab.setAttribute('aria-controls', panelId);
        tabPanel.setAttribute('role', 'tabpanel');
        tabPanel.setAttribute('aria-labelledby', tabId);
      }
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.setAttribute('tabindex', isActive && !isControlDisabled(tab) ? '0' : '-1');
      if (tabPanel) tabPanel.hidden = !isActive;
      if (isActive) panel = tabPanel;
    });
    tabsRoot.dataset.uzuTabsValue = value;
    setControlIndicator(tabsRoot, nextTab, 'tabs');
    if (panel) {
      queueIndicatorRefresh(panel, true);
      queueDisclosureHeightRefresh(panel);
    }

    if (emit && value !== previousValue) {
      tabsRoot.dispatchEvent(new CustomEvent('uzu-tabs-change', {
        bubbles: true,
        detail: {
          value,
          tab: nextTab,
          tabs: tabsRoot,
          index: tabs.indexOf(nextTab),
          panel
        }
      }));
      tabsRoot.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function initTabs(root = document) {
    queryAll(root, '[data-uzu-tabs]').forEach((tabsRoot) => {
      const tabs = getScopedControls(tabsRoot, '.uzu-tab', '[data-uzu-tabs]');
      if (!tabs.length) return;
      const activeTab = tabs.find((tab) => tab.classList.contains('is-active') || tab.getAttribute('aria-selected') === 'true');
      syncTabsState(tabsRoot, activeTab, false);

      if (!markInitialized(tabsRoot, 'Tabs')) return;

      tabsRoot.addEventListener('click', (event) => {
        const tab = getScopedEventControl(event, '.uzu-tab', tabsRoot, '[data-uzu-tabs]');
        if (!tab || isControlDisabled(tab)) return;
        syncTabsState(tabsRoot, tab);
      });

      tabsRoot.addEventListener('keydown', (event) => {
        const tab = getScopedEventControl(event, '.uzu-tab', tabsRoot, '[data-uzu-tabs]');
        if (!tab || isControlDisabled(tab)) return;
        const currentTabs = getScopedControls(tabsRoot, '.uzu-tab', '[data-uzu-tabs]');
        let nextTab = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          nextTab = moveActiveControl(currentTabs, tab, 1);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          nextTab = moveActiveControl(currentTabs, tab, -1);
        } else if (event.key === 'Home') {
          nextTab = getEnabledControls(currentTabs)[0];
        } else if (event.key === 'End') {
          const enabled = getEnabledControls(currentTabs);
          nextTab = enabled[enabled.length - 1];
        }
        if (nextTab) {
          event.preventDefault();
          syncTabsState(tabsRoot, nextTab);
          nextTab.focus();
        }
      });
    });
  }

  function syncSegmentedState(segmented, activeSegment, emit = true) {
    const segments = getScopedControls(segmented, '.uzu-segment', '[data-uzu-segmented]');
    const enabled = getEnabledControls(segments);
    const nextSegment = activeSegment && !isControlDisabled(activeSegment) ? activeSegment : enabled[0];
    if (!nextSegment) return;
    const previousValue = segmented.dataset.uzuSegmentedValue || '';
    const value = getControlValue(nextSegment, 'uzuSegmentValue');

    if (!segmented.hasAttribute('role')) segmented.setAttribute('role', 'group');
    segments.forEach((segment) => {
      const isActive = segment === nextSegment;
      segment.classList.toggle('is-active', isActive);
      segment.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    segmented.dataset.uzuSegmentedValue = value;
    setControlIndicator(segmented, nextSegment, 'segmented');

    if (emit && value !== previousValue) {
      segmented.dispatchEvent(new CustomEvent('uzu-segmented-change', {
        bubbles: true,
        detail: {
          value,
          segment: nextSegment,
          segmented,
          index: segments.indexOf(nextSegment)
        }
      }));
      segmented.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function initSegmented(root = document) {
    queryAll(root, '[data-uzu-segmented]').forEach((segmented) => {
      const segments = getScopedControls(segmented, '.uzu-segment', '[data-uzu-segmented]');
      if (!segments.length) return;
      const activeSegment = segments.find((segment) => segment.classList.contains('is-active') || segment.getAttribute('aria-pressed') === 'true');
      syncSegmentedState(segmented, activeSegment, false);

      if (!markInitialized(segmented, 'Segmented')) return;

      segmented.addEventListener('click', (event) => {
        const segment = getScopedEventControl(event, '.uzu-segment', segmented, '[data-uzu-segmented]');
        if (!segment || isControlDisabled(segment)) return;
        syncSegmentedState(segmented, segment);
      });

      segmented.addEventListener('keydown', (event) => {
        const segment = getScopedEventControl(event, '.uzu-segment', segmented, '[data-uzu-segmented]');
        if (!segment || isControlDisabled(segment)) return;
        const currentSegments = getScopedControls(segmented, '.uzu-segment', '[data-uzu-segmented]');
        let nextSegment = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          nextSegment = moveActiveControl(currentSegments, segment, 1);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          nextSegment = moveActiveControl(currentSegments, segment, -1);
        } else if (event.key === 'Home') {
          nextSegment = getEnabledControls(currentSegments)[0];
        } else if (event.key === 'End') {
          const enabled = getEnabledControls(currentSegments);
          nextSegment = enabled[enabled.length - 1];
        }
        if (nextSegment) {
          event.preventDefault();
          syncSegmentedState(segmented, nextSegment);
          nextSegment.focus();
        }
      });
    });
  }

/* ui/js/pagination.js */
function getPaginationPageValue(control) {
    return control.dataset.uzuPage ?? control.dataset.page ?? '';
  }

  function getPaginationPageControls(pagination) {
    return getScopedControls(pagination, '.uzu-page-button', '[data-uzu-pagination]')
      .filter((control) => getPaginationPageValue(control));
  }

  function getActivePaginationPage(pagination) {
    const pages = getPaginationPageControls(pagination);
    return pages.find((page) => page.classList.contains('is-active') || page.getAttribute('aria-current') === 'page')
      || pages.find((page) => getPaginationPageValue(page) === pagination.dataset.uzuPaginationPage)
      || pages.find((page) => !isControlDisabled(page));
  }

  function getPaginationPanelRoot(pagination) {
    const target = pagination.dataset.uzuPaginationTarget;
    if (!target) return null;
    try {
      return document.querySelector(target);
    } catch (_) {
      return null;
    }
  }

  function setPaginationControlDisabled(control, disabled) {
    control.classList.toggle('is-disabled', disabled);
    if ('disabled' in control) control.disabled = disabled;
    if (disabled) {
      control.setAttribute('aria-disabled', 'true');
      control.setAttribute('tabindex', '-1');
    } else {
      control.removeAttribute('aria-disabled');
      control.removeAttribute('tabindex');
    }
  }

  function syncPaginationPanels(pagination, value) {
    const panelRoot = getPaginationPanelRoot(pagination);
    if (!panelRoot) return null;
    let activePanel = null;
    [...panelRoot.children].filter((panel) => panel.hasAttribute('data-uzu-page-panel')).forEach((panel) => {
      const isActive = (panel.dataset.uzuPagePanel ?? panel.dataset.page ?? '') === value;
      panel.hidden = !isActive;
      if (isActive) activePanel = panel;
    });
    return activePanel;
  }

  function syncPaginationState(pagination, activePage, emit = true) {
    const pages = getPaginationPageControls(pagination);
    const enabledPages = getEnabledControls(pages);
    const requestedValue = typeof activePage === 'string' ? activePage : getPaginationPageValue(activePage || getActivePaginationPage(pagination));
    const nextPage = enabledPages.find((page) => getPaginationPageValue(page) === requestedValue) || enabledPages[0];
    if (!nextPage) return;

    const previousValue = pagination.dataset.uzuPaginationPage || '';
    const value = getPaginationPageValue(nextPage);
    const pageIndex = pages.indexOf(nextPage);
    const enabledPageIndex = enabledPages.indexOf(nextPage);
    pages.forEach((page) => {
      const isActive = page === nextPage;
      page.classList.toggle('is-active', isActive);
      if (isActive) page.setAttribute('aria-current', 'page');
      else page.removeAttribute('aria-current');
    });

    const controls = getScopedControls(pagination, '.uzu-page-button', '[data-uzu-pagination]');
    controls
      .filter((control) => control.hasAttribute('data-uzu-page-prev'))
      .forEach((control) => setPaginationControlDisabled(control, enabledPageIndex <= 0));
    controls
      .filter((control) => control.hasAttribute('data-uzu-page-next'))
      .forEach((control) => setPaginationControlDisabled(control, enabledPageIndex >= enabledPages.length - 1));

    pagination.dataset.uzuPaginationPage = value;
    const panel = syncPaginationPanels(pagination, value);
    if (panel) queueDisclosureHeightRefresh(panel);

    if (emit && value !== previousValue) {
      pagination.dispatchEvent(new CustomEvent('uzu-pagination-change', {
        bubbles: true,
        detail: {
          value,
          page: nextPage,
          pagination,
          index: pageIndex,
          panel
        }
      }));
      pagination.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function getRelativePaginationPage(pagination, direction) {
    const pages = getEnabledControls(getPaginationPageControls(pagination));
    const active = getActivePaginationPage(pagination);
    const index = Math.max(0, pages.indexOf(active));
    return pages[index + direction] || null;
  }

  function initPaginations(root = document) {
    queryAll(root, '[data-uzu-pagination]').forEach((pagination) => {
      const pages = getPaginationPageControls(pagination);
      if (!pages.length) return;
      syncPaginationState(pagination, getActivePaginationPage(pagination), false);

      if (!markInitialized(pagination, 'Pagination')) return;

      pagination.addEventListener('click', (event) => {
        const control = getScopedEventControl(event, '.uzu-page-button', pagination, '[data-uzu-pagination]');
        if (!control || isControlDisabled(control)) return;
        let nextPage = null;
        if (control.hasAttribute('data-uzu-page-prev')) {
          nextPage = getRelativePaginationPage(pagination, -1);
        } else if (control.hasAttribute('data-uzu-page-next')) {
          nextPage = getRelativePaginationPage(pagination, 1);
        } else if (getPaginationPageValue(control)) {
          nextPage = control;
        }
        if (!nextPage) return;
        event.preventDefault();
        syncPaginationState(pagination, nextPage);
        if (typeof nextPage.focus === 'function') nextPage.focus({ preventScroll: true });
      });

      pagination.addEventListener('keydown', (event) => {
        const control = getScopedEventControl(event, '.uzu-page-button', pagination, '[data-uzu-pagination]');
        if (!control || isControlDisabled(control)) return;
        const pages = getEnabledControls(getPaginationPageControls(pagination));
        const active = getActivePaginationPage(pagination);
        let nextPage = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          nextPage = pages[Math.min(pages.length - 1, Math.max(0, pages.indexOf(active)) + 1)];
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          nextPage = pages[Math.max(0, Math.max(0, pages.indexOf(active)) - 1)];
        } else if (event.key === 'Home') {
          nextPage = pages[0];
        } else if (event.key === 'End') {
          nextPage = pages[pages.length - 1];
        }
        if (nextPage) {
          event.preventDefault();
          syncPaginationState(pagination, nextPage);
          nextPage.focus();
        }
      });
    });
  }

/* ui/js/switches.js */
function setSwitchState(control, checked, emit = true) {
    control.classList.toggle('is-on', checked);
    control.setAttribute('role', 'switch');
    control.setAttribute('aria-checked', checked ? 'true' : 'false');
    if (!control.hasAttribute('tabindex') && control.tagName !== 'BUTTON') {
      control.setAttribute('tabindex', '0');
    }
    if (emit) {
      control.dispatchEvent(new CustomEvent('uzu-switch-change', {
        bubbles: true,
        detail: { checked, switch: control }
      }));
      control.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function toggleSwitch(control) {
    if (control.getAttribute('aria-disabled') === 'true' || control.classList.contains('is-disabled') || control.disabled) return;
    setSwitchState(control, control.getAttribute('aria-checked') !== 'true');
  }

/* ui/js/forms.js */
function initSwitches(root = document) {
    queryAll(root, '[data-uzu-switch]').forEach((control) => {
      const checked = control.getAttribute('aria-checked') === 'true' || control.classList.contains('is-on');
      setSwitchState(control, checked, false);
      if (!markInitialized(control, 'Switch')) return;
      control.addEventListener('click', () => toggleSwitch(control));
      control.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleSwitch(control);
        }
      });
    });
  }

  function getFieldControl(field) {
    return field.querySelector('input:not([type="hidden"]), textarea, select, [data-uzu-select], [data-uzu-combobox], [data-uzu-switch]');
  }

  function getFormField(control) {
    return control.closest('.uzu-field, [data-uzu-field]');
  }

  function getControlValidity(control) {
    if ('validity' in control && control.validity) return control.validity.valid;
    if (control.matches?.('[data-uzu-select], [data-uzu-combobox], [data-uzu-switch]')) {
      return control.getAttribute('aria-invalid') !== 'true' && !control.classList.contains('is-invalid');
    }
    return true;
  }

  function syncFieldValidity(field, emit = false) {
    const control = getFieldControl(field);
    if (!control) return true;
    const valid = getControlValidity(control);
    const invalid = !valid;
    field.classList.toggle('is-invalid', invalid);
    if ('setAttribute' in control) {
      control.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    }
    queryAll(field, '.uzu-form-error, [data-uzu-form-error]').forEach((message) => {
      message.hidden = !invalid;
      message.setAttribute('role', message.getAttribute('role') || 'alert');
    });
    if (emit) {
      field.dispatchEvent(new CustomEvent('uzu-field-validate', {
        bubbles: true,
        detail: { field, control, valid, invalid }
      }));
    }
    return valid;
  }

  function syncFieldInitialState(field) {
    const control = getFieldControl(field);
    const invalid = field.classList.contains('is-invalid') || control?.getAttribute?.('aria-invalid') === 'true';
    field.classList.toggle('is-invalid', invalid);
    if (control && 'setAttribute' in control) {
      control.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    }
    queryAll(field, '.uzu-form-error, [data-uzu-form-error]').forEach((message) => {
      message.hidden = !invalid;
      message.setAttribute('role', message.getAttribute('role') || 'alert');
    });
    return invalid;
  }

  function shouldValidateFormOnInit(form) {
    const value = form.getAttribute('data-uzu-form-validate-on-init');
    return value === '' || value === 'true';
  }

  function validateForm(form, emit = true) {
    const fields = queryAll(form, '.uzu-field, [data-uzu-field]');
    const valid = fields.map((field) => syncFieldValidity(field, emit)).every(Boolean);
    form.classList.toggle('is-invalid', !valid);
    if (emit) {
      form.dispatchEvent(new CustomEvent('uzu-form-validate', {
        bubbles: true,
        detail: { form, valid, invalid: !valid }
      }));
    }
    return valid;
  }

  function initForms(root = document) {
    queryAll(root, '[data-uzu-form]').forEach((form) => {
      if (shouldValidateFormOnInit(form)) {
        validateForm(form, false);
      } else {
        const hasInvalidField = queryAll(form, '.uzu-field, [data-uzu-field]').map(syncFieldInitialState).some(Boolean);
        form.classList.toggle('is-invalid', hasInvalidField || form.classList.contains('is-invalid'));
      }
      if (!markInitialized(form, 'Form')) return;
      queryAll(form, 'input, textarea, select, [data-uzu-select], [data-uzu-combobox], [data-uzu-switch]').forEach((control) => {
        const sync = () => {
          const field = getFormField(control);
          if (field) syncFieldValidity(field, true);
          validateForm(form, true);
        };
        control.addEventListener('input', sync);
        control.addEventListener('change', sync);
        control.addEventListener('blur', sync);
        control.addEventListener('uzu-select-change', sync);
        control.addEventListener('uzu-combobox-change', sync);
        control.addEventListener('uzu-switch-change', sync);
      });
      form.addEventListener('submit', (event) => {
        if (!validateForm(form, true)) {
          event.preventDefault();
          const firstInvalid = form.querySelector('[aria-invalid="true"], .is-invalid input, .is-invalid textarea, .is-invalid select, .is-invalid [tabindex]');
          if (firstInvalid && typeof firstInvalid.focus === 'function') firstInvalid.focus();
        }
      });
    });
  }

  function setSearchClearState(search) {
    const input = search.querySelector('.uzu-search-input, input[type="search"], input[type="text"]');
    const clear = search.querySelector('[data-uzu-search-clear]');
    if (!input || !clear) return;
    clear.hidden = !input.value;
    clear.setAttribute('aria-hidden', input.value ? 'false' : 'true');
  }

  function initSearches(root = document) {
    queryAll(root, '[data-uzu-search]').forEach((search) => {
      const input = search.querySelector('.uzu-search-input, input[type="search"], input[type="text"]');
      const clear = search.querySelector('[data-uzu-search-clear]');
      if (!input || !clear) return;
      setSearchClearState(search);
      if (!markInitialized(search, 'Search')) return;
      input.addEventListener('input', () => setSearchClearState(search));
      clear.addEventListener('click', () => {
        if (input.disabled || input.readOnly) return;
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        setSearchClearState(search);
        input.focus();
      });
    });
  }

  function setPasswordVisible(password, visible, emit = true) {
    const input = password.querySelector('.uzu-password-input, input[type="password"], input[type="text"]');
    const toggle = password.querySelector('[data-uzu-password-toggle]');
    if (!input || !toggle) return;
    input.type = visible ? 'text' : 'password';
    password.classList.toggle('is-visible', visible);
    toggle.setAttribute('aria-pressed', visible ? 'true' : 'false');
    if (emit) {
      password.dispatchEvent(new CustomEvent('uzu-password-toggle', {
        bubbles: true,
        detail: { visible, password, input, toggle }
      }));
    }
  }

  function initPasswords(root = document) {
    queryAll(root, '[data-uzu-password]').forEach((password) => {
      const input = password.querySelector('.uzu-password-input, input[type="password"], input[type="text"]');
      const toggle = password.querySelector('[data-uzu-password-toggle]');
      if (!input || !toggle) return;
      setPasswordVisible(password, input.type === 'text', false);
      if (!markInitialized(password, 'Password')) return;
      toggle.addEventListener('click', () => {
        if (input.disabled || toggle.disabled || toggle.getAttribute('aria-disabled') === 'true') return;
        setPasswordVisible(password, input.type !== 'text');
      });
    });
  }

  function getStepperInput(stepper) {
    return stepper.querySelector('.uzu-stepper-input, input[type="number"]');
  }

  function getNumberAttribute(input, name, fallback) {
    const value = Number.parseFloat(input.getAttribute(name));
    return Number.isFinite(value) ? value : fallback;
  }

  function getInputNumber(input) {
    const value = Number.parseFloat(input.value);
    return Number.isFinite(value) ? value : 0;
  }

  function clampNumber(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function getStepPrecision(step) {
    const text = String(step);
    if (/e/i.test(text)) {
      const fixed = Number(step).toFixed(12).replace(/0+$/, '');
      const fixedIndex = fixed.indexOf('.');
      return fixedIndex === -1 ? 0 : fixed.length - fixedIndex - 1;
    }
    const index = text.indexOf('.');
    return index === -1 ? 0 : text.length - index - 1;
  }

  function syncStepperDisabled(stepper) {
    const input = getStepperInput(stepper);
    if (!input) return;
    const min = getNumberAttribute(input, 'min', Number.NEGATIVE_INFINITY);
    const max = getNumberAttribute(input, 'max', Number.POSITIVE_INFINITY);
    const value = getInputNumber(input);
    queryAll(stepper, '[data-uzu-stepper-decrement]').forEach((button) => {
      button.disabled = input.disabled || value <= min;
    });
    queryAll(stepper, '[data-uzu-stepper-increment]').forEach((button) => {
      button.disabled = input.disabled || value >= max;
    });
  }

  function setStepperValue(stepper, nextValue, emit = true) {
    const input = getStepperInput(stepper);
    if (!input) return;
    const min = getNumberAttribute(input, 'min', Number.NEGATIVE_INFINITY);
    const max = getNumberAttribute(input, 'max', Number.POSITIVE_INFINITY);
    const step = Math.abs(getNumberAttribute(input, 'step', 1)) || 1;
    const precision = getStepPrecision(step);
    const clamped = clampNumber(nextValue, min, max);
    input.value = Number.isFinite(clamped) ? clamped.toFixed(precision).replace(/\.?0+$/, '') : String(nextValue);
    syncStepperDisabled(stepper);
    if (emit) {
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      stepper.dispatchEvent(new CustomEvent('uzu-stepper-change', {
        bubbles: true,
        detail: { value: input.value, number: getInputNumber(input), stepper, input }
      }));
    }
  }

  function stepStepper(stepper, direction) {
    const input = getStepperInput(stepper);
    if (!input || input.disabled || input.readOnly) return;
    const step = Math.abs(getNumberAttribute(input, 'step', 1)) || 1;
    setStepperValue(stepper, getInputNumber(input) + step * direction);
    input.focus();
  }

  function initSteppers(root = document) {
    queryAll(root, '[data-uzu-stepper]').forEach((stepper) => {
      const input = getStepperInput(stepper);
      if (!input) return;
      syncStepperDisabled(stepper);
      if (!markInitialized(stepper, 'Stepper')) return;
      queryAll(stepper, '[data-uzu-stepper-decrement]').forEach((button) => {
        button.addEventListener('click', () => stepStepper(stepper, -1));
      });
      queryAll(stepper, '[data-uzu-stepper-increment]').forEach((button) => {
        button.addEventListener('click', () => stepStepper(stepper, 1));
      });
      input.addEventListener('input', () => syncStepperDisabled(stepper));
      input.addEventListener('change', () => setStepperValue(stepper, getInputNumber(input), false));
    });
  }

  function syncSliderValue(slider) {
    if (!slider || !('value' in slider)) return;
    const min = Number.parseFloat(slider.min || '0');
    const max = Number.parseFloat(slider.max || '100');
    const value = Number.parseFloat(slider.value || '0');
    const range = max - min;
    const percent = range ? ((value - min) / range) * 100 : 0;
    const clampedPercent = Math.min(100, Math.max(0, percent));
    slider.style.setProperty('--uzu-slider-value', `${clampedPercent}%`);
    syncSliderSteps(slider, min, max, value, range);
  }

  function syncSliderSteps(slider, min, max, value, range) {
    const stepped = slider.classList.contains('uzu-slider-stepped') || slider.hasAttribute('data-uzu-slider-stepped');
    const stepAttr = slider.getAttribute('step');
    const step = stepAttr !== 'any' ? Number.parseFloat(stepAttr || '1') : NaN;
    const stepCount = range > 0 && Number.isFinite(step) && step > 0 ? Math.floor(range / step) + 1 : 0;
    if (!stepped || stepCount < 2 || stepCount > 64) {
      slider.style.setProperty('--uzu-slider-step-count', '0');
      slider.style.setProperty('--uzu-slider-step-ticks', 'none');
      return;
    }

    const clampedValue = Math.min(range, Math.max(0, value - min));
    const valueIndex = Math.round(clampedValue / step);
    const ticks = Array.from({ length: stepCount }, (_, index) => {
      const stepValue = Math.min(range, index * step);
      const position = (stepValue / range) * 100;
      const color = index <= valueIndex ? 'var(--uzu-slider-step-dot-active)' : 'var(--uzu-slider-step-dot)';
      return `radial-gradient(circle at ${position}% 50%, ${color} 0 var(--uzu-slider-step-dot-radius), transparent calc(var(--uzu-slider-step-dot-radius) + 1px))`;
    });
    slider.style.setProperty('--uzu-slider-step-count', String(stepCount));
    slider.style.setProperty('--uzu-slider-step-ticks', ticks.join(', '));
  }

  function initSliders(root = document) {
    queryAll(root, '[data-uzu-slider], .uzu-slider').forEach((slider) => {
      if (!(slider instanceof HTMLInputElement) || slider.type !== 'range') return;
      syncSliderValue(slider);
      if (!markInitialized(slider, 'Slider')) return;
      slider.addEventListener('input', () => syncSliderValue(slider));
      slider.addEventListener('change', () => syncSliderValue(slider));
    });
  }

/* ui/js/menus-core.js */
function getMenuTrigger(menu) {
    return menu.querySelector('[data-uzu-menu-trigger], .uzu-menu-trigger');
  }

  function getMenuContent(menu) {
    return menu.querySelector('[data-uzu-menu-content], .uzu-menu-content');
  }

  function getMenuItems(menu) {
    return getScopedControls(menu, '.uzu-menu-item', '[data-uzu-menu], [data-uzu-context-menu]');
  }

  function emitMenuEvent(menu, name, trigger = getMenuTrigger(menu), extra = {}) {
    menu.dispatchEvent(new CustomEvent(name, {
      bubbles: true,
      detail: {
        menu,
        trigger,
        content: getMenuContent(menu),
        ...extra
      }
    }));
  }

  function emitMenuSelectEvent(menu, item) {
    emitMenuEvent(menu, 'uzu-menu-select', menuActiveTriggers.get(menu) || getMenuTrigger(menu), {
      item,
      value: getControlValue(item, 'uzuMenuValue')
    });
  }

  function setContextMenuPoint(menu, content, x, y) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    const rect = content.getBoundingClientRect();
    const inlineMargin = 8;
    const blockMargin = 8;
    const nextX = Math.max(inlineMargin, Math.min(x, window.innerWidth - rect.width - inlineMargin));
    const nextY = Math.max(blockMargin, Math.min(y, window.innerHeight - rect.height - blockMargin));
    menu.style.setProperty('--uzu-menu-x', `${nextX}px`);
    menu.style.setProperty('--uzu-menu-y', `${nextY}px`);
  }

  function focusMenuItem(menu, index) {
    const items = getEnabledControls(getMenuItems(menu));
    if (!items.length) return null;
    const nextIndex = (index + items.length) % items.length;
    items.forEach((item, itemIndex) => {
      item.classList.toggle('is-active', itemIndex === nextIndex);
      item.setAttribute('tabindex', itemIndex === nextIndex ? '0' : '-1');
    });
    items[nextIndex].focus();
    return items[nextIndex];
  }

  function openMenu(menu, options = {}) {
    const trigger = options.trigger || getMenuTrigger(menu);
    const content = getMenuContent(menu);
    if (!content) return;
    if (menu.classList.contains('is-open')) {
      if (Number.isFinite(options.x) && Number.isFinite(options.y)) {
        menu.classList.add('is-context');
        setContextMenuPoint(menu, content, options.x, options.y);
      }
      return;
    }
    const existingTimer = menuCloseTimers.get(menu);
    if (existingTimer) {
      window.clearTimeout(existingTimer);
      menuCloseTimers.delete(menu);
    }
    const isContextMenu = Number.isFinite(options.x) && Number.isFinite(options.y);
    if (isContextMenu) menu.classList.add('is-context');
    content.hidden = false;
    menu.classList.remove('is-closing');
    menu.classList.add('is-open');
    queueDisclosureHeightRefresh(content);
    if (isContextMenu) setContextMenuPoint(menu, content, options.x, options.y);
    if (trigger) {
      trigger.setAttribute('aria-haspopup', trigger.getAttribute('aria-haspopup') || 'menu');
      trigger.setAttribute('aria-expanded', 'true');
    }
    menuActiveTriggers.set(menu, trigger || null);
    content.setAttribute('role', content.getAttribute('role') || 'menu');
    getMenuItems(menu).forEach((item) => {
      item.setAttribute('role', item.getAttribute('role') || 'menuitem');
      item.setAttribute('tabindex', '-1');
    });
    emitMenuEvent(menu, 'uzu-menu-open', trigger);
    if (options.focus !== false) focusMenuItem(menu, 0);
  }

  function closeMenu(menu, options = {}) {
    const content = getMenuContent(menu);
    if (!content || menu.classList.contains('is-closing') || (!menu.classList.contains('is-open') && content.hidden)) return;
    const trigger = options.trigger || menuActiveTriggers.get(menu) || getMenuTrigger(menu);
    const existingTimer = menuCloseTimers.get(menu);
    if (existingTimer) window.clearTimeout(existingTimer);
    menu.classList.remove('is-open');
    menu.classList.add('is-closing');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    getMenuItems(menu).forEach((item) => {
      item.classList.remove('is-active');
      item.setAttribute('tabindex', '-1');
    });
    const finish = () => {
      menu.classList.remove('is-closing', 'is-context');
      content.hidden = true;
      menuCloseTimers.delete(menu);
      menuActiveTriggers.delete(menu);
      emitMenuEvent(menu, 'uzu-menu-close', trigger);
      if (options.restoreFocus && trigger && typeof trigger.focus === 'function') trigger.focus();
    };
    const timer = scheduleAfterAnimation([content], finish);
    if (timer) menuCloseTimers.set(menu, timer);
  }

  function closeOpenMenus(except = null) {
    let count = 0;
    queryAll(document, '[data-uzu-menu].is-open, [data-uzu-context-menu].is-open').forEach((menu) => {
      if (menu !== except) {
        count += 1;
        closeMenu(menu);
      }
    });
    return count;
  }

  function handleMenuItemKeydown(event, menu, item) {
    const enabled = getEnabledControls(getMenuItems(menu));
    const index = Math.max(0, enabled.indexOf(item));
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusMenuItem(menu, index + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusMenuItem(menu, index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusMenuItem(menu, 0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusMenuItem(menu, enabled.length - 1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(menu, { restoreFocus: true });
    } else if (event.key === 'Tab') {
      closeMenu(menu);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      item.click();
    }
  }

  function initMenus(root = document) {
    queryAll(root, '[data-uzu-menu]').forEach((menu) => {
      const trigger = getMenuTrigger(menu);
      const content = getMenuContent(menu);
      if (!trigger || !content) return;
      const contentId = ensureId(content, 'uzu-menu-content');
      trigger.setAttribute('aria-haspopup', 'menu');
      trigger.setAttribute('aria-expanded', menu.classList.contains('is-open') ? 'true' : 'false');
      trigger.setAttribute('aria-controls', contentId);
      if (!menu.classList.contains('is-open')) content.hidden = true;
      getMenuItems(menu).forEach((item) => {
        item.setAttribute('role', item.getAttribute('role') || 'menuitem');
        item.setAttribute('tabindex', '-1');
      });
      if (!markInitialized(menu, 'Menu')) return;
      trigger.addEventListener('click', (event) => {
        if (isControlDisabled(trigger)) return;
        event.preventDefault();
        if (menu.classList.contains('is-open')) {
          closeMenu(menu, { restoreFocus: true });
        } else {
          closeOpenMenus(menu);
          openMenu(menu, { trigger });
        }
      });
      trigger.addEventListener('keydown', (event) => {
        if (isControlDisabled(trigger)) return;
        if (['ArrowDown', 'Enter', ' '].includes(event.key)) {
          event.preventDefault();
          closeOpenMenus(menu);
          openMenu(menu, { trigger });
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          closeOpenMenus(menu);
          openMenu(menu, { trigger, focus: false });
          focusMenuItem(menu, getEnabledControls(getMenuItems(menu)).length - 1);
        }
      });
      menu.addEventListener('click', (event) => {
        const item = getScopedEventControl(event, '.uzu-menu-item', menu, '[data-uzu-menu], [data-uzu-context-menu]');
        if (!item || isControlDisabled(item)) return;
        emitMenuSelectEvent(menu, item);
        if (item.dataset.uzuMenuKeepOpen === 'true') return;
        closeMenu(menu, { restoreFocus: false });
      });
      menu.addEventListener('keydown', (event) => {
        const item = getScopedEventControl(event, '.uzu-menu-item', menu, '[data-uzu-menu], [data-uzu-context-menu]');
        if (!item) return;
        handleMenuItemKeydown(event, menu, item);
      });
      getMenuItems(menu).forEach((item) => {
        item.addEventListener('mouseenter', () => {
          const enabled = getEnabledControls(getMenuItems(menu));
          const index = enabled.indexOf(item);
          if (index >= 0) focusMenuItem(menu, index);
        });
      });
    });
  }

  function getContextMenuTrigger(contextMenu) {
    const selector = contextMenu.dataset.uzuContextMenuTrigger || '';
    if (!selector) return contextMenu;
    try {
      return document.querySelector(selector) || contextMenu;
    } catch (_) {
      return contextMenu;
    }
  }

  function getContextPoint(event, target) {
    if ('clientX' in event && event.clientX) {
      return { x: event.clientX, y: event.clientY };
    }
    const rect = target.getBoundingClientRect();
    return { x: rect.left, y: rect.bottom + 4 };
  }

  function initContextMenus(root = document) {
    queryAll(root, '[data-uzu-context-menu]').forEach((menu) => {
      const content = getMenuContent(menu);
      const trigger = getContextMenuTrigger(menu);
      if (!content || !trigger) return;
      const contentId = ensureId(content, 'uzu-context-menu-content');
      content.hidden = true;
      content.setAttribute('role', content.getAttribute('role') || 'menu');
      if (trigger !== menu) {
        trigger.setAttribute('aria-haspopup', 'menu');
        trigger.setAttribute('aria-controls', contentId);
        trigger.setAttribute('aria-expanded', 'false');
      }
      getMenuItems(menu).forEach((item) => {
        item.setAttribute('role', item.getAttribute('role') || 'menuitem');
        item.setAttribute('tabindex', '-1');
      });
      if (!markInitialized(menu, 'ContextMenu')) return;
      trigger.addEventListener('contextmenu', (event) => {
        if (isControlDisabled(trigger)) return;
        event.preventDefault();
        closeOpenMenus(menu);
        const point = getContextPoint(event, trigger);
        openMenu(menu, { trigger, x: point.x, y: point.y });
      });
      trigger.addEventListener('keydown', (event) => {
        if (isControlDisabled(trigger)) return;
        if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
          event.preventDefault();
          closeOpenMenus(menu);
          const point = getContextPoint(event, trigger);
          openMenu(menu, { trigger, x: point.x, y: point.y });
        }
      });
      menu.addEventListener('click', (event) => {
        const item = getScopedEventControl(event, '.uzu-menu-item', menu, '[data-uzu-menu], [data-uzu-context-menu]');
        if (!item || isControlDisabled(item)) return;
        emitMenuSelectEvent(menu, item);
        if (item.dataset.uzuMenuKeepOpen === 'true') return;
        closeMenu(menu);
      });
      menu.addEventListener('keydown', (event) => {
        const item = getScopedEventControl(event, '.uzu-menu-item', menu, '[data-uzu-menu], [data-uzu-context-menu]');
        if (!item) return;
        handleMenuItemKeydown(event, menu, item);
      });
    });
  }

/* ui/js/menubars.js */
function initMenubars(root = document) {
    queryAll(root, '[data-uzu-menubar]').forEach((menubar) => {
      const items = getScopedControls(menubar, '.uzu-menubar-item', '[data-uzu-menubar]');
      if (!items.length) return;
      menubar.setAttribute('role', menubar.getAttribute('role') || 'menubar');
      items.forEach((item, index) => {
        item.setAttribute('role', item.getAttribute('role') || 'menuitem');
        item.setAttribute('tabindex', index === 0 ? '0' : '-1');
      });
      if (!markInitialized(menubar, 'Menubar')) return;
      menubar.addEventListener('click', (event) => {
        const item = getScopedEventControl(event, '.uzu-menubar-item', menubar, '[data-uzu-menubar]');
        if (!item || isControlDisabled(item)) return;
        items.forEach((control) => {
          const active = control === item;
          control.classList.toggle('is-active', active);
          control.setAttribute('tabindex', active ? '0' : '-1');
        });
        menubar.dispatchEvent(new CustomEvent('uzu-menubar-change', {
          bubbles: true,
          detail: { value: getControlValue(item, 'uzuMenubarValue'), item, menubar, index: items.indexOf(item) }
        }));
      });
      menubar.addEventListener('keydown', (event) => {
        const item = getScopedEventControl(event, '.uzu-menubar-item', menubar, '[data-uzu-menubar]');
        if (!item || isControlDisabled(item)) return;
        let next = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = moveActiveControl(items, item, 1);
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = moveActiveControl(items, item, -1);
        else if (event.key === 'Home') next = getEnabledControls(items)[0];
        else if (event.key === 'End') next = getEnabledControls(items).at(-1);
        if (next) {
          event.preventDefault();
          items.forEach((control) => control.setAttribute('tabindex', control === next ? '0' : '-1'));
          next.focus();
        }
      });
    });
  }

/* ui/js/commands.js */
function getCommandItems(command) {
    return getScopedControls(command, '.uzu-command-item', '[data-uzu-command]');
  }

  function getCommandInput(command) {
    return command.querySelector('.uzu-command-input, [data-uzu-command-input]');
  }

  function getCommandList(command) {
    return command.querySelector('.uzu-command-list, [data-uzu-command-list]');
  }

  function getCommandItemText(item) {
    return (item.dataset.uzuCommandText || item.textContent || '').trim().toLowerCase();
  }

  function getVisibleCommandItems(command) {
    return getEnabledControls(getCommandItems(command).filter((item) => !item.hidden));
  }

  function focusCommandItem(command, index, focus = true) {
    const items = getVisibleCommandItems(command);
    if (!items.length) return null;
    const nextIndex = (index + items.length) % items.length;
    items.forEach((item, itemIndex) => {
      item.classList.toggle('is-active', itemIndex === nextIndex);
      item.setAttribute('tabindex', itemIndex === nextIndex ? '0' : '-1');
    });
    const input = getCommandInput(command);
    if (input && items[nextIndex].id) input.setAttribute('aria-activedescendant', items[nextIndex].id);
    if (focus) items[nextIndex].focus();
    return items[nextIndex];
  }

  function filterCommand(command, focus = false) {
    const input = getCommandInput(command);
    const list = getCommandList(command);
    const query = (input?.value || '').trim().toLowerCase();
    let visibleCount = 0;
    getCommandItems(command).forEach((item, index) => {
      ensureId(item, `uzu-command-item-${index + 1}`);
      const visible = !query || getCommandItemText(item).includes(query);
      item.hidden = !visible;
      item.setAttribute('tabindex', '-1');
      item.classList.remove('is-active');
      if (visible) visibleCount += 1;
    });
    queryAll(command, '.uzu-command-empty').forEach((empty) => {
      empty.hidden = visibleCount > 0;
    });
    if (list) list.setAttribute('aria-busy', 'false');
    if (visibleCount) {
      const items = getVisibleCommandItems(command);
      items[0].classList.add('is-active');
      items[0].setAttribute('tabindex', '0');
      if (input && items[0].id) input.setAttribute('aria-activedescendant', items[0].id);
      if (focus) items[0].focus();
    } else if (input) {
      input.removeAttribute('aria-activedescendant');
    }
    command.dispatchEvent(new CustomEvent('uzu-command-filter', {
      bubbles: true,
      detail: { value: input?.value || '', command, visibleCount }
    }));
  }

  function initCommands(root = document) {
    queryAll(root, '[data-uzu-command]').forEach((command) => {
      const input = getCommandInput(command);
      const list = getCommandList(command);
      const items = getCommandItems(command);
      if (!input || !list || !items.length) return;
      list.setAttribute('role', list.getAttribute('role') || 'listbox');
      input.setAttribute('role', input.getAttribute('role') || 'combobox');
      input.setAttribute('aria-expanded', 'true');
      input.setAttribute('aria-controls', ensureId(list, 'uzu-command-list'));
      items.forEach((item, index) => {
        ensureId(item, `uzu-command-item-${index + 1}`);
        item.setAttribute('role', item.getAttribute('role') || 'option');
        item.setAttribute('tabindex', '-1');
      });
      filterCommand(command);
      if (!markInitialized(command, 'Command')) return;
      input.addEventListener('input', () => filterCommand(command));
      input.addEventListener('keydown', (event) => {
        const visible = getVisibleCommandItems(command);
        const active = visible.find((item) => item.classList.contains('is-active')) || visible[0];
        const index = Math.max(0, visible.indexOf(active));
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          focusCommandItem(command, index + 1, false);
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          focusCommandItem(command, index - 1, false);
        } else if (event.key === 'Enter' && active) {
          event.preventDefault();
          active.click();
        }
      });
      command.addEventListener('click', (event) => {
        const item = getScopedEventControl(event, '.uzu-command-item', command, '[data-uzu-command]');
        if (!item || isControlDisabled(item)) return;
        command.dispatchEvent(new CustomEvent('uzu-command-select', {
          bubbles: true,
          detail: { value: getControlValue(item, 'uzuCommandValue'), item, command }
        }));
      });
    });
  }

/* ui/js/disclosures.js */
function parseLengthValue(value) {
    return Number.parseFloat(value) || 0;
  }

  function syncDisclosurePanelHeight(panel) {
    if (!panel) return;
    if (!panel.isConnected || panel.getClientRects().length === 0) {
      panel.style.removeProperty('--uzu-disclosure-panel-height');
      return;
    }
    const style = window.getComputedStyle(panel);
    const targetPadding = parseLengthValue(style.getPropertyValue('--uzu-disclosure-panel-block-end-padding'));
    const currentPadding = parseLengthValue(style.paddingBottom);
    panel.style.setProperty('--uzu-disclosure-panel-height', `${panel.scrollHeight + Math.max(0, targetPadding - currentPadding)}px`);
  }

  function refreshDisclosureHeights(root = document) {
    queryAll(root, '[data-uzu-disclosure].is-open').forEach((disclosure) => {
      syncDisclosurePanelHeight(disclosure.querySelector('[data-uzu-disclosure-panel]'));
    });
  }

  function queueDisclosureHeightRefresh(root = document) {
    window.requestAnimationFrame(() => refreshDisclosureHeights(root));
  }

  function setDisclosureState(disclosure, open, emit = true) {
    const trigger = disclosure.querySelector('[data-uzu-disclosure-trigger]');
    const panel = disclosure.querySelector('[data-uzu-disclosure-panel]');
    const existingTimer = disclosureCloseTimers.get(disclosure);
    if (existingTimer) {
      window.clearTimeout(existingTimer);
      disclosureCloseTimers.delete(disclosure);
    }
    if (trigger) trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      disclosure.classList.remove('is-closing');
      if (panel) panel.hidden = false;
      syncDisclosurePanelHeight(panel);
      disclosure.classList.add('is-open');
    } else {
      if (disclosure.classList.contains('is-open')) {
        syncDisclosurePanelHeight(panel);
        disclosure.classList.remove('is-open');
        disclosure.classList.add('is-closing');
        const finish = () => {
          disclosure.classList.remove('is-closing');
          if (panel) panel.hidden = true;
          disclosureCloseTimers.delete(disclosure);
        };
        const timer = scheduleAfterAnimation([panel].filter(Boolean), finish);
        if (timer) disclosureCloseTimers.set(disclosure, timer);
      } else {
        disclosure.classList.remove('is-closing');
        if (panel) panel.hidden = true;
      }
    }
    if (emit) {
      disclosure.dispatchEvent(new CustomEvent('uzu-disclosure-change', {
        bubbles: true,
        detail: { open, disclosure }
      }));
      disclosure.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function initDisclosures(root = document) {
    queryAll(root, '[data-uzu-disclosure]').forEach((disclosure) => {
      const trigger = disclosure.querySelector('[data-uzu-disclosure-trigger]');
      const panel = disclosure.querySelector('[data-uzu-disclosure-panel]');
      if (!trigger || !panel) return;
      const panelId = ensureId(panel, 'uzu-disclosure-panel');
      trigger.setAttribute('aria-controls', panelId);
      setDisclosureState(disclosure, disclosure.classList.contains('is-open') || trigger.getAttribute('aria-expanded') === 'true', false);
      if (!markInitialized(disclosure, 'Disclosure')) return;
      trigger.addEventListener('click', () => {
        setDisclosureState(disclosure, !disclosure.classList.contains('is-open'));
      });
    });
  }

/* ui/js/comboboxes.js */
function getComboboxInput(combobox) {
    return combobox.querySelector('[data-uzu-combobox-input], .uzu-combobox-input');
  }

  function getComboboxList(combobox) {
    return combobox.querySelector('[data-uzu-combobox-list], .uzu-combobox-list');
  }

  function getComboboxOptions(combobox) {
    return getScopedControls(combobox, '[data-uzu-combobox-option], .uzu-combobox-option', '[data-uzu-combobox]');
  }

  function getComboboxOptionText(option) {
    return (option.dataset.uzuComboboxText || option.textContent || '').trim();
  }

  function ensureComboboxHiddenInput(combobox) {
    const name = combobox.dataset.uzuComboboxName;
    if (!name) return null;
    let input = combobox.querySelector('input[type="hidden"][data-uzu-combobox-hidden]');
    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.dataset.uzuComboboxHidden = '';
      combobox.append(input);
    }
    input.name = name;
    return input;
  }

  function getVisibleComboboxOptions(combobox) {
    return getEnabledControls(getComboboxOptions(combobox).filter((option) => !option.hidden));
  }

  function openCombobox(combobox) {
    const input = getComboboxInput(combobox);
    const list = getComboboxList(combobox);
    if (!input || !list) return;
    list.hidden = false;
    combobox.classList.add('is-open');
    input.setAttribute('aria-expanded', 'true');
    queueDisclosureHeightRefresh(list);
    combobox.dispatchEvent(new CustomEvent('uzu-combobox-open', {
      bubbles: true,
      detail: { combobox, input, list }
    }));
  }

  function closeCombobox(combobox) {
    const input = getComboboxInput(combobox);
    const list = getComboboxList(combobox);
    if (!input || !list || list.hidden) return;
    combobox.classList.remove('is-open');
    input.setAttribute('aria-expanded', 'false');
    list.hidden = true;
    getComboboxOptions(combobox).forEach((option) => option.classList.remove('is-active'));
    input.removeAttribute('aria-activedescendant');
    combobox.dispatchEvent(new CustomEvent('uzu-combobox-close', {
      bubbles: true,
      detail: { combobox, input, list }
    }));
  }

  function focusComboboxOption(combobox, index) {
    const input = getComboboxInput(combobox);
    const options = getVisibleComboboxOptions(combobox);
    if (!options.length) return null;
    const nextIndex = (index + options.length) % options.length;
    options.forEach((option, optionIndex) => {
      option.classList.toggle('is-active', optionIndex === nextIndex);
    });
    if (input) input.setAttribute('aria-activedescendant', ensureId(options[nextIndex], 'uzu-combobox-option'));
    return options[nextIndex];
  }

  function filterCombobox(combobox) {
    const input = getComboboxInput(combobox);
    const query = (input?.value || '').trim().toLowerCase();
    let visibleCount = 0;
    getComboboxOptions(combobox).forEach((option, index) => {
      ensureId(option, `uzu-combobox-option-${index + 1}`);
      const visible = !query || getComboboxOptionText(option).toLowerCase().includes(query);
      option.hidden = !visible;
      option.classList.remove('is-active');
      if (visible) visibleCount += 1;
    });
    queryAll(combobox, '.uzu-combobox-empty').forEach((empty) => {
      empty.hidden = visibleCount > 0;
    });
    focusComboboxOption(combobox, 0);
    combobox.dispatchEvent(new CustomEvent('uzu-combobox-filter', {
      bubbles: true,
      detail: { value: input?.value || '', combobox, visibleCount }
    }));
  }

  function setComboboxValue(combobox, optionOrValue, emit = true) {
    const input = getComboboxInput(combobox);
    const hidden = ensureComboboxHiddenInput(combobox);
    const options = getComboboxOptions(combobox);
    const option = optionOrValue instanceof Element
      ? optionOrValue
      : options.find((item) => getControlValue(item, 'uzuComboboxValue') === String(optionOrValue));
    if (!input || !option || isControlDisabled(option)) return;
    const value = getControlValue(option, 'uzuComboboxValue');
    const label = getComboboxOptionText(option);
    input.value = label;
    if (hidden) hidden.value = value;
    combobox.dataset.uzuComboboxValue = value;
    options.forEach((item) => {
      const selected = item === option;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
    closeCombobox(combobox);
    if (emit) {
      comboboxSelectionInputs.add(input);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      comboboxSelectionInputs.delete(input);
      input.dispatchEvent(new Event('change', { bubbles: true }));
      combobox.dispatchEvent(new CustomEvent('uzu-combobox-change', {
        bubbles: true,
        detail: { value, label, option, combobox, input }
      }));
      combobox.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function initComboboxes(root = document) {
    queryAll(root, '[data-uzu-combobox]').forEach((combobox) => {
      const input = getComboboxInput(combobox);
      const list = getComboboxList(combobox);
      const options = getComboboxOptions(combobox);
      if (!input || !list || !options.length) return;
      const listId = ensureId(list, 'uzu-combobox-list');
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-autocomplete', input.getAttribute('aria-autocomplete') || 'list');
      input.setAttribute('aria-expanded', 'false');
      input.setAttribute('aria-controls', listId);
      list.setAttribute('role', list.getAttribute('role') || 'listbox');
      ensureComboboxHiddenInput(combobox);
      options.forEach((option, index) => {
        ensureId(option, `uzu-combobox-option-${index + 1}`);
        option.setAttribute('role', option.getAttribute('role') || 'option');
        option.setAttribute('aria-selected', option.classList.contains('is-selected') ? 'true' : 'false');
      });
      const selected = options.find((option) => option.classList.contains('is-selected') || option.getAttribute('aria-selected') === 'true');
      if (selected) setComboboxValue(combobox, selected, false);
      else if (!input.value) {
        const hidden = ensureComboboxHiddenInput(combobox);
        if (hidden) hidden.value = '';
      }
      list.hidden = true;
      if (!markInitialized(combobox, 'Combobox')) return;
      input.addEventListener('focus', () => {
        filterCombobox(combobox);
        openCombobox(combobox);
      });
      input.addEventListener('input', () => {
        if (comboboxSelectionInputs.has(input)) return;
        filterCombobox(combobox);
        openCombobox(combobox);
      });
      input.addEventListener('keydown', (event) => {
        const visible = getVisibleComboboxOptions(combobox);
        const active = visible.find((option) => option.classList.contains('is-active'));
        const index = Math.max(0, visible.indexOf(active));
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          openCombobox(combobox);
          focusComboboxOption(combobox, index + 1);
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          openCombobox(combobox);
          focusComboboxOption(combobox, index - 1);
        } else if (event.key === 'Enter' && active) {
          event.preventDefault();
          setComboboxValue(combobox, active);
        } else if (event.key === 'Escape') {
          event.preventDefault();
          closeCombobox(combobox);
        }
      });
      combobox.addEventListener('click', (event) => {
        const option = getScopedEventControl(event, '[data-uzu-combobox-option], .uzu-combobox-option', combobox, '[data-uzu-combobox]');
        if (option) {
          event.preventDefault();
          setComboboxValue(combobox, option);
        } else if (event.target === input) {
          openCombobox(combobox);
        }
      });
    });
  }

/* ui/js/data-grids.js */
function getDataGridRows(table) {
    return queryAll(table, 'tbody tr, [data-uzu-grid-row]').filter((row) => row.closest('table') === table && !row.hasAttribute('data-uzu-grid-empty'));
  }

  function getDataGridVisibleRows(table) {
    return getDataGridRows(table).filter((row) => !row.hidden);
  }

  function getDataGridSelectableRows(table) {
    return getDataGridVisibleRows(table).filter((row) => !row.hasAttribute('data-uzu-grid-disabled') && row.getAttribute('aria-disabled') !== 'true');
  }

  function getDataGridRowValue(row) {
    return row.dataset.uzuGridRow || row.dataset.value || '';
  }

  function getDataGridRowSelection(row) {
    return row.querySelector('[data-uzu-grid-selection], input[type="checkbox"]');
  }

  function getDataGridSortText(row, columnIndex) {
    const cell = row.cells[columnIndex];
    if (!cell) return '';
    return cell.dataset.uzuGridSortValue ?? cell.getAttribute('data-sort-value') ?? cell.textContent.trim();
  }

  function syncDataGridRowSelected(grid, table, row, selected, emit = true) {
    const nextSelected = Boolean(selected);
    const selection = getDataGridRowSelection(row);
    row.classList.toggle('is-selected', nextSelected);
    row.setAttribute('aria-selected', nextSelected ? 'true' : 'false');
    if (selection && 'checked' in selection) selection.checked = nextSelected;
    if (emit) {
      grid.dispatchEvent(new CustomEvent('uzu-data-grid-select', {
        bubbles: true,
        detail: { grid, table, row, selected: nextSelected, value: getDataGridRowValue(row) }
      }));
    }
  }

  function getDataGridTable(gridOrTable) {
    return gridOrTable?.matches?.('table') ? gridOrTable : gridOrTable?.querySelector?.('table');
  }

  function getDataGridRoot(table) {
    return table?.closest?.('[data-uzu-data-grid]') || table;
  }

  function setDataGridRowSelected(row, selected, emit = true) {
    const table = row?.closest?.('table');
    const grid = getDataGridRoot(table);
    if (!table || !grid || row.hasAttribute('data-uzu-grid-empty')) return;
    syncDataGridRowSelected(grid, table, row, selected, emit);
    syncDataGridSelectAll(grid, table);
  }

  function syncDataGridSelectAll(grid, table) {
    const controls = queryAll(table, '[data-uzu-grid-select-all]');
    if (!controls.length) return;
    const rows = getDataGridSelectableRows(table);
    const selectedRows = rows.filter((row) => row.getAttribute('aria-selected') === 'true' || row.classList.contains('is-selected'));
    controls.forEach((control) => {
      if ('checked' in control) control.checked = rows.length > 0 && selectedRows.length === rows.length;
      if ('indeterminate' in control) control.indeterminate = selectedRows.length > 0 && selectedRows.length < rows.length;
      control.setAttribute('aria-checked', selectedRows.length > 0 && selectedRows.length === rows.length ? 'true' : selectedRows.length > 0 ? 'mixed' : 'false');
    });
  }

  function updateDataGridEmptyState(table) {
    const rows = getDataGridVisibleRows(table);
    queryAll(table, '[data-uzu-grid-empty]').forEach((row) => {
      row.hidden = rows.length > 0;
    });
  }

  function refreshDataGrid(gridOrTable) {
    const table = getDataGridTable(gridOrTable);
    if (!table) return;
    const grid = getDataGridRoot(table);
    updateDataGridEmptyState(table);
    syncDataGridSelectAll(grid, table);
  }

  function initDataGrids(root = document) {
    queryAll(root, '[data-uzu-data-grid]').forEach((grid) => {
      const table = getDataGridTable(grid);
      if (!table) return;
      const allRows = () => getDataGridRows(table);
      const rows = () => getDataGridVisibleRows(table);
      allRows().forEach((row, index) => {
        row.dataset.uzuGridRow = row.dataset.uzuGridRow || String(index + 1);
        row.setAttribute('tabindex', row.getAttribute('tabindex') || '0');
        row.setAttribute('aria-selected', row.classList.contains('is-selected') || row.getAttribute('aria-selected') === 'true' ? 'true' : 'false');
        const selection = getDataGridRowSelection(row);
        if (selection && 'checked' in selection) selection.checked = row.getAttribute('aria-selected') === 'true';
      });
      updateDataGridEmptyState(table);
      syncDataGridSelectAll(grid, table);
      if (!markInitialized(grid, 'DataGrid')) return;
      queryAll(table, '[data-uzu-grid-sort]').forEach((header) => {
        header.setAttribute('tabindex', header.getAttribute('tabindex') || '0');
        header.setAttribute('aria-sort', header.getAttribute('aria-sort') || 'none');
        const sort = () => {
          const body = table.tBodies[0];
          if (!body) return;
          const headers = [...header.parentElement.children];
          const columnIndex = headers.indexOf(header);
          const current = header.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
          queryAll(table, '[data-uzu-grid-sort]').forEach((item) => item.setAttribute('aria-sort', item === header ? current : 'none'));
          const direction = current === 'ascending' ? 1 : -1;
          const sorted = [...body.rows].sort((a, b) => {
            if (a.hasAttribute('data-uzu-grid-empty')) return 1;
            if (b.hasAttribute('data-uzu-grid-empty')) return -1;
            if (a.hidden && !b.hidden) return 1;
            if (!a.hidden && b.hidden) return -1;
            const aText = getDataGridSortText(a, columnIndex);
            const bText = getDataGridSortText(b, columnIndex);
            const aNumber = Number(aText.replace(/[^\d.-]/g, ''));
            const bNumber = Number(bText.replace(/[^\d.-]/g, ''));
            if (Number.isFinite(aNumber) && Number.isFinite(bNumber) && /\d/.test(aText + bText)) {
              return (aNumber - bNumber) * direction;
            }
            return aText.localeCompare(bText, undefined, { numeric: true }) * direction;
          });
          sorted.forEach((row) => body.append(row));
          grid.dispatchEvent(new CustomEvent('uzu-data-grid-sort', {
            bubbles: true,
            detail: { grid, table, header, columnIndex, direction: current }
          }));
        };
        header.addEventListener('click', sort);
        header.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            sort();
          }
        });
      });
      queryAll(table, '[data-uzu-grid-select-all]').forEach((control) => {
        control.addEventListener('change', () => {
          const nextSelected = Boolean(control.checked);
          getDataGridSelectableRows(table).forEach((row) => syncDataGridRowSelected(grid, table, row, nextSelected));
          syncDataGridSelectAll(grid, table);
          grid.dispatchEvent(new CustomEvent('uzu-data-grid-select-all', {
            bubbles: true,
            detail: {
              grid,
              table,
              selected: nextSelected,
              rows: getDataGridSelectableRows(table).filter((row) => row.getAttribute('aria-selected') === 'true')
            }
          }));
        });
      });
      grid.addEventListener('click', (event) => {
        const row = event.target instanceof Element ? event.target.closest('[data-uzu-grid-row], tbody tr') : null;
        if (!row || !table.contains(row) || row.hasAttribute('data-uzu-grid-empty') || row.hasAttribute('data-uzu-grid-disabled') || row.getAttribute('aria-disabled') === 'true') return;
        const selection = event.target instanceof Element ? event.target.closest('[data-uzu-grid-selection], input[type="checkbox"]') : null;
        if (!selection && event.target.closest('a, button, input, select, textarea')) return;
        const multi = grid.dataset.uzuDataGridMulti === 'true';
        if (!multi) rows().forEach((item) => {
          if (item !== row) {
            syncDataGridRowSelected(grid, table, item, false, false);
          }
        });
        const selected = selection && 'checked' in selection
          ? Boolean(selection.checked)
          : !(row.classList.contains('is-selected') || row.getAttribute('aria-selected') === 'true');
        syncDataGridRowSelected(grid, table, row, selected);
        syncDataGridSelectAll(grid, table);
      });
      grid.addEventListener('keydown', (event) => {
        const row = event.target instanceof Element ? event.target.closest('[data-uzu-grid-row], tbody tr') : null;
        const list = rows();
        if (!row || !list.length) return;
        const index = list.indexOf(row);
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          list[(index + (event.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length].focus();
        } else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          row.click();
        }
      });
    });
  }

/* ui/js/trees.js */
function getTreeItems(tree) {
    return getScopedControls(tree, '[data-uzu-tree-item], .uzu-tree-item', '[data-uzu-tree]');
  }

  function getTreeItemControl(item) {
    return item.querySelector('[data-uzu-tree-label], .uzu-tree-label') || item;
  }

  function getTreeItemRow(item) {
    return item.querySelector(':scope > [data-uzu-tree-row], :scope > .uzu-tree-row');
  }

  function getTreeItemGroup(item) {
    return item.querySelector(':scope > [role="group"], :scope > .uzu-tree-group');
  }

  function isTreeItemExpanded(item) {
    const group = getTreeItemGroup(item);
    return Boolean(group && !group.hidden);
  }

  function setTreeItemExpanded(item, expanded, emit = true) {
    const tree = item.closest('[data-uzu-tree]');
    const group = getTreeItemGroup(item);
    const toggle = item.querySelector('[data-uzu-tree-toggle], .uzu-tree-toggle');
    if (!group) return;
    group.hidden = !expanded;
    item.classList.toggle('is-open', expanded);
    item.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    if (toggle) toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    if (expanded) queueDisclosureHeightRefresh(group);
    if (emit && tree) {
      tree.dispatchEvent(new CustomEvent('uzu-tree-toggle', {
        bubbles: true,
        detail: { tree, item, expanded, value: getControlValue(item, 'uzuTreeValue') }
      }));
    }
  }

  function getVisibleTreeItems(tree) {
    return getTreeItems(tree).filter((item) => {
      let parent = item.parentElement?.closest('[data-uzu-tree-item], .uzu-tree-item');
      while (parent && tree.contains(parent)) {
        if (!isTreeItemExpanded(parent)) return false;
        parent = parent.parentElement?.closest('[data-uzu-tree-item], .uzu-tree-item');
      }
      return true;
    });
  }

  function selectTreeItem(tree, item, emit = true) {
    getTreeItems(tree).forEach((control) => {
      const selected = control === item;
      control.classList.toggle('is-selected', selected);
      control.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
    tree.dataset.uzuTreeValue = getControlValue(item, 'uzuTreeValue');
    if (emit) {
      tree.dispatchEvent(new CustomEvent('uzu-tree-select', {
        bubbles: true,
        detail: { tree, item, value: tree.dataset.uzuTreeValue }
      }));
      tree.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function getTreeItemLevel(item) {
    let level = 1;
    let parent = item.parentElement?.closest('[data-uzu-tree-item], .uzu-tree-item');
    while (parent) {
      level += 1;
      parent = parent.parentElement?.closest('[data-uzu-tree-item], .uzu-tree-item');
    }
    return level;
  }

  function syncTreeItemSetMetadata(tree) {
    getTreeItems(tree).forEach((item) => {
      const parentGroup = item.parentElement;
      const siblings = [...parentGroup?.children || []].filter((child) => child.matches?.('[data-uzu-tree-item], .uzu-tree-item'));
      item.setAttribute('aria-level', String(getTreeItemLevel(item)));
      item.setAttribute('aria-setsize', String(siblings.length || 1));
      item.setAttribute('aria-posinset', String(Math.max(1, siblings.indexOf(item) + 1)));
    });
  }

  function initTrees(root = document) {
    queryAll(root, '[data-uzu-tree]').forEach((tree) => {
      const items = getTreeItems(tree);
      if (!items.length) return;
      tree.setAttribute('role', tree.getAttribute('role') || 'tree');
      items.forEach((item) => {
        item.setAttribute('role', item.getAttribute('role') || 'treeitem');
        item.setAttribute('tabindex', item.classList.contains('is-selected') ? '0' : '-1');
        const group = getTreeItemGroup(item);
        if (group) {
          group.setAttribute('role', group.getAttribute('role') || 'group');
          if (!item.classList.contains('is-open') && item.getAttribute('aria-expanded') !== 'true') group.hidden = true;
          setTreeItemExpanded(item, !group.hidden, false);
        }
      });
      const selected = items.find((item) => item.classList.contains('is-selected')) || items[0];
      if (selected) {
        selected.setAttribute('tabindex', '0');
        selectTreeItem(tree, selected, false);
      }
      syncTreeItemSetMetadata(tree);
      if (!markInitialized(tree, 'Tree')) return;
      tree.addEventListener('click', (event) => {
        const toggle = getScopedEventControl(event, '[data-uzu-tree-toggle], .uzu-tree-toggle', tree, '[data-uzu-tree]');
        const item = toggle ? toggle.closest('[data-uzu-tree-item], .uzu-tree-item') : getScopedEventControl(event, '[data-uzu-tree-item], .uzu-tree-item', tree, '[data-uzu-tree]');
        if (!item) return;
        const group = getTreeItemGroup(item);
        const row = getTreeItemRow(item);
        const target = event.target instanceof Element ? event.target : null;
        const clickedRow = Boolean(target && row?.contains(target));
        const embeddedControl = target?.closest('a, button, input, select, textarea, [role="button"], [role="link"]');
        if (embeddedControl && !toggle) return;
        if (toggle || (group && clickedRow)) {
          event.preventDefault();
          setTreeItemExpanded(item, !isTreeItemExpanded(item));
        } else {
          selectTreeItem(tree, item);
        }
      });
      tree.addEventListener('keydown', (event) => {
        const item = event.target instanceof Element ? event.target.closest('[data-uzu-tree-item], .uzu-tree-item') : null;
        if (!item || !tree.contains(item)) return;
        const visible = getVisibleTreeItems(tree);
        const index = visible.indexOf(item);
        let next = null;
        if (event.key === 'ArrowDown') next = visible[index + 1] || visible[0];
        else if (event.key === 'ArrowUp') next = visible[index - 1] || visible.at(-1);
        else if (event.key === 'ArrowRight') {
          if (getTreeItemGroup(item) && !isTreeItemExpanded(item)) setTreeItemExpanded(item, true);
          else next = getVisibleTreeItems(tree)[index + 1] || null;
        } else if (event.key === 'ArrowLeft') {
          if (getTreeItemGroup(item) && isTreeItemExpanded(item)) setTreeItemExpanded(item, false);
          else next = item.parentElement?.closest('[data-uzu-tree-item], .uzu-tree-item');
        } else if (event.key === 'Home') next = visible[0];
        else if (event.key === 'End') next = visible.at(-1);
        else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectTreeItem(tree, item);
        }
        if (next) {
          event.preventDefault();
          getTreeItems(tree).forEach((control) => control.setAttribute('tabindex', control === next ? '0' : '-1'));
          next.focus();
        }
      });
    });
  }

/* ui/js/accordions-hover-cards.js */
function initAccordions(root = document) {
    queryAll(root, '[data-uzu-accordion]').forEach((accordion) => {
      const disclosures = getScopedControls(accordion, '[data-uzu-disclosure]', '[data-uzu-accordion]');
      if (!disclosures.length) return;
      const allowMultiple = accordion.dataset.uzuAccordionMultiple === 'true';
      if (!allowMultiple) {
        let hasOpenDisclosure = false;
        disclosures.forEach((disclosure) => {
          if (!disclosure.classList.contains('is-open')) return;
          if (hasOpenDisclosure) setDisclosureState(disclosure, false, false);
          else hasOpenDisclosure = true;
        });
      }
      if (!markInitialized(accordion, 'Accordion')) return;
      disclosures.forEach((disclosure) => {
        disclosure.addEventListener('uzu-disclosure-change', (event) => {
          if (event.target !== disclosure) return;
          if (event.detail.open && !allowMultiple) {
            disclosures.forEach((item) => {
              if (item !== disclosure) setDisclosureState(item, false, false);
            });
          }
          accordion.dispatchEvent(new CustomEvent('uzu-accordion-change', {
            bubbles: true,
            detail: { accordion, disclosure, open: Boolean(event.detail.open) }
          }));
        });
      });
    });
  }

  function getHoverCardTrigger(card) {
    return card.querySelector('[data-uzu-hover-card-trigger], .uzu-hover-card-trigger');
  }

  function getHoverCardContent(card) {
    return card.querySelector('[data-uzu-hover-card-content], .uzu-hover-card-content');
  }

  function clearHoverCardTimer(card, store) {
    const timer = store.get(card);
    if (!timer) return;
    window.clearTimeout(timer);
    store.delete(card);
  }

  function setHoverCardState(card, open, emit = true) {
    const trigger = getHoverCardTrigger(card);
    const content = getHoverCardContent(card);
    if (!content) return;
    clearHoverCardTimer(card, hoverCardOpenTimers);
    clearHoverCardTimer(card, hoverCardCloseTimers);
    if (trigger) trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      content.hidden = false;
      card.classList.remove('is-closing');
      card.classList.add('is-open');
      queueDisclosureHeightRefresh(content);
    } else if (card.classList.contains('is-open')) {
      card.classList.remove('is-open');
      card.classList.add('is-closing');
      const finish = () => {
        card.classList.remove('is-closing');
        content.hidden = true;
        hoverCardCloseTimers.delete(card);
      };
      const timer = scheduleAfterAnimation([content], finish);
      if (timer) hoverCardCloseTimers.set(card, timer);
    } else {
      card.classList.remove('is-closing');
      content.hidden = true;
    }
    if (emit) {
      card.dispatchEvent(new CustomEvent(open ? 'uzu-hover-card-open' : 'uzu-hover-card-close', {
        bubbles: true,
        detail: { hoverCard: card, trigger, content }
      }));
    }
  }

  function initHoverCards(root = document) {
    queryAll(root, '[data-uzu-hover-card]').forEach((card) => {
      const trigger = getHoverCardTrigger(card);
      const content = getHoverCardContent(card);
      if (!trigger || !content) return;
      const contentId = ensureId(content, 'uzu-hover-card-content');
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-expanded', card.classList.contains('is-open') ? 'true' : 'false');
      trigger.setAttribute('aria-controls', contentId);
      if (!card.classList.contains('is-open')) content.hidden = true;
      if (!markInitialized(card, 'HoverCard')) return;
      const openDelay = Number.isFinite(Number(card.dataset.uzuHoverCardDelay)) ? Number(card.dataset.uzuHoverCardDelay) : 120;
      const closeDelay = Number.isFinite(Number(card.dataset.uzuHoverCardCloseDelay)) ? Number(card.dataset.uzuHoverCardCloseDelay) : 120;
      const open = () => {
        clearHoverCardTimer(card, hoverCardCloseTimers);
        clearHoverCardTimer(card, hoverCardOpenTimers);
        const timer = window.setTimeout(() => setHoverCardState(card, true), openDelay);
        hoverCardOpenTimers.set(card, timer);
      };
      const close = () => {
        clearHoverCardTimer(card, hoverCardOpenTimers);
        clearHoverCardTimer(card, hoverCardCloseTimers);
        const timer = window.setTimeout(() => setHoverCardState(card, false), closeDelay);
        hoverCardCloseTimers.set(card, timer);
      };
      [trigger, content].forEach((element) => {
        element.addEventListener('mouseenter', open);
        element.addEventListener('mouseleave', close);
        element.addEventListener('focusin', open);
        element.addEventListener('focusout', close);
      });
      trigger.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          setHoverCardState(card, false);
          trigger.focus();
        }
      });
    });
  }

/* ui/js/popovers.js */
function getPopoverTrigger(popover) {
    return getScopedControls(popover, '[data-uzu-popover-trigger], .uzu-popover-trigger', '[data-uzu-popover]')[0] || null;
  }

  function getPopoverContent(popover) {
    return getScopedControls(popover, '[data-uzu-popover-content], .uzu-popover', '[data-uzu-popover]')[0] || null;
  }

  function emitPopoverEvent(popover, name, trigger = getPopoverTrigger(popover)) {
    popover.dispatchEvent(new CustomEvent(name, {
      bubbles: true,
      detail: {
        popover,
        trigger,
        content: getPopoverContent(popover)
      }
    }));
  }

  function openPopover(popover, options = {}) {
    const trigger = options.trigger || getPopoverTrigger(popover);
    const content = getPopoverContent(popover);
    if (!content) return;
    if (popover.classList.contains('is-open')) return;
    const existingTimer = popoverCloseTimers.get(popover);
    if (existingTimer) {
      window.clearTimeout(existingTimer);
      popoverCloseTimers.delete(popover);
    }
    content.hidden = false;
    popover.classList.remove('is-closing');
    popover.classList.add('is-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    queueDisclosureHeightRefresh(content);
    emitPopoverEvent(popover, 'uzu-popover-open', trigger);
  }

  function closePopover(popover, options = {}) {
    const trigger = options.trigger || getPopoverTrigger(popover);
    const content = getPopoverContent(popover);
    if (!content || popover.classList.contains('is-closing') || (!popover.classList.contains('is-open') && content.hidden)) return;
    popover.classList.remove('is-open');
    popover.classList.add('is-closing');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    const existingTimer = popoverCloseTimers.get(popover);
    if (existingTimer) window.clearTimeout(existingTimer);
    const finish = () => {
      popover.classList.remove('is-closing');
      content.hidden = true;
      popoverCloseTimers.delete(popover);
      emitPopoverEvent(popover, 'uzu-popover-close', trigger);
      if (options.restoreFocus && trigger && typeof trigger.focus === 'function') trigger.focus();
    };
    const timer = scheduleAfterAnimation([content], finish);
    if (timer) popoverCloseTimers.set(popover, timer);
  }

  function closeOpenPopovers(except = null) {
    let count = 0;
    queryAll(document, '[data-uzu-popover].is-open').forEach((popover) => {
      if (popover !== except) {
        count += 1;
        closePopover(popover);
      }
    });
    return count;
  }

  function initPopovers(root = document) {
    queryAll(root, '[data-uzu-popover]').forEach((popover) => {
      const trigger = getPopoverTrigger(popover);
      const content = getPopoverContent(popover);
      if (!trigger || !content) return;
      const contentId = ensureId(content, 'uzu-popover-content');
      trigger.setAttribute('aria-haspopup', trigger.getAttribute('aria-haspopup') || 'dialog');
      trigger.setAttribute('aria-expanded', popover.classList.contains('is-open') ? 'true' : 'false');
      trigger.setAttribute('aria-controls', contentId);
      if (popover.classList.contains('is-open')) {
        content.hidden = false;
        queueDisclosureHeightRefresh(content);
      } else {
        content.hidden = true;
      }
      if (!markInitialized(popover, 'Popover')) return;
      trigger.addEventListener('click', (event) => {
        if (isControlDisabled(trigger)) return;
        event.preventDefault();
        if (popover.classList.contains('is-open')) {
          closePopover(popover, { restoreFocus: true });
        } else {
          closeOpenPopovers(popover);
          openPopover(popover, { trigger });
        }
      });
      trigger.addEventListener('keydown', (event) => {
        if (isControlDisabled(trigger)) return;
        if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
          event.preventDefault();
          closeOpenPopovers(popover);
          openPopover(popover, { trigger });
        } else if (event.key === 'Escape') {
          event.preventDefault();
          closePopover(popover, { restoreFocus: true });
        }
      });
      popover.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        closePopover(popover, { restoreFocus: true });
      });
    });
  }

/* ui/js/tags.js */
const tagInputTriggers = new WeakMap();

  function setTagSelected(tag, selected, emit = true) {
    const nextSelected = Boolean(selected);
    const previousSelected = tag.classList.contains('is-selected') || tag.getAttribute('aria-pressed') === 'true';
    tag.classList.toggle('is-selected', nextSelected);
    tag.setAttribute('aria-pressed', nextSelected ? 'true' : 'false');
    if (emit && nextSelected !== previousSelected) {
      tag.dispatchEvent(new CustomEvent('uzu-tag-change', {
        bubbles: true,
        detail: { selected: nextSelected, tag, value: getControlValue(tag, 'uzuTagValue') }
      }));
      tag.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function closeTag(tag, closeButton = null) {
    const event = new CustomEvent('uzu-tag-close', {
      bubbles: true,
      cancelable: true,
      detail: { tag, closeButton, value: getControlValue(tag, 'uzuTagValue') }
    });
    tag.dispatchEvent(event);
    if (!event.defaultPrevented) tag.hidden = true;
  }

  function isSelectableTag(tag) {
    return tag.dataset.uzuTagSelectable === 'true' || tag.hasAttribute('aria-pressed');
  }

  function getTagListAddButton(list) {
    return getScopedControls(list, '[data-uzu-tag-add], .uzu-tag-add', '[data-uzu-tag-list]')[0] || null;
  }

  function getOpenTagInput(list) {
    return getScopedControls(list, '[data-uzu-tag-input], .uzu-tag-input', '[data-uzu-tag-list]')[0] || null;
  }

  function getTagInputControl(inputTag) {
    return inputTag?.querySelector?.('[data-uzu-tag-input-control], .uzu-tag-input-control') || null;
  }

  function getTagAddText(list, trigger, key, fallback, useTriggerLabel = false) {
    return list.dataset[key] || trigger?.dataset?.[key] || (useTriggerLabel ? trigger?.getAttribute?.('aria-label') : '') || fallback;
  }

  function setTagInputWidth(input) {
    const length = String(input.value || input.placeholder || '').length;
    input.style.width = `${Math.max(8, Math.min(length + 2, 24))}ch`;
  }

  function createTagIcon(path) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('fill', 'none');
    const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    iconPath.setAttribute('d', path);
    iconPath.setAttribute('stroke', 'currentColor');
    iconPath.setAttribute('stroke-width', '1.8');
    iconPath.setAttribute('stroke-linecap', 'round');
    svg.append(iconPath);
    return svg;
  }

  function createAddedTag(list, label, trigger = null) {
    const tag = document.createElement('span');
    const value = label;
    const closeText = list.dataset.uzuTagCloseLabel || trigger?.dataset?.uzuTagCloseLabel || 'Remove tag';
    const closeLabel = closeText.includes('{label}') ? closeText.split('{label}').join(label) : `${closeText}: ${label}`;
    const text = document.createElement('span');
    const closeButton = document.createElement('button');

    tag.className = 'uzu-tag';
    tag.dataset.uzuTag = '';
    tag.dataset.uzuTagValue = value;
    text.textContent = label;
    closeButton.className = 'uzu-tag-close';
    closeButton.type = 'button';
    closeButton.dataset.uzuTagClose = '';
    closeButton.setAttribute('aria-label', closeLabel);
    closeButton.append(createTagIcon('M6 6l12 12M18 6 6 18'));
    tag.append(text, closeButton);
    return tag;
  }

  function closeTagInput(list, inputTag, options = {}) {
    const input = getTagInputControl(inputTag);
    if (!input || input.dataset.uzuTagInputClosing === 'true') return null;
    input.dataset.uzuTagInputClosing = 'true';
    const label = String(input.value || '').trim();
    const trigger = tagInputTriggers.get(inputTag) || getTagListAddButton(list);
    let tag = null;

    if (options.commit !== false && label) {
      tag = createAddedTag(list, label, trigger);
      const event = new CustomEvent('uzu-tag-add', {
        bubbles: true,
        cancelable: true,
        detail: {
          list,
          tag,
          input,
          trigger,
          value: tag.dataset.uzuTagValue,
          label
        }
      });
      list.dispatchEvent(event);
      if (event.defaultPrevented) {
        delete input.dataset.uzuTagInputClosing;
        if (options.restoreFocus && typeof input.focus === 'function') {
          window.requestAnimationFrame(() => {
            if (input.isConnected) input.focus();
          });
        }
        return null;
      }
      if (!event.defaultPrevented) {
        inputTag.before(tag);
        initTags(tag);
        list.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    inputTag.remove();
    list.classList.remove('is-adding');
    if (options.restoreFocus && trigger && typeof trigger.focus === 'function') trigger.focus();
    return tag;
  }

  function openTagInput(list, trigger = null) {
    const existing = getOpenTagInput(list);
    if (existing) {
      const input = getTagInputControl(existing);
      if (input) input.focus();
      return input || existing;
    }

    const inputTag = document.createElement('span');
    const input = document.createElement('input');
    inputTag.className = 'uzu-tag uzu-tag-input';
    inputTag.dataset.uzuTagInput = '';
    input.type = 'text';
    input.className = 'uzu-tag-input-control';
    input.dataset.uzuTagInputControl = '';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.setAttribute('aria-label', getTagAddText(list, trigger, 'uzuTagInputLabel', 'Add tag', true));
    const placeholder = getTagAddText(list, trigger, 'uzuTagInputPlaceholder', '');
    if (placeholder) input.placeholder = placeholder;
    setTagInputWidth(input);
    inputTag.append(input);

    const addButton = trigger || getTagListAddButton(list);
    tagInputTriggers.set(inputTag, addButton);
    list.insertBefore(inputTag, addButton || null);
    list.classList.add('is-adding');

    input.addEventListener('input', () => setTagInputWidth(input));
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        closeTagInput(list, inputTag, { commit: true, restoreFocus: true });
      } else if (event.key === 'Escape') {
        event.preventDefault();
        closeTagInput(list, inputTag, { commit: false, restoreFocus: true });
      }
    });
    input.addEventListener('blur', () => {
      window.setTimeout(() => {
        if (inputTag.isConnected) closeTagInput(list, inputTag, { commit: true });
      }, 0);
    });

    window.requestAnimationFrame(() => input.focus());
    return input;
  }

  function initTagLists(root = document) {
    queryAll(root, '[data-uzu-tag-list]').forEach((list) => {
      getScopedControls(list, '[data-uzu-tag-add], .uzu-tag-add', '[data-uzu-tag-list]').forEach((addButton) => {
        addButton.setAttribute('aria-label', addButton.getAttribute('aria-label') || 'Add tag');
        addButton.setAttribute('type', addButton.getAttribute('type') || 'button');
      });
      if (!markInitialized(list, 'TagList')) return;
      list.addEventListener('click', (event) => {
        const trigger = getScopedEventControl(event, '[data-uzu-tag-add], .uzu-tag-add', list, '[data-uzu-tag-list]');
        if (!trigger || isControlDisabled(trigger)) return;
        event.preventDefault();
        openTagInput(list, trigger);
      });
    });
  }

  function initTags(root = document) {
    initTagLists(root);
    queryAll(root, '[data-uzu-tag]').forEach((tag) => {
      const selectable = isSelectableTag(tag);
      if (selectable) {
        if (!/^(A|BUTTON)$/i.test(tag.tagName)) {
          tag.setAttribute('role', tag.getAttribute('role') || 'button');
          tag.setAttribute('tabindex', tag.getAttribute('tabindex') || '0');
        }
        setTagSelected(tag, tag.classList.contains('is-selected') || tag.getAttribute('aria-pressed') === 'true', false);
      }
      queryAll(tag, '[data-uzu-tag-close], .uzu-tag-close').forEach((button) => {
        button.setAttribute('aria-label', button.getAttribute('aria-label') || 'Remove tag');
      });
      if (!markInitialized(tag, 'Tag')) return;
      tag.addEventListener('click', (event) => {
        const closeButton = getScopedEventControl(event, '[data-uzu-tag-close], .uzu-tag-close', tag, '[data-uzu-tag]');
        if (closeButton) {
          event.preventDefault();
          closeTag(tag, closeButton);
          return;
        }
        if (selectable && !isControlDisabled(tag)) {
          setTagSelected(tag, !(tag.classList.contains('is-selected') || tag.getAttribute('aria-pressed') === 'true'));
        }
      });
      tag.addEventListener('keydown', (event) => {
        if (!selectable || isControlDisabled(tag) || !['Enter', ' '].includes(event.key)) return;
        event.preventDefault();
        setTagSelected(tag, !(tag.classList.contains('is-selected') || tag.getAttribute('aria-pressed') === 'true'));
      });
    });
  }

/* ui/js/resizable.js */
function setSplitPaneSize(splitPane, size, emit = true) {
    const min = Number(splitPane.dataset.uzuSplitMin || 20);
    const max = Number(splitPane.dataset.uzuSplitMax || 80);
    const next = clampNumber(size, min, max);
    splitPane.style.setProperty('--uzu-split-primary-size', `${next}%`);
    splitPane.dataset.uzuSplitSize = String(next);
    const key = splitPane.dataset.uzuSplitKey;
    if (key) storage.set(`uzu-split:${key}`, String(next));
    queryAll(splitPane, '[data-uzu-split-resizer], .uzu-split-resizer').forEach((resizer) => {
      resizer.setAttribute('aria-valuenow', String(Math.round(next)));
    });
    if (emit) {
      splitPane.dispatchEvent(new CustomEvent('uzu-split-resize', {
        bubbles: true,
        detail: { splitPane, size: next }
      }));
    }
  }

  function initSplitPanes(root = document) {
    queryAll(root, '[data-uzu-split-pane]').forEach((splitPane) => {
      const resizer = splitPane.querySelector('[data-uzu-split-resizer], .uzu-split-resizer');
      if (!resizer) return;
      const orientation = splitPane.dataset.uzuSplitOrientation === 'vertical' ? 'vertical' : 'horizontal';
      splitPane.dataset.uzuSplitOrientation = orientation;
      resizer.setAttribute('role', 'separator');
      resizer.setAttribute('tabindex', resizer.getAttribute('tabindex') || '0');
      resizer.setAttribute('aria-orientation', orientation);
      const saved = splitPane.dataset.uzuSplitKey ? Number(storage.get(`uzu-split:${splitPane.dataset.uzuSplitKey}`)) : NaN;
      setSplitPaneSize(splitPane, Number.isFinite(saved) ? saved : Number(splitPane.dataset.uzuSplitSize || 50), false);
      if (!markInitialized(splitPane, 'SplitPane')) return;
      const getPointSize = (event) => {
        const rect = splitPane.getBoundingClientRect();
        const raw = orientation === 'vertical'
          ? ((event.clientY - rect.top) / rect.height) * 100
          : ((event.clientX - rect.left) / rect.width) * 100;
        return Number.isFinite(raw) ? raw : Number(splitPane.dataset.uzuSplitSize || 50);
      };
      const stopDrag = () => {
        splitPane.classList.remove('is-resizing');
        activePointerDrags.delete(resizer);
        document.removeEventListener('pointermove', moveDrag);
        document.removeEventListener('pointerup', stopDrag);
        document.removeEventListener('pointercancel', stopDrag);
      };
      const moveDrag = (event) => {
        event.preventDefault();
        setSplitPaneSize(splitPane, getPointSize(event));
      };
      resizer.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        if (activePointerDrags.has(resizer)) activePointerDrags.get(resizer)();
        splitPane.classList.add('is-resizing');
        activePointerDrags.set(resizer, stopDrag);
        if (resizer.setPointerCapture) {
          try { resizer.setPointerCapture(event.pointerId); } catch (_) {}
        }
        document.addEventListener('pointermove', moveDrag);
        document.addEventListener('pointerup', stopDrag, { once: true });
        document.addEventListener('pointercancel', stopDrag, { once: true });
      });
      resizer.addEventListener('lostpointercapture', stopDrag);
      resizer.addEventListener('keydown', (event) => {
        const keyMap = orientation === 'vertical'
          ? { ArrowUp: -2, ArrowDown: 2, Home: -100, End: 100 }
          : { ArrowLeft: -2, ArrowRight: 2, Home: -100, End: 100 };
        if (!(event.key in keyMap)) return;
        event.preventDefault();
        const current = Number(splitPane.dataset.uzuSplitSize || 50);
        const next = event.key === 'Home' ? Number(splitPane.dataset.uzuSplitMin || 20)
          : event.key === 'End' ? Number(splitPane.dataset.uzuSplitMax || 80)
            : current + keyMap[event.key];
        setSplitPaneSize(splitPane, next);
      });
    });
  }

  function setResizableSize(panel, width, height, emit = true) {
    const axis = panel.dataset.uzuResizableAxis || 'both';
    const minWidth = Number(panel.dataset.uzuResizableMinWidth || 160);
    const maxWidth = Number(panel.dataset.uzuResizableMaxWidth || 960);
    const minHeight = Number(panel.dataset.uzuResizableMinHeight || 100);
    const maxHeight = Number(panel.dataset.uzuResizableMaxHeight || 720);
    const nextWidth = clampNumber(width, minWidth, maxWidth);
    const nextHeight = clampNumber(height, minHeight, maxHeight);
    if (axis !== 'vertical') panel.style.setProperty('--uzu-resizable-width', `${nextWidth}px`);
    if (axis !== 'horizontal') panel.style.setProperty('--uzu-resizable-height', `${nextHeight}px`);
    panel.dataset.uzuResizableWidth = String(Math.round(nextWidth));
    panel.dataset.uzuResizableHeight = String(Math.round(nextHeight));
    const key = panel.dataset.uzuResizableKey;
    if (key) storage.set(`uzu-resizable:${key}`, `${Math.round(nextWidth)}:${Math.round(nextHeight)}`);
    if (emit) {
      panel.dispatchEvent(new CustomEvent('uzu-resizable-resize', {
        bubbles: true,
        detail: { resizable: panel, width: nextWidth, height: nextHeight }
      }));
    }
  }

  function initResizables(root = document) {
    queryAll(root, '[data-uzu-resizable]').forEach((panel) => {
      const handle = panel.querySelector('[data-uzu-resizable-handle], .uzu-resizable-handle');
      if (!handle) return;
      const rect = panel.getBoundingClientRect();
      const saved = panel.dataset.uzuResizableKey ? storage.get(`uzu-resizable:${panel.dataset.uzuResizableKey}`) : '';
      const [savedWidth, savedHeight] = String(saved || '').split(':').map(Number);
      setResizableSize(panel, Number.isFinite(savedWidth) ? savedWidth : Number(panel.dataset.uzuResizableWidth || rect.width || 320), Number.isFinite(savedHeight) ? savedHeight : Number(panel.dataset.uzuResizableHeight || rect.height || 180), false);
      handle.setAttribute('role', 'separator');
      handle.setAttribute('tabindex', handle.getAttribute('tabindex') || '0');
      if (!markInitialized(panel, 'Resizable')) return;
      let start = null;
      const move = (event) => {
        if (!start) return;
        event.preventDefault();
        setResizableSize(panel, start.width + event.clientX - start.x, start.height + event.clientY - start.y);
      };
      const stop = () => {
        panel.classList.remove('is-resizing');
        start = null;
        activePointerDrags.delete(handle);
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', stop);
        document.removeEventListener('pointercancel', stop);
      };
      handle.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        if (activePointerDrags.has(handle)) activePointerDrags.get(handle)();
        const bounds = panel.getBoundingClientRect();
        start = { x: event.clientX, y: event.clientY, width: bounds.width, height: bounds.height };
        panel.classList.add('is-resizing');
        activePointerDrags.set(handle, stop);
        if (handle.setPointerCapture) {
          try { handle.setPointerCapture(event.pointerId); } catch (_) {}
        }
        document.addEventListener('pointermove', move);
        document.addEventListener('pointerup', stop, { once: true });
        document.addEventListener('pointercancel', stop, { once: true });
      });
      handle.addEventListener('lostpointercapture', stop);
      handle.addEventListener('keydown', (event) => {
        const currentWidth = Number(panel.dataset.uzuResizableWidth || panel.getBoundingClientRect().width);
        const currentHeight = Number(panel.dataset.uzuResizableHeight || panel.getBoundingClientRect().height);
        let width = currentWidth;
        let height = currentHeight;
        if (event.key === 'ArrowRight') width += 12;
        else if (event.key === 'ArrowLeft') width -= 12;
        else if (event.key === 'ArrowDown') height += 12;
        else if (event.key === 'ArrowUp') height -= 12;
        else return;
        event.preventDefault();
        setResizableSize(panel, width, height);
      });
    });
  }

/* ui/js/editors.js */
function createJsonToken(text, type = '') {
    const node = document.createElement('span');
    node.className = type ? `uzu-code-token uzu-code-token-${type}` : 'uzu-code-token';
    node.textContent = text;
    return node;
  }

  function createJsonSpacer() {
    const spacer = document.createElement('span');
    spacer.className = 'uzu-json-spacer';
    spacer.setAttribute('aria-hidden', 'true');
    return spacer;
  }

  function createJsonLine(depth, state, foldControl = null) {
    const line = document.createElement('div');
    const code = document.createElement('span');
    line.className = 'uzu-json-line';
    line.dataset.uzuJsonLine = String(state.line += 1);
    line.style.setProperty('--uzu-json-depth', String(depth));
    code.className = 'uzu-json-code';
    line.append(foldControl || createJsonSpacer(), code);
    return { line, code };
  }

  function appendJsonKey(row, key) {
    if (key === null || key === undefined) return;
    const keyNode = createJsonToken(JSON.stringify(String(key)), 'property');
    keyNode.classList.add('uzu-json-key');
    row.append(keyNode, createJsonToken(': ', 'punctuation'));
  }

  function appendJsonComma(row, isLast) {
    if (!isLast) row.append(createJsonToken(',', 'punctuation'));
  }

  function formatJsonSummary(count) {
    return ' ...';
  }

  function createJsonNode(value, key = '', options = {}) {
    const isLast = options.isLast !== false;
    const depth = Number.isFinite(options.depth) ? options.depth : 0;
    const state = options.state || { line: 0 };
    const row = document.createElement('div');
    row.className = 'uzu-json-node';
    if (value && typeof value === 'object') {
      const isArray = Array.isArray(value);
      const entries = Object.entries(value);
      row.classList.add('uzu-json-branch');
      const toggle = document.createElement('button');
      toggle.className = 'uzu-json-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', isArray ? 'Collapse array' : 'Collapse object');
      const { line, code } = createJsonLine(depth, state, toggle);
      appendJsonKey(code, key);
      code.append(createJsonToken(isArray ? '[' : '{', 'punctuation'));
      const summary = createJsonToken(formatJsonSummary(entries.length), 'comment');
      summary.classList.add('uzu-json-summary');
      const inlineClose = createJsonToken(isArray ? ']' : '}', 'punctuation');
      inlineClose.classList.add('uzu-json-inline-close');
      code.append(summary, inlineClose);
      if (!isLast) {
        const inlineComma = createJsonToken(',', 'punctuation');
        inlineComma.classList.add('uzu-json-inline-comma');
        code.append(inlineComma);
      }
      const children = document.createElement('div');
      children.className = 'uzu-json-children';
      children.dataset.uzuJsonChildren = '';
      entries.forEach(([childKey, childValue], index) => {
        children.append(createJsonNode(childValue, isArray ? null : childKey, {
          depth: depth + 1,
          isLast: index === entries.length - 1,
          state
        }));
      });
      const close = createJsonLine(depth, state);
      const closeLine = close.line;
      closeLine.classList.add('uzu-json-line-end');
      close.code.append(createJsonToken(isArray ? ']' : '}', 'punctuation'));
      appendJsonComma(close.code, isLast);
      toggle.addEventListener('click', () => {
        const collapsed = !children.hidden;
        children.hidden = collapsed;
        closeLine.hidden = collapsed;
        toggle.classList.toggle('is-collapsed', collapsed);
        toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        toggle.setAttribute('aria-label', collapsed ? (isArray ? 'Expand array' : 'Expand object') : (isArray ? 'Collapse array' : 'Collapse object'));
        row.classList.toggle('is-collapsed', collapsed);
      });
      row.append(line, children, closeLine);
      return row;
    }
    const { line, code } = createJsonLine(depth, state);
    appendJsonKey(code, key);
    const valueNode = document.createElement('span');
    const valueType = value === null ? 'null' : typeof value;
    const tokenType = valueType === 'string' ? 'string' : valueType === 'number' ? 'number' : valueType === 'boolean' || valueType === 'null' ? 'keyword' : '';
    valueNode.className = `uzu-json-value uzu-json-${valueType} uzu-code-token${tokenType ? ` uzu-code-token-${tokenType}` : ''}`;
    valueNode.textContent = typeof value === 'string' ? JSON.stringify(value) : String(value);
    code.append(valueNode);
    appendJsonComma(code, isLast);
    row.append(line);
    return row;
  }

  function renderJson(value) {
    const fragment = document.createDocumentFragment();
    fragment.append(createJsonNode(value, null, { state: { line: 0 } }));
    return fragment;
  }

  function updateJsonFoldGutterHover(viewer, event) {
    const line = viewer.querySelector('.uzu-json-line');
    if (!line) return;
    const lineBox = line.getBoundingClientRect();
    const style = getComputedStyle(viewer);
    const lineNumberWidth = Number.parseFloat(style.getPropertyValue('--uzu-json-line-number-width')) || 40;
    const foldWidth = Number.parseFloat(style.getPropertyValue('--uzu-json-fold-width')) || 20;
    const x = event.clientX - lineBox.left;
    const inFoldGutter = x >= lineNumberWidth && x <= lineNumberWidth + foldWidth;
    viewer.classList.toggle('is-fold-gutter-hover', inFoldGutter);
  }

  function initJsonViewers(root = document) {
    queryAll(root, '[data-uzu-json-viewer]').forEach((viewer) => {
      if (!markInitialized(viewer, 'JsonViewer')) return;
      const source = (viewer.querySelector('script[type="application/json"]')?.textContent || viewer.dataset.uzuJsonSource || viewer.textContent || '').trim();
      viewer.dataset.uzuJsonSource = source;
      try {
        const value = JSON.parse(source);
        viewer.replaceChildren(renderJson(value));
        viewer.addEventListener('pointermove', (event) => updateJsonFoldGutterHover(viewer, event));
        viewer.addEventListener('pointerleave', () => viewer.classList.remove('is-fold-gutter-hover'));
      } catch (_) {
        viewer.classList.add('is-invalid');
      }
    });
  }

  function initDiffViewers(root = document) {
    queryAll(root, '[data-uzu-diff-viewer]').forEach((viewer) => {
      if (!markInitialized(viewer, 'DiffViewer') || viewer.querySelector('.uzu-diff-line')) return;
      const source = String(viewer.textContent || '').replace(/\r\n?/g, '\n').trim();
      const lines = source.split('\n');
      viewer.replaceChildren();
      lines.forEach((line, index) => {
        const row = document.createElement('div');
        const type = line.startsWith('+') ? 'add' : line.startsWith('-') ? 'remove' : line.startsWith('@') ? 'meta' : 'context';
        row.className = `uzu-diff-line uzu-diff-line-${type}`;
        const gutter = document.createElement('span');
        gutter.className = 'uzu-diff-gutter';
        gutter.textContent = String(index + 1);
        const code = document.createElement('code');
        code.className = 'uzu-diff-code';
        code.textContent = line;
        row.append(gutter, code);
        viewer.append(row);
      });
    });
  }

  function initEditorShells(root = document) {
    queryAll(root, '[data-uzu-editor]').forEach((editor) => {
      const surface = editor.querySelector('[data-uzu-editor-surface], .uzu-editor-surface');
      if (!markInitialized(editor, 'EditorShell')) return;
      queryAll(editor, '[data-uzu-editor-command]').forEach((button) => {
        const command = button.dataset.uzuEditorCommand || '';
        const value = button.dataset.uzuEditorValue || '';
        if (button.hasAttribute('data-uzu-editor-toggle') && !button.hasAttribute('aria-pressed')) {
          button.setAttribute('aria-pressed', button.getAttribute('aria-pressed') || 'false');
        }
        button.addEventListener('click', () => {
          if (surface && typeof surface.focus === 'function') surface.focus({ preventScroll: true });
          editor.dispatchEvent(new CustomEvent('uzu-editor-command', {
            bubbles: true,
            detail: { editor, surface, button, command, value }
          }));
        });
      });
      if (surface) {
        surface.addEventListener('input', () => {
          const value = 'value' in surface ? surface.value : surface.innerHTML;
          editor.dispatchEvent(new CustomEvent('uzu-editor-change', {
            bubbles: true,
            detail: { editor, surface, value }
          }));
        });
      }
    });
  }

  function shouldRenderMarkdownEditor(editor) {
    const value = editor.getAttribute('data-uzu-markdown-render');
    return value !== null && value !== 'false';
  }

  function initMarkdownEditors(root = document) {
    queryAll(root, '[data-uzu-markdown-editor]').forEach((editor) => {
      const source = editor.querySelector('[data-uzu-markdown-source]');
      const preview = editor.querySelector('[data-uzu-markdown-preview]');
      if (!source) return;
      const getSourceValue = () => {
        return 'value' in source ? source.value : source.textContent;
      };
      const render = (sourceValue = getSourceValue()) => {
        if (!preview) return;
        const value = sourceValue || '';
        editor.dataset.uzuMarkdownValue = value;
        preview.replaceChildren(renderMarkdown(value));
        initCodeHighlight(preview);
        initCodeCopy(preview);
        editor.dispatchEvent(new CustomEvent('uzu-markdown-editor-render', {
          bubbles: true,
          detail: { editor, source, preview, value }
        }));
      };
      if (shouldRenderMarkdownEditor(editor)) render();
      if (!markInitialized(editor, 'MarkdownEditor')) return;
      source.addEventListener('input', () => {
        const value = getSourceValue() || '';
        editor.dataset.uzuMarkdownValue = value;
        editor.dispatchEvent(new CustomEvent('uzu-markdown-editor-change', {
          bubbles: true,
          detail: { editor, source, preview, value }
        }));
        if (shouldRenderMarkdownEditor(editor)) render(value);
      });
    });
  }

  function initInlineEditors(root = document) {
    queryAll(root, '[data-uzu-inline-editor]').forEach((editor) => {
      editor.setAttribute('contenteditable', editor.getAttribute('contenteditable') || 'true');
      editor.setAttribute('role', editor.getAttribute('role') || 'textbox');
      const sync = (emit = true) => {
        editor.classList.toggle('is-empty', !editor.textContent.trim());
        if (emit) {
          editor.dispatchEvent(new CustomEvent('uzu-inline-editor-change', {
            bubbles: true,
            detail: { editor, value: editor.textContent }
          }));
        }
      };
      sync(false);
      if (!markInitialized(editor, 'InlineEditor')) return;
      editor.addEventListener('input', sync);
    });
  }

  function initEditors(root = document) {
    initEditorShells(root);
    initMarkdownEditors(root);
    initInlineEditors(root);
  }

/* ui/js/dialogs.js */
function getDialog(selector) {
    try {
      return selector ? document.querySelector(selector) : null;
    } catch (_) {
      return null;
    }
  }

  function getFocusable(dialog) {
    return queryAll(dialog, 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')
      .filter((element) => element.offsetParent !== null || element === document.activeElement);
  }

  function emitDialogEvent(dialog, name, trigger = activeDialogTrigger) {
    dialog.dispatchEvent(new CustomEvent(name, {
      bubbles: true,
      detail: {
        dialog,
        overlay: dialog.closest('[data-uzu-dialog-overlay]'),
        trigger
      }
    }));
  }

  function getDialogIsolationRoot(dialog) {
    return dialog.closest('[data-uzu-dialog-overlay]') || dialog;
  }

  function getDialogInertSiblings(root) {
    const siblings = new Set();
    let node = root;
    while (node && node !== document.body && node.parentElement) {
      [...node.parentElement.children].forEach((child) => {
        if (child !== node && !child.contains(root)) siblings.add(child);
      });
      node = node.parentElement;
    }
    return [...siblings];
  }

  function lockDialogScroll() {
    if (dialogScrollLockState || !document.body) return;
    const body = document.body;
    const root = document.documentElement;
    const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth);
    const bodyPaddingRight = window.getComputedStyle(body).paddingRight;
    const bodyPaddingValue = Number.parseFloat(bodyPaddingRight) || 0;
    dialogScrollLockState = {
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
      rootOverflow: root.style.overflow
    };
    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${bodyPaddingValue + scrollbarWidth}px`;
  }

  function unlockDialogScroll() {
    if (!dialogScrollLockState || !document.body) return;
    const body = document.body;
    const root = document.documentElement;
    body.style.overflow = dialogScrollLockState.bodyOverflow;
    body.style.paddingRight = dialogScrollLockState.bodyPaddingRight;
    root.style.overflow = dialogScrollLockState.rootOverflow;
    dialogScrollLockState = null;
  }

  function applyDialogIsolation(dialog) {
    if (dialogIsolationState && dialogIsolationState.dialog === dialog) return;
    restoreDialogIsolation();
    const root = getDialogIsolationRoot(dialog);
    const entries = getDialogInertSiblings(root).map((element) => ({
      element,
      hadInert: element.hasAttribute('inert'),
      ariaHidden: element.getAttribute('aria-hidden')
    }));
    entries.forEach(({ element }) => {
      element.setAttribute('inert', '');
      element.setAttribute('aria-hidden', 'true');
    });
    dialogIsolationState = { dialog, entries };
    lockDialogScroll();
  }

  function getTopDialog() {
    return dialogStack.at(-1) || null;
  }

  function isNestedDialog(dialog) {
    const top = getTopDialog();
    if (!top || top === dialog) return false;
    const overlay = dialog.closest('[data-uzu-dialog-overlay]');
    return top.contains(dialog) || (overlay && top.contains(overlay));
  }

  function pushDialog(dialog, trigger) {
    const existingIndex = dialogStack.indexOf(dialog);
    if (existingIndex >= 0) dialogStack.splice(existingIndex, 1);
    dialogStack.push(dialog);
    if (trigger) dialogTriggers.set(dialog, trigger);
    activeDialog = dialog;
    activeDialogTrigger = trigger;
  }

  function popDialog(dialog) {
    const index = dialogStack.indexOf(dialog);
    if (index >= 0) dialogStack.splice(index, 1);
    activeDialog = getTopDialog();
    activeDialogTrigger = activeDialog ? dialogTriggers.get(activeDialog) || null : null;
    dialogTriggers.delete(dialog);
  }

  function restoreDialogIsolation(dialog = null) {
    if (!dialogIsolationState || (dialog && dialogIsolationState.dialog !== dialog)) return;
    dialogIsolationState.entries.forEach(({ element, hadInert, ariaHidden }) => {
      if (!hadInert) element.removeAttribute('inert');
      if (ariaHidden === null) {
        element.removeAttribute('aria-hidden');
      } else {
        element.setAttribute('aria-hidden', ariaHidden);
      }
    });
    dialogIsolationState = null;
    unlockDialogScroll();
  }

  function openDialog(dialog, trigger = null) {
    if (!dialog) return;
    const nested = isNestedDialog(dialog);
    if (activeDialog && activeDialog !== dialog && !activeDialog.hidden && !nested) {
      closeDialog(activeDialog);
    }
    const existingTimer = dialogCloseTimers.get(dialog);
    if (existingTimer) {
      window.clearTimeout(existingTimer);
      dialogCloseTimers.delete(dialog);
    }
    pushDialog(dialog, trigger);
    const overlay = dialog.closest('[data-uzu-dialog-overlay]');
    if (overlay) overlay.hidden = false;
    dialog.hidden = false;
    if (overlay) {
      overlay.classList.remove('is-closing');
      overlay.classList.add('is-open');
    }
    dialog.classList.remove('is-closing');
    dialog.classList.add('is-open');
    dialog.setAttribute('role', dialog.getAttribute('role') || 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    if (!dialog.hasAttribute('tabindex')) dialog.setAttribute('tabindex', '-1');
    if (!nested) applyDialogIsolation(dialog);
    queueDisclosureHeightRefresh(dialog);
    const focusable = getFocusable(dialog);
    (focusable[0] || dialog).focus();
    emitDialogEvent(dialog, 'uzu-dialog-open');
  }

  function closeDialog(dialog) {
    if (!dialog || dialog.classList.contains('is-closing') || dialog.hidden) return;
    const overlay = dialog.closest('[data-uzu-dialog-overlay]');
    dialog.classList.remove('is-open');
    dialog.classList.add('is-closing');
    if (overlay) {
      overlay.classList.remove('is-open');
      overlay.classList.add('is-closing');
    }
    const trigger = dialogTriggers.get(dialog) || activeDialogTrigger;
    const finish = () => {
      dialog.classList.remove('is-closing');
      dialog.hidden = true;
      if (overlay) {
        overlay.classList.remove('is-closing');
        overlay.hidden = true;
      }
      restoreDialogIsolation(dialog);
      emitDialogEvent(dialog, 'uzu-dialog-close', trigger);
      const wasActiveDialog = activeDialog === dialog;
      if (wasActiveDialog || dialogStack.includes(dialog)) {
        popDialog(dialog);
        if (wasActiveDialog && trigger && typeof trigger.focus === 'function') trigger.focus();
      }
      dialogCloseTimers.delete(dialog);
    };
    const timer = scheduleAfterAnimation([dialog, overlay].filter(Boolean), finish);
    if (timer) dialogCloseTimers.set(dialog, timer);
  }

  function initDialogs(root = document) {
    queryAll(root, '[data-uzu-dialog-target]').forEach((trigger) => {
      if (!markInitialized(trigger, 'DialogTrigger')) return;
      trigger.addEventListener('click', () => {
        openDialog(getDialog(trigger.dataset.uzuDialogTarget), trigger);
      });
    });

    queryAll(root, '[data-uzu-dialog-close]').forEach((trigger) => {
      if (!markInitialized(trigger, 'DialogClose')) return;
      trigger.addEventListener('click', () => {
        closeDialog(trigger.closest('[data-uzu-dialog]'));
      });
    });

    queryAll(root, '[data-uzu-dialog-overlay]').forEach((overlay) => {
      if (!markInitialized(overlay, 'DialogOverlay')) return;
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) closeDialog(overlay.querySelector('[data-uzu-dialog]'));
      });
    });
  }

/* ui/js/toasts.js */
function closeToast(toast) {
    if (!toast || toast.classList.contains('is-dismissed')) return;
    toast.classList.add('is-dismissed');
    toast.dispatchEvent(new CustomEvent('uzu-toast-close', {
      bubbles: true,
      detail: { toast }
    }));
    const timer = scheduleAfterAnimation([toast], () => {
      toast.remove();
      toastCloseTimers.delete(toast);
    });
    if (timer) toastCloseTimers.set(toast, timer);
  }

  function getToastStack(selector) {
    const explicitSelector = typeof selector === 'string' && selector.trim() !== '';
    if (!explicitSelector) {
      return document.querySelector('[data-uzu-toast-stack], .uzu-toast-stack') || null;
    }
    try {
      return document.querySelector(selector) || null;
    } catch (_) {
      return null;
    }
  }

  function getToastTemplate(selector) {
    if (!selector) return null;
    try {
      const target = document.querySelector(selector);
      return target instanceof HTMLTemplateElement ? target : null;
    } catch (_) {
      return null;
    }
  }

  function syncToastLanguage(toast, reference = toast) {
    const languageRoot = getClosestLanguageRoot(reference);
    const language = languageRoot.getAttribute('data-language') || languageRoot.getAttribute('data-uzu-lang') || 'zh';
    if (toast.matches?.('[data-lang]') || toast.querySelector?.('[data-lang]')) {
      syncLanguageContent(toast, normalizeLanguage(language));
    }
  }

  function prepareToast(toast, reference = toast) {
    if (!(toast instanceof HTMLElement)) return null;
    if (!toast.hasAttribute('data-uzu-toast')) toast.setAttribute('data-uzu-toast', '');
    syncToastLanguage(toast, reference);
    initToasts(toast);
    return toast;
  }

  function getToastFromTemplate(template) {
    if (!template) return null;
    const fragment = template.content.cloneNode(true);
    return fragment.querySelector('[data-uzu-toast], .uzu-toast') || fragment.firstElementChild || null;
  }

  function showToast(options = {}) {
    const settings = typeof options === 'string' ? { template: options } : options || {};
    const stack = getToastStack(settings.stack || settings.stackSelector);
    if (!stack) return null;
    const template = getToastTemplate(settings.template || settings.templateSelector);
    const reference = settings.trigger instanceof Element ? settings.trigger : stack;
    const toast = prepareToast(settings.toast instanceof HTMLElement ? settings.toast : getToastFromTemplate(template), reference);
    if (!toast) return null;
    stack.append(toast);
    toast.dispatchEvent(new CustomEvent('uzu-toast-open', {
      bubbles: true,
      detail: { toast, stack }
    }));
    return toast;
  }

  function initToastInstance(toast) {
    if (!markInitialized(toast, 'Toast')) return;
    if (!toast.hasAttribute('role')) toast.setAttribute('role', 'status');
    if (!toast.hasAttribute('aria-live')) {
      toast.setAttribute('aria-live', toast.getAttribute('role') === 'alert' ? 'assertive' : 'polite');
    }
    if (!toast.hasAttribute('aria-atomic')) toast.setAttribute('aria-atomic', 'true');
    const timeout = Number(toast.dataset.uzuToastTimeout || 0);
    queryAll(toast, '[data-uzu-toast-close]').forEach((close) => {
      close.addEventListener('click', () => closeToast(toast));
    });
    if (timeout > 0) window.setTimeout(() => closeToast(toast), timeout);
  }

  function initToastTriggers(root = document) {
    queryAll(root, '[data-uzu-toast-trigger]').forEach((trigger) => {
      if (!markInitialized(trigger, 'ToastTrigger')) return;
      trigger.addEventListener('click', () => {
        if (isControlDisabled(trigger)) return;
        showToast({
          template: trigger.dataset.uzuToastTemplate || trigger.dataset.uzuToastTrigger,
          stack: trigger.dataset.uzuToastStack,
          trigger
        });
      });
    });
  }

  function initToasts(root = document) {
    queryAll(root, '[data-uzu-toast]').forEach((toast) => {
      initToastInstance(toast);
    });
    initToastTriggers(root);
  }

/* ui/js/panel-navigation.js */
function getPanelNavTarget(control) {
    return control.dataset.uzuPanelTarget || '';
  }

  function getPanelNavControl(root, target) {
    return getScopedControls(root, '[data-uzu-panel-target]', '[data-uzu-panel-nav]')
      .find((control) => getPanelNavTarget(control) === target);
  }

  function getPanelNavPanel(target) {
    if (!target) return null;
    try {
      return document.querySelector(target);
    } catch (_) {
      return null;
    }
  }

  function getPanelNavPanels(root, panel) {
    const panels = getScopedControls(root, '[data-uzu-panel-target]', '[data-uzu-panel-nav]')
      .map((item) => getPanelNavPanel(getPanelNavTarget(item)))
      .filter(Boolean);
    if (panels.length) return [...new Set(panels)];
    const selector = root.dataset.uzuPanelSelector || '.uzu-panel';
    const scope = root.closest(root.dataset.uzuPanelScope || '.uzu-scope, main, body') || root.parentElement || document;
    return queryAll(scope, selector).filter((item) => item === panel || item.parentElement === panel.parentElement);
  }

  function showPanelNavTarget(root, control, options = {}) {
    const target = getPanelNavTarget(control);
    if (!target || isControlDisabled(control)) return null;
    const panel = getPanelNavPanel(target);
    if (!panel) return null;
    const controls = getScopedControls(root, '[data-uzu-panel-target]', '[data-uzu-panel-nav]');
    controls.forEach((item) => {
      const isActive = item === control;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    getPanelNavPanels(root, panel).forEach((item) => {
      item.hidden = item !== panel;
    });
    if (options.updateHash && window.location.hash !== target) {
      window.history.pushState(null, '', target);
    }
    root.dispatchEvent(new CustomEvent('uzu-panel-nav-change', {
      bubbles: true,
      detail: { target, control, panel, nav: root }
    }));
    panel.dispatchEvent(new CustomEvent('uzu-panel-show', {
      bubbles: true,
      detail: { target, control, panel, nav: root }
    }));
    queueIndicatorRefresh(panel, true);
    queueDisclosureHeightRefresh(panel);
    return panel;
  }

  function syncStepNavState(stepNav, activeButton, emit = true) {
    const buttons = getScopedControls(stepNav, '.uzu-step-nav-button', '[data-uzu-step-nav]');
    const enabled = getEnabledControls(buttons);
    const nextButton = activeButton && !isControlDisabled(activeButton) ? activeButton : enabled[0];
    if (!nextButton) return;
    const previousValue = stepNav.dataset.uzuStepNavValue || '';
    const value = getControlValue(nextButton, 'uzuStepValue');
    let reachedActive = false;
    buttons.forEach((button) => {
      const isActive = button === nextButton;
      if (isActive) reachedActive = true;
      button.classList.toggle('is-active', isActive);
      button.classList.toggle('is-complete', !reachedActive && !isControlDisabled(button));
      if (isActive) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    stepNav.dataset.uzuStepNavValue = value;
    if (emit && value !== previousValue) {
      stepNav.dispatchEvent(new CustomEvent('uzu-step-nav-change', {
        bubbles: true,
        detail: { value, step: nextButton, stepNav, index: buttons.indexOf(nextButton) }
      }));
      stepNav.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function initStepNavs(root = document) {
    queryAll(root, '[data-uzu-step-nav]').forEach((stepNav) => {
      const buttons = getScopedControls(stepNav, '.uzu-step-nav-button', '[data-uzu-step-nav]');
      if (!buttons.length) return;
      const active = buttons.find((button) => button.classList.contains('is-active') || button.getAttribute('aria-current') === 'step');
      syncStepNavState(stepNav, active, false);
      if (!markInitialized(stepNav, 'StepNav')) return;
      stepNav.addEventListener('click', (event) => {
        const button = getScopedEventControl(event, '.uzu-step-nav-button', stepNav, '[data-uzu-step-nav]');
        if (!button || isControlDisabled(button)) return;
        syncStepNavState(stepNav, button);
      });
      stepNav.addEventListener('keydown', (event) => {
        const button = getScopedEventControl(event, '.uzu-step-nav-button', stepNav, '[data-uzu-step-nav]');
        if (!button || isControlDisabled(button)) return;
        let next = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = moveActiveControl(buttons, button, 1);
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = moveActiveControl(buttons, button, -1);
        else if (event.key === 'Home') next = getEnabledControls(buttons)[0];
        else if (event.key === 'End') next = getEnabledControls(buttons).at(-1);
        if (next) {
          event.preventDefault();
          syncStepNavState(stepNav, next);
          next.focus();
        }
      });
    });
  }

  function showPanelNavFromHash(root) {
    const target = window.location.hash;
    if (!target) return false;
    const control = getPanelNavControl(root, target);
    if (!control) return false;
    showPanelNavTarget(root, control);
    return true;
  }

  function initPanelNavs(root = document) {
    queryAll(root, '[data-uzu-panel-nav]').forEach((nav) => {
      const controls = getScopedControls(nav, '[data-uzu-panel-target]', '[data-uzu-panel-nav]');
      if (!controls.length) return;
      const openedFromHash = nav.dataset.uzuPanelHash === 'true' && showPanelNavFromHash(nav);
      if (!openedFromHash) {
        const active = controls.find((control) => control.classList.contains('is-active') || control.getAttribute('aria-pressed') === 'true') || controls[0];
        showPanelNavTarget(nav, active);
      }

      if (!markInitialized(nav, 'PanelNav')) return;
      nav.addEventListener('click', (event) => {
        const control = getScopedEventControl(event, '[data-uzu-panel-target]', nav, '[data-uzu-panel-nav]');
        if (!control) return;
        showPanelNavTarget(nav, control, { updateHash: nav.dataset.uzuPanelHash === 'true' });
      });
      if (nav.dataset.uzuPanelHash === 'true') {
        const listener = () => showPanelNavFromHash(nav);
        panelNavHashListeners.set(nav, listener);
        window.addEventListener('hashchange', listener);
      }
    });
  }

/* ui/js/tooltips.js */
function initTooltips(root = document) {
    queryAll(root, '[data-uzu-tooltip]').forEach((tooltip) => {
      if (tooltipNodes.has(tooltip)) return;
      if (tooltip.getAttribute('aria-describedby')) return;
      const text = tooltip.getAttribute('data-uzu-tooltip') || '';
      const id = tooltip.id || ensureId(tooltip, 'uzu-tooltip');
      const description = document.createElement('span');
      description.id = `${id}-desc`;
      description.className = 'uzu-sr-only';
      description.textContent = text;
      (document.body || document.documentElement).append(description);
      tooltip.setAttribute('aria-describedby', description.id);
      tooltipNodes.set(tooltip, description);
    });
  }

/* ui/js/code-highlight.js */
const codeHighlightClassMap = new Map([
    ['comment', 'comment'],
    ['quote', 'comment'],
    ['doctag', 'property'],
    ['keyword', 'keyword'],
    ['built_in', 'keyword'],
    ['type', 'tag'],
    ['literal', 'keyword'],
    ['number', 'number'],
    ['operator', 'operator'],
    ['punctuation', 'punctuation'],
    ['regexp', 'string'],
    ['string', 'string'],
    ['subst', 'variable'],
    ['symbol', 'variable'],
    ['class', 'tag'],
    ['function', 'variable'],
    ['title', 'variable'],
    ['params', 'variable'],
    ['attr', 'attr'],
    ['attribute', 'attr'],
    ['variable', 'variable'],
    ['property', 'property'],
    ['selector-tag', 'selector'],
    ['selector-id', 'selector'],
    ['selector-class', 'selector'],
    ['selector-attr', 'selector'],
    ['selector-pseudo', 'selector'],
    ['tag', 'tag'],
    ['name', 'tag'],
    ['section', 'selector'],
    ['bullet', 'operator'],
    ['code', 'string'],
    ['emphasis', 'string'],
    ['strong', 'keyword'],
    ['formula', 'string'],
    ['link', 'string'],
    ['meta', 'property'],
    ['deletion', 'invalid'],
    ['addition', 'string']
  ]);

  const codeLanguageAliases = {
    cjs: 'javascript',
    conf: 'ini',
    console: 'shell',
    cs: 'csharp',
    docker: 'dockerfile',
    golang: 'go',
    htm: 'html',
    html: 'xml',
    js: 'javascript',
    jsx: 'javascript',
    jsonc: 'json',
    mjs: 'javascript',
    md: 'markdown',
    patch: 'diff',
    ps: 'powershell',
    ps1: 'powershell',
    py: 'python',
    rb: 'ruby',
    rs: 'rust',
    sh: 'bash',
    svg: 'xml',
    terminal: 'shell',
    toml: 'ini',
    ts: 'typescript',
    tsx: 'typescript',
    xhtml: 'xml',
    yml: 'yaml',
    zsh: 'bash'
  };

  function normalizeCodeLanguage(value) {
    const language = String(value || '').trim().toLowerCase().replace(/^language-/, '');
    if (!language || language === 'text' || language === 'txt' || language === 'plain' || language === 'plaintext') return '';
    return codeLanguageAliases[language] || language;
  }

  function inferCodeLanguage(source) {
    const code = String(source || '').trim();
    if (!code) return '';
    if (/^\s*</.test(code)) return 'xml';
    if (/^\s*(?:\{|\[)/.test(code)) return 'json';
    if (/^\s*(?:--[\w-]+|[.#]?[\w-]+\s*\{|@media|@supports|:root)/m.test(code)) return 'css';
    if (/^\s*(?:npm|pnpm|yarn|node|git|cd|mkdir|cp|mv|rm|curl|sudo|export)\b/m.test(code)) return 'bash';
    if (/^\s*(?:#|\- |\* |\d+\. )/m.test(code)) return 'markdown';
    if (/\b(?:import|export|const|let|var|function|return|document|window|class|await|async)\b/.test(code)) return 'javascript';
    return '';
  }

  function getCodeLanguage(element, source) {
    const classLanguage = [...element.classList]
      .find((className) => className.startsWith('language-'));
    return normalizeCodeLanguage(element.dataset.uzuCodeLanguage || classLanguage || inferCodeLanguage(source));
  }

  function getCodeTargets(root = document) {
    const scope = root instanceof Element || root instanceof Document ? root : document;
    const nestedCode = queryAll(scope, '.uzu-code-block pre code, pre.uzu-code-block-body code');
    const plainPre = queryAll(scope, '.uzu-code-block pre, pre.uzu-code-block-body')
      .filter((pre) => !pre.querySelector('code'));
    return [...nestedCode, ...plainPre];
  }

  function mapHighlightClass(className) {
    if (!className.startsWith('hljs-')) return '';
    const token = className.replace(/^hljs-/, '');
    return codeHighlightClassMap.get(token) || '';
  }

  function mapCodeHighlightTokens(root) {
    queryAll(root, '[class*="hljs-"]').forEach((node) => {
      const mapped = [...node.classList].map(mapHighlightClass).filter(Boolean);
      node.className = mapped.length
        ? `uzu-code-token ${[...new Set(mapped)].map((token) => `uzu-code-token-${token}`).join(' ')}`
        : 'uzu-code-token';
    });
  }

  function highlightCode(source, language = '') {
    const code = String(source ?? '');
    const normalizedLanguage = normalizeCodeLanguage(language);
    const engine = typeof UsuzumiHighlightEngine !== 'undefined' ? UsuzumiHighlightEngine : null;
    if (!engine || typeof engine.highlight !== 'function') {
      const span = document.createElement('span');
      span.textContent = code;
      const fragment = document.createDocumentFragment();
      fragment.append(span);
      return {
        fragment,
        html: span.innerHTML,
        language: normalizedLanguage,
        highlighted: false
      };
    }
    const result = engine.highlight(code, normalizedLanguage);
    const template = document.createElement('template');
    template.innerHTML = result.value || '';
    if (!template.content.childNodes.length) {
      template.content.append(document.createTextNode(code));
    }
    mapCodeHighlightTokens(template.content);
    return {
      fragment: template.content,
      html: template.innerHTML,
      language: normalizeCodeLanguage(result.language) || normalizedLanguage,
      highlighted: Boolean(result.value)
    };
  }

  function highlightCodeBlock(target) {
    if (!(target instanceof HTMLElement)) return false;
    const source = target.dataset.uzuCodeSource ?? target.textContent ?? '';
    const language = getCodeLanguage(target, source);
    const signature = `${language || 'auto'}:${source}`;
    if (target.dataset.uzuSyntaxHighlighted === signature) return false;
    const result = highlightCode(source, language);
    target.dataset.uzuCodeSource = source;
    target.dataset.uzuCodeLanguage = result.language || language || '';
    target.dataset.uzuSyntaxHighlighted = signature;
    [...target.classList].forEach((className) => {
      if (className.startsWith('language-')) target.classList.remove(className);
    });
    target.classList.add(`language-${target.dataset.uzuCodeLanguage || 'text'}`);
    target.replaceChildren(result.fragment.cloneNode(true));
    target.dispatchEvent(new CustomEvent('uzu-code-highlight', {
      bubbles: true,
      detail: {
        code: target,
        language: target.dataset.uzuCodeLanguage,
        source,
        highlighted: result.highlighted
      }
    }));
    return true;
  }

  function highlightCodeBlocks(root = document) {
    let count = 0;
    getCodeTargets(root).forEach((target) => {
      if (highlightCodeBlock(target)) count += 1;
    });
    return count;
  }

  function initCodeHighlight(root = document) {
    highlightCodeBlocks(root);
  }

  function listCodeLanguages() {
    const engine = typeof UsuzumiHighlightEngine !== 'undefined' ? UsuzumiHighlightEngine : null;
    if (!engine || typeof engine.listLanguages !== 'function') return [];
    return engine.listLanguages().map(normalizeCodeLanguage).filter(Boolean);
  }

  function hasCodeLanguage(language) {
    const normalizedLanguage = normalizeCodeLanguage(language);
    if (!normalizedLanguage) return false;
    const engine = typeof UsuzumiHighlightEngine !== 'undefined' ? UsuzumiHighlightEngine : null;
    if (!engine || typeof engine.hasLanguage !== 'function') return false;
    return engine.hasLanguage(normalizedLanguage);
  }

/* ui/js/markdown.js */
function isSafeMarkdownHref(value) {
    const href = String(value || '').trim();
    if (!href) return false;
    if (href.startsWith('#') || href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) return true;
    try {
      return ['http:', 'https:', 'mailto:', 'tel:'].includes(new URL(href, window.location.href).protocol);
    } catch (_) {
      return false;
    }
  }

  function appendInlineMarkdown(parent, text) {
    const pattern = /(`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
    String(text).split(pattern).forEach((part) => {
      if (!part) return;
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        const code = document.createElement('code');
        code.className = 'uzu-code';
        code.textContent = part.slice(1, -1);
        parent.append(code);
        return;
      }
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        if (!isSafeMarkdownHref(link[2])) {
          parent.append(document.createTextNode(link[1]));
          return;
        }
        const anchor = document.createElement('a');
        anchor.href = link[2].trim();
        anchor.textContent = link[1];
        parent.append(anchor);
        return;
      }
      parent.append(document.createTextNode(part));
    });
  }

  function createMarkdownBlock(type, content) {
    const element = document.createElement(type);
    appendInlineMarkdown(element, content);
    return element;
  }

  function createCodeBlock(codeText, language = '') {
    const shell = document.createElement('div');
    shell.className = 'uzu-code-block';
    const pre = document.createElement('pre');
    pre.className = 'uzu-code-block-body uzu-scroll';
    const code = document.createElement('code');
    if (language) code.className = `language-${language}`;
    code.textContent = codeText.replace(/\n$/, '');
    pre.append(code);
    const button = document.createElement('button');
    button.className = 'uzu-icon-button uzu-code-block-copy';
    button.type = 'button';
    button.setAttribute('aria-label', 'Copy code');
    button.setAttribute('data-uzu-code-copy', '');
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><rect x="8" y="8" width="10" height="10" rx="1.8" stroke="currentColor" stroke-width="1.7"/><path d="M6 15H5.8A1.8 1.8 0 0 1 4 13.2V5.8A1.8 1.8 0 0 1 5.8 4h7.4A1.8 1.8 0 0 1 15 5.8V6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg><span data-uzu-code-copy-label>Copy</span>';
    shell.append(pre, button);
    return shell;
  }

  function renderMarkdown(markdown) {
    const fragment = document.createDocumentFragment();
    const lines = String(markdown).replace(/\r\n?/g, '\n').split('\n');
    let paragraph = [];
    let list = null;
    let inFence = false;
    let fenceLanguage = '';
    let fenceLines = [];

    const flushParagraph = () => {
      if (!paragraph.length) return;
      fragment.append(createMarkdownBlock('p', paragraph.join(' ')));
      paragraph = [];
    };
    const flushList = () => {
      if (!list) return;
      fragment.append(list);
      list = null;
    };

    lines.forEach((line) => {
      const fence = line.match(/^\s{0,3}```([\w-]*)\s*$/);
      if (fence) {
        if (inFence) {
          fragment.append(createCodeBlock(fenceLines.join('\n'), fenceLanguage));
          inFence = false;
          fenceLanguage = '';
          fenceLines = [];
        } else {
          flushParagraph();
          flushList();
          inFence = true;
          fenceLanguage = fence[1] || '';
        }
        return;
      }
      if (inFence) {
        fenceLines.push(line);
        return;
      }

      if (!line.trim()) {
        flushParagraph();
        flushList();
        return;
      }

      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        flushParagraph();
        flushList();
        fragment.append(createMarkdownBlock(`h${heading[1].length}`, heading[2]));
        return;
      }

      const item = line.match(/^\s*[-*]\s+(.+)$/);
      if (item) {
        flushParagraph();
        if (!list) list = document.createElement('ul');
        const li = document.createElement('li');
        appendInlineMarkdown(li, item[1]);
        list.append(li);
        return;
      }

      paragraph.push(line.trim());
    });

    if (inFence) fragment.append(createCodeBlock(fenceLines.join('\n'), fenceLanguage));
    flushParagraph();
    flushList();
    return fragment;
  }

  function initMarkdown(root = document) {
    queryAll(root, '[data-uzu-markdown]').forEach((element) => {
      if (markInitialized(element, 'Markdown')) {
        const source = element.tagName === 'TEXTAREA' ? element.value : element.textContent;
        element.replaceChildren(renderMarkdown(source));
      }
      initCodeHighlight(element);
      initCodeCopy(element);
    });
  }

/* ui/js/code-copy.js */
function getCodeCopyLabelText(button, label, key, fallback) {
    return label?.dataset[key] || button.dataset[key] || fallback;
  }

  function getCodeCopyLabels(button) {
    return queryAll(button, '[data-uzu-code-copy-label]');
  }

  function setCodeCopyLabel(button, key, fallback) {
    const labels = getCodeCopyLabels(button);
    const nextLabel = button.dataset[key] || fallback;
    button.setAttribute('aria-label', nextLabel);
    if (labels.length) {
      labels.forEach((label) => {
        label.textContent = getCodeCopyLabelText(button, label, key, fallback);
      });
      return;
    }
    button.textContent = nextLabel;
  }

  function restoreCodeCopyLabel(button) {
    const labels = getCodeCopyLabels(button);
    if (labels.length) {
      button.setAttribute('aria-label', button.dataset.uzuCopyText || 'Copy code');
      labels.forEach((label) => {
        label.textContent = getCodeCopyLabelText(button, label, 'uzuCopyText', label.dataset.uzuCodeCopyDefault || 'Copy');
      });
      return;
    }
    const defaultContent = codeCopyDefaultContent.get(button);
    if (defaultContent) {
      button.replaceChildren(...defaultContent.map((node) => node.cloneNode(true)));
      button.setAttribute('aria-label', button.dataset.uzuCopyText || 'Copy code');
      return;
    }
    button.setAttribute('aria-label', button.dataset.uzuCopyText || 'Copy code');
    button.textContent = button.dataset.uzuCopyText || 'Copy';
  }

  function isCodeCopyCandidateVisible(candidate) {
    if (!(candidate instanceof Element)) return false;
    let node = candidate;
    const block = candidate.closest('.uzu-code-block');
    while (node && node !== block) {
      if (node.hidden || node.hasAttribute('data-uzu-language-hidden')) return false;
      node = node.parentElement;
    }
    const style = window.getComputedStyle(candidate);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }

  function getCodeCopyCandidate(block) {
    if (!block) return null;
    const candidates = [
      ...queryAll(block, 'pre code'),
      ...queryAll(block, 'pre').filter((pre) => !pre.querySelector('code'))
    ];
    return candidates.find(isCodeCopyCandidateVisible) || candidates[0] || null;
  }

  function getCodeCopyText(block) {
    const code = getCodeCopyCandidate(block);
    return code?.dataset?.uzuCodeSource ?? code?.textContent ?? '';
  }

  function initCodeCopy(root = document) {
    queryAll(root, '[data-uzu-code-copy]').forEach((button) => {
      if (!markInitialized(button, 'CodeCopy')) return;
      const labels = getCodeCopyLabels(button);
      labels.forEach((label) => {
        if (!label.dataset.uzuCodeCopyDefault) label.dataset.uzuCodeCopyDefault = label.textContent.trim();
      });
      if (!labels.length && !codeCopyDefaultContent.has(button)) {
        codeCopyDefaultContent.set(button, [...button.childNodes].map((node) => node.cloneNode(true)));
      }
      button.addEventListener('click', () => {
        const block = button.closest('.uzu-code-block');
        const code = getCodeCopyText(block);
        copyText(code).then(() => {
          setCodeCopyLabel(button, 'uzuCopiedText', 'Copied');
          window.setTimeout(() => {
            restoreCodeCopyLabel(button);
          }, 1400);
        }).catch(() => {
          setCodeCopyLabel(button, 'uzuCopyFailedText', 'Copy failed');
          window.setTimeout(() => {
            restoreCodeCopyLabel(button);
          }, 1800);
        });
      });
    });
  }

/* ui/js/boot.js */
function handleDocumentClick(event) {
    queryAll(document, '[data-uzu-select].is-open').forEach((select) => {
      if (!select.contains(event.target)) closeSelect(select);
    });
    queryAll(document, '[data-uzu-combobox].is-open').forEach((combobox) => {
      if (!combobox.contains(event.target)) closeCombobox(combobox);
    });
    queryAll(document, '[data-uzu-language-select].is-open').forEach((select) => {
      if (!select.contains(event.target)) closeLanguageSelect(select);
    });
    queryAll(document, '[data-uzu-menu].is-open, [data-uzu-context-menu].is-open').forEach((menu) => {
      const trigger = getContextMenuTrigger(menu);
      if (!menu.contains(event.target) && !(trigger instanceof Element && trigger.contains(event.target))) closeMenu(menu);
    });
    queryAll(document, '[data-uzu-popover].is-open').forEach((popover) => {
      if (!popover.contains(event.target)) closePopover(popover);
    });
  }

  function handleDocumentKeydown(event) {
    if (event.key !== 'Escape') return;
    if (closeOpenLanguageSelects() || closeOpenMenus() || closeOpenPopovers()) {
      event.preventDefault();
    } else if (activeDialog) {
      event.preventDefault();
      closeDialog(activeDialog);
    }
  }

  function trapDialogFocus(event) {
    if (event.key !== 'Tab' || !activeDialog) return;
    const focusable = getFocusable(activeDialog);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function initGlobalListeners() {
    if (document.documentElement.dataset.uzuGlobalListeners === 'true') return;
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleDocumentKeydown);
    document.addEventListener('keydown', trapDialogFocus);
    resizeListener = () => queueIndicatorRefresh();
    window.addEventListener('resize', resizeListener);
    document.documentElement.dataset.uzuGlobalListeners = 'true';
  }

  function initAutoInit(root = document) {
    if (typeof MutationObserver === 'undefined') return;
    queryAll(root, '[data-uzu-auto-init]').forEach((container) => {
      if (autoInitObservers.has(container)) return;
      const observer = new MutationObserver((records) => {
        const added = [];
        records.forEach((record) => {
          record.addedNodes.forEach((node) => {
            if (node instanceof Element) added.push(node);
          });
        });
        if (!added.length) return;
        window.requestAnimationFrame(() => {
          if (!container.isConnected) return;
          added.forEach((node) => {
            if (node.isConnected && container.contains(node)) init(node);
          });
        });
      });
      observer.observe(container, { childList: true, subtree: true });
      autoInitObservers.set(container, observer);
    });
  }

  function isWholeDocumentRoot(root) {
    return root === document || root === document.documentElement || root === document.body;
  }

  function rootContains(root, node) {
    return root === document || root === node || (root instanceof Element && root.contains(node));
  }

  function destroy(root = document) {
    queryAll(root, '[data-uzu-auto-init]').forEach((container) => {
      const observer = autoInitObservers.get(container);
      if (observer) {
        observer.disconnect();
        autoInitObservers.delete(container);
      }
    });
    queryAll(root, '[data-uzu-panel-nav]').forEach((nav) => {
      const listener = panelNavHashListeners.get(nav);
      if (!listener) return;
      window.removeEventListener('hashchange', listener);
      panelNavHashListeners.delete(nav);
    });
    queryAll(root, '[data-uzu-tooltip]').forEach((tooltip) => {
      const description = tooltipNodes.get(tooltip);
      if (description && description.parentNode) {
        description.remove();
      }
      if (description) {
        const describedBy = (tooltip.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
        const nextDescribedBy = describedBy.filter((id) => id !== description.id).join(' ');
        if (nextDescribedBy) {
          tooltip.setAttribute('aria-describedby', nextDescribedBy);
        } else {
          tooltip.removeAttribute('aria-describedby');
        }
      }
      tooltipNodes.delete(tooltip);
    });
    [...activePointerDrags].forEach(([handle, stop]) => {
      if (!rootContains(root, handle)) return;
      try { stop(); } catch (_) {}
      handle.removeEventListener('lostpointercapture', stop);
    });
    if (isWholeDocumentRoot(root) || (dialogIsolationState && rootContains(root, dialogIsolationState.dialog))) {
      restoreDialogIsolation();
    }
    if (activeDialog && rootContains(root, activeDialog)) {
      const timer = dialogCloseTimers.get(activeDialog);
      if (timer) {
        window.clearTimeout(timer);
        dialogCloseTimers.delete(activeDialog);
      }
      activeDialog = null;
      activeDialogTrigger = null;
    }
    for (let index = dialogStack.length - 1; index >= 0; index -= 1) {
      const dialog = dialogStack[index];
      if (rootContains(root, dialog)) {
        dialogStack.splice(index, 1);
        dialogTriggers.delete(dialog);
      }
    }
    const dialogNodes = new Set(queryAll(root, '[data-uzu-dialog-overlay], [data-uzu-dialog]'));
    queryAll(root, '[data-uzu-dialog]').forEach((dialog) => {
      const overlay = dialog.closest('[data-uzu-dialog-overlay]');
      if (overlay) dialogNodes.add(overlay);
    });
    dialogNodes.forEach((node) => {
      const timer = dialogCloseTimers.get(node);
      if (timer) {
        window.clearTimeout(timer);
        dialogCloseTimers.delete(node);
      }
      node.classList.remove('is-open');
      node.classList.remove('is-closing');
      node.hidden = true;
    });
    queryAll(root, '[data-uzu-popover]').forEach((popover) => {
      const timer = popoverCloseTimers.get(popover);
      if (timer) {
        window.clearTimeout(timer);
        popoverCloseTimers.delete(popover);
      }
      const content = getPopoverContent(popover);
      popover.classList.remove('is-open', 'is-closing');
      if (content) content.hidden = true;
      const trigger = getPopoverTrigger(popover);
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
    if (!isWholeDocumentRoot(root)) return;
    if (themeMediaQuery) {
      if (themeMediaQuery.removeEventListener) {
        themeMediaQuery.removeEventListener('change', handleThemePreferenceChange);
      } else if (themeMediaQuery.removeListener) {
        themeMediaQuery.removeListener(handleThemePreferenceChange);
      }
      themeMediaQuery = null;
    }
    if (resizeListener) {
      window.removeEventListener('resize', resizeListener);
      resizeListener = null;
    }
    document.removeEventListener('click', handleDocumentClick);
    document.removeEventListener('keydown', handleDocumentKeydown);
    document.removeEventListener('keydown', trapDialogFocus);
    delete document.documentElement.dataset.uzuGlobalListeners;
  }

  function init(root = document) {
    syncRootClass();
    initGlobalListeners();
    for (const fn of [initThemeToggles, initLanguageSelects, initSelects, initTabs, initSegmented, initPaginations, initSwitches, initForms, initSearches, initPasswords, initSteppers, initSliders, initMenus, initContextMenus, initMenubars, initCommands, initComboboxes, initDataGrids, initTrees, initDisclosures, initAccordions, initHoverCards, initPopovers, initTags, initSplitPanes, initResizables, initJsonViewers, initDiffViewers, initEditors, initDialogs, initToasts, initTooltips, initStepNavs, initPanelNavs, initMarkdown, initCodeHighlight, initCodeCopy]) {
      try { fn(root); } catch (error) { console.error('[usuzumi]', error); }
    }
    initAutoInit(root);
    queueIndicatorRefresh(root);
  }

  window.Usuzumi = {
    init,
    applyTheme,
    applyLanguage,
    setSwitchState,
    setPasswordVisible,
    setStepperValue,
    setComboboxValue,
    setDataGridRowSelected,
    refreshDataGrid,
    setTagSelected,
    setSplitPaneSize,
    setResizableSize,
    setTreeItemExpanded,
    validateForm,
    renderJson,
    openMenu,
    closeMenu,
    openPopover,
    closePopover,
    setPaginationPage: syncPaginationState,
    setStepNavStep: syncStepNavState,
    renderMarkdown,
    highlightCode,
    highlightCodeBlock,
    highlightCodeBlocks,
    initCodeHighlight,
    listCodeLanguages,
    hasCodeLanguage,
    initCodeCopy,
    showToast,
    closeToast,
    openDialog,
    closeDialog,
    destroy
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init(), { once: true });
  } else {
    init();
  }
})();
