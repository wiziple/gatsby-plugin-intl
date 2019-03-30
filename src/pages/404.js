import React from "react"
import { withIntl, FormattedMessage } from "gatsby-plugin-intl"

import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = ({ intl }) => (
  <Layout>
    <SEO title={`404: ${intl.formatMessage({ id: "title" })}`} />
    <h1>
      <FormattedMessage id="notfound" />
    </h1>
    <p>
      <FormattedMessage id="notfound_p" />
    </p>
  </Layout>
)

export default withIntl(NotFoundPage)
