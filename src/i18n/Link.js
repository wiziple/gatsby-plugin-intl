import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'

const I18nLink = ({ to, children, ...rest }, { language }) => {
  const { locale } = language
  const toWithLang = locale ? `/${language.locale}${to}` : `${to}`
  return (
    <Link to={toWithLang} {...rest}>
      {children}
    </Link>
  )
}

I18nLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

I18nLink.contextTypes = {
  language: PropTypes.object,
}

export default I18nLink
