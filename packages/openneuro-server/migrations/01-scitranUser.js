/* eslint-disable no-console */
/**
 * Migration from old SciTran user format to our own user database
 */
import path from 'path'
import User from '../models/user.js'
import mongo from '../libs/mongo.js'

const scitran = mongo.collections.scitran

export default {
  id: path.basename(module.filename),
  update: async () => {
    await scitran.users
      .find()
      .toArray()
      .then(async scitranUsers => {
        //throw new Error(util.inspect(scitranUsers))
        for (const oldUser of scitranUsers) {
          let newUser
          if (oldUser._id.indexOf('@') !== -1) {
            // This is a legacy Google user
            newUser = await User.findOneAndUpdate(
              {
                provider: 'google',
                providerId: oldUser._id,
              },
              {
                provider: 'google',
                providerId: oldUser._id,
                email: oldUser.email,
                admin: oldUser.root,
                name: `${oldUser.firstname} ${oldUser.lastname}`,
                created: oldUser.created,
                lastLogin: oldUser.lastlogin,
              },
              { upsert: true, new: true, setDefaultsOnInsert: true },
            )
          } else {
            // This is a legacy ORCID user
            newUser = await User.findOneAndUpdate(
              {
                provider: 'orcid',
                providerId: oldUser._id,
              },
              {
                provider: 'orcid',
                providerId: oldUser._id,
                email: oldUser.email,
                admin: oldUser.root,
                name: `${oldUser.firstname} ${oldUser.lastname}`,
                created: oldUser.created,
                lastLogin: oldUser.lastlogin,
              },
              { upsert: true, new: true, setDefaultsOnInsert: true },
            )
          }
          console.log(
            `User "${oldUser._id}" ->"${newUser.id}" + "${
              newUser.providerId
            }" migrated to new auth format.`,
          )
        }
      })
  },
}
