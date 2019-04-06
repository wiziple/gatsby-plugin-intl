import React from "react"
import PropTypes from "prop-types"
import { Link as GatsbyLink, navigate as gatsbyNavigate } from "gatsby"

const Link = ({ to, language, children, onClick, ...rest }) => {
  const intl = window.___gatsbyIntl
  const languageLink = language || intl.language
  const link = intl.routed || language ? `/${languageLink}${to}` : `${to}`

  const handleClick = e => {
    if (language) {
      localStorage.setItem("gatsby-intl-language", language)
    }
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <GatsbyLink {...rest} to={link} onClick={handleClick}>
      {children}
    </GatsbyLink>
  )
}

Link.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string,
  language: PropTypes.string,
}

Link.defaultProps = {
  to: "",
}

export default Link

export const navigate = (to, options) => {
  const { language, routed } = window.___gatsbyIntl
  const link = routed ? `/${language}${to}` : `${to}`
  gatsbyNavigate(link, options)
}

export const changeLocale = (language, to) => {
  const removeLocalePart = pathname => {
    const { routed } = window.___gatsbyIntl
    if (!routed) {
      return pathname
    }
    const i = pathname.indexOf(`/`, 1)
    return pathname.substring(i)
  }

  const pathname = to || removeLocalePart(window.location.pathname)
  // TODO: check slash
  const link = `/${language}${pathname}${window.location.search}`
  localStorage.setItem("gatsby-intl-language", language)
  gatsbyNavigate(link)
}
