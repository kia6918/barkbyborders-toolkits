import { describe, expect, it } from 'vitest';
import {
  createLocalization,
  type LocalizationInstance,
  type LocalizationMessages,
  type TranslationKey,
} from '../src/index.js';

const messages = {
  en: {
    common: {
      save: 'Save',
      nested: {
        title: 'Settings',
      },
      labels: ['first', 'second'],
      fallbackOnly: 'Fallback {{count}}',
    },
    greeting: 'Hello, {{name}}! {{name}}',
    special: '{{user+name[0]}} and {{group.name}}',
  },
  fr: {
    common: {
      save: 'Enregistrer',
      nested: {
        title: 'Paramètres',
      },
      labels: ['premier', 'deuxième'],
    },
    greeting: 'Bonjour, {{name}} ! {{name}}',
    special: '{{user+name[0]}} et {{group.name}}',
  },
} as const satisfies Record<string, LocalizationMessages>;

const createTestLocalization = (locale: 'en' | 'fr' = 'fr') =>
  createLocalization({
    locale,
    fallbackLocale: 'en',
    messages,
  });

const translateDynamic = <TAllMessages extends Record<string, LocalizationMessages>>(
  key: string,
  locale: LocalizationInstance<TAllMessages>,
  params?: Record<string, string | number>,
) => locale.t(key as TranslationKey<TAllMessages[keyof TAllMessages]>, params);

const hasDynamic = <TAllMessages extends Record<string, LocalizationMessages>>(
  key: string,
  locale: LocalizationInstance<TAllMessages>,
) => locale.has(key as TranslationKey<TAllMessages[keyof TAllMessages]>);

describe('createLocalization', () => {
  it('keeps locale selection and nested translation keys typed', () => {
    const localization = createTestLocalization();
    const key: TranslationKey<typeof messages.en> = 'common.nested.title';

    expect(localization.getLocale()).toBe('fr');
    expect(localization.t(key)).toBe('Paramètres');

    localization.setLocale('en');
    expect(localization.getLocale()).toBe('en');
    expect(localization.t('common.save')).toBe('Save');

    // @ts-expect-error Unknown translation keys must fail type-checking.
    localization.t('common.missing');
    // @ts-expect-error Arrays are values, not translatable leaf keys.
    localization.t('common.labels');
  });

  it('interpolates repeated string and numeric parameters', () => {
    const localization = createTestLocalization();

    expect(localization.t('greeting', { name: 'Ari' })).toBe('Bonjour, Ari ! Ari');
    expect(localization.t('common.fallbackOnly', { count: 3 })).toBe('Fallback 3');
  });

  it('supports parameter names with regex metacharacters', () => {
    const localization = createTestLocalization();

    expect(
      localization.t('special', {
        'user+name[0]': 'Ari',
        'group.name': 'Dogs',
      }),
    ).toBe('Ari et Dogs');
  });

  it('leaves placeholders untouched when no parameter value is supplied', () => {
    const localization = createTestLocalization('en');

    expect(localization.t('greeting')).toBe('Hello, {{name}}! {{name}}');
  });

  it('uses the fallback locale for missing translations and reports their presence', () => {
    const localization = createTestLocalization();

    expect(localization.t('common.fallbackOnly')).toBe('Fallback {{count}}');
    expect(localization.has('common.fallbackOnly')).toBe(true);
    expect(localization.has('common.save')).toBe(true);
  });

  it('returns the key for missing translations when no missing-key handler is configured', () => {
    const localization = createLocalization({ locale: 'en', messages: { en: messages.en } });

    expect(translateDynamic('common.absent', localization)).toBe('common.absent');
    expect(localization.has('common.save')).toBe(true);
    expect(localization.has('greeting')).toBe(true);
  });

  it('applies interpolation to the missing-key handler result', () => {
    const localization = createLocalization({
      locale: 'en',
      messages: { en: messages.en },
      onMissingKey: (key) => `Missing: ${key} ({{count}})`,
    });

    expect(translateDynamic('common.absent', localization, { count: 2 })).toBe(
      'Missing: common.absent (2)',
    );
    expect(hasDynamic('common.absent', localization)).toBe(false);
  });

  it('rejects invalid runtime paths, arrays, and inherited object properties', () => {
    const localization = createTestLocalization('en');

    expect(translateDynamic('common..save', localization)).toBe('common..save');
    expect(translateDynamic('common.labels', localization)).toBe('common.labels');
    expect(translateDynamic('__proto__.toString', localization)).toBe('__proto__.toString');
    expect(translateDynamic('common.nested.absent', localization)).toBe(
      'common.nested.absent',
    );
  });
});
