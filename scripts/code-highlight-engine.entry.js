import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import diff from 'highlight.js/lib/languages/diff';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import go from 'highlight.js/lib/languages/go';
import http from 'highlight.js/lib/languages/http';
import ini from 'highlight.js/lib/languages/ini';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import less from 'highlight.js/lib/languages/less';
import markdown from 'highlight.js/lib/languages/markdown';
import nginx from 'highlight.js/lib/languages/nginx';
import php from 'highlight.js/lib/languages/php';
import powershell from 'highlight.js/lib/languages/powershell';
import python from 'highlight.js/lib/languages/python';
import ruby from 'highlight.js/lib/languages/ruby';
import rust from 'highlight.js/lib/languages/rust';
import scss from 'highlight.js/lib/languages/scss';
import shell from 'highlight.js/lib/languages/shell';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';

const languageModules = [
  ['bash', bash, ['sh', 'zsh']],
  ['c', c, ['h']],
  ['cpp', cpp, ['cc', 'c++', 'cxx', 'hpp']],
  ['csharp', csharp, ['cs']],
  ['css', css],
  ['diff', diff, ['patch']],
  ['dockerfile', dockerfile, ['docker']],
  ['go', go, ['golang']],
  ['http', http],
  ['ini', ini, ['conf', 'toml']],
  ['java', java],
  ['javascript', javascript, ['js', 'jsx', 'mjs', 'cjs']],
  ['json', json, ['jsonc']],
  ['less', less],
  ['markdown', markdown, ['md']],
  ['nginx', nginx],
  ['php', php],
  ['powershell', powershell, ['ps', 'ps1']],
  ['python', python, ['py']],
  ['ruby', ruby, ['rb']],
  ['rust', rust, ['rs']],
  ['scss', scss],
  ['shell', shell, ['console', 'terminal']],
  ['sql', sql],
  ['typescript', typescript, ['ts', 'tsx']],
  ['xml', xml, ['html', 'xhtml', 'svg']],
  ['yaml', yaml, ['yml']]
];

const registeredLanguages = [];

languageModules.forEach(([name, language, aliases = []]) => {
  hljs.registerLanguage(name, language);
  registeredLanguages.push(name);
  if (aliases.length) hljs.registerAliases(aliases, { languageName: name });
});

function highlight(source, language = '') {
  const code = String(source ?? '');
  if (!code) {
    return { value: '', language: language || '', relevance: 0 };
  }
  try {
    if (language && hljs.getLanguage(language)) {
      const result = hljs.highlight(code, { language, ignoreIllegals: true });
      return {
        value: result.value,
        language: result.language || language,
        relevance: result.relevance || 0
      };
    }
    const result = hljs.highlightAuto(code, registeredLanguages);
    return {
      value: result.value,
      language: result.language || '',
      relevance: result.relevance || 0
    };
  } catch (_) {
    return { value: '', language: language || '', relevance: 0 };
  }
}

function hasLanguage(language) {
  return Boolean(language && hljs.getLanguage(language));
}

function listLanguages() {
  return [...registeredLanguages];
}

export { hasLanguage, highlight, listLanguages };
