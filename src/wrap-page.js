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

export default ({ element, props }) => {
  if (!props) {
    return
  }

  const { intl } = props.pageContext
  const { language, languages, messages, redirect, routed } = intl

  /* eslint-disable no-undef */
  const isRedirect = redirect && !routed

  if (isRedirect) {
    const { pathname } = props.location

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

      const queryParams = props.location.search || ""
      const newUrl = withPrefix(`/${detected}${pathname}${queryParams}`)
      window.localStorage.setItem("gatsby-intl-language", detected)
      window.location.replace(newUrl)
    }
  }

  if (typeof window !== "undefined") {
    window.___gatsbyIntl = intl
  }

  addLocaleDataForGatsby(language)
  return (
    <IntlProvider locale={language} messages={flattenMessages(messages)}>
      <IntlContextProvider value={intl}>
        {isRedirect
          ? GATSBY_INTL_REDIRECT_COMPONENT_PATH &&
            React.createElement(
              preferDefault(require(GATSBY_INTL_REDIRECT_COMPONENT_PATH))
            )
          : element}
      </IntlContextProvider>
    </IntlProvider>
  )
}
