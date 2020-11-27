export const getLocale = languageOption => {
  return typeof languageOption === "object"
    ? languageOption.locale
    : languageOption
}

export const getRoutePrefix = languageOption => {
  return typeof languageOption === "object"
    ? languageOption.prefix
    : languageOption
}

export const getLocaleList = languageOptions =>
  languageOptions.map(languageOption => getLocale(languageOption))

export const getLanguageOption = (languageOptions, locale) =>
  languageOptions.find(languageOption => getLocale(languageOption) === locale)
