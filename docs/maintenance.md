---
name: Site Maintenance
route: maintenance
---

## Unpublishing a dataset

To unpublish a dataset the database flag datasets.public can be set to false. Example query: `db.datasets.updateOne({id: "accession-number"}, {$set: {public: false}}`. This will hide the dataset on OpenNeuro but not remove it from any configured git-annex remotes.

After unpublishing a dataset like this the search index must either have the hidden dataset removed or the index needs to be rebuilt.

```shell
# One dataset can be removed like so
curl -X DELETE "http://elastic-server/datasets/_doc/${ACCESSION_NUMBER}"
```

To make the dataset public again it can simply be republished by a dataset administrator. Any remotes which were altered will need to be updated manually.
