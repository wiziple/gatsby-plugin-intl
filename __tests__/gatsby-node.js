const fs = require(`fs`)
const webpack = require("webpack")

const {
  flattenMessages,
  onCreatePage,
  onCreateWebpackConfig,
} = require(`../src/gatsby-node`)
const {
  getLanguage,
  getRoutePrefix,
  getLanguages,
  getLanguageOption,
} = require("../src/route-prefix")

const actions = {
  createPage: jest.fn(),
  deletePage: jest.fn(),
}

const mocks = {
  actions,
  page: {
    path: "/",
    context: {},
  },
}

describe("getLanguage()", () => {
  describe("when language is a string", () => {
    it("returns a string", () => {
      const language = "en"
      const locale = getLanguage(language)

      expect(locale).toEqual("en")
    })
  })

  describe("when language is an object", () => {
    it("returns a string", () => {
      const language = {
        locale: "en",
        prefix: "english",
      }
      const locale = getLanguage(language)

      expect(locale).toEqual("en")
    })
  })
})

describe("getRoutePrefix()", () => {
  describe("when language is a string", () => {
    it("returns a string", () => {
      const language = "en"
      const prefix = getRoutePrefix(language)

      expect(prefix).toEqual("en")
    })
  })

  describe("when language is an object", () => {
    it("returns a string", () => {
      const language = {
        locale: "en",
        prefix: "english",
      }
      const prefix = getRoutePrefix(language)

      expect(prefix).toEqual("english")
    })
  })
})

describe("getLanguages()", () => {
  describe("when languages are a mix of strings and objects", () => {
    it("returns an array of locale names", () => {
      const languageOptions = ["en", { locale: "es", prefix: "spanish" }]
      const locales = getLanguages(languageOptions)

      expect(locales).toEqual(["en", "es"])
    })
  })
})

describe("getLanguageOption()", () => {
  describe("when language is a string", () => {
    it("returns a string", () => {
      const languageOptions = ["en", { locale: "es", prefix: "spanish" }]
      const language = getLanguageOption(languageOptions, "es")

      expect(language).toEqual({ locale: "es", prefix: "spanish" })
    })
  })
})

describe("onCreatePage()", () => {
  describe("when no pluginConfig is provided", () => {
    it(`should not crash`, async () => {
      const pluginOptions = {}

      await onCreatePage(mocks, pluginOptions)
    })
  })

  describe("if page has already been processed", () => {
    it(`should exit`, async () => {
      const value = await onCreatePage({
        page: { context: { intl: {} } },
      })

      expect(value).toEqual(undefined)
      expect(actions.createPage.mock.calls.length).toBe(0)
    })
  })

  describe("when path is /404/", () => {
    it(`creates 404 page with a matchPath to catch all pages`, async () => {
      const notFoundMocks = {
        actions,
        page: {
          path: "/404/",
          context: {},
        },
      }

      const pluginOptions = {
        languages: [`es`],
        defaultLanguage: `es`,
        path: `${__dirname}/fixtures/intl`,
      }

      await onCreatePage(notFoundMocks, pluginOptions)

      expect(actions.createPage.mock.calls.length).toBe(2)

      expect(actions.createPage.mock.calls[0][0].matchPath).toBe(undefined)
      expect(actions.createPage.mock.calls[1][0].matchPath).toBe(`/es/*`)
    })
  })

  describe("when creating pages", () => {
    it(`should read translations from file and create corresponding pages`, async () => {
      const pluginOptions = {
        languages: [`es`],
        defaultLanguage: `es`,
        path: `${__dirname}/fixtures/intl`,
      }

      await onCreatePage(mocks, pluginOptions)

      expect(actions.createPage.mock.calls.length).toBe(2)

      // assert the pages created match the requested languages
      expect(actions.createPage.mock.calls[0][0].path).toBe(`/`)
      expect(actions.createPage.mock.calls[1][0].path).toBe(`/es/`)
    })

    it(`should create pages with correct context`, async () => {
      const pluginOptions = {
        languages: [`es`],
        defaultLanguage: `es`,
        path: `${__dirname}/fixtures/intl`,
      }

      await onCreatePage(mocks, pluginOptions)

      expect(actions.createPage.mock.calls[0][0].context).toMatchObject({
        language: "es",
        intl: {
          language: "es",
          languages: ["es"],
          messages: {},
          routed: false,
          originalPath: "/",
          redirect: false,
          defaultLanguage: "es",
        },
      })
      expect(actions.createPage.mock.calls[1][0].context).toMatchObject({
        language: "es",
        intl: {
          language: "es",
          languages: ["es"],
          messages: {},
          routed: true,
          originalPath: "/",
          redirect: false,
          defaultLanguage: "es",
        },
      })
    })

    it(`should accept a custom prefix for the URL`, async () => {
      const pluginOptions = {
        languages: [{ locale: "es", prefix: "spanish" }],
        defaultLanguage: `es`,
        path: `${__dirname}/fixtures/intl`,
      }

      await onCreatePage(mocks, pluginOptions)

      expect(actions.createPage.mock.calls.length).toBe(2)

      // assert the pages created match the requested languages
      expect(actions.createPage.mock.calls[0][0].path).toBe(`/`)
      expect(actions.createPage.mock.calls[1][0].path).toBe(`/spanish/`)
    })

    it(`should create pages with correct context when a custom prefix is used`, async () => {
      const pluginOptions = {
        languages: [{ locale: "es", prefix: "spanish" }],
        defaultLanguage: `es`,
        path: `${__dirname}/fixtures/intl`,
      }

      await onCreatePage(mocks, pluginOptions)

      expect(actions.createPage.mock.calls[0][0].context).toMatchObject({
        language: "es",
        prefix: "",
        intl: {
          language: "es",
          languages: ["es"],
          languageOptions: [{ locale: "es", prefix: "spanish" }],
          messages: {},
          routed: false,
          originalPath: "/",
          redirect: false,
          defaultLanguage: "es",
        },
      })
      expect(actions.createPage.mock.calls[1][0].context).toMatchObject({
        language: "es",
        prefix: "spanish",
        intl: {
          language: "es",
          languages: ["es"],
          languageOptions: [{ locale: "es", prefix: "spanish" }],
          messages: {},
          routed: true,
          originalPath: "/",
          redirect: false,
          defaultLanguage: "es",
        },
      })
    })
  })

  describe("when translations file doesn't exist", () => {
    it(`should crash `, async () => {
      const pluginOptions = {
        languages: [`es`, `en`],
        defaultLanguage: `es`,
        path: `${__dirname}/fixtures/intl`,
      }

      await expect(onCreatePage(mocks, pluginOptions)).rejects.toThrow(
        `Cannot find module`
      )
    })
  })

  beforeAll(() => {
    // Create file src/en.json because the default option for reading a file is `./en.json`
    fs.writeFileSync(
      `${__dirname}/../src/en.json`,
      JSON.stringify({ english: `English version` })
    )
  })

  afterAll(() => {
    fs.unlinkSync(`${__dirname}/../src/en.json`)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })
})

describe("flattenMessages()", () => {
  describe("when called without a a prefix", () => {
    describe("when messages are already flattened", () => {
      it(`should return input unchanged`, async () => {
        const messages = {
          spanish: "Spanish version",
          english: "English version",
        }

        const flattened = flattenMessages(messages)

        expect(flattened).toEqual(messages)
      })
    })
    describe("when messages are not flattened", () => {
      it(`should flatten messages by prepending key`, async () => {
        const messages = {
          spanish: "Spanish version",
          english: {
            version: "English version",
          },
        }

        const flattened = flattenMessages(messages)

        expect(flattened).toEqual({
          spanish: "Spanish version",
          "english.version": "English version",
        })
      })
    })
  })
  describe("when called with a prefix", () => {
    it(`should prepend message keys with the prefix`, async () => {
      const messages = {
        spanish: "Spanish version",
        english: "English version",
      }
      const prefix = "language"

      const flattened = flattenMessages(messages, prefix)

      expect(flattened).toEqual({
        "language.spanish": "Spanish version",
        "language.english": "English version",
      })
    })
  })
})

describe("onCreateWebpackConfig", () => {
  const originalContextReplacementPlugin = webpack.ContextReplacementPlugin

  const gatsbyOptions = {
    actions: {
      setWebpackConfig: jest.fn(),
    },
    plugins: {
      define: jest.fn().mockReturnValue("define"),
    },
  }

  it(`should call setWebpackConfig with correct arguments`, async () => {
    const pluginOptions = {
      redirectComponent: "a redirect component",
      languages: ["es"],
      defaultLanguage: "es",
    }

    onCreateWebpackConfig(gatsbyOptions, pluginOptions)

    expect(gatsbyOptions.actions.setWebpackConfig).toHaveBeenCalledTimes(1)
    expect(gatsbyOptions.actions.setWebpackConfig).toHaveBeenCalledWith({
      plugins: ["define", {}, {}],
    })

    expect(gatsbyOptions.plugins.define).toHaveBeenCalledTimes(1)
    expect(gatsbyOptions.plugins.define).toHaveBeenCalledWith({
      GATSBY_INTL_REDIRECT_COMPONENT_PATH: '"a redirect component"',
    })

    expect(webpack.ContextReplacementPlugin).toHaveBeenCalledTimes(2)
    expect(webpack.ContextReplacementPlugin).toHaveBeenNthCalledWith(
      1,
      /@formatjs[/\\]intl-relativetimeformat[/\\]dist[/\\]locale-data$/,
      /es/
    )
    expect(webpack.ContextReplacementPlugin).toHaveBeenNthCalledWith(
      2,
      /@formatjs[/\\]intl-pluralrules[/\\]dist[/\\]locale-data$/,
      /es/
    )
  })

  it(`should create regex with all languages`, async () => {
    const pluginOptions = {
      redirectComponent: "a redirect component",
      languages: ["es", "en"],
      defaultLanguage: "es",
    }

    onCreateWebpackConfig(gatsbyOptions, pluginOptions)

    expect(webpack.ContextReplacementPlugin).toHaveBeenCalledTimes(2)
    expect(webpack.ContextReplacementPlugin).toHaveBeenNthCalledWith(
      1,
      /@formatjs[/\\]intl-relativetimeformat[/\\]dist[/\\]locale-data$/,
      /es|en/
    )
    expect(webpack.ContextReplacementPlugin).toHaveBeenNthCalledWith(
      2,
      /@formatjs[/\\]intl-pluralrules[/\\]dist[/\\]locale-data$/,
      /es|en/
    )
  })

  it(`should add default language to regex`, async () => {
    const pluginOptions = {
      redirectComponent: "a redirect component",
      languages: ["en"],
      defaultLanguage: "es",
    }

    onCreateWebpackConfig(gatsbyOptions, pluginOptions)

    expect(webpack.ContextReplacementPlugin).toHaveBeenCalledTimes(2)
    expect(webpack.ContextReplacementPlugin).toHaveBeenNthCalledWith(
      1,
      /@formatjs[/\\]intl-relativetimeformat[/\\]dist[/\\]locale-data$/,
      /en|es/
    )
    expect(webpack.ContextReplacementPlugin).toHaveBeenNthCalledWith(
      2,
      /@formatjs[/\\]intl-pluralrules[/\\]dist[/\\]locale-data$/,
      /en|es/
    )
  })

  it(`should create regex with locale when language option with prefix is used`, async () => {
    const pluginOptions = {
      languages: [
        {
          locale: "es",
          prefix: "spanish",
        },
        "en",
      ],
      defaultLanguage: "es",
    }

    onCreateWebpackConfig(gatsbyOptions, pluginOptions)

    expect(webpack.ContextReplacementPlugin).toHaveBeenCalledTimes(2)
    expect(webpack.ContextReplacementPlugin).toHaveBeenNthCalledWith(
      1,
      /@formatjs[/\\]intl-relativetimeformat[/\\]dist[/\\]locale-data$/,
      /es|en/
    )
    expect(webpack.ContextReplacementPlugin).toHaveBeenNthCalledWith(
      2,
      /@formatjs[/\\]intl-pluralrules[/\\]dist[/\\]locale-data$/,
      /es|en/
    )
  })

  beforeAll(() => {
    webpack.ContextReplacementPlugin = jest.fn()
  })

  afterAll(() => {
    webpack.ContextReplacementPlugin = originalContextReplacementPlugin
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })
})
