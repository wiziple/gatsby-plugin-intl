const { polyfillIntl } = require(`../src/polyfillIntl`)

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
