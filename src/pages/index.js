import React from 'react'
import Layout from '../components/layout'
import { FormattedMessage } from 'react-intl'
import { withIntl, Link } from '../i18n'

const IndexPage = () => (
  <Layout>
    <h1>
      <FormattedMessage id="hello" />
    </h1>
    <p>
      <FormattedMessage id="welcome" />
    </p>
    <p>
      <FormattedMessage id="build" />
    </p>
    <Link to="/page-2/">
      <FormattedMessage id="gopage2" />
    </Link>
  </Layout>
)

export default withIntl(IndexPage)
