const config = jest.genMockFromModule('../config.js').default

config.auth.jwt.secret = '123456'
config.datalad.uri = 'datalad'
config.datalad.workers = 4
config.mongo.url = 'mongodb://'

export default config
