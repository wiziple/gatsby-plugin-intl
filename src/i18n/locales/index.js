/* eslint-disable global-require */

const localeData = [
  ...require('react-intl/locale-data/en'),
  ...require('react-intl/locale-data/de'),
  ...require('react-intl/locale-data/ko'),
]

module.exports = {
  localeData,
  languages: [
    { value: 'en', text: 'English' },
    { value: 'ko', text: '한국어' },
    { value: 'de', text: 'Deutsch' },
  ],
}
