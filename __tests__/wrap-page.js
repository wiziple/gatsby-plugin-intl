const { preferDefault } = require(`../src/wrap-page`)
const { polyfillIntl } = require(`../src/polyfill`)

describe("preferDefault()", () => {
  describe("when module does not have default export", () => {
    it("returns entire module", () => {
      const module = {
        foo: "bar",
      }
      const value = preferDefault(module)

      expect(value).toEqual(module)
    })
  })

  describe("when module has default export", () => {
    it("returns default export", () => {
      const module = {
        default: "bar",
      }
      const value = preferDefault(module)

      expect(value).toEqual("bar")
    })
  })
})

describe("polyfillIntl", () => {
  const originalIntl = Intl

  describe("when Intl is undefined", () => {
    it("throws error", () => {
      expect(() => {
        polyfillIntl("not-a-language")
      }).toThrow(`Cannot find react-intl/locale-data/not-a-language`)
    })

    beforeAll(() => {
      Intl = undefined
    })

    afterAll(() => {
      Intl = originalIntl
    })
  })
})
