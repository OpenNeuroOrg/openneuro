# OpenNeuro Kubernetes Deployment

This chart is used to deploy a copy of OpenNeuro and all required services except for MongoDB.

Written for Helm 3.0.0 or later

## Major components

* API deployment - GraphQL service (openneuro-server npm package)
* DataLad service deployment - Falcon server for microservice operations on datasets
* Dataset worker - Celery workers responsible for read and write operations on datasets
* Web deployment - static resources including the React application