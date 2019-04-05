import React from "react"
import { injectIntl } from "gatsby-plugin-intl"
import SEO from "../components/seo"

const Redirect = ({ intl }) => {
  return <SEO title={`404: ${intl.formatMessage({ id: "title" })}`} />
}

export default injectIntl(Redirect)
