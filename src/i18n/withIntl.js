import React, { Component } from "react"
import PropTypes from "prop-types"
import { IntlProvider, addLocaleData, injectIntl } from "react-intl"
import { localeData } from "./locales"

addLocaleData(localeData)

export default ComposedComponent => {
  class withIntl extends Component {
    static childContextTypes = {
      language: PropTypes.object,
    }

    constructor(props) {
      super()
      const { pageContext } = props
      const { locale, languages, originalPath } = pageContext

      this.state = {
        language: {
          locale,
          languages,
          originalPath,
        },
      }
    }

    getChildContext() {
      const { language } = this.state
      return {
        language,
      }
    }

    render() {
      const { language } = this.state
      const locale = language.locale || "en"
      const messages = require(`./locales/${locale}.js`) // eslint-disable-line
      const IntlComponent = injectIntl(ComposedComponent)
      return (
        <IntlProvider locale={locale} messages={messages}>
          <IntlComponent {...this.props} />
        </IntlProvider>
      )
    }
  }
  return withIntl
}
