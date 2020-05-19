/* eslint-disable no-console */
// Run all pending migrations
import config from '../config.js'
import { connect as redisConnect } from '../libs/redis.js'
import mongo from '../libs/mongo.js'
import mongoose from 'mongoose'
import Migration from '../models/migration.js'
import migrations from './index.js'

// Setup Mongoose
mongoose.connect(`${config.mongo.url}crn`)

/**
 * This is a basic migration system, runs any unapplied updates in order
 * from the index provided in index.js
 *
 * Will yell at you if there are errors.
 *
 * Runs manually for now but could run at startup.
 */
const upgradeAll = async () => {
  await redisConnect(config.redis)
  // Connect to old database(s)
  await mongo.connect(config.mongo.url)
  for (const migrationDefinition of migrations) {
    const key = migrationDefinition.id
    const migrate = await Migration.findOneAndUpdate(
      { id: key },
      {},
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )
    try {
      if (migrate.complete) {
        console.log(`${key} has already run - continuing`)
      } else {
        await migrationDefinition.update()
        console.log(`${key} migration complete`)
        migrate.complete = true
        await migrate.save()
      }
    } catch (e) {
      console.log(`${key} failed to execute - exiting`)
      throw e
    }
  }
}

// Entrypoint
upgradeAll().then(() => {
  mongo.dbs.crn.close()
  mongoose.connection.close()
  process.exit(0)
})
