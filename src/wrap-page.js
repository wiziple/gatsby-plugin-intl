import React from "react"
import browserLang from "browser-lang"
import { navigate } from "gatsby"
import { IntlProvider } from "react-intl"
import { IntlContextProvider } from "./intl-context"
import { isMatch } from "./util"
const preferDefault = m => (m && m.default) || m

const polyfillIntl = language => {
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

const withIntlProvider = intl => children => {
  polyfillIntl(intl.language)
  return (
    <IntlProvider
      locale={intl.language}
      defaultLocale={intl.defaultLanguage}
      messages={intl.messages}
    >
      <IntlContextProvider value={intl}>{children}</IntlContextProvider>
    </IntlProvider>
  )
}

export default ({ element, props }, pluginOptions) => {
  if (!props) {
    return
  }

  const { pageContext, location } = props
  const { defaultLanguage } = pluginOptions
  const { intl } = pageContext
  const {
    language,
    languages,
    redirect,
    routed,
    originalPath,
    redirectDefaultLanguageToRoot,
    ignoredPaths,
  } = intl

  if (typeof window !== "undefined") {
    window.___gatsbyIntl = intl
  }
  /* eslint-disable no-undef */
  let isRedirect = redirect && !routed

  if (isRedirect) {
    const { search } = location

    // Skip build, Browsers only
    if (typeof window !== "undefined") {
      let detected =
        window.localStorage.getItem("gatsby-intl-language") ||
        browserLang({
          languages,
          fallback: language,
        })

      if (!languages.includes(detected)) {
        detected = language
      }
      const isMatchedIgnoredPaths = isMatch(
        ignoredPaths,
        window.location.pathname
      )
      isRedirect =
        !(redirectDefaultLanguageToRoot && detected === defaultLanguage) &&
        !isMatchedIgnoredPaths

      if (isRedirect) {
        const queryParams = search || ""
        const newUrl = `/${detected}${originalPath}${queryParams}`
        window.localStorage.setItem("gatsby-intl-language", detected)

        navigate(newUrl, {
          replace: true,
        })
        // browser should render redirect element
        const renderElement =
          GATSBY_INTL_REDIRECT_COMPONENT_PATH &&
          React.createElement(
            preferDefault(require(GATSBY_INTL_REDIRECT_COMPONENT_PATH))
          )
        return withIntlProvider(intl)(renderElement)
      }
    }
  }
  const renderElement =
    isRedirect && !redirectDefaultLanguageToRoot
      ? GATSBY_INTL_REDIRECT_COMPONENT_PATH &&
        React.createElement(
          preferDefault(require(GATSBY_INTL_REDIRECT_COMPONENT_PATH))
        )
      : element
  return withIntlProvider(intl)(renderElement)
}
