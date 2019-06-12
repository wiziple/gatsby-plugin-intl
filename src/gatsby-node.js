const webpack = require("webpack")

exports.onCreateWebpackConfig = ({ actions, plugins }, pluginOptions) => {
  const { redirectComponent = null, languages } = pluginOptions
  const regex = new RegExp(languages.map(l => l.split("-")[0]).join("|"))
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        GATSBY_INTL_REDIRECT_COMPONENT_PATH: JSON.stringify(redirectComponent),
      }),
      new webpack.ContextReplacementPlugin(
        /react-intl[/\\]locale-data$/,
        regex
      ),
    ],
  })
}

exports.onCreatePage = async ({ page, actions }, pluginOptions) => {
  const { createPage, deletePage } = actions
  const {
    path = ".",
    languages = ["en"],
    defaultLanguage = "en",
    redirect = false,
  } = pluginOptions

  const generatePage = (routed, language) => {
    return {
      ...page,
      path: routed ? `/${language}${page.path}` : page.path,
      context: {
        ...page.context,
        intl: {
          language,
          languages,
          messages: require(`${path}/${language}.json`),
          routed,
          originalPath: page.path,
          redirect,
        },
      },
    }
  }

  const newPage = generatePage(false, defaultLanguage)
  deletePage(page)
  createPage(newPage)

  languages.forEach(language => {
    const localePage = generatePage(true, language)
    if (localePage.path.includes(`/404/`)) {
      localePage.matchPath = `/${language}/*`
    }
    createPage(localePage)
  })
}
