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
  admin?: boolean
  blocked?: boolean
  lastSeen?: string
  created?: string
  provider?: string
  modified?: string
  githubSynced?: Date
}

export interface UserRoutesProps {
  orcidUser: User
  hasEdit: boolean
  isUser: boolean
}
export interface UserCardProps {
  orcidUser: User
}

export interface UserAccountViewProps {
  orcidUser: User
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
      DatasetDOI?: string | null
      Name: string
    }
    summary?: {
      primaryModality?: string
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
  orcidUser: User
  hasEdit: boolean
}

export interface AccountContainerProps {
  orcidUser: User
  hasEdit: boolean
  isUser: boolean
}
