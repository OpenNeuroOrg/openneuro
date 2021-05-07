import React from 'react'
import { SearchResultItem } from './SearchResultItem'

export interface Dataset {
  analytics: {
    downloads: number
    views: number
  }
  created: string // Date string
  draft: {
    description: {
      Name: string
    }
    id: string
    issues: {
      severity: unknown
      key: string
      code: number
      reason: string
      files: {
        key: string
        code: number
        file: {
          name: string
          path: string
          relativePath: string
        }
        evidence: string
        line: number
        character: number
        severity: 'error' | 'warning'
        reason: string
        helpUrl: string
      }[]
      additionalFileCount: number
      helpUrl: string
    }[]
    summary: {
      dataProcessed: boolean
      modalities: string[]
      sessions: string[]
      size: number
      subjectMetadata: {
        participantId: string
        age: number
        sex: string
        group: string
      }
      subjects: string[]
      tasks: string[]
      totalFiles: number
    }
  }
  followers: {
    datasetId: string
    userId: string
  }[]
  id: string
  permissions: {
    id: string
    userPermissions: {
      access: string
      level: string
      user: {
        email: string
        id: string
        name: string
        provider: string
      }
      userId: string
    }[]
  }
  public: boolean
  snapshots: {
    id: string
    tag: string
    dataset: Dataset
    created: string // Date string
    summary: {
      dataProcessed: boolean
      modalities: string[]
      sessions: string[]
      size: number
      subjectMetadata: {
        participantId: string
        age: number
        sex: string
        group: string
      }
      subjects: string[]
      tasks: string[]
      totalFiles: number
    }
    files: unknown[]
    description: {
      Name: string
    }
    analytics: {
      downloads: number
      views: number
    }
    readme: string
    hexsha: string
  }[]
  stars: {
    userId: string
    datasetId: string
  }[]
  uploader: {
    id: string
    name: string
  }
}

export interface SearchResultsListProps {
  datasets: Dataset[]
}

export const SearchResultsList = ({ datasets }: SearchResultsListProps) => {
  return (
    <ul>
      {datasets.map(dataset => (
        <SearchResultItem
          name={dataset.draft.description.Name}
          modalities={dataset.draft.summary.modalities}
          tasks={dataset.draft.summary.tasks}
          accessionNumber={dataset.id}
          sessions={dataset.draft.summary.sessions.length}
          subjects={dataset.draft.summary.subjects.length}
          files={dataset.draft.summary.totalFiles}
          size={dataset.draft.summary.size.toString()}
          uploader={dataset.uploader.name}
          updated={dataset.created}
          downloads={dataset.analytics.downloads}
          views={dataset.analytics.views}
          followers={dataset.followers.length}
          bookmarks={dataset.stars.length}
        />
      ))}
    </ul>
  )
}
