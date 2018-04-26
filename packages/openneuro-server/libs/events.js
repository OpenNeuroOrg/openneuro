import { EventEmitter } from 'events'
import config from '../config'
import mongo from './mongo'

let c = mongo.collections

class CrnEmitter extends EventEmitter {
  constructor(events) {
    super()
    if (!CrnEmitter.instance) {
      CrnEmitter.instance = this
    }
    this.events = events
    return CrnEmitter.instance
  }
}

let emitter = new CrnEmitter(config.events)

Object.keys(emitter.events).forEach(event => {
  emitter.on(emitter.events[event], (data, user) => {
    //update logs collection in mongo
    c.crn.logs.insert({ type: event, data: data, date: new Date(), user: user })
  })
})

Object.freeze(emitter)

export default emitter
