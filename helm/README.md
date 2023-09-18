---
name: Kubernetes Deployment
---

# OpenNeuro Kubernetes Deployment

This chart is used to deploy a copy of OpenNeuro and all required services excluding MongoDB, and ElasticSearch.

On GCP, this chart is designed to support GKE with Autopilot for deployment. Only worker disks and cluster creation are configured outside of this chart.

Written for Helm 3.0.0 or later

## Major components

- API deployment - GraphQL service (@openneuro/server npm package)
- DataLad service deployment - Falcon server for microservice operations on datasets
- Web deployment - Nginx serving static resources including the React application (@openneuro/app npm package)

## Pre-requisites

Install [Helm](https://helm.sh/), [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/), and [gcloud](https://cloud.google.com/sdk/docs/install).

Helm manages configuration templates. Kubectl makes API calls to Kubernetes on your behalf. gcloud is used to create and authenticate with the cluster.

## Cluster Setup

### gcloud setup

Set the default project to use for gcloud commands.

```bash
gcloud config set project hs-openneuro
```

To authenticate and setup cluster access for an existing cluster.

```bash
# Authenticate with GCP account
gcloud auth login
# List clusters available
gcloud container clusters list
# Setup credentials for an existing cluster
gcloud container clusters get-credentials openneuro-staging
```

### Create a cluster

```bash
gcloud container clusters create-auto openneuro-dev --region=us-west1
```

This will configure the cluster and setup credentials and command context for later kubectl and helm commands. This requires IAM permissions for Kubernetes Engine.

OpenNeuro runs with autopilot which automatically allocates node resources as requested by the container requests: field.

### Storage setup

pd-standard is balanced performance using SSDs. This provides sufficient git operation performance for interactive use of multiple datasets sharing one worker.

```bash
gcloud compute disks create openneuro-staging-datasets-0 --zone us-west1-b --size 256Gi --type pd-standard
```

### Configuration

This chart is GCP specific at the moment due to mainly the disk configuration and load balancer ingress setup, minimal changes are required to run in other Kubernetes environments, mainly overriding the ingress and allocating moderately performant disks for the dataset worker containers.

To get started create a `values.yaml` and `secrets.yaml` file. In values.yaml you will override any chart settings necessary for your target environment. For a minimal dev environment it may look like this:

```yaml
hostname: my.dev.site.domain
url: https://my.dev.site.domain
environment: any-unique-string
googleTrackingIds: ''
workerDiskSize:
  - id: projects/my-dev-project/zones/us-west1-b/disks/openneuro-dev-datasets-0
    size: 256Gi
```

`secrets.yaml` contains any privileged configuration, like database connection strings or oauth secrets. Start with [secrets.yaml.example](secrets.yaml.example) and fill in each value. Most values are required, but you only need one authentication provider and mail, doi, and flower configuration is optional.

### Installing

Installing a chart deploys it to a cluster. This creates an initial release by generating the configuration templates and applying them to the cluster.

```bash
# Add an ssh key for GitHub remotes
kubectl create secret generic openneuro-my-dev-ssh-key --from-file=datalad-key=datalad-key
```

```bash
# Make sure you're in the helm directory and run
helm install -f values.yaml -f secrets.yaml openneuro-my-dev openneuro/
```

If things went well you'll see:

```
NAME: openneuro-my-dev
LAST DEPLOYED: 2019-06-03 12:15:12.514301172 -0700 PDT m=+0.581209308
NAMESPACE: default
STATUS: deployed
```

### Upgrading

To apply changes, specify the same configuration files. This will automatically upgrade the running containers to match the new template values.

```bash
helm upgrade -f values.yaml -f secrets.yaml openneuro-my-dev openneuro/
```

### Uninstalling

To remove all deployed resources for a release, you can delete the release.

```bash
helm delete openneuro-my-dev
```

## Kubernetes quickstart glossary

A few key Kubernetes terms are important to understand to setup or modify the site deployment.

### Workloads

Containers run in groups called **Pods** and these share resources on one **Node**. Nodes are EC2 instances that are automatically managed by EKS and Kubernetes. A **Deployment** is a declarative state defining which pods should exist and how many. A **StatefulSet** is a special kind of Deployment where pods are created with incremental ids and state is maintained across restarts.

### Services

A **Service** provides a mechanism to route TCP or HTTP traffic to pods or other resources within the cluster. This allows containers running on one node to abstract the details of how to communicate with containers running on another node.

An **Ingress** is similar but governs routing from outside the cluster to a service.

### Configuration

Two types of configuration exist **ConfigMaps** and **Secrets**. The only difference is that secrets are encrypted at rest and are useful for storing sensitive data suck as API keys, while ConfigMaps are stored plaintext and don't require any extra encryption or encoding step to work with.

### Storage

**Persistent Volume Claims** describe what disk resources a pod requires. For example, a pod can request a 10GB SSD disk and this is a claim. Depending on the underlying storage resource this may be automatically provisioned and assigned to the pod. For portable resources like an EBS volume, this means the volume is mounted onto the correct node.

### Helm

Helm templates are grouped into Charts. You install a chart on a cluster to create a release. Releases contain the state for a deployment at a given revision and you can create new releases with `helm upgrade` or revert to a prior release with `helm rollback`.
