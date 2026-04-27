/* eslint-disable */
import * as types from "./graphql"
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core"

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  "\n  mutation UpdateContributors(\n    $datasetId: String!\n    $newContributors: [ContributorInput!]!\n  ) {\n    updateContributors(\n      datasetId: $datasetId\n      newContributors: $newContributors\n    ) {\n      success\n      dataset {\n        id\n        draft {\n          id\n          contributors {\n            name\n            givenName\n            familyName\n            orcid\n            contributorType\n            order\n          }\n          files {\n            id\n            filename\n            size\n            annexed\n            urls\n            directory\n          }\n          modified\n        }\n      }\n    }\n  }\n":
    typeof types.UpdateContributorsDocument
  "\n  fragment DatasetReviewers on Dataset {\n    id\n    reviewers {\n      expiration\n      id\n    }\n  }\n":
    typeof types.DatasetReviewersFragmentDoc
  "\n  mutation createReviewer($datasetId: ID!) {\n    createReviewer(datasetId: $datasetId) {\n      id\n      datasetId\n      url\n      expiration\n    }\n  }\n":
    typeof types.CreateReviewerDocument
  "\n  query getDatasetRelations($datasetId: ID!) {\n    dataset(id: $datasetId) {\n      latestSnapshot {\n        tag\n        related {\n          id\n          kind\n          relation\n          description\n        }\n      }\n    }\n  }\n":
    typeof types.GetDatasetRelationsDocument
  "\n  mutation createDatasetRelation(\n    $datasetId: ID!\n    $doi: String!\n    $description: String!\n    $kind: RelatedObjectKind!\n    $relation: RelatedObjectRelation!\n  ) {\n    createRelation(\n      datasetId: $datasetId\n      doi: $doi\n      description: $description\n      kind: $kind\n      relation: $relation\n    ) {\n      id\n    }\n  }\n":
    typeof types.CreateDatasetRelationDocument
  "\n  mutation deleteDatasetRelation($datasetId: ID!, $doi: String!) {\n    deleteRelation(datasetId: $datasetId, doi: $doi) {\n      id\n    }\n  }\n":
    typeof types.DeleteDatasetRelationDocument
  "\n  mutation deleteReviewer($datasetId: ID!, $id: ID!) {\n    deleteReviewer(datasetId: $datasetId, id: $id) {\n      id\n      datasetId\n    }\n  }\n":
    typeof types.DeleteReviewerDocument
  "\n  mutation deprecateSnapshot($datasetId: ID!, $tag: String!, $reason: String!) {\n    deprecateSnapshot(datasetId: $datasetId, tag: $tag, reason: $reason) {\n      id\n      deprecated {\n        reason\n      }\n    }\n  }\n":
    typeof types.DeprecateSnapshotDocument
  "\n  mutation followDataset($datasetId: ID!) {\n    followDataset(datasetId: $datasetId) {\n      following\n      newFollower {\n        userId\n      }\n    }\n  }\n":
    typeof types.FollowDatasetDocument
  "\n  fragment UserFollowing on Dataset {\n    id\n    following\n  }\n":
    typeof types.UserFollowingFragmentDoc
  "\n  fragment DatasetFollowers on Dataset {\n    id\n    followers {\n      userId\n    }\n  }\n":
    typeof types.DatasetFollowersFragmentDoc
  "\n  mutation fsckDataset($datasetId: ID!) {\n    fsckDataset(datasetId: $datasetId)\n  }\n":
    typeof types.FsckDatasetDocument
  "\n  query getHoldDeletion($datasetId: ID!) {\n    dataset(id: $datasetId) {\n      id\n      holdDeletion\n    }\n  }\n":
    typeof types.GetHoldDeletionDocument
  "\n  mutation holdDeletion($datasetId: ID!, $hold: Boolean!) {\n    holdDeletion(datasetId: $datasetId, hold: $hold)\n  }\n":
    typeof types.HoldDeletionDocument
  "\n  mutation importRemoteDataset($datasetId: ID!, $url: String!) {\n    importRemoteDataset(datasetId: $datasetId, url: $url)\n  }\n":
    typeof types.ImportRemoteDatasetDocument
  "\n  mutation removePermissions($datasetId: ID!, $userId: String!) {\n    removePermissions(datasetId: $datasetId, userId: $userId)\n  }\n":
    typeof types.RemovePermissionsDocument
  "\n  mutation starDataset($datasetId: ID!) {\n    starDataset(datasetId: $datasetId) {\n      starred\n      newStar {\n        userId\n      }\n    }\n  }\n":
    typeof types.StarDatasetDocument
  "\n  fragment UserStarred on Dataset {\n    id\n    starred\n  }\n":
    typeof types.UserStarredFragmentDoc
  "\n  fragment DatasetStars on Dataset {\n    id\n    stars {\n      userId\n    }\n  }\n":
    typeof types.DatasetStarsFragmentDoc
  "\n  mutation undoDeprecateSnapshot($datasetId: ID!, $tag: String!) {\n    undoDeprecateSnapshot(datasetId: $datasetId, tag: $tag) {\n      id\n      deprecated {\n        reason\n      }\n    }\n  }\n":
    typeof types.UndoDeprecateSnapshotDocument
  "\n  mutation updatePermissions(\n    $datasetId: ID!\n    $userEmail: String!\n    $level: String!\n  ) {\n    updatePermissions(\n      datasetId: $datasetId\n      userEmail: $userEmail\n      level: $level\n    ) {\n      id\n      userPermissions {\n        datasetId\n        userId\n        level\n        user {\n          id\n          email\n          orcid\n          name\n        }\n      }\n    }\n  }\n":
    typeof types.UpdatePermissionsDocument
  "\n  mutation updateOrcidPermissions(\n    $datasetId: ID!\n    $userOrcid: String!\n    $level: String!\n  ) {\n    updateOrcidPermissions(\n      datasetId: $datasetId\n      userOrcid: $userOrcid\n      level: $level\n    ) {\n      id\n      userPermissions {\n        datasetId\n        userId\n        level\n        user {\n          id\n          email\n          orcid\n          name\n        }\n      }\n    }\n  }\n":
    typeof types.UpdateOrcidPermissionsDocument
  "\n  query participantCount($modality: String) {\n    participantCount(modality: $modality)\n  }\n":
    typeof types.ParticipantCountDocument
  "\n  query publicDatasetCount($modality: String) {\n    datasets(filterBy: { public: true }, modality: $modality) {\n      pageInfo {\n        count\n      }\n    }\n  }\n":
    typeof types.PublicDatasetCountDocument
  "\n  query AdvancedSearch($query: DatasetSearchInput!, $datasetType: String!) {\n    advancedSearch(query: $query, datasetType: $datasetType) {\n      pageInfo {\n        count\n      }\n    }\n  }\n":
    typeof types.AdvancedSearchDocument
  "\n  mutation subscribeToNewsletter($email: String!) {\n    subscribeToNewsletter(email: $email)\n  }\n":
    typeof types.SubscribeToNewsletterDocument
  "\n  query top_viewed_datasets {\n    datasets(\n      first: 12\n      orderBy: { views: descending }\n      filterBy: { public: true }\n    ) {\n      edges {\n        node {\n          id\n          analytics {\n            views\n          }\n          latestSnapshot {\n            tag\n            summary {\n              primaryModality\n            }\n            description {\n              Name\n            }\n          }\n        }\n      }\n    }\n  }\n":
    typeof types.Top_Viewed_DatasetsDocument
  "\n  query recently_published_datasets {\n    datasets(\n      first: 12\n      orderBy: { publishDate: descending }\n      filterBy: { public: true }\n    ) {\n      edges {\n        node {\n          id\n          publishDate\n          latestSnapshot {\n            tag\n            summary {\n              primaryModality\n            }\n            description {\n              Name\n            }\n          }\n        }\n      }\n    }\n  }\n":
    typeof types.Recently_Published_DatasetsDocument
  "\n  query GetDatasetEvents($datasetId: ID!) {\n    dataset(id: $datasetId) {\n      events {\n        id\n        note\n        success\n        timestamp\n        user {\n          email\n          name\n          orcid\n          id\n        }\n        event {\n          type\n          requestId\n          targetUserId\n          resolutionStatus\n        }\n        hasBeenRespondedTo\n        responseStatus\n      }\n    }\n  }\n":
    typeof types.GetDatasetEventsDocument
  "\n  mutation SaveAdminNote($datasetId: ID!, $note: String!) {\n    saveAdminNote(datasetId: $datasetId, note: $note) {\n      note\n    }\n  }\n":
    typeof types.SaveAdminNoteDocument
  "\n  mutation UpdateAdminNote(\n    $note: String!\n    $datasetId: ID!\n    $saveAdminNoteId: ID\n  ) {\n    saveAdminNote(note: $note, datasetId: $datasetId, id: $saveAdminNoteId) {\n      id\n      note\n    }\n  }\n":
    typeof types.UpdateAdminNoteDocument
  "\n  mutation ProcessContributorRequest(\n    $datasetId: ID!\n    $requestId: ID!\n    $targetUserId: ID!\n    $resolutionStatus: ResponseStatusType!\n    $reason: String\n  ) {\n    processContributorRequest(\n      datasetId: $datasetId\n      requestId: $requestId\n      targetUserId: $targetUserId\n      resolutionStatus: $resolutionStatus\n      reason: $reason\n    ) {\n      id\n      event {\n        type\n        requestId\n        resolutionStatus\n      }\n      note\n    }\n  }\n":
    typeof types.ProcessContributorRequestDocument
  "\n  mutation UpdateEventStatus($eventId: ID!, $status: NotificationStatusType!) {\n    updateEventStatus(eventId: $eventId, status: $status) {\n      status\n    }\n  }\n":
    typeof types.UpdateEventStatusDocument
  "\n  mutation CreateContributorRequestEvent($datasetId: ID!) {\n    createContributorRequestEvent(datasetId: $datasetId) {\n      id\n      timestamp\n      event {\n        type\n      }\n      success\n      note\n    }\n  }\n":
    typeof types.CreateContributorRequestEventDocument
  "\n  query DatasetEvents($datasetId: ID!) {\n    dataset(id: $datasetId) {\n      id\n      events {\n        id\n        timestamp\n        user {\n          id\n          name\n        }\n        event {\n          type\n        }\n        success\n        note\n      }\n    }\n  }\n":
    typeof types.DatasetEventsDocument
  "\n  mutation CreateContributorCitationEvent(\n    $datasetId: ID!\n    $targetUserId: ID!\n    $contributorData: ContributorInput!\n  ) {\n    createContributorCitationEvent(\n      datasetId: $datasetId\n      targetUserId: $targetUserId\n      contributorData: $contributorData\n    ) {\n      id\n      timestamp\n      success\n      user {\n        id\n        name\n      }\n      event {\n        type\n        resolutionStatus\n        contributorData {\n          name\n          givenName\n          familyName\n          orcid\n          contributorType\n          order\n        }\n      }\n      note\n    }\n  }\n":
    typeof types.CreateContributorCitationEventDocument
  "\n  mutation ProcessContributorCitation($eventId: ID!, $status: ResponseStatusType!) {\n    processContributorCitation(eventId: $eventId, status: $status) {\n      id\n      timestamp\n      success\n      user {\n        id\n        name\n      }\n      event {\n        type\n        targetUserId\n        contributorData {\n          name\n          givenName\n          familyName\n          orcid\n          contributorType\n          order\n        }\n        resolutionStatus\n      }\n    }\n  }\n":
    typeof types.ProcessContributorCitationDocument
  "\n  query User($userId: ID!) {\n    user(id: $userId) {\n      id\n      name\n      orcid\n      email\n      avatar\n      location\n      institution\n      links\n      provider\n      admin\n      created\n      lastSeen\n      blocked\n      githubSynced\n      github\n      notifications {\n        id\n        timestamp\n        note\n        success\n        user { \n          id\n          name\n          email\n          orcid\n        }\n        event {\n          type\n          version\n          public\n          level\n          ref\n          message\n          requestId\n          targetUserId\n          reason\n          datasetId\n          resolutionStatus\n          target { \n            id\n            name\n            email\n            orcid\n          }\n          contributorData { \n            name\n            givenName\n            familyName\n            orcid\n            contributorType\n            order\n          }\n        }\n        notificationStatus {\n          status\n        }\n      }\n      orcidConsent\n    }\n  }\n":
    typeof types.UserDocument
  "\n  mutation updateUser(\n    $id: ID!\n    $location: String\n    $links: [String!]\n    $institution: String\n    $orcidConsent: Boolean \n  ) {\n    updateUser(\n      id: $id\n      location: $location\n      links: $links\n      institution: $institution\n      orcidConsent: $orcidConsent \n    ) {\n      id\n      location\n      links\n      institution\n      orcidConsent\n    }\n  }\n":
    typeof types.UpdateUserDocument
  "\n  query UserAdvancedSearchDatasets(\n    $query: DatasetSearchInput!\n    $cursor: String\n    $allDatasets: Boolean\n    $datasetStatus: String\n    $first: Int!\n  ) {\n    datasets: advancedSearch(\n      query: $query\n      allDatasets: $allDatasets\n      datasetStatus: $datasetStatus\n      first: $first\n      after: $cursor\n    ) {\n      edges {\n        id\n        node {\n          id\n          created\n          name\n          uploader {\n            id\n            name\n            orcid\n          }\n          public\n          permissions {\n            id\n            userPermissions {\n              userId\n              level\n              access: level\n              user {\n                id\n                name\n                email\n                provider\n              }\n            }\n          }\n          metadata {\n            ages\n          }\n          latestSnapshot {\n            size\n            summary {\n              modalities\n              secondaryModalities\n              sessions\n              subjects\n              subjectMetadata {\n                participantId\n                age\n                sex\n                group\n              }\n              tasks\n              size\n              totalFiles\n              dataProcessed\n              pet {\n                BodyPart\n                ScannerManufacturer\n                ScannerManufacturersModelName\n                TracerName\n                TracerRadionuclide\n              }\n              primaryModality\n            }\n            issues {\n              severity\n            }\n            validation {\n              errors\n              warnings\n            }\n            description {\n              Name\n              Authors\n              DatasetDOI\n            }\n          }\n          analytics {\n            views\n            downloads\n          }\n          stars {\n            userId\n            datasetId\n          }\n          followers {\n            userId\n            datasetId\n          }\n          snapshots {\n            id\n            created\n            tag\n          }\n        }\n      }\n      pageInfo {\n        startCursor\n        endCursor\n        hasPreviousPage\n        hasNextPage\n        count\n      }\n    }\n  }\n":
    typeof types.UserAdvancedSearchDatasetsDocument
  "\n  fragment userFields on User {\n    id\n    name\n    admin\n    blocked\n    email\n    provider\n    lastSeen\n    created\n    avatar\n    github\n    institution\n    location\n    modified\n    orcid\n  }\n":
    typeof types.UserFieldsFragmentDoc
  "\n  query GetUsers(\n    $orderBy: [UserSortInput!]\n    $isAdmin: Boolean\n    $isBlocked: Boolean\n    $search: String\n    $limit: Int\n    $offset: Int\n  ) {\n    users(\n      orderBy: $orderBy\n      isAdmin: $isAdmin\n      isBlocked: $isBlocked\n      search: $search\n      limit: $limit\n      offset: $offset\n    ) {\n      users {\n        ...userFields\n      }\n      totalCount\n    }\n  }\n  \n":
    typeof types.GetUsersDocument
  "\n  mutation SetAdmin($id: ID!, $admin: Boolean!) {\n    setAdmin(id: $id, admin: $admin) {\n      ...userFields\n    }\n  }\n  \n":
    typeof types.SetAdminDocument
  "\n  mutation SetBlocked($id: ID!, $blocked: Boolean!) {\n    setBlocked(id: $id, blocked: $blocked) {\n      ...userFields\n    }\n  }\n  \n":
    typeof types.SetBlockedDocument
}
const documents: Documents = {
  "\n  mutation UpdateContributors(\n    $datasetId: String!\n    $newContributors: [ContributorInput!]!\n  ) {\n    updateContributors(\n      datasetId: $datasetId\n      newContributors: $newContributors\n    ) {\n      success\n      dataset {\n        id\n        draft {\n          id\n          contributors {\n            name\n            givenName\n            familyName\n            orcid\n            contributorType\n            order\n          }\n          files {\n            id\n            filename\n            size\n            annexed\n            urls\n            directory\n          }\n          modified\n        }\n      }\n    }\n  }\n":
    types.UpdateContributorsDocument,
  "\n  fragment DatasetReviewers on Dataset {\n    id\n    reviewers {\n      expiration\n      id\n    }\n  }\n":
    types.DatasetReviewersFragmentDoc,
  "\n  mutation createReviewer($datasetId: ID!) {\n    createReviewer(datasetId: $datasetId) {\n      id\n      datasetId\n      url\n      expiration\n    }\n  }\n":
    types.CreateReviewerDocument,
  "\n  query getDatasetRelations($datasetId: ID!) {\n    dataset(id: $datasetId) {\n      latestSnapshot {\n        tag\n        related {\n          id\n          kind\n          relation\n          description\n        }\n      }\n    }\n  }\n":
    types.GetDatasetRelationsDocument,
  "\n  mutation createDatasetRelation(\n    $datasetId: ID!\n    $doi: String!\n    $description: String!\n    $kind: RelatedObjectKind!\n    $relation: RelatedObjectRelation!\n  ) {\n    createRelation(\n      datasetId: $datasetId\n      doi: $doi\n      description: $description\n      kind: $kind\n      relation: $relation\n    ) {\n      id\n    }\n  }\n":
    types.CreateDatasetRelationDocument,
  "\n  mutation deleteDatasetRelation($datasetId: ID!, $doi: String!) {\n    deleteRelation(datasetId: $datasetId, doi: $doi) {\n      id\n    }\n  }\n":
    types.DeleteDatasetRelationDocument,
  "\n  mutation deleteReviewer($datasetId: ID!, $id: ID!) {\n    deleteReviewer(datasetId: $datasetId, id: $id) {\n      id\n      datasetId\n    }\n  }\n":
    types.DeleteReviewerDocument,
  "\n  mutation deprecateSnapshot($datasetId: ID!, $tag: String!, $reason: String!) {\n    deprecateSnapshot(datasetId: $datasetId, tag: $tag, reason: $reason) {\n      id\n      deprecated {\n        reason\n      }\n    }\n  }\n":
    types.DeprecateSnapshotDocument,
  "\n  mutation followDataset($datasetId: ID!) {\n    followDataset(datasetId: $datasetId) {\n      following\n      newFollower {\n        userId\n      }\n    }\n  }\n":
    types.FollowDatasetDocument,
  "\n  fragment UserFollowing on Dataset {\n    id\n    following\n  }\n":
    types.UserFollowingFragmentDoc,
  "\n  fragment DatasetFollowers on Dataset {\n    id\n    followers {\n      userId\n    }\n  }\n":
    types.DatasetFollowersFragmentDoc,
  "\n  mutation fsckDataset($datasetId: ID!) {\n    fsckDataset(datasetId: $datasetId)\n  }\n":
    types.FsckDatasetDocument,
  "\n  query getHoldDeletion($datasetId: ID!) {\n    dataset(id: $datasetId) {\n      id\n      holdDeletion\n    }\n  }\n":
    types.GetHoldDeletionDocument,
  "\n  mutation holdDeletion($datasetId: ID!, $hold: Boolean!) {\n    holdDeletion(datasetId: $datasetId, hold: $hold)\n  }\n":
    types.HoldDeletionDocument,
  "\n  mutation importRemoteDataset($datasetId: ID!, $url: String!) {\n    importRemoteDataset(datasetId: $datasetId, url: $url)\n  }\n":
    types.ImportRemoteDatasetDocument,
  "\n  mutation removePermissions($datasetId: ID!, $userId: String!) {\n    removePermissions(datasetId: $datasetId, userId: $userId)\n  }\n":
    types.RemovePermissionsDocument,
  "\n  mutation starDataset($datasetId: ID!) {\n    starDataset(datasetId: $datasetId) {\n      starred\n      newStar {\n        userId\n      }\n    }\n  }\n":
    types.StarDatasetDocument,
  "\n  fragment UserStarred on Dataset {\n    id\n    starred\n  }\n":
    types.UserStarredFragmentDoc,
  "\n  fragment DatasetStars on Dataset {\n    id\n    stars {\n      userId\n    }\n  }\n":
    types.DatasetStarsFragmentDoc,
  "\n  mutation undoDeprecateSnapshot($datasetId: ID!, $tag: String!) {\n    undoDeprecateSnapshot(datasetId: $datasetId, tag: $tag) {\n      id\n      deprecated {\n        reason\n      }\n    }\n  }\n":
    types.UndoDeprecateSnapshotDocument,
  "\n  mutation updatePermissions(\n    $datasetId: ID!\n    $userEmail: String!\n    $level: String!\n  ) {\n    updatePermissions(\n      datasetId: $datasetId\n      userEmail: $userEmail\n      level: $level\n    ) {\n      id\n      userPermissions {\n        datasetId\n        userId\n        level\n        user {\n          id\n          email\n          orcid\n          name\n        }\n      }\n    }\n  }\n":
    types.UpdatePermissionsDocument,
  "\n  mutation updateOrcidPermissions(\n    $datasetId: ID!\n    $userOrcid: String!\n    $level: String!\n  ) {\n    updateOrcidPermissions(\n      datasetId: $datasetId\n      userOrcid: $userOrcid\n      level: $level\n    ) {\n      id\n      userPermissions {\n        datasetId\n        userId\n        level\n        user {\n          id\n          email\n          orcid\n          name\n        }\n      }\n    }\n  }\n":
    types.UpdateOrcidPermissionsDocument,
  "\n  query participantCount($modality: String) {\n    participantCount(modality: $modality)\n  }\n":
    types.ParticipantCountDocument,
  "\n  query publicDatasetCount($modality: String) {\n    datasets(filterBy: { public: true }, modality: $modality) {\n      pageInfo {\n        count\n      }\n    }\n  }\n":
    types.PublicDatasetCountDocument,
  "\n  query AdvancedSearch($query: DatasetSearchInput!, $datasetType: String!) {\n    advancedSearch(query: $query, datasetType: $datasetType) {\n      pageInfo {\n        count\n      }\n    }\n  }\n":
    types.AdvancedSearchDocument,
  "\n  mutation subscribeToNewsletter($email: String!) {\n    subscribeToNewsletter(email: $email)\n  }\n":
    types.SubscribeToNewsletterDocument,
  "\n  query top_viewed_datasets {\n    datasets(\n      first: 12\n      orderBy: { views: descending }\n      filterBy: { public: true }\n    ) {\n      edges {\n        node {\n          id\n          analytics {\n            views\n          }\n          latestSnapshot {\n            tag\n            summary {\n              primaryModality\n            }\n            description {\n              Name\n            }\n          }\n        }\n      }\n    }\n  }\n":
    types.Top_Viewed_DatasetsDocument,
  "\n  query recently_published_datasets {\n    datasets(\n      first: 12\n      orderBy: { publishDate: descending }\n      filterBy: { public: true }\n    ) {\n      edges {\n        node {\n          id\n          publishDate\n          latestSnapshot {\n            tag\n            summary {\n              primaryModality\n            }\n            description {\n              Name\n            }\n          }\n        }\n      }\n    }\n  }\n":
    types.Recently_Published_DatasetsDocument,
  "\n  query GetDatasetEvents($datasetId: ID!) {\n    dataset(id: $datasetId) {\n      events {\n        id\n        note\n        success\n        timestamp\n        user {\n          email\n          name\n          orcid\n          id\n        }\n        event {\n          type\n          requestId\n          targetUserId\n          resolutionStatus\n        }\n        hasBeenRespondedTo\n        responseStatus\n      }\n    }\n  }\n":
    types.GetDatasetEventsDocument,
  "\n  mutation SaveAdminNote($datasetId: ID!, $note: String!) {\n    saveAdminNote(datasetId: $datasetId, note: $note) {\n      note\n    }\n  }\n":
    types.SaveAdminNoteDocument,
  "\n  mutation UpdateAdminNote(\n    $note: String!\n    $datasetId: ID!\n    $saveAdminNoteId: ID\n  ) {\n    saveAdminNote(note: $note, datasetId: $datasetId, id: $saveAdminNoteId) {\n      id\n      note\n    }\n  }\n":
    types.UpdateAdminNoteDocument,
  "\n  mutation ProcessContributorRequest(\n    $datasetId: ID!\n    $requestId: ID!\n    $targetUserId: ID!\n    $resolutionStatus: ResponseStatusType!\n    $reason: String\n  ) {\n    processContributorRequest(\n      datasetId: $datasetId\n      requestId: $requestId\n      targetUserId: $targetUserId\n      resolutionStatus: $resolutionStatus\n      reason: $reason\n    ) {\n      id\n      event {\n        type\n        requestId\n        resolutionStatus\n      }\n      note\n    }\n  }\n":
    types.ProcessContributorRequestDocument,
  "\n  mutation UpdateEventStatus($eventId: ID!, $status: NotificationStatusType!) {\n    updateEventStatus(eventId: $eventId, status: $status) {\n      status\n    }\n  }\n":
    types.UpdateEventStatusDocument,
  "\n  mutation CreateContributorRequestEvent($datasetId: ID!) {\n    createContributorRequestEvent(datasetId: $datasetId) {\n      id\n      timestamp\n      event {\n        type\n      }\n      success\n      note\n    }\n  }\n":
    types.CreateContributorRequestEventDocument,
  "\n  query DatasetEvents($datasetId: ID!) {\n    dataset(id: $datasetId) {\n      id\n      events {\n        id\n        timestamp\n        user {\n          id\n          name\n        }\n        event {\n          type\n        }\n        success\n        note\n      }\n    }\n  }\n":
    types.DatasetEventsDocument,
  "\n  mutation CreateContributorCitationEvent(\n    $datasetId: ID!\n    $targetUserId: ID!\n    $contributorData: ContributorInput!\n  ) {\n    createContributorCitationEvent(\n      datasetId: $datasetId\n      targetUserId: $targetUserId\n      contributorData: $contributorData\n    ) {\n      id\n      timestamp\n      success\n      user {\n        id\n        name\n      }\n      event {\n        type\n        resolutionStatus\n        contributorData {\n          name\n          givenName\n          familyName\n          orcid\n          contributorType\n          order\n        }\n      }\n      note\n    }\n  }\n":
    types.CreateContributorCitationEventDocument,
  "\n  mutation ProcessContributorCitation($eventId: ID!, $status: ResponseStatusType!) {\n    processContributorCitation(eventId: $eventId, status: $status) {\n      id\n      timestamp\n      success\n      user {\n        id\n        name\n      }\n      event {\n        type\n        targetUserId\n        contributorData {\n          name\n          givenName\n          familyName\n          orcid\n          contributorType\n          order\n        }\n        resolutionStatus\n      }\n    }\n  }\n":
    types.ProcessContributorCitationDocument,
  "\n  query User($userId: ID!) {\n    user(id: $userId) {\n      id\n      name\n      orcid\n      email\n      avatar\n      location\n      institution\n      links\n      provider\n      admin\n      created\n      lastSeen\n      blocked\n      githubSynced\n      github\n      notifications {\n        id\n        timestamp\n        note\n        success\n        user { \n          id\n          name\n          email\n          orcid\n        }\n        event {\n          type\n          version\n          public\n          level\n          ref\n          message\n          requestId\n          targetUserId\n          reason\n          datasetId\n          resolutionStatus\n          target { \n            id\n            name\n            email\n            orcid\n          }\n          contributorData { \n            name\n            givenName\n            familyName\n            orcid\n            contributorType\n            order\n          }\n        }\n        notificationStatus {\n          status\n        }\n      }\n      orcidConsent\n    }\n  }\n":
    types.UserDocument,
  "\n  mutation updateUser(\n    $id: ID!\n    $location: String\n    $links: [String!]\n    $institution: String\n    $orcidConsent: Boolean \n  ) {\n    updateUser(\n      id: $id\n      location: $location\n      links: $links\n      institution: $institution\n      orcidConsent: $orcidConsent \n    ) {\n      id\n      location\n      links\n      institution\n      orcidConsent\n    }\n  }\n":
    types.UpdateUserDocument,
  "\n  query UserAdvancedSearchDatasets(\n    $query: DatasetSearchInput!\n    $cursor: String\n    $allDatasets: Boolean\n    $datasetStatus: String\n    $first: Int!\n  ) {\n    datasets: advancedSearch(\n      query: $query\n      allDatasets: $allDatasets\n      datasetStatus: $datasetStatus\n      first: $first\n      after: $cursor\n    ) {\n      edges {\n        id\n        node {\n          id\n          created\n          name\n          uploader {\n            id\n            name\n            orcid\n          }\n          public\n          permissions {\n            id\n            userPermissions {\n              userId\n              level\n              access: level\n              user {\n                id\n                name\n                email\n                provider\n              }\n            }\n          }\n          metadata {\n            ages\n          }\n          latestSnapshot {\n            size\n            summary {\n              modalities\n              secondaryModalities\n              sessions\n              subjects\n              subjectMetadata {\n                participantId\n                age\n                sex\n                group\n              }\n              tasks\n              size\n              totalFiles\n              dataProcessed\n              pet {\n                BodyPart\n                ScannerManufacturer\n                ScannerManufacturersModelName\n                TracerName\n                TracerRadionuclide\n              }\n              primaryModality\n            }\n            issues {\n              severity\n            }\n            validation {\n              errors\n              warnings\n            }\n            description {\n              Name\n              Authors\n              DatasetDOI\n            }\n          }\n          analytics {\n            views\n            downloads\n          }\n          stars {\n            userId\n            datasetId\n          }\n          followers {\n            userId\n            datasetId\n          }\n          snapshots {\n            id\n            created\n            tag\n          }\n        }\n      }\n      pageInfo {\n        startCursor\n        endCursor\n        hasPreviousPage\n        hasNextPage\n        count\n      }\n    }\n  }\n":
    types.UserAdvancedSearchDatasetsDocument,
  "\n  fragment userFields on User {\n    id\n    name\n    admin\n    blocked\n    email\n    provider\n    lastSeen\n    created\n    avatar\n    github\n    institution\n    location\n    modified\n    orcid\n  }\n":
    types.UserFieldsFragmentDoc,
  "\n  query GetUsers(\n    $orderBy: [UserSortInput!]\n    $isAdmin: Boolean\n    $isBlocked: Boolean\n    $search: String\n    $limit: Int\n    $offset: Int\n  ) {\n    users(\n      orderBy: $orderBy\n      isAdmin: $isAdmin\n      isBlocked: $isBlocked\n      search: $search\n      limit: $limit\n      offset: $offset\n    ) {\n      users {\n        ...userFields\n      }\n      totalCount\n    }\n  }\n  \n":
    types.GetUsersDocument,
  "\n  mutation SetAdmin($id: ID!, $admin: Boolean!) {\n    setAdmin(id: $id, admin: $admin) {\n      ...userFields\n    }\n  }\n  \n":
    types.SetAdminDocument,
  "\n  mutation SetBlocked($id: ID!, $blocked: Boolean!) {\n    setBlocked(id: $id, blocked: $blocked) {\n      ...userFields\n    }\n  }\n  \n":
    types.SetBlockedDocument,
}

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation UpdateContributors(\n    $datasetId: String!\n    $newContributors: [ContributorInput!]!\n  ) {\n    updateContributors(\n      datasetId: $datasetId\n      newContributors: $newContributors\n    ) {\n      success\n      dataset {\n        id\n        draft {\n          id\n          contributors {\n            name\n            givenName\n            familyName\n            orcid\n            contributorType\n            order\n          }\n          files {\n            id\n            filename\n            size\n            annexed\n            urls\n            directory\n          }\n          modified\n        }\n      }\n    }\n  }\n",
): (typeof documents)[
  "\n  mutation UpdateContributors(\n    $datasetId: String!\n    $newContributors: [ContributorInput!]!\n  ) {\n    updateContributors(\n      datasetId: $datasetId\n      newContributors: $newContributors\n    ) {\n      success\n      dataset {\n        id\n        draft {\n          id\n          contributors {\n            name\n            givenName\n            familyName\n            orcid\n            contributorType\n            order\n          }\n          files {\n            id\n            filename\n            size\n            annexed\n            urls\n            directory\n          }\n          modified\n        }\n      }\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  fragment DatasetReviewers on Dataset {\n    id\n    reviewers {\n      expiration\n      id\n    }\n  }\n",
): (typeof documents)[
  "\n  fragment DatasetReviewers on Dataset {\n    id\n    reviewers {\n      expiration\n      id\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation createReviewer($datasetId: ID!) {\n    createReviewer(datasetId: $datasetId) {\n      id\n      datasetId\n      url\n      expiration\n    }\n  }\n",
): (typeof documents)[
  "\n  mutation createReviewer($datasetId: ID!) {\n    createReviewer(datasetId: $datasetId) {\n      id\n      datasetId\n      url\n      expiration\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  query getDatasetRelations($datasetId: ID!) {\n    dataset(id: $datasetId) {\n      latestSnapshot {\n        tag\n        related {\n          id\n          kind\n          relation\n          description\n        }\n      }\n    }\n  }\n",
): (typeof documents)[
  "\n  query getDatasetRelations($datasetId: ID!) {\n    dataset(id: $datasetId) {\n      latestSnapshot {\n        tag\n        related {\n          id\n          kind\n          relation\n          description\n        }\n      }\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation createDatasetRelation(\n    $datasetId: ID!\n    $doi: String!\n    $description: String!\n    $kind: RelatedObjectKind!\n    $relation: RelatedObjectRelation!\n  ) {\n    createRelation(\n      datasetId: $datasetId\n      doi: $doi\n      description: $description\n      kind: $kind\n      relation: $relation\n    ) {\n      id\n    }\n  }\n",
): (typeof documents)[
  "\n  mutation createDatasetRelation(\n    $datasetId: ID!\n    $doi: String!\n    $description: String!\n    $kind: RelatedObjectKind!\n    $relation: RelatedObjectRelation!\n  ) {\n    createRelation(\n      datasetId: $datasetId\n      doi: $doi\n      description: $description\n      kind: $kind\n      relation: $relation\n    ) {\n      id\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation deleteDatasetRelation($datasetId: ID!, $doi: String!) {\n    deleteRelation(datasetId: $datasetId, doi: $doi) {\n      id\n    }\n  }\n",
): (typeof documents)[
  "\n  mutation deleteDatasetRelation($datasetId: ID!, $doi: String!) {\n    deleteRelation(datasetId: $datasetId, doi: $doi) {\n      id\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation deleteReviewer($datasetId: ID!, $id: ID!) {\n    deleteReviewer(datasetId: $datasetId, id: $id) {\n      id\n      datasetId\n    }\n  }\n",
): (typeof documents)[
  "\n  mutation deleteReviewer($datasetId: ID!, $id: ID!) {\n    deleteReviewer(datasetId: $datasetId, id: $id) {\n      id\n      datasetId\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation deprecateSnapshot($datasetId: ID!, $tag: String!, $reason: String!) {\n    deprecateSnapshot(datasetId: $datasetId, tag: $tag, reason: $reason) {\n      id\n      deprecated {\n        reason\n      }\n    }\n  }\n",
): (typeof documents)[
  "\n  mutation deprecateSnapshot($datasetId: ID!, $tag: String!, $reason: String!) {\n    deprecateSnapshot(datasetId: $datasetId, tag: $tag, reason: $reason) {\n      id\n      deprecated {\n        reason\n      }\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation followDataset($datasetId: ID!) {\n    followDataset(datasetId: $datasetId) {\n      following\n      newFollower {\n        userId\n      }\n    }\n  }\n",
): (typeof documents)[
  "\n  mutation followDataset($datasetId: ID!) {\n    followDataset(datasetId: $datasetId) {\n      following\n      newFollower {\n        userId\n      }\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  fragment UserFollowing on Dataset {\n    id\n    following\n  }\n",
): (typeof documents)[
  "\n  fragment UserFollowing on Dataset {\n    id\n    following\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  fragment DatasetFollowers on Dataset {\n    id\n    followers {\n      userId\n    }\n  }\n",
): (typeof documents)[
  "\n  fragment DatasetFollowers on Dataset {\n    id\n    followers {\n      userId\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation fsckDataset($datasetId: ID!) {\n    fsckDataset(datasetId: $datasetId)\n  }\n",
): (typeof documents)[
  "\n  mutation fsckDataset($datasetId: ID!) {\n    fsckDataset(datasetId: $datasetId)\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  query getHoldDeletion($datasetId: ID!) {\n    dataset(id: $datasetId) {\n      id\n      holdDeletion\n    }\n  }\n",
): (typeof documents)[
  "\n  query getHoldDeletion($datasetId: ID!) {\n    dataset(id: $datasetId) {\n      id\n      holdDeletion\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation holdDeletion($datasetId: ID!, $hold: Boolean!) {\n    holdDeletion(datasetId: $datasetId, hold: $hold)\n  }\n",
): (typeof documents)[
  "\n  mutation holdDeletion($datasetId: ID!, $hold: Boolean!) {\n    holdDeletion(datasetId: $datasetId, hold: $hold)\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation importRemoteDataset($datasetId: ID!, $url: String!) {\n    importRemoteDataset(datasetId: $datasetId, url: $url)\n  }\n",
): (typeof documents)[
  "\n  mutation importRemoteDataset($datasetId: ID!, $url: String!) {\n    importRemoteDataset(datasetId: $datasetId, url: $url)\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation removePermissions($datasetId: ID!, $userId: String!) {\n    removePermissions(datasetId: $datasetId, userId: $userId)\n  }\n",
): (typeof documents)[
  "\n  mutation removePermissions($datasetId: ID!, $userId: String!) {\n    removePermissions(datasetId: $datasetId, userId: $userId)\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation starDataset($datasetId: ID!) {\n    starDataset(datasetId: $datasetId) {\n      starred\n      newStar {\n        userId\n      }\n    }\n  }\n",
): (typeof documents)[
  "\n  mutation starDataset($datasetId: ID!) {\n    starDataset(datasetId: $datasetId) {\n      starred\n      newStar {\n        userId\n      }\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment UserStarred on Dataset {\n    id\n    starred\n  }\n",
): (typeof documents)[
  "\n  fragment UserStarred on Dataset {\n    id\n    starred\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  fragment DatasetStars on Dataset {\n    id\n    stars {\n      userId\n    }\n  }\n",
): (typeof documents)[
  "\n  fragment DatasetStars on Dataset {\n    id\n    stars {\n      userId\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation undoDeprecateSnapshot($datasetId: ID!, $tag: String!) {\n    undoDeprecateSnapshot(datasetId: $datasetId, tag: $tag) {\n      id\n      deprecated {\n        reason\n      }\n    }\n  }\n",
): (typeof documents)[
  "\n  mutation undoDeprecateSnapshot($datasetId: ID!, $tag: String!) {\n    undoDeprecateSnapshot(datasetId: $datasetId, tag: $tag) {\n      id\n      deprecated {\n        reason\n      }\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation updatePermissions(\n    $datasetId: ID!\n    $userEmail: String!\n    $level: String!\n  ) {\n    updatePermissions(\n      datasetId: $datasetId\n      userEmail: $userEmail\n      level: $level\n    ) {\n      id\n      userPermissions {\n        datasetId\n        userId\n        level\n        user {\n          id\n          email\n          orcid\n          name\n        }\n      }\n    }\n  }\n",
): (typeof documents)[
  "\n  mutation updatePermissions(\n    $datasetId: ID!\n    $userEmail: String!\n    $level: String!\n  ) {\n    updatePermissions(\n      datasetId: $datasetId\n      userEmail: $userEmail\n      level: $level\n    ) {\n      id\n      userPermissions {\n        datasetId\n        userId\n        level\n        user {\n          id\n          email\n          orcid\n          name\n        }\n      }\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation updateOrcidPermissions(\n    $datasetId: ID!\n    $userOrcid: String!\n    $level: String!\n  ) {\n    updateOrcidPermissions(\n      datasetId: $datasetId\n      userOrcid: $userOrcid\n      level: $level\n    ) {\n      id\n      userPermissions {\n        datasetId\n        userId\n        level\n        user {\n          id\n          email\n          orcid\n          name\n        }\n      }\n    }\n  }\n",
): (typeof documents)[
  "\n  mutation updateOrcidPermissions(\n    $datasetId: ID!\n    $userOrcid: String!\n    $level: String!\n  ) {\n    updateOrcidPermissions(\n      datasetId: $datasetId\n      userOrcid: $userOrcid\n      level: $level\n    ) {\n      id\n      userPermissions {\n        datasetId\n        userId\n        level\n        user {\n          id\n          email\n          orcid\n          name\n        }\n      }\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  query participantCount($modality: String) {\n    participantCount(modality: $modality)\n  }\n",
): (typeof documents)[
  "\n  query participantCount($modality: String) {\n    participantCount(modality: $modality)\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  query publicDatasetCount($modality: String) {\n    datasets(filterBy: { public: true }, modality: $modality) {\n      pageInfo {\n        count\n      }\n    }\n  }\n",
): (typeof documents)[
  "\n  query publicDatasetCount($modality: String) {\n    datasets(filterBy: { public: true }, modality: $modality) {\n      pageInfo {\n        count\n      }\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  query AdvancedSearch($query: DatasetSearchInput!, $datasetType: String!) {\n    advancedSearch(query: $query, datasetType: $datasetType) {\n      pageInfo {\n        count\n      }\n    }\n  }\n",
): (typeof documents)[
  "\n  query AdvancedSearch($query: DatasetSearchInput!, $datasetType: String!) {\n    advancedSearch(query: $query, datasetType: $datasetType) {\n      pageInfo {\n        count\n      }\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation subscribeToNewsletter($email: String!) {\n    subscribeToNewsletter(email: $email)\n  }\n",
): (typeof documents)[
  "\n  mutation subscribeToNewsletter($email: String!) {\n    subscribeToNewsletter(email: $email)\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  query top_viewed_datasets {\n    datasets(\n      first: 12\n      orderBy: { views: descending }\n      filterBy: { public: true }\n    ) {\n      edges {\n        node {\n          id\n          analytics {\n            views\n          }\n          latestSnapshot {\n            tag\n            summary {\n              primaryModality\n            }\n            description {\n              Name\n            }\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)[
  "\n  query top_viewed_datasets {\n    datasets(\n      first: 12\n      orderBy: { views: descending }\n      filterBy: { public: true }\n    ) {\n      edges {\n        node {\n          id\n          analytics {\n            views\n          }\n          latestSnapshot {\n            tag\n            summary {\n              primaryModality\n            }\n            description {\n              Name\n            }\n          }\n        }\n      }\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  query recently_published_datasets {\n    datasets(\n      first: 12\n      orderBy: { publishDate: descending }\n      filterBy: { public: true }\n    ) {\n      edges {\n        node {\n          id\n          publishDate\n          latestSnapshot {\n            tag\n            summary {\n              primaryModality\n            }\n            description {\n              Name\n            }\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)[
  "\n  query recently_published_datasets {\n    datasets(\n      first: 12\n      orderBy: { publishDate: descending }\n      filterBy: { public: true }\n    ) {\n      edges {\n        node {\n          id\n          publishDate\n          latestSnapshot {\n            tag\n            summary {\n              primaryModality\n            }\n            description {\n              Name\n            }\n          }\n        }\n      }\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  query GetDatasetEvents($datasetId: ID!) {\n    dataset(id: $datasetId) {\n      events {\n        id\n        note\n        success\n        timestamp\n        user {\n          email\n          name\n          orcid\n          id\n        }\n        event {\n          type\n          requestId\n          targetUserId\n          resolutionStatus\n        }\n        hasBeenRespondedTo\n        responseStatus\n      }\n    }\n  }\n",
): (typeof documents)[
  "\n  query GetDatasetEvents($datasetId: ID!) {\n    dataset(id: $datasetId) {\n      events {\n        id\n        note\n        success\n        timestamp\n        user {\n          email\n          name\n          orcid\n          id\n        }\n        event {\n          type\n          requestId\n          targetUserId\n          resolutionStatus\n        }\n        hasBeenRespondedTo\n        responseStatus\n      }\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation SaveAdminNote($datasetId: ID!, $note: String!) {\n    saveAdminNote(datasetId: $datasetId, note: $note) {\n      note\n    }\n  }\n",
): (typeof documents)[
  "\n  mutation SaveAdminNote($datasetId: ID!, $note: String!) {\n    saveAdminNote(datasetId: $datasetId, note: $note) {\n      note\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation UpdateAdminNote(\n    $note: String!\n    $datasetId: ID!\n    $saveAdminNoteId: ID\n  ) {\n    saveAdminNote(note: $note, datasetId: $datasetId, id: $saveAdminNoteId) {\n      id\n      note\n    }\n  }\n",
): (typeof documents)[
  "\n  mutation UpdateAdminNote(\n    $note: String!\n    $datasetId: ID!\n    $saveAdminNoteId: ID\n  ) {\n    saveAdminNote(note: $note, datasetId: $datasetId, id: $saveAdminNoteId) {\n      id\n      note\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation ProcessContributorRequest(\n    $datasetId: ID!\n    $requestId: ID!\n    $targetUserId: ID!\n    $resolutionStatus: ResponseStatusType!\n    $reason: String\n  ) {\n    processContributorRequest(\n      datasetId: $datasetId\n      requestId: $requestId\n      targetUserId: $targetUserId\n      resolutionStatus: $resolutionStatus\n      reason: $reason\n    ) {\n      id\n      event {\n        type\n        requestId\n        resolutionStatus\n      }\n      note\n    }\n  }\n",
): (typeof documents)[
  "\n  mutation ProcessContributorRequest(\n    $datasetId: ID!\n    $requestId: ID!\n    $targetUserId: ID!\n    $resolutionStatus: ResponseStatusType!\n    $reason: String\n  ) {\n    processContributorRequest(\n      datasetId: $datasetId\n      requestId: $requestId\n      targetUserId: $targetUserId\n      resolutionStatus: $resolutionStatus\n      reason: $reason\n    ) {\n      id\n      event {\n        type\n        requestId\n        resolutionStatus\n      }\n      note\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation UpdateEventStatus($eventId: ID!, $status: NotificationStatusType!) {\n    updateEventStatus(eventId: $eventId, status: $status) {\n      status\n    }\n  }\n",
): (typeof documents)[
  "\n  mutation UpdateEventStatus($eventId: ID!, $status: NotificationStatusType!) {\n    updateEventStatus(eventId: $eventId, status: $status) {\n      status\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation CreateContributorRequestEvent($datasetId: ID!) {\n    createContributorRequestEvent(datasetId: $datasetId) {\n      id\n      timestamp\n      event {\n        type\n      }\n      success\n      note\n    }\n  }\n",
): (typeof documents)[
  "\n  mutation CreateContributorRequestEvent($datasetId: ID!) {\n    createContributorRequestEvent(datasetId: $datasetId) {\n      id\n      timestamp\n      event {\n        type\n      }\n      success\n      note\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  query DatasetEvents($datasetId: ID!) {\n    dataset(id: $datasetId) {\n      id\n      events {\n        id\n        timestamp\n        user {\n          id\n          name\n        }\n        event {\n          type\n        }\n        success\n        note\n      }\n    }\n  }\n",
): (typeof documents)[
  "\n  query DatasetEvents($datasetId: ID!) {\n    dataset(id: $datasetId) {\n      id\n      events {\n        id\n        timestamp\n        user {\n          id\n          name\n        }\n        event {\n          type\n        }\n        success\n        note\n      }\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation CreateContributorCitationEvent(\n    $datasetId: ID!\n    $targetUserId: ID!\n    $contributorData: ContributorInput!\n  ) {\n    createContributorCitationEvent(\n      datasetId: $datasetId\n      targetUserId: $targetUserId\n      contributorData: $contributorData\n    ) {\n      id\n      timestamp\n      success\n      user {\n        id\n        name\n      }\n      event {\n        type\n        resolutionStatus\n        contributorData {\n          name\n          givenName\n          familyName\n          orcid\n          contributorType\n          order\n        }\n      }\n      note\n    }\n  }\n",
): (typeof documents)[
  "\n  mutation CreateContributorCitationEvent(\n    $datasetId: ID!\n    $targetUserId: ID!\n    $contributorData: ContributorInput!\n  ) {\n    createContributorCitationEvent(\n      datasetId: $datasetId\n      targetUserId: $targetUserId\n      contributorData: $contributorData\n    ) {\n      id\n      timestamp\n      success\n      user {\n        id\n        name\n      }\n      event {\n        type\n        resolutionStatus\n        contributorData {\n          name\n          givenName\n          familyName\n          orcid\n          contributorType\n          order\n        }\n      }\n      note\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation ProcessContributorCitation($eventId: ID!, $status: ResponseStatusType!) {\n    processContributorCitation(eventId: $eventId, status: $status) {\n      id\n      timestamp\n      success\n      user {\n        id\n        name\n      }\n      event {\n        type\n        targetUserId\n        contributorData {\n          name\n          givenName\n          familyName\n          orcid\n          contributorType\n          order\n        }\n        resolutionStatus\n      }\n    }\n  }\n",
): (typeof documents)[
  "\n  mutation ProcessContributorCitation($eventId: ID!, $status: ResponseStatusType!) {\n    processContributorCitation(eventId: $eventId, status: $status) {\n      id\n      timestamp\n      success\n      user {\n        id\n        name\n      }\n      event {\n        type\n        targetUserId\n        contributorData {\n          name\n          givenName\n          familyName\n          orcid\n          contributorType\n          order\n        }\n        resolutionStatus\n      }\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  query User($userId: ID!) {\n    user(id: $userId) {\n      id\n      name\n      orcid\n      email\n      avatar\n      location\n      institution\n      links\n      provider\n      admin\n      created\n      lastSeen\n      blocked\n      githubSynced\n      github\n      notifications {\n        id\n        timestamp\n        note\n        success\n        user { \n          id\n          name\n          email\n          orcid\n        }\n        event {\n          type\n          version\n          public\n          level\n          ref\n          message\n          requestId\n          targetUserId\n          reason\n          datasetId\n          resolutionStatus\n          target { \n            id\n            name\n            email\n            orcid\n          }\n          contributorData { \n            name\n            givenName\n            familyName\n            orcid\n            contributorType\n            order\n          }\n        }\n        notificationStatus {\n          status\n        }\n      }\n      orcidConsent\n    }\n  }\n",
): (typeof documents)[
  "\n  query User($userId: ID!) {\n    user(id: $userId) {\n      id\n      name\n      orcid\n      email\n      avatar\n      location\n      institution\n      links\n      provider\n      admin\n      created\n      lastSeen\n      blocked\n      githubSynced\n      github\n      notifications {\n        id\n        timestamp\n        note\n        success\n        user { \n          id\n          name\n          email\n          orcid\n        }\n        event {\n          type\n          version\n          public\n          level\n          ref\n          message\n          requestId\n          targetUserId\n          reason\n          datasetId\n          resolutionStatus\n          target { \n            id\n            name\n            email\n            orcid\n          }\n          contributorData { \n            name\n            givenName\n            familyName\n            orcid\n            contributorType\n            order\n          }\n        }\n        notificationStatus {\n          status\n        }\n      }\n      orcidConsent\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation updateUser(\n    $id: ID!\n    $location: String\n    $links: [String!]\n    $institution: String\n    $orcidConsent: Boolean \n  ) {\n    updateUser(\n      id: $id\n      location: $location\n      links: $links\n      institution: $institution\n      orcidConsent: $orcidConsent \n    ) {\n      id\n      location\n      links\n      institution\n      orcidConsent\n    }\n  }\n",
): (typeof documents)[
  "\n  mutation updateUser(\n    $id: ID!\n    $location: String\n    $links: [String!]\n    $institution: String\n    $orcidConsent: Boolean \n  ) {\n    updateUser(\n      id: $id\n      location: $location\n      links: $links\n      institution: $institution\n      orcidConsent: $orcidConsent \n    ) {\n      id\n      location\n      links\n      institution\n      orcidConsent\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  query UserAdvancedSearchDatasets(\n    $query: DatasetSearchInput!\n    $cursor: String\n    $allDatasets: Boolean\n    $datasetStatus: String\n    $first: Int!\n  ) {\n    datasets: advancedSearch(\n      query: $query\n      allDatasets: $allDatasets\n      datasetStatus: $datasetStatus\n      first: $first\n      after: $cursor\n    ) {\n      edges {\n        id\n        node {\n          id\n          created\n          name\n          uploader {\n            id\n            name\n            orcid\n          }\n          public\n          permissions {\n            id\n            userPermissions {\n              userId\n              level\n              access: level\n              user {\n                id\n                name\n                email\n                provider\n              }\n            }\n          }\n          metadata {\n            ages\n          }\n          latestSnapshot {\n            size\n            summary {\n              modalities\n              secondaryModalities\n              sessions\n              subjects\n              subjectMetadata {\n                participantId\n                age\n                sex\n                group\n              }\n              tasks\n              size\n              totalFiles\n              dataProcessed\n              pet {\n                BodyPart\n                ScannerManufacturer\n                ScannerManufacturersModelName\n                TracerName\n                TracerRadionuclide\n              }\n              primaryModality\n            }\n            issues {\n              severity\n            }\n            validation {\n              errors\n              warnings\n            }\n            description {\n              Name\n              Authors\n              DatasetDOI\n            }\n          }\n          analytics {\n            views\n            downloads\n          }\n          stars {\n            userId\n            datasetId\n          }\n          followers {\n            userId\n            datasetId\n          }\n          snapshots {\n            id\n            created\n            tag\n          }\n        }\n      }\n      pageInfo {\n        startCursor\n        endCursor\n        hasPreviousPage\n        hasNextPage\n        count\n      }\n    }\n  }\n",
): (typeof documents)[
  "\n  query UserAdvancedSearchDatasets(\n    $query: DatasetSearchInput!\n    $cursor: String\n    $allDatasets: Boolean\n    $datasetStatus: String\n    $first: Int!\n  ) {\n    datasets: advancedSearch(\n      query: $query\n      allDatasets: $allDatasets\n      datasetStatus: $datasetStatus\n      first: $first\n      after: $cursor\n    ) {\n      edges {\n        id\n        node {\n          id\n          created\n          name\n          uploader {\n            id\n            name\n            orcid\n          }\n          public\n          permissions {\n            id\n            userPermissions {\n              userId\n              level\n              access: level\n              user {\n                id\n                name\n                email\n                provider\n              }\n            }\n          }\n          metadata {\n            ages\n          }\n          latestSnapshot {\n            size\n            summary {\n              modalities\n              secondaryModalities\n              sessions\n              subjects\n              subjectMetadata {\n                participantId\n                age\n                sex\n                group\n              }\n              tasks\n              size\n              totalFiles\n              dataProcessed\n              pet {\n                BodyPart\n                ScannerManufacturer\n                ScannerManufacturersModelName\n                TracerName\n                TracerRadionuclide\n              }\n              primaryModality\n            }\n            issues {\n              severity\n            }\n            validation {\n              errors\n              warnings\n            }\n            description {\n              Name\n              Authors\n              DatasetDOI\n            }\n          }\n          analytics {\n            views\n            downloads\n          }\n          stars {\n            userId\n            datasetId\n          }\n          followers {\n            userId\n            datasetId\n          }\n          snapshots {\n            id\n            created\n            tag\n          }\n        }\n      }\n      pageInfo {\n        startCursor\n        endCursor\n        hasPreviousPage\n        hasNextPage\n        count\n      }\n    }\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  fragment userFields on User {\n    id\n    name\n    admin\n    blocked\n    email\n    provider\n    lastSeen\n    created\n    avatar\n    github\n    institution\n    location\n    modified\n    orcid\n  }\n",
): (typeof documents)[
  "\n  fragment userFields on User {\n    id\n    name\n    admin\n    blocked\n    email\n    provider\n    lastSeen\n    created\n    avatar\n    github\n    institution\n    location\n    modified\n    orcid\n  }\n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  query GetUsers(\n    $orderBy: [UserSortInput!]\n    $isAdmin: Boolean\n    $isBlocked: Boolean\n    $search: String\n    $limit: Int\n    $offset: Int\n  ) {\n    users(\n      orderBy: $orderBy\n      isAdmin: $isAdmin\n      isBlocked: $isBlocked\n      search: $search\n      limit: $limit\n      offset: $offset\n    ) {\n      users {\n        ...userFields\n      }\n      totalCount\n    }\n  }\n  \n",
): (typeof documents)[
  "\n  query GetUsers(\n    $orderBy: [UserSortInput!]\n    $isAdmin: Boolean\n    $isBlocked: Boolean\n    $search: String\n    $limit: Int\n    $offset: Int\n  ) {\n    users(\n      orderBy: $orderBy\n      isAdmin: $isAdmin\n      isBlocked: $isBlocked\n      search: $search\n      limit: $limit\n      offset: $offset\n    ) {\n      users {\n        ...userFields\n      }\n      totalCount\n    }\n  }\n  \n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation SetAdmin($id: ID!, $admin: Boolean!) {\n    setAdmin(id: $id, admin: $admin) {\n      ...userFields\n    }\n  }\n  \n",
): (typeof documents)[
  "\n  mutation SetAdmin($id: ID!, $admin: Boolean!) {\n    setAdmin(id: $id, admin: $admin) {\n      ...userFields\n    }\n  }\n  \n"
]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source:
    "\n  mutation SetBlocked($id: ID!, $blocked: Boolean!) {\n    setBlocked(id: $id, blocked: $blocked) {\n      ...userFields\n    }\n  }\n  \n",
): (typeof documents)[
  "\n  mutation SetBlocked($id: ID!, $blocked: Boolean!) {\n    setBlocked(id: $id, blocked: $blocked) {\n      ...userFields\n    }\n  }\n  \n"
]

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
