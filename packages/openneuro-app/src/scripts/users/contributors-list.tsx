import React, { FC, useEffect, useState } from "react"
import { gql, useMutation } from "@apollo/client"
import type { Contributor } from "../types/datacite"
import { SingleContributorDisplay } from "./contributor"
import { Loading } from "../components/loading/Loading"
import { SelectGroup } from "../components/select/SelectGroup"
interface ContributorsListDisplayProps {
  contributors: Contributor[] | null | undefined
  separator?: React.ReactNode
  datasetId?: string
  editable?: boolean
}

const UPDATE_CONTRIBUTORS = gql`
  mutation UpdateContributors(
    $datasetId: String!
    $newContributors: [ContributorInput!]!
  ) {
    updateContributors(
      datasetId: $datasetId
      newContributors: $newContributors
    ) {
      success
      contributors {
        name
        givenName
        familyName
        orcid
        contributorType
      }
    }
  }
`

// Controlled list of valid contributor types
const CONTRIBUTOR_TYPES = [
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

export const ContributorsListDisplay: FC<ContributorsListDisplayProps> = ({
  contributors,
  separator = <br />,
  datasetId,
  editable,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editingContributors, setEditingContributors] = useState<Contributor[]>(
    contributors || [],
  )
  const [errors, setErrors] = useState<Record<number, string>>({})

  useEffect(() => {
    setEditingContributors(contributors || [])
  }, [contributors])

  const [updateContributorsMutation, { loading }] = useMutation(
    UPDATE_CONTRIBUTORS,
    {
      onCompleted: (data) => {
        const updatedContributors = data?.updateContributors?.contributors
        if (updatedContributors) setEditingContributors(updatedContributors)
        setIsEditing(false)
        setErrors({})
      },
      onError: (err) => console.error("Failed to save contributors", err),
    },
  )

  const handleChange = (
    index: number,
    field: keyof Contributor,
    value: string,
  ) => {
    const updated = [...editingContributors]
    updated[index] = { ...updated[index], [field]: value }
    setEditingContributors(updated)

    // Live validation for required name field
    if (field === "name") {
      const newErrors = { ...errors }
      if (!value.trim()) {
        newErrors[index] = "Required"
      } else {
        delete newErrors[index]
      }
      setErrors(newErrors)
    }
  }

  const handleAdd = () => {
    setEditingContributors([
      ...editingContributors,
      {
        name: "",
        givenName: "",
        familyName: "",
        orcid: "",
        contributorType: "Researcher", // default value
      },
    ])
  }

  const handleRemove = (index: number) => {
    const updated = [...editingContributors]
    updated.splice(index, 1)
    setEditingContributors(updated)

    // Also clean up any validation errors for removed index
    const newErrors = { ...errors }
    delete newErrors[index]
    setErrors(newErrors)
  }

  // Move contributor up or down
  const handleMove = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= editingContributors.length) return

    const updated = [...editingContributors]
    const [movedItem] = updated.splice(index, 1)
    updated.splice(newIndex, 0, movedItem)
    setEditingContributors(updated)
  }

  const handleSave = () => {
    if (!datasetId) return

    const newErrors: Record<number, string> = {}

    // Validate all contributors before save
    editingContributors.forEach((c, idx) => {
      if (!c.name.trim()) {
        newErrors[idx] = "Required"
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Validate contributor types
    for (const c of editingContributors) {
      if (!c.contributorType) {
        alert("All contributors must have a contributor type selected.")
        return
      }
    }

    const cleanContributors = editingContributors.map((c) => ({
      name: c.name.trim(),
      givenName: c.givenName || "",
      familyName: c.familyName || "",
      orcid: c.orcid || "",
      contributorType: c.contributorType,
    }))

    updateContributorsMutation({
      variables: { datasetId, newContributors: cleanContributors },
    })
  }

  if (!contributors || contributors.length === 0) return <>N/A</>

  if (isEditing && editable) {
    return (
      <div>
        {loading ? <Loading /> : (
          <>
            <button
              className="on-button on-button--small on-button--primary text-right"
              onClick={() => setIsEditing(false)}
              style={{
                width: "60px",
                top: "-5px",
                position: "absolute",
                right: 0,
                padding: "3px",
                zIndex: 10, // makes sure it's on top
              }}
            >
              Close
            </button>
            {editingContributors.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                {/* Move Buttons */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleMove(i, "up")}
                    disabled={i === 0}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(i, "down")}
                    disabled={i === editingContributors.length - 1}
                  >
                    ↓
                  </button>
                </div>

                {/* Name input with validation */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <input
                    type="text"
                    placeholder="Name"
                    value={c.name || ""}
                    onChange={(e) => handleChange(i, "name", e.target.value)}
                    style={{
                      borderColor: errors[i] ? "red" : undefined,
                      borderWidth: errors[i] ? "2px" : undefined,
                    }}
                    required
                  />
                  {errors[i] && (
                    <span style={{ color: "red", fontSize: "0.8em" }}>
                      {errors[i]}
                    </span>
                  )}
                </div>

                {/* Contributor Type */}
                <SelectGroup
                  id={`contributor-type-${i}`}
                  layout="inline"
                  options={CONTRIBUTOR_TYPES.map((type) => ({
                    label: type,
                    value: type,
                  }))}
                  value={c.contributorType?.trim() ?? ""}
                  setValue={(value) =>
                    handleChange(i, "contributorType", value)}
                />

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  style={{
                    color: "#C82429",
                    border: 0,
                    background: "none",
                  }}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            ))}

            <button
              onClick={handleAdd}
              className="on-button on-button--small on-button--primary"
              style={{
                marginRight: "8px",
                padding: "3px",
              }}
            >
              Add Contributor
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="on-button on-button--small on-button--primary "
              style={{
                position: "absolute",
                padding: "3px",
              }}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </>
        )}
      </div>
    )
  }

  return (
    <>
      <div style={{ position: "relative" }}>
        {editable && !isEditing && (
          <button
            className="on-button on-button--small on-button--primary"
            onClick={() => setIsEditing(true)}
            style={{
              width: "60px",
              top: "-5px",
              position: "absolute",
              right: 0,
              padding: "3px",
              zIndex: 10, // makes sure it's on top
            }}
          >
            Edit
          </button>
        )}
      </div>
      {editingContributors.map((c, i) => (
        <SingleContributorDisplay
          key={i}
          contributor={c}
          isLast={i === editingContributors.length - 1}
          separator={separator}
        />
      ))}
    </>
  )
}
