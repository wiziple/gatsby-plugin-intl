import React from "react"
import { FormattedMessage } from "react-intl"

import { withIntl, Link } from "../i18n"

import Layout from "../components/layout"
import SEO from "../components/seo"

const SecondPage = ({ intl }) => (
  <Layout>
    <SEO title={intl.formatMessage({ id: "title_page2" })} />
    <h1>
      <FormattedMessage id="title_page2" />
    </h1>
    <p>
      <FormattedMessage id="welcome2" />
    </p>
    <Link to="/">
      <FormattedMessage id="goback" />
    </Link>
  </Layout>
)

export default withIntl(SecondPage)
