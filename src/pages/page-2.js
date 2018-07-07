import React from 'react'
import { FormattedMessage } from 'react-intl'
import { withIntl, Link } from '../i18n'
import Layout from '../components/layout'

const SecondPage = () => (
  <Layout>
    <h1>
      <FormattedMessage id="hello" />
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
