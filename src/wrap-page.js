import React from "react"
import browserLang from "browser-lang"
import { withPrefix } from "gatsby"
import { IntlProvider, addLocaleData } from "react-intl"
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
  const locale = language.split("-")[0]
  const localeData = getLocaleData(locale)

  if (!localeData) {
    throw new Error(`Cannot find react-intl/locale-data/${language}`)
  }

  addLocaleData(...localeData)
}

const pageIsIncludedInSite = (allSitePage, regexp) => {
  return allSitePage.some(page => {
    if (regexp.test(page)) {
      return true
    }
    return false
  })
}

const withIntlProvider = intl => children => {
  addLocaleDataForGatsby(intl.language)
  return (
    <IntlProvider locale={intl.language} messages={intl.messages}>
      <IntlContextProvider value={intl}>{children}</IntlContextProvider>
    </IntlProvider>
  )
}

export default ({ element, props }) => {
  if (!props) {
    return
  }

  const { pageContext, location } = props
  const { intl } = pageContext
  const { language, languages, redirect, routed, allSitePage } = intl

  if (typeof window !== "undefined") {
    window.___gatsbyIntl = intl
  }
  /* eslint-disable no-undef */
  const isRedirect = redirect && !routed

  if (isRedirect) {
    const { pathname, search } = location

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

      const queryParams = search || ""
      const newUrl = withPrefix(`/${detected}${pathname}${queryParams}`)
      window.localStorage.setItem("gatsby-intl-language", detected)

      // regex => /\/en\/signup\/?$/

      let urlWithoutTrailingSlash = newUrl
      let urlRegExp

      if (newUrl.endsWith("/")) {
        urlWithoutTrailingSlash = newUrl.substr(0, newUrl.length - 1)
      }

      urlWithoutTrailingSlash += "/?$"

      urlRegExp = new RegExp(urlWithoutTrailingSlash)

      if (pageIsIncludedInSite(allSitePage, urlRegExp)) {
        window.location.replace(newUrl)
      } else {
        // TODO: better 404 handler instead of redirect
        window.location.replace(withPrefix(`/${detected}/404`))
      }
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
