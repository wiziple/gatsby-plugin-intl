export const getLocale = language => {
  return typeof language === "object" ? language.locale : language
}

export const getRoutePrefix = language => {
  return typeof language === "object" ? language.prefix : language
}

export const getLocales = languages =>
  languages.map(language => getLocale(language))

export const getLanguage = (languages, language) =>
  languages.find(l => getLocale(l) === language)
