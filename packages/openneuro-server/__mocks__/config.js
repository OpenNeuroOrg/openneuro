const config = jest.genMockFromModule('../config.js').default

config.datalad.enabled = true
config.auth.jwt.secret = '123456'

export default config
