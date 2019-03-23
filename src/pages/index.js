import React from "react"
import { FormattedMessage } from "react-intl"
import { withIntl, Link } from "../i18n"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = ({ intl }) => (
  <Layout>
    <SEO
      title={intl.formatMessage({ id: "title" })}
      keywords={[`gatsby`, `application`, `react`]}
    />
    <h1>
      <FormattedMessage id="hello" />
    </h1>
    <p>
      <FormattedMessage id="welcome" />
    </p>
    <p>
      <FormattedMessage id="build" />
    </p>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <Link to="/page-2/">
      <FormattedMessage id="gopage2" />
    </Link>
  </Layout>
)

export default withIntl(IndexPage)
