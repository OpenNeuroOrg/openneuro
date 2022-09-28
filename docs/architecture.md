---
name: Architecture
route: architecture
---

# Architecture

This guide covers the software architecture of the OpenNeuro platform. It is meant as an introduction for new developers working on the platform or interested contributors wanting to gain a better understanding of advanced use cases with the tools provided.

OpenNeuro is built around a GraphQL API gateway and microservices architecture. There are a small number of backend services and only one API fronting them. The @openneuro/server npm package implements the GraphQL API using [Apollo Server](https://www.apollographql.com/docs/apollo-server/). This API core is written in JavaScript and TypeScript and is responsible for providing platform wide services such as authentication, persistent metadata, and aggregation of other services. All public APIs are provided by this gateway.

[DataLad](https://www.datalad.org/) and [git-annex](https://git-annex.branchable.com/) are the foundation for version control of datasets and are accessed via a Python service named datalad-service. This service has exclusive filesystem level access to datasets and handles read and write requests from the other services.

@openneuro/indexer implements an elasticsearch crawler for periodic indexing of datasets and external resources.

@openneuro/app is a ReactJS frontend that provides the user facing web interface to OpenNeuro. This is built around [Apollo Client](https://www.apollographql.com/docs/react/) for API access and state management.

@openneuro/cli is a command line interface that provides higher level features for command line automation or use cases such as downloading datasets for processing on HPC resources.

@openneuro/ssr provides server side rendering of @openneuro/app.

## API Gateway

The @openneuro/server package itself is stateless but accesses several stateful backend services. datalad-service for dataset content, MongoDB for models, and ElasticSearch for indexed information. Ephemeral caching is kept in Redis. This is implemented as an [Express](https://expressjs.com/) server running [Apollo Server](https://www.apollographql.com/docs/apollo-server/) middleware for most actions. OpenNeuro 1.0 used RESTful Express endpoints without Apollo and some API features are still implemented outside of the Apollo reducer tree for this reason.

### Databases

MongoDB provides an efficient geodistributed persistent key value store that is used to coordinate instances of @openneuro/server. This provides quick access to metadata records and aggregations even when the raw dataset content is not local to the API. The server implements database collections with the [Mongoose library](https://mongoosejs.com/). MongoDB is used when the record must persist, requires atomic access, and does not belong within a dataset.

Redis is used to provide ephemeral caching. Any data stored in Redis may be lost at any time as Redis caches are routinely dropped during updates or autoscaling changes. Use Redis when profiling has shown an opportunity for time/memory tradeoffs and the Apollo Server cache is not sufficiently granular (such as multiple resolvers sharing an expensive aggregation).

datalad-service and git-annex can also be thought of as a content-addressible database for file records and more detail is provided below.

### Authentication

Authentication follows the RESTFul OAuth model and abstracts authentication from the GraphQL resolver implementation. Resolvers receive user information as context. Authorization is handled by resolvers, in most cases gated by the dataset being accessed. The permission model is dataset wide, with users having administrator, editor, or read-only access to a dataset and all revisions of it.

Authentication tokens are a JWT containing a copy of the user record or a scope and extensions related to that scope. These tokens are provided to the API as either a cookie named accessToken or an authorization bearer token header. Cookies are preferred for browser clients and bearer tokens for programmic clients.

User records are created when a user initially authenticates via any supported OAuth provider. OpenNeuro assigns a user UUID and maps this to the original provider identifier. Providers must expose a preferred name and email field but may expose any additional metadata that is required to link or renew provider authorization. If provider authorization is valid, OpenNeuro generates a new JWT.

### GraphQL Server

With few exceptions, functionality is implemented as GraphQL queries and mutation resolvers. Websockets are used for pushing updates to subscribed clients on changes or after long running operations. Long running operations should return some initial state and either update clients with a subscription when complete or defer results until the next client request.

## DataLad Service

This [Falcon](https://falconframework.org/) HTTP backend service provides OpenNeuro functionality on top of DataLad and git-annex. It is responsible for creating repositories, modifying them, generating tags, running BIDS-validator on dataset file trees, exporting datasets to external resources such as S3, and allowing git protocol access to datasets. It is specifically not responsible for authorization, indexing, or aggregation of datasets, this is handled by other services.

Each dataset consists of a working tree git repo. HTTP requests are made to perform operations on a dataset. No caching is done at this level, if caching is required it is the responsibility of the GraphQL API. In some cases, memoization is done to prevent duplicate operations from interfering with long running tasks (exports or validation). POSIX locking is used to prevent conflicting git operations.

Even though OpenNeuro now allows direct git access, we use working tree checkouts instead of bare repos to allow for BIDS-validator operate as normal on a dataset.

Authorization is the responsibility of other services but user information is provided to annotate commit messages and associate results with the original user when data is sent back to another service.

### Git Annex as a database

Key to how OpenNeuro works with files is understanding the git and git-annex data model. In git, each file is hashed and kept on disk as an object referenced by that hash. A version or commit consists of a tree of those hashes. Git-annex extends this concept to large files by keeping storing the file hash as the content instead of the actual contents and coordinating this extra level of indirection on a special branch (named git-annex). The special branch does not share history with the content branches of the repo. Think of it as another repo that is bundled together.

To retrieve information about a given tree (one commit within a dataset), we prefer to access this information by the hashed tree object. This provides stable results regardless of working tree state and avoids the high cost of file access across in many cases due to git's own optimization of packed content-hashes.

Annexed objects can be treated as regular git objects in many cases but if the actual contents are required, we use the annex key to access the file independent of the working tree.

Uploads create a temporary directory keyed by a hash of the array of files that will be modified. This way the hash is stable across similar uploads but unique otherwise. A similar upload is usually the same source tree upload being reattempted due to the original upload being interrupted. Once an upload is completed, the client makes a request to complete it which atomically adds the changes as a new commit to the dataset and removes the temporary tree.

## Clients

The @openneuro/client npm package is provided to share common client implementations between different OpenNeuro API clients. The React app and CLI clients both use this to setup Apollo client and share some queries and mutations.

### React

The React frontend @openneuro/app package implements the majority of the web UI for OpenNeuro. A @openneuro/components library package provides generic reusable components as a foundation for this case or embedding in other React projects using OpenNeuro data.

The state management model used treats the Apollo Client cache as the client side state. Queries and mutations are expected to provide id keyed responses that allow for automatic cache updates as needed or implement their own cache updates. A general principal to follow is a given page route should aim for one primary request sufficient for getting the page to first contentful paint. Secondary queries should provide their own loading states and not block layout whenever possible.
