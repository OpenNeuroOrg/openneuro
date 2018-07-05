import mongo from './libs/mongo.js'

export default () => {
  return new Promise(resolve => {
    mongo.connect('...', () => {
      resolve()
    })
  })
}
