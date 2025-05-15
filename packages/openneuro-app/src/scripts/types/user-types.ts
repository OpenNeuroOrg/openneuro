export interface User {
  id: string
  name: string
  location?: string
  github?: string
  institution?: string
  email: string
  avatar?: string
  orcid?: string
  links?: string[]
  githubSynced?: Date
}

export interface UserRoutesProps {
  user: User
  hasEdit: boolean
  isUser: boolean
}
export interface UserCardProps {
  user: User
}

export interface UserAccountViewProps {
  user: {
    name: string
    email: string
    orcid?: string
    links?: string[]
    location?: string
    institution?: string
    github?: string
    githubSynced?: Date
  }
}

export interface Dataset {
  id: string
  created: string
  name: string
  public: boolean
  analytics: {
    views: number
    downloads: number
  }
  stars?: { userId: string; datasetId: string }[]
  followers?: { userId: string; datasetId: string }[]
  latestSnapshot?: {
    id: string
    size: number
    issues: { severity: string }[]
    created?: string
    description?: {
      Authors: string[]
    }
  }
  draft?: {
    size?: number
    created?: string
  }
}

export interface DatasetCardProps {
  dataset: Dataset
  hasEdit: boolean
}

export interface UserDatasetsViewProps {
  user: User
  hasEdit: boolean
}

export interface AccountContainerProps {
  user: User
  hasEdit: boolean
  isUser: boolean
}
