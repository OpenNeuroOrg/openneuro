# General Policies

- Version: 1.0.0
- Last updated: 2026-10-13

## Content

- **Scope**:
  Neuroimaging products of biomedical and psychological research;
  raw and derived experimental data.
  Content must not violate privacy or copyright,
  or breach confidentiality or non-disclosure agreements
  for data collected from human subjects.

- **Status of research data**:
  Empirical (not simulated) data and associated metadata
  from any stage of the research study's life cycle is accepted.

- **Simulated data**:
  Simulated data may be submitted to OpenNeuro,
  as determined on a case-by-case basis.
  Contact the OpenNeuro team to discuss simulated deposits.
  OpenNeuro reserves the right to remove simulated data
  uploaded without prior authorization.

- **Eligible users**:
  Anyone may register as a user of OpenNeuro.
  Users must authenticate with [ORCID](https://orcid.org/)
  and provide a verified email address for contact.
  All users are allowed to deposit empirical data for which
  they possess the appropriate rights and which falls within the scope of the archive.
  See the **Simulated data** section for details on submitting simulated data.

- **Ownership**:
  By uploading content,
  the uploading party commits to making the data available under the permissive CC0 license.
  No change of ownership is implied and no property rights are transferred
  to the OpenNeuro team.
  Users allow OpenNeuro to extract metadata records
  and make them available under the CC0 license.

- **Data file formats**:
  OpenNeuro only accepts data organized according to the
  [Brain Imaging Data Structure](https://bids.neuroimaging.io/) (BIDS) standard.
  We work with the community to improve BIDS standards
  and to make the OpenNeuro archive FAIR.

- **Data quality**:
  All data are provided "as-is" and without warranty of any kind,
  express, implied, statutory or otherwise,
  including without limitation warranties of title, merchantability,
  fitness for a particular purpose, non infringement,
  or the absence of latent or other defects, accuracy,
  or the present or absence of errors, whether or not discoverable,
  all to the greatest extent permissible under applicable law.

- **Metadata types and sources**:
  OpenNeuro’s GraphQL API is the user-facing record source.

- **Language**:
  Textual items must be in English.
  Latin names could be used in exceptional cases where appropriate.

## Access and Reuse

- **Embargo status**:
  Users may deposit content under an embargo status
  with a default end date of 36 months after the initial version.
  The repository will restrict access to the data until the end of the embargo period,
  at which time the content will automatically become publicly available.
  The user may publish the dataset at any time prior to the end of the default embargo.

- **Access to data objects**:
  Files deposited to the archive are accessible to the public openly or
  accessible to collaborators for embargoed datasets.
  Access to metadata and data files is provided over standard protocols such as HTTPS.

- **Use and reuse of data objects**:
  Use and reuse is subject to the terms of the license
  under which the data objects were deposited.

- **Metadata access and reuse**:
  Metadata records, provided by the users or extracted from the assets,
  are licensed under CC0.
  All metadata for non-embargoed datasets is made publicly available and can be harvested.

- **Restricted access**:
  Depositors of embargoed datasets have the ability
  to share access with other collaborators.
  These files will not be made publicly available until the end of the embargo period.

## Removal

- **Removal**:
  OpenNeuro reserves the right to remove any data file or dataset that is not within scope,
  violates terms of use, or is otherwise non-compliant with OpenNeuro’s data policies.
  If you suspect a policy violation, inform the OpenNeuro team as soon as possible.
  Datasets that have been issued a DOI will have the OpenNeuro DOI marked as “not findable”.
  User access may be revoked on violation of Terms of Use.

- **Withdrawal**:
  Withdrawal is a user-initiated removal of a dataset from OpenNeuro.
  If the uploaded research object must later be withdrawn,
  the reason for the withdrawal will be indicated on a tombstone page,
  which will thereafter be served in its place.
  Withdrawal is considered an exceptional action,
  which normally should be requested and fully justified by the original uploader.
  In any other circumstance reasonable attempts will be made
  to contact the original uploader to obtain consent.
  The DOI and the URL of the original object are retained.

## Longevity

- **Versions**:
  Datasets are versioned repositories.
  Prior to the creation of a version (or “snapshot”),
  the data and metadata are not guaranteed to persist.
  Modifications made to a dataset that are not saved in a new version
  are not guaranteed to persist.

- **Replicas**:
  All data files are stored on an AWS public bucket,
  with replicas housed in encrypted object storage.
  Data files are kept in multiple replicas at the moment, but this may change over time,
  and no recovery mechanisms for unversioned data should be assumed to be in place.

- **Retention period**:
  Versioned items will be retained for the lifetime of the repository.

- **Functional preservation**:
  OpenNeuro makes no promises of usability and understandability of deposited objects.

- **File preservation**:
  Data files and metadata are backed up nightly
  and replicated into multiple copies in different storage services.

- **Fixity and authenticity**:
  All data files are stored along with checksums of the file content.
  Files are regularly checked against their checksums to assure that
  file content remains constant.

- **Succession plans**:
  In case of a repository shutdown, our best efforts will be made
  to integrate all content into suitable alternative institutional
  and/or other repositories overlapping in the scope of the OpenNeuro archive.

This policy document is derived from the [Zenodo General Policies v1.0](https://about.zenodo.org/policies/) and [DANDI Archive General Policies v1.3.0](https://docs.dandiarchive.org/terms-policies/policies/).
