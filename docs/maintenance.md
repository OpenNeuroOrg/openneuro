---
name: Site Maintenance
route: /maintenance
---

# Unpublishing a dataset

To unpublish a dataset the database flag datasets.public can be set to false. Example query: `db.datasets.updateOne({id: "accession-number"}, {$set: {public: false}}`. This will hide the dataset on OpenNeuro but not remove it from any configured git-annex remotes.

After unpublishing a dataset like this the search index must either have the hidden dataset removed or the index needs to be rebuilt.

```shell
# One dataset can be removed like so
curl -X DELETE "http://elastic-server/datasets/_doc/${ACCESSION_NUMBER}"
```

To make the dataset public again it can simply be republished by a dataset administrator. Any remotes which were altered will need to be updated manually.

# Adjusting worker storage size

Disks are managed as preallocated GCP volumes and assigned to Kubernetes persistent volumes. Worker file systems are ReadWriteOnce. Increasing storage capacity for a worker is done in two steps. Resize the GCP disk and update the persistent volume configuration to match.

```shell
# Get disk name
> gcloud compute disks list
NAME                                      LOCATION    LOCATION_SCOPE  SIZE_GB  TYPE         STATUS
openneuro-staging-datasets-0              us-west1-b  zone            256      pd-balanced  READY
openneuro-staging-datasets-1              us-west1-b  zone            256      pd-balanced  READY
openneuro-staging-datasets-2              us-west1-b  zone            256      pd-balanced  READY
openneuro-staging-datasets-3              us-west1-b  zone            256      pd-balanced  READY
# Resize to 512GB
> gcloud compute disks resize openneuro-staging-datasets-0 --size=512
```

Make sure the resize operation has completed (status "READY") and then update the worker configuration for the PV to match (see `helm/openneuro/values.yaml` key workerDiskSize) and upgrade to deploy the new helm configuration.

If the configuration is updated prior to the disk being resized, the worker will need to be restarted to pick up the change. Verify the resize is complete with a shell on the worker or from the GCP console under pod statistics for the worker.