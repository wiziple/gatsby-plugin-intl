import React from "react"
import browserLang from "browser-lang"
import { withPrefix } from "gatsby"
import { IntlProvider, injectIntl, addLocaleData } from "react-intl"
import { IntlContextProvider } from "./intl-context"

const preferDefault = m => (m && m.default) || m

const getLocaleData = locale => {
  try {
    const localeData = require(`react-intl/locale-data/${locale}`)

    return localeData
  } catch (e) {
    return false
  }
}

const addLocaleDataForGatsby = language => {
  let localeData = null
  localeData = getLocaleData(language)

  if (!localeData && language.length > 2) {
    const locale = language.substring(0, 2)
    localeData = getLocaleData(locale)
  }

  if (!localeData) {
    throw new Error(`Cannot find react-intl/locale-data/${language}`)
  }

  addLocaleData(...localeData)
}

export default WrappedComponent => {
  return props => {
    const { intl } = props.pageContext
    const { language, languages, messages, redirect, routed } = intl

    /* eslint-disable no-undef */
    const isRedirect = redirect && !routed

    if (isRedirect) {
      const { pathname } = props.location

      // Skip build, Browsers only
      if (typeof window !== "undefined") {
        const detected =
          window.localStorage.getItem("gatsby-intl-language") ||
          browserLang({
            languages,
            fallback: language,
          })

        const newUrl = withPrefix(`/${detected}${pathname}`)
        window.localStorage.setItem("gatsby-intl-language", detected)
        window.location.replace(newUrl)
      }
    }

    if (typeof window !== "undefined") {
      window.___gatsbyIntl = intl
    }

    addLocaleDataForGatsby(language)
    return (
      <IntlProvider locale={language} messages={messages}>
        <IntlContextProvider value={intl}>
          {isRedirect
            ? GATSBY_INTL_REDIRECT_COMPONENT_PATH &&
              React.createElement(
                preferDefault(require(GATSBY_INTL_REDIRECT_COMPONENT_PATH))
              )
            : React.createElement(injectIntl(WrappedComponent), props)}
        </IntlContextProvider>
      </IntlProvider>
    )
  }
}
