import React from "react"
import browserLang from "browser-lang"
import { withPrefix } from "gatsby"
import { IntlProvider, injectIntl, addLocaleData } from "react-intl"
import { IntlContextProvider } from "./intl-context"

export default WrappedComponent => {
  return props => {
    const { intl } = props.pageContext
    const { language, languages, messages, redirect, routed } = intl

    if (redirect && !routed) {
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
      return <div />
    }

    addLocaleData(...require(`react-intl/locale-data/${language}`))
    const IntlComponent = injectIntl(WrappedComponent)
    return (
      <IntlProvider locale={language} messages={messages}>
        <IntlContextProvider value={intl}>
          <IntlComponent {...props} />
        </IntlContextProvider>
      </IntlProvider>
    )
  }
}
