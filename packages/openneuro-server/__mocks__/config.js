const config = jest.genMockFromModule('../config.js').default

config.datalad.enabled = true

export default config
