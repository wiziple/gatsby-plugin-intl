const webpack = require("webpack")
const {
  getLanguage,
  getRoutePrefix,
  getLanguages,
  getLanguageOption,
} = require("./route-prefix")

function flattenMessages(nestedMessages, prefix = "") {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    let value = nestedMessages[key]
    let prefixedKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === "string") {
      messages[prefixedKey] = value
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey))
    }

    return messages
  }, {})
}

exports.onCreateWebpackConfig = ({ actions, plugins }, pluginOptions) => {
  const { redirectComponent = null, languages, defaultLanguage } = pluginOptions
  const locales = getLanguages(languages)
  if (!locales.includes(defaultLanguage)) {
    locales.push(defaultLanguage)
  }
  const regex = new RegExp(locales.map(l => l.split("-")[0]).join("|"))
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        GATSBY_INTL_REDIRECT_COMPONENT_PATH: JSON.stringify(redirectComponent),
      }),
      new webpack.ContextReplacementPlugin(
        /@formatjs[/\\]intl-relativetimeformat[/\\]dist[/\\]locale-data$/,
        regex
      ),
      new webpack.ContextReplacementPlugin(
        /@formatjs[/\\]intl-pluralrules[/\\]dist[/\\]locale-data$/,
        regex
      ),
    ],
  })
}

exports.onCreatePage = async ({ page, actions }, pluginOptions) => {
  //Exit if the page has already been processed.
  if (typeof page.context.intl === "object") {
    return
  }
  const { createPage, deletePage } = actions
  const {
    path = ".",
    languages = ["en"],
    defaultLanguage = "en",
    redirect = false,
  } = pluginOptions

  const getMessages = (path, language) => {
    try {
      // TODO load yaml here
      const messages = require(`${path}/${language}.json`)

      return flattenMessages(messages)
    } catch (error) {
      if (error.code === "MODULE_NOT_FOUND") {
        process.env.NODE_ENV !== "test" &&
          console.error(
            `[gatsby-plugin-intl] couldn't find file "${path}/${language}.json"`
          )
      }

      throw error
    }
  }

  const generatePage = (routed, language) => {
    const locale = getLanguage(language)
    const routePrefix = getRoutePrefix(language)
    const messages = getMessages(path, locale)
    const newPath = routed ? `/${routePrefix}${page.path}` : page.path
    const locales = getLanguages(languages)
    return {
      ...page,
      path: newPath,
      context: {
        ...page.context,
        language: locale,
        prefix: routed ? routePrefix : "",
        intl: {
          language: locale,
          languages: locales,
          languageOptions: languages,
          messages,
          routed,
          originalPath: page.path,
          redirect,
          defaultLanguage: getLanguage(defaultLanguage),
        },
      },
    }
  }

  const newPage = generatePage(false, getLanguageOption(languages, defaultLanguage))
  deletePage(page)
  createPage(newPage)

  languages.forEach(language => {
    const localePage = generatePage(true, language)
    const regexp = new RegExp("/404/?$")
    const routePrefix = getRoutePrefix(language)
    if (regexp.test(localePage.path)) {
      localePage.matchPath = `/${routePrefix}/*`
    }
    createPage(localePage)
  })
}
