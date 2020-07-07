export const getLanguage = languageOption => {
  return typeof languageOption === "object" ? languageOption.locale : languageOption
}

export const getRoutePrefix = languageOption => {
  return typeof languageOption === "object" ? languageOption.prefix : languageOption
}

export const getLanguages = languageOptions =>
  languageOptions.map(languageOption => getLanguage(languageOption))

export const getLanguageOption = (languageOptions, language) =>
  languageOptions.find(l => getLanguage(l) === language)
