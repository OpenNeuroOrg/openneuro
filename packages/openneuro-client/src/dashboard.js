import gql from 'graphql-tag'

export const myDatasets = gql`
  query myDatasets {
    myDatasets {
      id
      _id: id
      created
      uploader {
        id
        name
      }
      public
      permissions {
        userId
        _id: userId
        level
        access: level
        user {
          id
          name
          email
          provider
        }
      }
      draft {
        id
        partial
        summary {
          modalities
          sessions
          subjects
          tasks
          size
          totalFiles
        }
        issues {
          severity
        }
        description {
          Name
        }
      }
      analytics {
        views
        downloads
      }
      stars {
        userId
        datasetId
      }
      followers {
        userId
        datasetId
      }
    }
  }
`

export const adminDatasets = gql`
  query adminDatasets {
    adminDatasets {
      id
      _id: id
      created
      uploader {
        id
        name
      }
      public
      permissions {
        userId
        _id: userId
        level
        access: level
        user {
          id
          name
          email
          provider
        }
      }
      draft {
        id
        partial
        summary {
          modalities
          sessions
          subjects
          tasks
          size
          totalFiles
        }
        issues {
          severity
        }
        description {
          Name
        }
      }
      analytics {
        views
        downloads
      }
      stars {
        userId
        datasetId
      }
      followers {
        userId
        datasetId
      }
    }
  }
`

export const publicDatasets = gql`
  query publicDatasets {
    publicDatasets {
      id
      _id: id
      created
      uploader {
        id
        name
      }
      public
      permissions {
        userId
        _id: userId
        level
        access: level
        user {
          id
          name
          email
          provider
        }
      }
      draft {
        id
        partial
        summary {
          modalities
          sessions
          subjects
          tasks
          size
          totalFiles
        }
        issues {
          severity
        }
        description {
          Name
        }
      }
      analytics {
        views
        downloads
      }
      stars {
        userId
        datasetId
      }
      followers {
        userId
        datasetId
      }
    }
  }
`
