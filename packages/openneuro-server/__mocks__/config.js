const config = jest.genMockFromModule('../config.js').default

config.auth.jwt.secret = '123456'

export default config
