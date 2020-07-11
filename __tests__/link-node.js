/**
 * @jest-environment node
 */
import { navigate as gatsbyNavigate } from "gatsby"
import { navigate, changeLocale } from "../src/link"

jest.mock("gatsby", () => ({
  __esModule: true,
  navigate: jest.fn(),
}))

describe("navigate when window is undefined", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns nothing", () => {
    const result = navigate("path")

    expect(result).toEqual(undefined)
  })

  it("does not call Gatsby's navigate", () => {
    navigate("path")

    expect(gatsbyNavigate).not.toHaveBeenCalled()
  })
})

describe("changeLocale when window is undefined", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns nothing", () => {
    const result = changeLocale("es", "/path")

    expect(result).toEqual(undefined)
  })

  it("does not call Gatsby's navigate", () => {
    navigate("path")

    expect(gatsbyNavigate).not.toHaveBeenCalled()
  })
})
