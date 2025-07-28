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
  notifications?: DatasetEventGraphQL[]
}

export interface DatasetEventDescriptionGraphQL {
  type?: string
  version?: string
  public?: boolean
  target?: { id: string; name?: string }
  level?: string
  ref?: string
  message?: string
  requestId?: string
  targetUserId?: string
  status?: string
  reason?: string
}

export interface DatasetEventGraphQL {
  id: string
  timestamp: string // GraphQL DateTime is a string
  note?: string
  success?: boolean
  user?: { id: string; name?: string }
  event: DatasetEventDescriptionGraphQL
  dataset?: {
    id: string
    name?: string
  }
}

export interface MappedNotification {
  id: string
  title: string
  content: string
  status: "unread" | "saved" | "archived"
  type: "general" | "approval"
  approval: "" | "not provided" | "denied" | "approved" | "accepted"
  originalNotification: DatasetEventGraphQL
}

export interface OutletContextType {
  notifications: DatasetEventGraphQL[]
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
