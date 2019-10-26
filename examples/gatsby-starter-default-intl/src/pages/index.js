import React from "react"
import { FormattedMessage, Link, useIntl } from "gatsby-plugin-intl"
import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => {
  const intl = useIntl()
  return (
    <Layout>
      <SEO
        lang={intl.locale}
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
        <FormattedMessage id="go_page2" />
      </Link>
    </Layout>
  )
}

export default IndexPage
