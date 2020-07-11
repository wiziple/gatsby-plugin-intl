import React from "react"
import browserLang from "browser-lang"
import { withPrefix } from "gatsby"
import { IntlProvider } from "react-intl"
import { IntlContextProvider } from "./intl-context"
const { getRoutePrefix, getLanguageOption } = require("./route-prefix")

export const preferDefault = m => (m && m.default) || m

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

export const withIntlProvider = intl => children => {
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
  const { languages: languageOptions } = pluginOptions
  const { intl } = pageContext
  const { language, languages, redirect, routed, originalPath } = intl

  if (typeof window !== "undefined") {
    window.___gatsbyIntl = intl
  }
  /* eslint-disable no-undef */
  const isRedirect = redirect && !routed

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

      const prefix = getRoutePrefix(
        getLanguageOption(languageOptions, detected)
      )

      const queryParams = search || ""
      const newUrl = withPrefix(`/${prefix}${originalPath}${queryParams}`)
      window.localStorage.setItem("gatsby-intl-language", detected)
      window.location.replace(newUrl)
    }
  }
  const renderElement = isRedirect
    ? GATSBY_INTL_REDIRECT_COMPONENT_PATH &&
      React.createElement(
        preferDefault(require(GATSBY_INTL_REDIRECT_COMPONENT_PATH))
      )
    : element
  return withIntlProvider(intl)(renderElement)
}
