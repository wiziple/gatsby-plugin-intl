import React from "react"
import PropTypes from "prop-types"
import { Link as GatsbyLink, navigate as gatsbyNavigate } from "gatsby"
import { IntlContextConsumer } from "./intl-context"

const getLink = (language, to, routed, messages) => {
  const currentPage = to.replace(/\//g, "")
  const slugTo = messages[`${currentPage}.slug`] ? messages[`${currentPage}.slug`] : to
  const link = routed || language ? `/${language}/${slugTo}` : `${slugTo}`

  return link;
}

const Link = ({ to, language, children, onClick, ...rest }) => (
  <IntlContextConsumer>
    {intl => {
      const languageLink = language || intl.language
      const link = getLink(languageLink, to, intl.routed, intl.messages)

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
    }}
  </IntlContextConsumer>
)

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
  if (typeof window === "undefined") {
    return
  }

  const { language, routed, messages } = window.___gatsbyIntl
  const link = getLink(language, to, routed, messages)
  gatsbyNavigate(link, options)
}

export const changeLocale = (language, to) => {
  if (typeof window === "undefined") {
    return
  }
  const { slugs } = window.___gatsbyIntl

  // TODO: check slash
  const link = `/${language}${slugs[language]}${window.location.search}`
  localStorage.setItem("gatsby-intl-language", language)
  gatsbyNavigate(link)
}
