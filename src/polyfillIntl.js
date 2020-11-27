export const polyfillIntl = language => {
  const locale = language.split("-")[0]
  try {
    if (!Intl.PluralRules) {
      require("@formatjs/intl-pluralrules/polyfill")
      require(`@formatjs/intl-pluralrules/dist/locale-data/${locale}`)
    }

    if (!Intl.RelativeTimeFormat) {
      require("@formatjs/intl-relativetimeformat/polyfill")
      require(`@formatjs/intl-relativetimeformat/dist/locale-data/${locale}`)
    }
  } catch (e) {
    throw new Error(`Cannot find react-intl/locale-data/${language}`)
  }
}
