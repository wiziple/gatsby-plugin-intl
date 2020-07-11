const { preferDefault, polyfillIntl } = require(`../src/wrap-page`)

describe("preferDefault", () => {
  it("returns module when module does not have default export", () => {
    const module = {
      foo: "bar",
    }
    const value = preferDefault(module)

    expect(value).toEqual(module)
  })

  it("returns default export", () => {
    const module = {
      default: "bar",
    }
    const value = preferDefault(module)

    expect(value).toEqual("bar")
  })
})

const originalIntl = Intl

describe("polyfillIntl when Intl is undefined", () => {
  beforeAll(() => {
    Intl = undefined
  })
  it("throws error", () => {
    expect(() => {
      polyfillIntl("not-a-language")
    }).toThrow(`Cannot find react-intl/locale-data/not-a-language`)
  })
  afterAll(() => {
    Intl = originalIntl
  })
})
