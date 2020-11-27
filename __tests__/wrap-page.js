const { preferDefault } = require(`../src/wrap-page`)

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
