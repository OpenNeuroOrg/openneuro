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
  mutation UpdateContributors($datasetId: String!, $newContributors: [ContributorInput!]!) {
    updateContributors(datasetId: $datasetId, newContributors: $newContributors) {
      success
      dataset {
        id
        draft {
          id
          contributors { name givenName familyName orcid contributorType order }
          files { id filename key size annexed urls directory }
          modified
        }
      }
    }
  }
`

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
    contributors?.map((c) => ({ ...c, order: c.order ?? 0 })) || [],
  )
  const [errors, setErrors] = useState<Record<number, string>>({})

  useEffect(() => {
    if (contributors) {
      setEditingContributors(
        contributors.map((c) => ({ ...c, order: c.order ?? 0 })),
      )
    }
  }, [contributors])

  const [updateContributorsMutation, { loading }] = useMutation(
    UPDATE_CONTRIBUTORS,
    {
      update(cache, { data }) {
        const updatedDraft = data?.updateContributors?.dataset?.draft
        if (!updatedDraft || !datasetId) return

        const datasetCacheId = cache.identify({
          __typename: "Dataset",
          id: datasetId,
        })
        if (!datasetCacheId) return

        cache.modify({
          id: datasetCacheId,
          fields: {
            draft() {
              return { ...updatedDraft }
            },
          },
        })
      },
      onCompleted(data) {
        const updated = data?.updateContributors?.dataset?.draft?.contributors
        if (updated) {
          setEditingContributors(
            updated.map((c) => ({ ...c })).sort((a, b) =>
              (a.order ?? 0) - (b.order ?? 0)
            ),
          )
        }
        setIsEditing(false)
        setErrors({})
      },
      onError(err) {
        console.error("Failed to save contributors", err)
      },
    },
  )

  const handleChange = (
    index: number,
    field: keyof Contributor,
    value: string,
  ) => {
    setEditingContributors((prev) =>
      prev.map((c, i) =>
        i === index
          ? { ...structuredClone(c), [field]: value }
          : structuredClone(c)
      )
    )

    if (field === "name") {
      setErrors((prev) => {
        const newErrors = { ...prev }
        if (!value.trim()) newErrors[index] = "Required"
        else delete newErrors[index]
        return newErrors
      })
    }
  }

  const handleAdd = () => {
    setEditingContributors((prev) => [
      ...prev.map((c) => structuredClone(c)),
      {
        name: "",
        givenName: "",
        familyName: "",
        orcid: "",
        contributorType: "Researcher",
        order: prev.length + 1,
      },
    ])
  }

  const handleRemove = (index: number) => {
    setEditingContributors((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((c, idx) => ({ ...structuredClone(c), order: idx + 1 }))
    )
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[index]
      return newErrors
    })
  }

  const handleMove = (index: number, direction: "up" | "down") => {
    setEditingContributors((prev) => {
      const newIndex = direction === "up" ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) {
        return prev.map((c) => structuredClone(c))
      }

      const updated = prev.map((c) => structuredClone(c))
      const [movedItem] = updated.splice(index, 1)
      updated.splice(newIndex, 0, movedItem)

      return updated.map((c, idx) => ({ ...c, order: idx + 1 }))
    })
  }

  const handleSave = () => {
    if (!datasetId) return

    const newErrors: Record<number, string> = {}
    editingContributors.forEach((c, idx) => {
      if (!c.name.trim()) newErrors[idx] = "Required"
    })
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

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
      order: c.order,
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

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <input
                    type="text"
                    placeholder="Name"
                    value={c.name || ""}
                    onChange={(e) => handleChange(i, "name", e.target.value)}
                    style={{
                      borderColor: errors[i] ? "red" : undefined,
                      borderWidth: errors[i] ? 2 : undefined,
                    }}
                    required
                  />
                  {errors[i] && (
                    <span style={{ color: "red", fontSize: "0.8em" }}>
                      {errors[i]}
                    </span>
                  )}
                </div>

                <SelectGroup
                  id={`contributor-type-${i}`}
                  layout="inline"
                  options={CONTRIBUTOR_TYPES.map((t) => ({
                    label: t,
                    value: t,
                  }))}
                  value={c.contributorType?.trim() ?? ""}
                  setValue={(v) => handleChange(i, "contributorType", v)}
                />

                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  style={{ color: "#C82429", border: 0, background: "none" }}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            ))}

            <button
              onClick={handleAdd}
              className="on-button on-button--small on-button--primary"
              style={{ marginRight: "8px", padding: "3px" }}
            >
              Add Contributor
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="on-button on-button--small on-button--primary"
              style={{ position: "absolute", padding: "3px" }}
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
              zIndex: 10,
            }}
          >
            Edit
          </button>
        )}
      </div>
      {editingContributors
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((c, i) => (
          <SingleContributorDisplay
            key={i}
            contributor={{ ...c }}
            isLast={i === editingContributors.length - 1}
            separator={separator}
          />
        ))}
    </>
  )
}
