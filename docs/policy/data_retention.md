# Data Retention Policies

OpenNeuro has a data retention policy in place to ensure the maintainability of
and prevent abuse of the service.

## Data Management Plan Boilerplate

The following text may be used in data management plans for researchers intending to
upload data to OpenNeuro:

> Digital content ingested to OpenNeuro is replicated multiple times and stored in
> geo-diverse locations on different media types.
> Datasets are audited systematically to ensure that the bits are maintained exactly as deposited,
> and a log of preservation actions is kept to help ensure the content's integrity.
> The repository is built using widely-adopted and actively maintained open-source data
> management tools.
> These tools permit changes to content to be tracked and "snapshots" to be made that uniquely
> identify specific points in the lifetime of each dataset.
> After an optional 36-month embargo period, all datasets are published into the public domain.
> Prior to being made public, access to a dataset is controlled through strict authentication
> policies and an isolated storage backend to further guard against unintended access.
> Metadata describing each dataset snapshot is indexed for searching,
> and copies of ingested content are provided via persistent Digital Object Identifiers (DOIs)
> minted for each version of a dataset.

For further details, please consult the remainder of this page.

## Data storage

OpenNeuro datasets are stored as git/git-annex repositories on Google Cloud storage
media. Small files are included as git objects, while large files are added to the
annex. On each snapshot, a tag is made in the git repository, and copies of all files
are synchronized to an Amazon Web Services S3 bucket. This S3 bucket is used as a
remote for git-annex, ensuring high-availability access.

### Content integrity assurance

Content integrity is assured through multiple mechanisms. The git and git-annex protocols
use content-addressing to refer to each object in the dataset by its cryptographic hash,
providing a first defense against accidental replacement of one file with another.

Amazon S3 also provides checksums to ensure that uploaded data may be retrieved unchanged.

Finally, incremental backups (see [Backups](#backups)) compare checksums to identify files
that have changed from one day to the next, ensuring the recoverability of corrupted data.

## Backups

OpenNeuro uses daily incremental backups of all datasets to ensure integrity and
availability.

## Data administration and deletion

In order to ensure the high availability of uploaded datasets and prevent abuse of the
service, OpenNeuro may delete data under certain conditions.

### Automatic deletion

OpenNeuro reservces the right to delete draft data following a 28-day grace period.

Draft data is any data that is not included in a versioned snapshot. When a dataset
is first uploaded, it is placed in draft status, and the entire dataset is subject
to deletion until the first snapshot is made. If the first snapshot is not made within
28 days, deleting draft data results in the entire dataset being deleted.

After a snapshot, a dataset may be placed in draft status again by making changes to
the dataset, including metadata changes that are encoded in `dataset_description.json`.
If a new snapshot is not created within 28 days, then the dataset may be reverted to
the most recent snapshot at any time.

Only data included in a snapshot is guaranteed to be accessible. If a file is uploaded
and deleted between snapshots, then it may become inaccessible at any time, even if it
was temporarily accessible.

### Manual review and deletion

OpenNeuro makes use of a `.bidsignore` file to allow dataset owners to upload datasets
that include files that are not standardized. This mechanism is intended to ensure that
datasets may be uploaded with all available information despite gaps in definitions in
the BIDS standard.

However, this mechanism can potentially be used to store datasets that simply do not
conform to the BIDS standard, which is an abuse of the terms of service.
Any suspected abuse will be manually reviewed, and OpenNeuro may take steps to remediate
the abuse.
These steps may range from consultation with uploaders to correct the dataset to summary
deletion of datasets.
OpenNeuro may implement at any time mechanisms to automatically detect potential abuses
and flag them for manual review and deletion.
