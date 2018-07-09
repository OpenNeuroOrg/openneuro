const user = {
  new: {
    title: 'new user',
    type: 'object',
    properties: {
      _id: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string' },
    },
    required: ['_id', 'name'],
  },
  blacklisted: {
    title: 'new user',
    type: 'object',
    properties: {
      _id: { type: 'string' },
      name: { type: 'string' },
      note: { type: 'string' },
    },
    required: ['_id'],
  },
}

export default user
