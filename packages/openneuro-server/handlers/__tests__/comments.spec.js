import mongo from '../../libs/mongo'
import request from 'supertest'
import { ObjectID } from 'mongodb'
import createApp from '../../app.js'
import utils from '../../libs/testing-utils.js'

jest.mock('../../config.js')
jest.unmock('superagent')

const app = createApp(true)

const userId = ObjectID().toString()
const parentId = ObjectID()
const mailgunId = ObjectID()
const mailgunMessageId = ObjectID().toString()

const user = {
  _id: userId,
  email: 'test@test.com',
}
const comment = {
  commentId: parentId,
  _id: parentId,
  datasetId: '22',
  datasetLabel: 'test_dataset',
}
const mailgunIdentifier = {
  _id: mailgunId,
  messageId: mailgunMessageId,
}
const validReply = {
  'stripped-text': 'testing an email reply',
  'In-Reply-To': mailgunMessageId,
}

const hasParentId = res => {
  expect(res.body).toHaveProperty('parentId', parentId.toString())
}

const hasSameUserInfo = res => {
  expect(res.body).toHaveProperty('user', user)
}

const insertedIntoMongo = async res => {
  const dbEntry = await mongo.collections.crn.comments.findOne({
    _id: ObjectID(res.body._id),
  })
  expect(dbEntry)
}

// runs before every test is executed
beforeAll(async () => {
  await mongo.connect(global.__MONGO_URI__)
  await mongo.collections.crn.comments.insertOne(comment)
  await mongo.collections.crn.mailgunIdentifiers.insertOne(mailgunIdentifier)
  await mongo.collections.scitran.users.insertOne(user)
})

afterAll(async () => {
  await mongo.shutdown()
})

// test reply generation when content sent to /comments/reply/commentId/userId
describe('comments/reply', () => {
  const baseUrl = '/crn/comments/reply/'
  const commentReplyUrl = baseUrl + `${parentId}/${userId}`

  it('sends a response', done => {
    request(app)
      .post(commentReplyUrl)
      .send(validReply)
      .expect('Content-Type', /json/)
      .expect(utils.ok)
      .expect(200, done)
  })
  it('should return 404 if the email is not in reply to a message we sent', done => {
    request(app)
      .post(commentReplyUrl)
      .send({
        'stripped-text': 'testing an email reply',
        'In-Reply-To': 'wrongID!',
      })
      .expect(404, done)
  })

  it('should return 404 when an invalid userId is provided', done => {
    request(app)
      .post(baseUrl + parentId + '/' + ObjectID())
      .send(validReply)
      .expect(404, done)
  })

  it('should return the proper newly created comment when provided accurate information', done => {
    request(app)
      .post(commentReplyUrl)
      .send(validReply)
      .expect(hasParentId)
      .expect(hasSameUserInfo)
      .expect(insertedIntoMongo)
      .end(done)
  })
})
