import type { Contributor } from "../types/datacite"

export const CONTRIBUTOR_TYPES = [
  "ContactPerson",
  "DataCollector",
  "DataCurator",
  "DataManager",
  "Distributor",
  "Editor",
  "HostingInstitution",
  "Producer",
  "ProjectLeader",
  "ProjectManager",
  "ProjectMember",
  "RegistrationAgency",
  "RegistrationAuthority",
  "RelatedPerson",
  "Researcher",
  "ResearchGroup",
  "RightsHolder",
  "Sponsor",
  "Supervisor",
  "WorkPackageLeader",
  "Other",
]

// Utility to deep clone a contributor
export const cloneContributor = (c: Contributor): Contributor =>
  structuredClone(c)
