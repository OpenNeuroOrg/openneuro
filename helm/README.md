---
name: Kubernetes Deployment
---

# OpenNeuro Kubernetes Deployment

This chart is used to deploy a copy of OpenNeuro and all required services except for MongoDB.

Written for Helm 3.0.0 or later

## Major components

- API deployment - GraphQL service (openneuro-server npm package)
- DataLad service deployment - Falcon server for microservice operations on datasets
- Dataset worker - Celery workers responsible for read and write operations on datasets
- Web deployment - static resources including the React application (openneuro-app npm package)

## Pre-requisites

Install [Helm](https://helm.sh/), [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/), and (optionally) [eksctl](https://eksctl.io/).

Helm manages configuration templates. Kubectl makes API calls to Kubernetes on your behalf. eksctl configures AWS specific EKS resources to simplify control plane setup and is most useful when creating a new cluster or changing node groups.

## Cluster Setup

### Create a cluster on AWS

```bash
eksctl create cluster --name=my-cluster-name --nodegroup-name=general --nodes=2 --instance-type=c5a.xlarge --node-ami-family=Ubuntu1804
```

This should configure the cluster and setup credentials and command context for later kubectl and helm commadns. If you encounter errors here, your user likely lacks access to manage EC2, EKS, or CloudFormation resources on the AWS account.

OpenNeuro uses at least two node groups to run. A general node group created as above and a secondary node group assigned to storage resources only.

```bash
eksctl create nodegroup --cluster=my-cluster-name --nodes=2 --instance-type=m5ad.xlarge --name=storage
```

Example eksctl configurations from the main OpenNeuro instance are available in [staging](eksctl-cluster-prod.yaml) and [production](eksctl-cluster-staging.yaml) configurations.

### Storage setup

OpenEBS is used to manage volume allocation for worker nodes. Your Kubernetes nodes requires OpenZFS configuration. See [OpenEBS for supported versions](https://github.com/openebs/zfs-localpv#prerequisites). This can be built into the AMI on EKS or installed at node creation by eksctl as in the above example cluster configuration files.

Once the cluster is running, initialize the CSI driver for OpenEBS ZFS LocalPV following the [install instructions](https://github.com/openebs/zfs-localpv#setup).

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

This chart is AWS specific at the moment, as OpenNeuro requires EC2 EBS and ALB resources to run as configured. Pull requests welcome if you add support for other hosting environments.

To get started create a `values.yaml` and `secrets.yaml` file. In values.yaml you will override any chart settings necessary for your target environment. For a minimal dev environment it may look like this:

```yaml
hostname: my.dev.site.domain
url: https://my.dev.site.domain
environment: any-unique-string
googleTrackingId: ''
storagePools:
  stripeSize: 1099511627776 # 1TB EBS disks
  pools:
    - name: a
      size: 2199023255552 # 2TB per pool
    - name: b
      size: 2199023255552
```

Storage pools are local to a specific node. Generally you should add one pool for each node assigned to the storage node group. It is possible to assign multiple pools to one node but this will prevent even load distribution across volumes.

Disks are automatically allocated by the pool size divided by stripe size. Each "stripe" is one block persistent volume backing the pool. Multiple volumes are sparsely allocated from the pool. The pool can be much smaller than the quota size for the volumes within it as long as the total requested storage is below the pool's real available size.

The pool size can be adjusted automatically when increasing the size. To scale down a pool, the underlying EBS disks need to be removed from the pool first, and then manually removed.

```bash
# Locate the correct node, then run
zpool remove nvme-Amazon_Elastic_Block_Store_vol0123457908104
# Wait until the disk leaves the removing state, takes a while
watch -n 60 zpool list -v
```

Remove the PVCs once the pool is no longer using them.

```bash
# Save the volume ID
kubectl get pvc storage-pool-release-name-storage-pool-a-1
# Delete PVC first
kubectl delete pvc storage-pool-release-name-storage-pool-a-1
# Delete the volume once freed (this will delete the EBS disk, so be sure here!)
kubectl delete pv pvc-3a29528a-7b17-40b6-96a7-6385316fb401
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
