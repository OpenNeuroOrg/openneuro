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

### Quickstart commands

#### Access Kubernetes dashboard

```bash
# Setup a port forward to the Dashboard pod
export POD_NAME=$(kubectl get pods -n default -l "app=kubernetes-dashboard,release=dashboard" -o jsonpath="{.items[0].metadata.name}")
kubectl -n default port-forward $POD_NAME 8443:8443
# Obtain an admin token
kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep eks-admin | awk '{print $1}')
```

## Kuberetes quickstart glossary

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