# OpenNeuro Kubernetes Deployment

This chart is used to deploy a copy of OpenNeuro and all required services except for MongoDB.

Written for Helm 3.0.0 or later

## Major components

* API deployment - GraphQL service (openneuro-server npm package)
* DataLad service deployment - Falcon server for microservice operations on datasets
* Dataset worker - Celery workers responsible for read and write operations on datasets
* Web deployment - static resources including the React application (openneuro-app npm package)

## Pre-requisites

Install [Helm](https://helm.sh/), [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/), and (optionally) [eksctl](https://eksctl.io/).

Helm manages configuration templates. Kubectl makes API calls to Kubernetes on your behalf. eksctl configures AWS specific EKS resources to simplify control plane setup and is most useful when creating a new cluster or changing node groups.

## Cluster Setup

### Create a cluster on AWS

```bash
eksctl create cluster --name=my-cluster-name --nodes=3 --instance-type=m5a.large
```

This should configure the cluster and setup credentials and command context for later kubectl and helm commadns. If you encounter errors here, your user likely lacks access to manage EC2, EKS, or CloudFormation resources on the AWS account.

### Setup and access Kubernetes dashboard

To install:

```bash
helm install dashboard stable/kubernetes-dashboard
```

To access:

```bash
# Setup a port forward to the Dashboard pod
export POD_NAME=$(kubectl get pods -n default -l "app=kubernetes-dashboard,release=dashboard" -o jsonpath="{.items[0].metadata.name}")
kubectl -n default port-forward $POD_NAME 8443:8443
# Obtain an admin token
kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep eks-admin | awk '{print $1}')
```

### Configuration

This chart is AWS specific at the moment, as OpenNeuro requires EFS and ALB resources to run. Pull requests welcome if you add support for other hosting environments. 

To get started create a `values.yaml` and `secrets.yaml` file. In values.yaml you will override any chart settings necessary for your target environment. For a minimal dev environment it may look like this:

```yaml
hostname: my.dev.site.domain
url: https://my.dev.site.domain
environment: any-unique-string
googleTrackingId: ""
efs-provisioner:
  efsProvisioner:
    efsFileSystemId: fs-12345678
```

Other values which can be overriden are found in the chart version of [values.yaml](charts/values.yaml). 

`secrets.yaml` contains any privileged configuration, like database connection strings or oauth secrets. Start with [secrets.yaml.example](secrets.yaml.example) and fill in each value. Most values are required, but you only need one authentication provider and mail, doi, and flower configuration is optional.

### Installing

Installing a chart deploys it to a cluster. This creates an initial release by generating the configuration templates and applying them to the cluster.

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