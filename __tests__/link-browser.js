import { navigate as gatsbyNavigate } from "gatsby"
import { navigate, changeLocale } from "../src/link"

jest.mock("gatsby", () => ({
  __esModule: true,
  navigate: jest.fn(),
}))

describe("navigate()", () => {
  describe("when 'routed' is false", () => {
    it("calls gatsby's navigate with the same path and options", () => {
      window.___gatsbyIntl = {
        language: "es",
        routed: false,
        languageOptions: ["es"],
      }
      navigate("/path", "some options")

      expect(gatsbyNavigate).toHaveBeenCalledTimes(1)
      expect(gatsbyNavigate).toHaveBeenCalledWith("/path", "some options")
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })
  })

  describe("when 'routed' is true", () => {
    it("calls gatsby's navigate with locale as the prefix", () => {
      window.___gatsbyIntl = {
        language: "es",
        routed: true,
        languageOptions: ["es"],
      }
      navigate("/path")

      expect(gatsbyNavigate).toHaveBeenCalledTimes(1)
      expect(gatsbyNavigate).toHaveBeenCalledWith("/es/path", undefined)
    })

    it("calls gatsby's navigate with locale as the prefix", () => {
      window.___gatsbyIntl = {
        language: "es",
        routed: true,
        languageOptions: [{ locale: "es", prefix: "spanish" }],
      }
      navigate("/path")

      expect(gatsbyNavigate).toHaveBeenCalledTimes(1)
      expect(gatsbyNavigate).toHaveBeenCalledWith("/spanish/path", undefined)
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })
  })
})

describe("changeLocale()", () => {
  describe("when 'to' argument is defined", () => {
    it("sets language in local storage", () => {
      window.___gatsbyIntl = {
        languageOptions: ["es"],
      }
      changeLocale("es", "/path")

      expect(localStorage.setItem).toHaveBeenCalledTimes(1)
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "gatsby-intl-language",
        "es"
      )
    })

    it("adds the language to the path", () => {
      window.___gatsbyIntl = {
        languageOptions: ["es"],
      }
      changeLocale("es", "/path")

      expect(gatsbyNavigate).toHaveBeenCalledTimes(1)
      expect(gatsbyNavigate).toHaveBeenCalledWith("/es/path")
    })

    it("adds the language prefix to the path", () => {
      window.___gatsbyIntl = {
        languageOptions: [{ locale: "es", prefix: "spanish" }],
      }
      changeLocale("es", "/path")

      expect(gatsbyNavigate).toHaveBeenCalledTimes(1)
      expect(gatsbyNavigate).toHaveBeenCalledWith("/spanish/path")
    })

    beforeEach(() => {
      jest.clearAllMocks()
      global.__BASE_PATH__ = undefined
      global.__PATH_PREFIX__ = ""
    })

    beforeAll(() => {
      jest.spyOn(window.localStorage.__proto__, "setItem")
      window.localStorage.__proto__.setItem = jest.fn()
    })
  })

  describe("when 'to' argument is undefined", () => {
    it("changes URL from default language to Spanish", () => {
      window.location = new URL("https://www.example.com/a-blog-post/")
      window.___gatsbyIntl = {
        routed: false,
        languageOptions: ["es"],
      }
      changeLocale("es")

      expect(gatsbyNavigate).toHaveBeenCalledTimes(1)
      expect(gatsbyNavigate).toHaveBeenCalledWith("/es/a-blog-post/")
    })

    it("changes URL from Spanish to English", () => {
      window.location = new URL("https://www.example.com/es/a-blog-post/")
      window.___gatsbyIntl = {
        routed: true,
        languageOptions: ["es", "en"],
      }
      changeLocale("en")

      expect(gatsbyNavigate).toHaveBeenCalledTimes(1)
      expect(gatsbyNavigate).toHaveBeenCalledWith("/en/a-blog-post/")
    })

    beforeEach(() => {
      jest.clearAllMocks()
      global.__BASE_PATH__ = undefined
      global.__PATH_PREFIX__ = ""
      delete window.location
    })
  })

  describe("when __BASE_PATH__ is defined", () => {
    it("removes __BASE_PATH__ from the URL", () => {
      window.location = new URL("https://www.example.com/blog/a-blog-post/")
      window.___gatsbyIntl = {
        routed: false,
        languageOptions: ["es"],
      }
      changeLocale("es")

      expect(gatsbyNavigate).toHaveBeenCalledTimes(1)
      expect(gatsbyNavigate).toHaveBeenCalledWith("/es/a-blog-post/")
    })

    beforeEach(() => {
      jest.clearAllMocks()
      global.__BASE_PATH__ = "/blog"
      delete window.location
    })
  })

  describe("when __PATH_PREFIX__ is defined", () => {
    it("removes __PATH_PREFIX__ from the URL", () => {
      window.location = new URL("https://www.example.com/blog/a-blog-post/")
      window.___gatsbyIntl = {
        routed: false,
        languageOptions: ["es"],
      }
      changeLocale("es")

      expect(gatsbyNavigate).toHaveBeenCalledTimes(1)
      expect(gatsbyNavigate).toHaveBeenCalledWith("/es/a-blog-post/")
    })

    beforeEach(() => {
      jest.clearAllMocks()
      global.__BASE_PATH__ = undefined
      global.__PATH_PREFIX__ = "/blog"
      delete window.location
    })
  })
})
