const webpack = require("webpack")
const {
  getLocale,
  getRoutePrefix,
  getLocaleList,
  getLanguageOption,
} = require("./route-prefix")
const { flattenMessages } = require("./flattenMessages")

exports.onCreateWebpackConfig = ({ actions, plugins }, pluginOptions) => {
  const {
    redirectComponent = null,
    languages: languageOptions,
    defaultLanguage,
  } = pluginOptions
  const languages = getLocaleList(languageOptions)
  if (!languages.includes(defaultLanguage)) {
    languages.push(defaultLanguage)
  }
  const regex = new RegExp(languages.map(l => l.split("-")[0]).join("|"))
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
    languages: languageOptions = ["en"],
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

  const generatePage = (routed, languageOption) => {
    const language = getLocale(languageOption)
    const routePrefix = getRoutePrefix(languageOption)
    const messages = getMessages(path, language)
    const newPath = routed ? `/${routePrefix}${page.path}` : page.path
    const languages = getLocaleList(languageOptions)
    return {
      ...page,
      path: newPath,
      context: {
        ...page.context,
        language: language,
        prefix: routed ? routePrefix : "",
        intl: {
          language,
          languages,
          languageOptions,
          messages,
          routed,
          originalPath: page.path,
          redirect,
          defaultLanguage: getLocale(defaultLanguage),
        },
      },
    }
  }

  const newPage = generatePage(
    false,
    getLanguageOption(languageOptions, defaultLanguage)
  )
  deletePage(page)
  createPage(newPage)

  languageOptions.forEach(language => {
    const localePage = generatePage(true, language)
    const regexp = new RegExp("/404/?$")
    const routePrefix = getRoutePrefix(language)
    if (regexp.test(localePage.path)) {
      localePage.matchPath = `/${routePrefix}/*`
    }
    createPage(localePage)
  })
}
