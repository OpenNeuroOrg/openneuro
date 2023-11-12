const config = {
  auth: {
    jwt: {
      secret: "123456",
    },
  },
  datalad: {
    uri: "datalad",
    workers: 4,
  },
  mongo: {
    url: "mongodb://",
  },
  notifications: {
    email: {
      from: "notifications@example.com",
    },
  },
  elasticsearch: {},
  doi: {
    username: "",
  },
}

export default config
