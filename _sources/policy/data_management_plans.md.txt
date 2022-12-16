# Data Management Plans

OpenNeuro is a public resource intended to make neuroimaging research data available to as
broad an audience as possible. This page is intended to help researchers and reviewers evaluate
whether OpenNeuro meets your criteria for a data host.

For further details, please consult our [](data_retention.md).

## Endorsements

OpenNeuro is an [NIH-supported][NIHbmic] domain-specific data repository.

## Boilerplate text

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

## Checklists

### NIH Desirable Characteristics

The National Institutes of Health has published a list of "desirable characteristics"
for data repositories:


**Unique Persistent Identifiers**
: > Assigns datasets a citable, unique persistent identifier, such as a digital object identifier (DOI) or accession number, to support data discovery, reporting, and research assessment. The identifier points to a persistent landing page that remains accessible even if the dataset is de-accessioned or no longer available.

  OpenNeuro:
  * assigns internal accession numbers (for example, `ds000001`) on initial upload
  * generates a [DOI](https://www.doi.org/) for each version of a dataset
  * maintains landing pages for published datasets that have been removed

**Long-Term Sustainability**
: > Has a plan for long-term management of data, including maintaining integrity, authenticity, and availability of datasets; building on a stable technical infrastructure and funding plans; and having contingency plans to ensure data are available and maintained during and after unforeseen events.

  OpenNeuro's [](data_retention.md) detail the technical approaches to maintaining integrity, authenticity
  and availability, including redundant distribution mechanisms that do not rely upon the availability of
  the primary website.
  The source code and deployment specifications are maintained in public repositories,
  using industry-standard technologies that are not tied to any one hosting provider.
  OpenNeuro is funded through an NIMH R24 grant, a five-year funding mechanism that enables long-term
  stability.

**Metadata**
: > Ensures datasets are accompanied by metadata to enable discovery, reuse, and citation of datasets, using schema that are appropriate to, and ideally widely used across, the community(ies) the repository serves. Domain-specific repositories would generally have more detailed metadata than generalist repositories.

  OpenNeuro requires all datasets be uploaded in [BIDS][] format, a community-developed
  standard for organizing data and metadata. OpenNeuro extracts metadata from the datasets
  to populate the dataset landing page and enable search queries.

**Curation and Quality Assurance**
: > Provides, or has a mechanism for others to provide, expert curation and quality assurance to improve the accuracy and integrity of datasets and metadata.

  OpenNeuro permits dataset owners to grant anonymous review access to private datasets,
  as well as write access to trusted users, if they wish to seek expert assistance.
  OpenNeuro *does not* currently provide curation assistance or a method for interested third
  parties to annotate datasets without the author's consent.
  Users may leave comments on datasets.

**Free and Easy Access**
: > Provides broad, equitable, and maximally open access to datasets and their metadata free of charge in a timely manner after submission, consistent with legal and ethical limits required to maintain privacy and confidentiality, Tribal sovereignty, and protection of other sensitive data.

  OpenNeuro provides on-demand access to all published datasets through multiple download mechanisms,
  free of charge, over the Internet.
  All data and metadata are released into the Public Domain.

**Broad and Measured Reuse**
: > Makes datasets and their metadata available with broadest possible terms of reuse; and provides the ability to measure attribution, citation, and reuse of data (i.e., through assignment of adequate metadata and unique PIDs).

  OpenNeuro is working toward providing mechanisms for measuring dataset downloads and
  linking to related digital objects like journal articles.

**Clear Use Guidance**
: > Provides accompanying documentation describing terms of dataset access and use (e.g., particular licenses, need for approval by a data use committee).

**Security and Integrity**
: > Has documented measures in place to meet generally accepted criteria for preventing unauthorized access to, modification of, or release of data, with levels of security that are appropriate to the sensitivity of data.

  OpenNeuro currently only hosts datasets that do not require restricted access, as attested by
  the dataset uploader.

**Confidentiality**
: > Has documented capabilities for ensuring that administrative, technical, and physical safeguards are employed to comply with applicable confidentiality, risk management, and continuous monitoring requirements for sensitive data.

**Common Format**
: > Allows datasets and metadata downloaded, accessed, or exported from the repository to be in widely used, preferably non-proprietary, formats consistent with those used in the community(ies) the repository serves.

  All OpenNeuro datasets are formatted according to the [BIDS][] standard.
  The DataLad access mechanism retrieves the dataset in the form of a [git][]/[git-annex][] repository.

**Provenance**
: > Has mechanisms in place to record the origin, chain of custody, and any modifications to submitted datasets and metadata.

  All changes to datasets are recorded in the [git][] history of each dataset.

**Retention Policy**
: > Provides documentation on policies for data retention within the repository.

  These policies may be found at [](data_retention.md).


[BIDS]: https://bids.neuroimaging.io
[NIHbmic]: https://www.nlm.nih.gov/NIHbmic/domain_specific_repositories.html
[desirable]: https://sharing.nih.gov/data-management-and-sharing-policy/sharing-scientific-data/selecting-a-data-repository#desirable-characteristics-for-all-data-repositories
[git]: https://www.git-scm.com/
[git-annex]: https://git-annex.branchable.com/
