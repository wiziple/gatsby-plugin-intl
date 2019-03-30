const { onCreatePage } = require(`../src/gatsby-node`)

const actions = {
  createPage: jest.fn(),
  deletePage: jest.fn(),
}

const mocks = {
  actions,
  page: {
    path: "/",
  },
}

it(`does not crash when no pluginConfig is provided`, () => {
  const pluginOptions = {}
  onCreatePage(mocks, pluginOptions)
})
