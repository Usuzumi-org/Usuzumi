/* Usuzumi generated syntax highlight engine. Edit scripts/code-highlight-engine.entry.js, then run npm run build. */
/* Usuzumi lightweight syntax highlight engine */
var UsuzumiHighlightEngine = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // scripts/code-highlight-engine.entry.js
  var code_highlight_engine_entry_exports = {};
  __export(code_highlight_engine_entry_exports, {
    hasLanguage: () => hasLanguage,
    highlight: () => highlight,
    listLanguages: () => listLanguages
  });
  var languageAliases = {
    cjs: "javascript",
    conf: "ini",
    console: "shell",
    cs: "csharp",
    docker: "dockerfile",
    golang: "go",
    htm: "xml",
    html: "xml",
    js: "javascript",
    jsx: "javascript",
    jsonc: "json",
    less: "scss",
    mjs: "javascript",
    md: "markdown",
    patch: "diff",
    ps: "powershell",
    ps1: "powershell",
    py: "python",
    rb: "ruby",
    rs: "rust",
    sh: "bash",
    svg: "xml",
    terminal: "shell",
    toml: "ini",
    ts: "typescript",
    tsx: "typescript",
    xhtml: "xml",
    yml: "yaml",
    zsh: "bash"
  };
  var languages = [
    "bash",
    "c",
    "cpp",
    "csharp",
    "css",
    "diff",
    "dockerfile",
    "go",
    "http",
    "ini",
    "java",
    "javascript",
    "json",
    "markdown",
    "nginx",
    "php",
    "powershell",
    "python",
    "ruby",
    "rust",
    "scss",
    "shell",
    "sql",
    "typescript",
    "xml",
    "yaml"
  ];
  var keywordSets = {
    bash: "if then else elif fi for while until do done case esac in function select time coproc export local readonly return shift break continue exit true false sudo npm pnpm yarn node git cd mkdir cp mv rm curl grep rg cat sed awk echo test".split(" "),
    c: "auto break case char const continue default do double else enum extern float for goto if inline int long register restrict return short signed sizeof static struct switch typedef union unsigned void volatile while bool true false null".split(" "),
    cpp: "alignas alignof asm auto bool break case catch char class const constexpr const_cast continue decltype default delete do double dynamic_cast else enum explicit export extern false float for friend goto if inline int long mutable namespace new noexcept nullptr operator private protected public register reinterpret_cast return short signed sizeof static static_assert static_cast struct switch template this thread_local throw true try typedef typeid typename union unsigned using virtual void volatile while".split(" "),
    csharp: "abstract as base bool break byte case catch char checked class const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach goto if implicit in int interface internal is lock long namespace new null object operator out override params private protected public readonly ref return sbyte sealed short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using virtual void volatile while var async await".split(" "),
    css: "@media @supports @container @keyframes @font-face @layer @import @scope important var calc color-mix repeat minmax clamp".split(" "),
    dockerfile: "FROM RUN CMD LABEL MAINTAINER EXPOSE ENV ADD COPY ENTRYPOINT VOLUME USER WORKDIR ARG ONBUILD STOPSIGNAL HEALTHCHECK SHELL".split(" "),
    go: "break default func interface select case defer go map struct chan else goto package switch const fallthrough if range type continue for import return var true false nil iota".split(" "),
    http: "GET POST PUT PATCH DELETE HEAD OPTIONS HTTP Host Content-Type Accept Authorization Cache-Control".split(" "),
    ini: "true false yes no on off null".split(" "),
    java: "abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new null package private protected public return short static strictfp super switch synchronized this throw throws transient true try void volatile while var".split(" "),
    javascript: "as async await break case catch class const continue debugger default delete do else export extends false finally for from function get if import in instanceof let new null of return set static super switch this throw true try typeof undefined var void while with yield document window".split(" "),
    json: "true false null".split(" "),
    markdown: "".split(" "),
    nginx: "server location upstream listen root index proxy_pass include try_files return rewrite access_log error_log".split(" "),
    php: "abstract and array as break callable case catch class clone const continue declare default die do echo else elseif empty enddeclare endfor endforeach endif endswitch endwhile eval exit extends final finally fn for foreach function global goto if implements include include_once instanceof insteadof interface isset list namespace new null or print private protected public require require_once return static switch throw trait try unset use var while xor true false".split(" "),
    powershell: "begin break catch class continue data define do dynamicparam else elseif end enum exit filter finally for foreach from function if in param process return switch throw trap try until using var while true false null".split(" "),
    python: "and as assert async await break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield self".split(" "),
    ruby: "BEGIN END alias and begin break case class def defined do else elsif end ensure false for if in module next nil not or redo rescue retry return self super then true undef unless until when while yield".split(" "),
    rust: "as async await break const continue crate dyn else enum extern false fn for if impl in let loop match mod move mut pub ref return self Self static struct super trait true type unsafe use where while".split(" "),
    scss: "@use @forward @mixin @include @function @return @if @else @for @each @while @extend @media @supports var calc color-mix".split(" "),
    shell: "if then else elif fi for while until do done case esac in function select time export local readonly return shift break continue exit true false".split(" "),
    sql: "select from where join left right inner outer full on group by order having limit offset insert into update delete create alter drop table view index values set and or not null true false is like in exists between union all distinct as case when then else end primary key foreign references".split(" "),
    typescript: "abstract any as async await boolean break case catch class const constructor continue debugger declare default delete do else enum export extends false finally for from function get if implements import in infer instanceof interface keyof let module namespace never new null number object of private protected public readonly return set static string super switch symbol this throw true try type typeof undefined unknown var void while with yield".split(" "),
    xml: "".split(" "),
    yaml: "true false yes no on off null".split(" ")
  };
  function normalizeLanguage(value) {
    const language = String(value || "").trim().toLowerCase().replace(/^language-/, "");
    if (!language || language === "text" || language === "txt" || language === "plain" || language === "plaintext") return "";
    return languageAliases[language] || language;
  }
  function escapeHtml(value) {
    return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  }
  function token(type, value) {
    return `<span class="uzu-code-token uzu-code-token-${type}">${escapeHtml(value)}</span>`;
  }
  function plain(value) {
    return escapeHtml(value);
  }
  function sticky(pattern, flags = "") {
    return new RegExp(pattern.source, flags.includes("y") ? flags : `${flags}y`);
  }
  function applyRules(source, rules) {
    const code = String(source ?? "");
    let output = "";
    let index = 0;
    while (index < code.length) {
      let matched = false;
      for (const rule of rules) {
        rule.pattern.lastIndex = index;
        const match = rule.pattern.exec(code);
        if (!match) continue;
        const value = match[0];
        if (!value) continue;
        output += typeof rule.render === "function" ? rule.render(value, match) : token(rule.type, value);
        index += value.length;
        matched = true;
        break;
      }
      if (!matched) {
        output += plain(code[index]);
        index += 1;
      }
    }
    return output;
  }
  function keywordRule(language) {
    const words = [...new Set(keywordSets[language] || [])].filter(Boolean).sort((a, b) => b.length - a.length);
    if (!words.length) return null;
    const symbolic = words.filter((word) => word.startsWith("@")).map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const regular = words.filter((word) => !word.startsWith("@")).map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const parts = [];
    if (symbolic.length) parts.push(`(?:${symbolic.join("|")})\\b?`);
    if (regular.length) parts.push(`\\b(?:${regular.join("|")})\\b`);
    return { pattern: sticky(new RegExp(parts.join("|"))), type: "keyword" };
  }
  function commonRules(language, options = {}) {
    const rules = [];
    if (options.hashComments) rules.push({ pattern: sticky(/#[^\n]*/), type: "comment" });
    if (options.sqlComments) rules.push({ pattern: sticky(/--[^\n]*/), type: "comment" });
    if (options.slashComments !== false) {
      rules.push({ pattern: sticky(/\/\*[\s\S]*?\*\//), type: "comment" });
      rules.push({ pattern: sticky(/\/\/[^\n]*/), type: "comment" });
    }
    rules.push({ pattern: sticky(/`(?:\\[\s\S]|[^`\\])*`/), type: "string" });
    rules.push({ pattern: sticky(/"(?:\\[\s\S]|[^"\\])*"/), type: "string" });
    rules.push({ pattern: sticky(/'(?:\\[\s\S]|[^'\\])*'/), type: "string" });
    rules.push({ pattern: sticky(/\b0x[\da-fA-F]+\b|\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i), type: "number" });
    const keywords = keywordRule(language);
    if (keywords) rules.push(keywords);
    if (options.variables) rules.push({ pattern: sticky(/[$@][A-Za-z_][\w:-]*/), type: "variable" });
    rules.push({ pattern: sticky(/[{}()[\].,;:]/), type: "punctuation" });
    rules.push({ pattern: sticky(/[+\-*\/%=!<>|&~^?]+/), type: "operator" });
    return rules;
  }
  function highlightGeneric(source, language) {
    const hashLanguages = /* @__PURE__ */ new Set(["bash", "dockerfile", "ini", "nginx", "powershell", "python", "ruby", "shell", "yaml"]);
    const sqlLanguages = /* @__PURE__ */ new Set(["sql"]);
    const variableLanguages = /* @__PURE__ */ new Set(["bash", "php", "powershell", "ruby", "shell"]);
    return applyRules(source, commonRules(language, {
      hashComments: hashLanguages.has(language),
      sqlComments: sqlLanguages.has(language),
      variables: variableLanguages.has(language)
    }));
  }
  function highlightJson(source) {
    return applyRules(source, [
      { pattern: sticky(/"(?:\\[\s\S]|[^"\\])*"(?=\s*:)/), type: "property" },
      { pattern: sticky(/"(?:\\[\s\S]|[^"\\])*"/), type: "string" },
      { pattern: sticky(/\b(?:true|false|null)\b/), type: "keyword" },
      { pattern: sticky(/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i), type: "number" },
      { pattern: sticky(/[{}[\],:]/), type: "punctuation" }
    ]);
  }
  function highlightDiff(source) {
    return String(source ?? "").split(/(\n)/).map((line) => {
      if (line === "\n") return line;
      if (line.startsWith("+++") || line.startsWith("---") || line.startsWith("@@")) return token("property", line);
      if (line.startsWith("+")) return token("string", line);
      if (line.startsWith("-")) return token("invalid", line);
      return plain(line);
    }).join("");
  }
  function renderAttributes(value) {
    return applyRules(value, [
      { pattern: sticky(/\s+/), render: plain },
      { pattern: sticky(/[A-Za-z_:][\w:.-]*(?=\s*=)/), type: "attr" },
      { pattern: sticky(/"(?:\\[\s\S]|[^"\\])*"/), type: "string" },
      { pattern: sticky(/'(?:\\[\s\S]|[^'\\])*'/), type: "string" },
      { pattern: sticky(/[=\/]/), type: "operator" },
      { pattern: sticky(/[<>]/), type: "punctuation" }
    ]);
  }
  function highlightXml(source) {
    const code = String(source ?? "");
    let output = "";
    let index = 0;
    const pattern = /<!--[\s\S]*?-->|<!\[[\s\S]*?\]>|<\/?[A-Za-z][\s\S]*?>/g;
    for (const match of code.matchAll(pattern)) {
      output += plain(code.slice(index, match.index));
      const tag = match[0];
      if (tag.startsWith("<!--")) output += token("comment", tag);
      else {
        const tagMatch = tag.match(/^(<\/?)([A-Za-z][\w:.-]*)([\s\S]*?)(\/?>)$/);
        if (!tagMatch) output += plain(tag);
        else output += token("punctuation", tagMatch[1]) + token("tag", tagMatch[2]) + renderAttributes(tagMatch[3]) + token("punctuation", tagMatch[4]);
      }
      index = match.index + tag.length;
    }
    output += plain(code.slice(index));
    return output;
  }
  function highlightCss(source, language = "css") {
    return applyRules(source, [
      { pattern: sticky(/\/\*[\s\S]*?\*\//), type: "comment" },
      { pattern: sticky(/"(?:\\[\s\S]|[^"\\])*"/), type: "string" },
      { pattern: sticky(/'(?:\\[\s\S]|[^'\\])*'/), type: "string" },
      { pattern: sticky(/#[\da-fA-F]{3,8}\b/), type: "number" },
      { pattern: sticky(/\b\d+(?:\.\d+)?(?:%|[a-z]+)?\b/i), type: "number" },
      { pattern: sticky(/--[A-Za-z_][\w-]*(?=\s*:)/), type: "property" },
      { pattern: sticky(/[A-Za-z-]+(?=\s*:)/), type: "property" },
      { pattern: sticky(/[.#][A-Za-z_][\w-]*/), type: "selector" },
      { pattern: sticky(/@[A-Za-z-]+/), type: "keyword" },
      keywordRule(language) || { pattern: sticky(/\bvar\b/), type: "keyword" },
      { pattern: sticky(/[{}()[\].,;:]/), type: "punctuation" },
      { pattern: sticky(/[+\-*\/%=!<>|&~^?]+/), type: "operator" }
    ]);
  }
  function highlightMarkdown(source) {
    const lines = String(source ?? "").split(/(\n)/);
    let inFence = false;
    return lines.map((line) => {
      if (line === "\n") return line;
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        return token("string", line);
      }
      if (inFence) return token("string", line);
      if (/^\s{0,3}#{1,6}\s/.test(line)) return token("selector", line.match(/^\s{0,3}#{1,6}/)[0]) + plain(line.replace(/^\s{0,3}#{1,6}/, ""));
      if (/^\s*[-*+]\s/.test(line)) return token("operator", line.match(/^\s*[-*+]/)[0]) + plain(line.replace(/^\s*[-*+]/, ""));
      return applyRules(line, [
        { pattern: sticky(/`[^`]+`/), type: "string" },
        { pattern: sticky(/!?\[[^\]]+\]\([^)]+\)/), type: "property" },
        { pattern: sticky(/\*\*[^*]+\*\*/), type: "keyword" },
        { pattern: sticky(/\*[^*]+\*/), type: "string" }
      ]);
    }).join("");
  }
  function inferLanguage(source) {
    const code = String(source || "").trim();
    if (!code) return "";
    if (/^\s*</.test(code)) return "xml";
    if (/^\s*(?:\{|\[)/.test(code)) return "json";
    if (/^\s*(?:FROM|RUN|COPY|CMD|ENTRYPOINT)\b/m.test(code)) return "dockerfile";
    if (/^\s*(?:select|insert|update|delete|create)\b/i.test(code)) return "sql";
    if (/^\s*(?:--[\w-]+|[.#]?[\w-]+\s*\{|@media|@supports|:root)/m.test(code)) return "css";
    if (/^\s*(?:npm|pnpm|yarn|node|git|cd|mkdir|cp|mv|rm|curl|sudo|export)\b/m.test(code)) return "bash";
    if (/^\s*(?:#|- |\* |\d+\. )/m.test(code)) return "markdown";
    if (/\b(?:import|export|const|let|var|function|return|document|window|class|await|async)\b/.test(code)) return "javascript";
    return "";
  }
  function highlight(source, language = "") {
    const code = String(source ?? "");
    if (!code) return { value: "", language: normalizeLanguage(language) || "", relevance: 0 };
    const requestedLanguage = normalizeLanguage(language);
    const inferredLanguage = requestedLanguage && hasLanguage(requestedLanguage) ? requestedLanguage : inferLanguage(code);
    const knownLanguage = hasLanguage(inferredLanguage) ? inferredLanguage : "";
    const activeLanguage = knownLanguage || "text";
    let value = "";
    try {
      if (activeLanguage === "json") value = highlightJson(code);
      else if (activeLanguage === "xml") value = highlightXml(code);
      else if (activeLanguage === "css" || activeLanguage === "scss") value = highlightCss(code, activeLanguage);
      else if (activeLanguage === "markdown") value = highlightMarkdown(code);
      else if (activeLanguage === "diff") value = highlightDiff(code);
      else if (activeLanguage === "text") value = plain(code);
      else value = highlightGeneric(code, activeLanguage);
    } catch (_) {
      value = plain(code);
    }
    return {
      value,
      language: knownLanguage,
      relevance: value === plain(code) ? 0 : 1
    };
  }
  function hasLanguage(language) {
    return languages.includes(normalizeLanguage(language));
  }
  function listLanguages() {
    return [...languages];
  }
  return __toCommonJS(code_highlight_engine_entry_exports);
})();
const usuzumiHighlightGlobal = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : null);
if (usuzumiHighlightGlobal && typeof UsuzumiHighlightEngine !== 'undefined') {
  usuzumiHighlightGlobal.UsuzumiHighlightEngine = UsuzumiHighlightEngine;
}
if (typeof window !== 'undefined' && typeof UsuzumiHighlightEngine !== 'undefined') {
  window.UsuzumiHighlightEngine = UsuzumiHighlightEngine;
}
if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
  const usuzumiHighlightEngine = window.UsuzumiHighlightEngine || usuzumiHighlightGlobal?.UsuzumiHighlightEngine || null;
  window.dispatchEvent(new CustomEvent('uzu-code-highlight-engine-ready', { detail: { engine: usuzumiHighlightEngine } }));
}
