const fs = require(`fs`)

const { onCreatePage } = require(`../src/gatsby-node`)

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

  expect(actions.createPage.mock.calls.length).toBe(4)

  // assert the pages created match the requested languages
  expect(actions.createPage.mock.calls[0][0].path).toBe(`/`)
  expect(actions.createPage.mock.calls[1][0].path).toBe(`/en/`)
  expect(actions.createPage.mock.calls[2][0].path).toBe(`/`)
  expect(actions.createPage.mock.calls[3][0].path).toBe(`/es/`)
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
