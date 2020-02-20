import mongodb from 'mongo-mock'

// eslint-disable-next-line @typescript-eslint/camelcase
mongodb.max_delay = 0

module.exports = mongodb
