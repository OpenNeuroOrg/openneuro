const user = {
  new: {
    title: 'new user',
    type: 'object',
    properties: {
      _id: { type: 'string' },
      firstname: { type: 'string' },
      lastname: { type: 'string' },
      email: { type: 'string' },
    },
    required: ['_id', 'firstname', 'lastname'],
  },
  blacklisted: {
    title: 'new user',
    type: 'object',
    properties: {
      _id: { type: 'string' },
      firstname: { type: 'string' },
      lastname: { type: 'string' },
      note: { type: 'string' },
    },
    required: ['_id'],
  },
}

export default user
