import React from "react"
import PropTypes from "prop-types"
import { Link as GatsbyLink, navigate as gatsbyNavigate } from "gatsby"
import { IntlContextConsumer } from "./intl-context"
import { isMatch } from "./util"

const Link = ({ to, language, children, onClick, ...rest }) => (
  <IntlContextConsumer>
    {intl => {
      const languageLink = language || intl.language

      const isMatchedIgnoredPaths = isMatch(intl.ignoredPaths, to)

      const link =
        (intl.routed || language) && !isMatchedIgnoredPaths
          ? `/${languageLink}${to}`
          : `${to}`

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

  const { language, routed, ignoredPaths } = window.___gatsbyIntl
  const isMatchedIgnoredPaths = isMatch(ignoredPaths, to)

  const link = routed && !isMatchedIgnoredPaths ? `/${language}${to}` : `${to}`
  gatsbyNavigate(link, options)
}

export const changeLocale = (language, to) => {
  if (typeof window === "undefined") {
    return
  }
  const {
    routed,
    redirectDefaultLanguageToRoot,
    defaultLanguage,
    ignoredPaths,
  } = window.___gatsbyIntl

  const removePrefix = pathname => {
    const base =
      typeof __BASE_PATH__ !== `undefined` ? __BASE_PATH__ : __PATH_PREFIX__
    if (base && pathname.indexOf(base) === 0) {
      pathname = pathname.slice(base.length)
    }
    return pathname
  }

  const removeLocalePart = pathname => {
    if (!routed) {
      return pathname
    }
    const i = pathname.indexOf(`/`, 1)
    return pathname.substring(i)
  }

  const pathname =
    to || removeLocalePart(removePrefix(window.location.pathname))
  // TODO: check slash
  const isMatchedIgnoredPaths = isMatch(ignoredPaths, pathname)
  const languageLink =
    (redirectDefaultLanguageToRoot && defaultLanguage === language) ||
    isMatchedIgnoredPaths
      ? ""
      : language
  const link = `/${languageLink}${pathname}${window.location.search}`
  localStorage.setItem("gatsby-intl-language", language)
  gatsbyNavigate(link)
}
