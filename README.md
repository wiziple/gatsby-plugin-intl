# gatsby-starter-default-intl

The default Gatsby starter with features of `multi-language url routes` and `browser language detection`.

## Demo

[http://gatsby-starter-default-intl.netlify.com](http://gatsby-starter-default-intl.netlify.com)

## Features

- Localization (Multilanguage) provided by [react-intl](https://github.com/yahoo/react-intl). 

- Support automatic redirection based on user's preferred language in browser provided by [browser-lang](https://github.com/wiziple/browser-lang).

- Support multi-language url routes within a single page component. That means you don't have to create separate pages such as `pages/en/index.js` or `pages/ko/index.js`.

- Based on [gatsby-starter-default](https://github.com/gatsbyjs/gatsby-starter-default) with least modification.

## Inspiration

Google recommends using different URLs for each language version of a page rather than using cookies or browser settings to adjust the content language on the page. [(read more)](https://support.google.com/webmasters/answer/182192?hl=en&ref_topic=2370587)

## Realworld Example

[https://picpick.app](https://picpick.app)

## Getting Started

Install this starter (assuming [Gatsby](https://github.com/gatsbyjs/gatsby/) is installed and updated) by running from your CLI:


```sh
gatsby new gatsby-starter-default-intl https://github.com/wiziple/gatsby-starter-default-intl
cd gatsby-starter-default-intl
npm install # or yarn
npm run develop # or gatsby develop
```

Or you can fork the project, make your changes there and merge new features when needed.

Alternatively:

```sh
git clone https://github.com/wiziple/gatsby-starter-default-intl gatsby-starter-default-intl # Clone the project
cd gatsby-starter-default-intl
rm -rf .git # So you can have your own changes stored in VCS.
npm install # or yarn
npm run develop # or gatsby develop
```

## How it works

You can easily add any language file by creating a new translation .js file and modifying `src/i18n/locales/index.js`

For example,

translation file | language
-- | --
src/i18n/locales/en.js | English
src/i18n/locales/ko.js | German
src/i18n/locales/de.js | Korean
src/i18n/locales/index.js | language list

Let's say you have two pages in your `pages` directory. The starter will create multi-language url routers for you.

file | English | Korean | German | Default*
-- | -- | -- | -- | -- 
src/pages/index.js | /**en** | /**ko** | /**de** | /
src/pages/page-2.js | /**en**/page-2 | /**ko**/page-2 | /**de**/page-2 | /page-2

_* `/` or `/page-2` will be redirected to the user's preferred language router. e.g) `/ko` or `/ko/page-2`_

## License

MIT &copy; [Daewoong Moon](https://github.com/wiziple)