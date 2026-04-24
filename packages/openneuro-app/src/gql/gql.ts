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
