export type LocalizationMessageValue =
  | string
  | readonly string[]
  | { readonly [key: string]: LocalizationMessageValue };

export type LocalizationMessages = { readonly [key: string]: LocalizationMessageValue };

export type LocaleOf<TAllMessages extends Record<string, unknown>> = Extract<keyof TAllMessages, string>;

type TranslationKeyFor<TMessages extends LocalizationMessages> = {
  [K in Extract<keyof TMessages, string>]: TMessages[K] extends string
    ? K
    : TMessages[K] extends readonly string[]
      ? never
      : TMessages[K] extends LocalizationMessages
        ? `${K}.${TranslationKey<TMessages[K]>}`
        : never;
}[Extract<keyof TMessages, string>];

export type TranslationKey<TMessages extends LocalizationMessages> =
  TMessages extends LocalizationMessages ? TranslationKeyFor<TMessages> : never;

export type CreateLocalizationOptions<TAllMessages extends Record<string, LocalizationMessages>> = {
  locale: LocaleOf<TAllMessages>;
  messages: TAllMessages;
  fallbackLocale?: LocaleOf<TAllMessages>;
  onMissingKey?: (key: string) => string;
};

export type LocalizationInstance<TAllMessages extends Record<string, LocalizationMessages>> = {
  getLocale: () => LocaleOf<TAllMessages>;
  setLocale: (next: LocaleOf<TAllMessages>) => void;
  t: <TKey extends TranslationKey<TAllMessages[keyof TAllMessages]>>(
    key: TKey,
    params?: Record<string, string | number>,
  ) => string;
  has: <TKey extends TranslationKey<TAllMessages[keyof TAllMessages]>>(key: TKey) => boolean;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getPathValue = (root: unknown, key: string): unknown => {
  const parts = key.split('.');
  let cursor: unknown = root;

  for (const part of parts) {
    if (!isRecord(cursor) || !Object.prototype.hasOwnProperty.call(cursor, part)) return undefined;
    cursor = cursor[part];
  }

  return cursor;
};

const interpolate = (message: string, params?: Record<string, string | number>): string => {
  if (!params) return message;

  return message.replace(/{{(.*?)}}/g, (placeholder, key: string) =>
    Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : placeholder,
  );
};

export const createLocalization = <
  const TAllMessages extends Record<string, LocalizationMessages>,
>(
    options: CreateLocalizationOptions<TAllMessages>,
  ): LocalizationInstance<TAllMessages> => {
  let currentLocale = options.locale;

  const resolve = (locale: LocaleOf<TAllMessages>, key: string): string | undefined => {
    const messageRoot = options.messages[locale];
    const value = getPathValue(messageRoot, key);
    return typeof value === 'string' ? value : undefined;
  };

  const t: LocalizationInstance<TAllMessages>['t'] = (key, params) => {
    const primary = resolve(currentLocale, key);
    if (primary !== undefined) return interpolate(primary, params);

    if (options.fallbackLocale) {
      const fallback = resolve(options.fallbackLocale, key);
      if (fallback !== undefined) return interpolate(fallback, params);
    }

    const finalKey = options.onMissingKey ? options.onMissingKey(key) : key;
    return interpolate(finalKey, params);
  };

  const has: LocalizationInstance<TAllMessages>['has'] = (key) =>
    resolve(currentLocale, key) !== undefined ||
    (options.fallbackLocale ? resolve(options.fallbackLocale, key) !== undefined : false);

  return {
    getLocale: () => currentLocale,
    setLocale: (next) => {
      currentLocale = next;
    },
    t,
    has,
  };
};
