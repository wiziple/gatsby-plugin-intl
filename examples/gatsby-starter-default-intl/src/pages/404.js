import React from "react"
import { FormattedMessage, injectIntl } from "gatsby-plugin-intl"

import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = ({ intl }) => (
  <Layout>
    <SEO
      lang={intl.locale}
      title={`404: ${intl.formatMessage({ id: "title" })}`}
    />
    <h1>
      <FormattedMessage id="notfound.header" />
    </h1>
    <p>
      <FormattedMessage id="notfound.description" />
    </p>
  </Layout>
)

export default injectIntl(NotFoundPage)
