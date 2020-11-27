import React from "react"
import { render } from "@testing-library/react"
import { IntlProvider } from "react-intl"
import { withIntlProvider } from "../src/wrap-page"
import { polyfillIntl } from "../src/polyfillIntl"
import { IntlContextProvider } from "../src/intl-context"

jest.mock("../src/polyfillIntl")

jest.mock("react-intl", () => ({
  __esModule: true,
  IntlProvider: jest.fn(({ children }) => <div>{children}</div>),
}))

jest.mock("../src/intl-context", () => ({
  __esModule: true,
  IntlContextProvider: jest.fn(({ children }) => <div>{children}</div>),
}))

describe("withIntlProvider()", () => {
  describe("when TestElement is wrapped", () => {
    const TestElement = () => <div>Hello</div>
    const intl = { language: "es", defaultLanguage: "es", messages: {} }

    it("polyfills Intl for spanish", () => {
      render(withIntlProvider(intl)(<TestElement />))

      expect(polyfillIntl).toHaveBeenCalledTimes(1)
      expect(polyfillIntl).toHaveBeenCalledWith("es")
    })

    it("renders IntlProvider with locale, default locale and messages", () => {
      render(withIntlProvider(intl)(<TestElement />))

      expect(IntlProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          locale: "es",
          defaultLocale: "es",
          messages: {},
        }),
        {}
      )
    })

    it("renders IntlContextProvider with intl object as the value", () => {
      render(withIntlProvider(intl)(<TestElement />))

      expect(IntlContextProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          value: intl,
        }),
        {}
      )
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })
  })
})
