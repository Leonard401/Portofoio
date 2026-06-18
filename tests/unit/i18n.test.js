import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { translations, otherLanguage, getStoredLanguage, storeLanguage } from '../../js/i18n.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const html = readFileSync(path.join(__dirname, '../../index.html'), 'utf8');

function extractKeysFromHtml(markup) {
  const matches = [...markup.matchAll(/data-i18n="([^"]+)"/g)];
  return [...new Set(matches.map((m) => m[1]))];
}

describe('translations', () => {
  it('has the exact same set of keys for ro and en', () => {
    expect(Object.keys(translations.en).sort()).toEqual(Object.keys(translations.ro).sort());
  });

  it('covers every data-i18n key referenced in index.html', () => {
    const usedKeys = extractKeysFromHtml(html);
    expect(usedKeys.length).toBeGreaterThan(0);
    expect(usedKeys.filter((k) => !(k in translations.ro))).toEqual([]);
    expect(usedKeys.filter((k) => !(k in translations.en))).toEqual([]);
  });

  it('has no leftover translation keys unused by the markup', () => {
    const usedKeys = new Set(extractKeysFromHtml(html));
    const unused = Object.keys(translations.ro).filter((k) => !usedKeys.has(k));
    expect(unused).toEqual([]);
  });
});

describe('otherLanguage', () => {
  it('toggles between ro and en', () => {
    expect(otherLanguage('ro')).toBe('en');
    expect(otherLanguage('en')).toBe('ro');
  });
});

describe('getStoredLanguage', () => {
  it('defaults to ro when nothing is stored', () => {
    expect(getStoredLanguage({ getItem: () => null })).toBe('ro');
  });

  it('returns en when stored as en', () => {
    expect(getStoredLanguage({ getItem: () => 'en' })).toBe('en');
  });

  it('falls back to ro for any other stored value', () => {
    expect(getStoredLanguage({ getItem: () => 'fr' })).toBe('ro');
  });

  it('falls back to ro when storage access throws', () => {
    const throwingStorage = { getItem: () => { throw new Error('blocked'); } };
    expect(getStoredLanguage(throwingStorage)).toBe('ro');
  });
});

describe('storeLanguage', () => {
  it('persists the language via setItem', () => {
    const calls = [];
    storeLanguage('en', { setItem: (k, v) => calls.push([k, v]) });
    expect(calls).toEqual([['lang', 'en']]);
  });

  it('does not throw when storage access is blocked', () => {
    const throwingStorage = { setItem: () => { throw new Error('blocked'); } };
    expect(() => storeLanguage('en', throwingStorage)).not.toThrow();
  });
});
