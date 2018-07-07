import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Language extends Component {
  static contextTypes = {
    language: PropTypes.object,
  }

  state = {
    value: '',
  }

  componentDidMount() {
    const { language } = this.context
    this.setState({
      value: language.locale || language.detected,
    })
  }

  handleChange = event => {
    const { language } = this.context
    const { originalPath } = language
    const { value } = event.target

    if (value === this.state.value) {
      return
    }

    this.setState({ value }, () => {
      localStorage.setItem('language', value)
      window.location.href = `/${value}${originalPath}`
    })
  }

  render() {
    const { language } = this.context
    const { languages } = language
    const { value } = this.state

    if (!value) {
      return null
    }

    return (
      <select value={value} onChange={this.handleChange}>
        {languages.map(({ value, text }) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    )
  }
}

export default Language
