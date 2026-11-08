# @barkbyborders/localization

Framework-agnostic TypeScript localization with strongly typed nested keys, locale switching, fallback messages, and interpolation. It has no runtime dependencies.

## Install

```sh
pnpm add @barkbyborders/localization
```

## Create an instance

```ts
import {
  createLocalization,
  type LocalizationMessages,
} from '@barkbyborders/localization';

const en = {
  common: {
    save: 'Save',
  },
  greeting: 'Hello, {{name}}!',
} as const;

const fr = {
  common: {
    save: 'Enregistrer',
  },
  greeting: 'Bonjour, {{name}} !',
} as const;

const messages = { en, fr } satisfies Record<string, LocalizationMessages>;

export const i18n = createLocalization({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});

// Inferred as `string`; invalid keys fail TypeScript checking.
i18n.t('common.save');
i18n.t('greeting', { name: 'Ari' });
i18n.setLocale('fr');
```

## API

- `createLocalization({ locale, messages, fallbackLocale?, onMissingKey? })` creates an independent localization instance.
- `getLocale()` and `setLocale(locale)` read and change its active locale.
- `t(key, params?)` resolves a nested key, interpolates `{{parameter}}` placeholders, and falls back to `fallbackLocale`. If no translation exists, it returns `onMissingKey(key)` or the key itself.
- `has(key)` checks whether the active or fallback locale contains a string value for that key.
- `TranslationKey<TMessages>`, `LocalizationMessages`, `LocaleOf<TMessages>`, and the related option/instance types are exported.

Translation keys use dot-separated paths. Arrays and objects are not leaf translations. Unmatched placeholders remain unchanged.
