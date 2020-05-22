import React from "react"
import browserLang from "browser-lang"
import { navigate } from "gatsby"
import { IntlProvider } from "react-intl"
import { IntlContextProvider } from "./intl-context"

const preferDefault = m => (m && m.default) || m

const replaceParams = (path, props) => {
  const regex = /\:(\w+)/g

  let newPath = path
  let match
  while ((match = regex.exec(path)) !== null) {
    newPath = newPath.replace(
      new RegExp(match[0], "g"),
      props[match[1]] || match[0]
    )
  }
  return newPath
}

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

      const queryParams = search || ""
      const pathWithParams = replaceParams(originalPath, props)

      const newUrl = `/${detected}${pathWithParams}${queryParams}`
      window.localStorage.setItem("gatsby-intl-language", detected)
      navigate(newUrl, {
        replace: true,
      })
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
