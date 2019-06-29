# gatsby-plugin-intl

Internationalize your Gatsby site.

## Features

- Turn your gatsby site into an internationalization-framework out of the box powered by [react-intl](https://github.com/yahoo/react-intl). 

- Support automatic redirection based on the user's preferred language in browser provided by [browser-lang](https://github.com/wiziple/browser-lang).

- Support multi-language url routes in a single page component. This means you don't have to create separate pages such as `pages/en/index.js` or `pages/ko/index.js`.

## Why?

When you build multilingual sites, Google recommends using different URLs for each language version of a page rather than using cookies or browser settings to adjust the content language on the page. [(read more)](https://support.google.com/webmasters/answer/182192?hl=en&ref_topic=2370587)

## Starters

Demo: [http://gatsby-starter-default-intl.netlify.com](http://gatsby-starter-default-intl.netlify.com)

Source: [https://github.com/wiziple/gatsby-plugin-intl/tree/master/examples/gatsby-starter-default-intl](https://github.com/wiziple/gatsby-plugin-intl/tree/master/examples/gatsby-starter-default-intl)


## Showcase

- [https://picpick.app](https://picpick.app)
- [https://www.krashna.nl](https://www.krashna.nl) [(Source)](https://github.com/krashnamusika/krashna-site)

*Feel free to send us PR to add your project.*

## How to use

### Install package

`npm install --save gatsby-plugin-intl`

### Add a plugin to your gatsby-config.js

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-plugin-intl`,
    options: {
      // language JSON resource path
      path: `${__dirname}/src/intl`,
      // supported language
      languages: [`en`, `ko`, `de`],
      // language file path
      defaultLanguage: `ko`,
      // option to redirect to `/ko` when connecting `/`
      redirect: true,
    },
  },
]
```

### You'll also need to add language JSON resources to the project.

For example,

| language resource file | language |
| --- | --- |
| [src/intl/en.json](https://github.com/wiziple/gatsby-plugin-intl/blob/master/examples/gatsby-starter-default-intl/src/intl/en.json) | English |
| [src/intl/ko.json](https://github.com/wiziple/gatsby-plugin-intl/blob/master/examples/gatsby-starter-default-intl/src/intl/ko.json) | Korean |
| [src/intl/de.json](https://github.com/wiziple/gatsby-plugin-intl/blob/master/examples/gatsby-starter-default-intl/src/intl/de.json) | German |


### Change your components

You can use `injectIntl` HOC on any react components including page components.

```jsx
import React from "react"
import { injectIntl, Link, FormattedMessage } from "gatsby-plugin-intl"

const IndexPage = ({ intl }) => {
  return (
    <Layout>
      <SEO
        title={intl.formatMessage({ id: "title" })}
      />
      <Link to="/page-2/">
        {intl.formatMessage({ id: "go_page2" })}
        {/* OR <FormattedMessage id="go_page2" /> */}
      </Link>
    </Layout>
  )
}
export default injectIntl(IndexPage)
```

## How It Works

Let's say you have two pages (`index.js` and `page-2.js`) in your `pages` directory. The plugin will create static pages for every language.

file | English | Korean | German | Default*
-- | -- | -- | -- | -- 
src/pages/index.js | /**en** | /**ko** | /**de** | /
src/pages/page-2.js | /**en**/page-2 | /**ko**/page-2 | /**de**/page-2 | /page-2

**Default Pages and Redirection**

If redirect option is `true`, `/` or `/page-2` will be redirected to the user's preferred language router. e.g) `/ko` or `/ko/page-2`. Otherwise, the pages will render `defaultLangugage` language. You can also specify additional component to be rendered on redirection page by adding `redirectComponent` option.


## Plugin Options

Option | Type | Description
-- | -- | --
path | string | language JSON resource path
languages | string[] | supported language keys
defaultLanguage | string | default language when visiting `/page` instead of `ko/page`
redirect | boolean | if the value is `true`, `/` or `/page-2` will be redirected to the user's preferred language router. e.g) `/ko` or `/ko/page-2`. Otherwise, the pages will render `defaultLangugage` language.
redirectComponent | string (optional) | additional component file path to be rendered on with a redirection component for SEO.


## Components

To make it easy to handle i18n with multi-language url routes, the plugin provides several components.

To use it, simply import it from `gatsby-plugin-intl`.

Component | Type | Description
-- | -- | --
Link | component | This is a wrapper around @gatsby’s Link component that adds useful enhancements for multi-language routes. All props are passed through to @gatsby’s Link component.
navigate | function | This is a wrapper around @gatsby’s navigate function that adds useful enhancements for multi-language routes. All options are passed through to @gatsby’s navigate function.
changeLocale | function | A function that replaces your locale. `changeLocale(locale, to = null)`
IntlContextConsumer | component | A context component to get plugin configuration on the component level.
injectIntl | component | https://github.com/yahoo/react-intl/wiki/API#injection-api
FormattedMessage | component | https://github.com/yahoo/react-intl/wiki/Components#string-formatting-components
and more... | | https://github.com/yahoo/react-intl/wiki/Components


## License

MIT &copy; [Daewoong Moon](https://github.com/wiziple)
