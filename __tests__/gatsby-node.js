const fs = require(`fs`)

const { onCreatePage } = require(`../src/gatsby-node`)
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

describe("getLanguage", () => {
  it("returns a string when language is a string", () => {
    const language = "en"
    const locale = getLanguage(language)

    expect(locale).toEqual("en")
  })
  it("returns a string when language is an object", () => {
    const language = {
      locale: "en",
      prefix: "english",
    }
    const locale = getLanguage(language)

    expect(locale).toEqual("en")
  })
})

describe("getRoutePrefix", () => {
  it("returns a string when language is a string", () => {
    const language = "en"
    const prefix = getRoutePrefix(language)

    expect(prefix).toEqual("en")
  })
  it("returns a string when language is an object", () => {
    const language = {
      locale: "en",
      prefix: "english",
    }
    const prefix = getRoutePrefix(language)

    expect(prefix).toEqual("english")
  })
})

describe("getLanguages", () => {
  it("returns array of locale names", () => {
    const languageOptions = ["en", { locale: "es", prefix: "spanish" }]
    const locales = getLanguages(languageOptions)

    expect(locales).toEqual(["en", "es"])
  })
})

describe("getLanguageOption", () => {
  it("returns a string when language is a string", () => {
    const languageOptions = ["en", { locale: "es", prefix: "spanish" }]
    const language = getLanguageOption(languageOptions, "es")

    expect(language).toEqual({ locale: "es", prefix: "spanish" })
  })
})

describe("onCreatePage", () => {
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

  it(`should not crash when no pluginConfig is provided`, async () => {
    const pluginOptions = {}

    await onCreatePage(mocks, pluginOptions)
  })

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

  it(`should crash when translations file doesn't exist`, async () => {
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
