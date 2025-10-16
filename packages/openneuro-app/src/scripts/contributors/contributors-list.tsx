import React, { useEffect, useState } from "react"
import { gql, useMutation } from "@apollo/client"
import * as Sentry from "@sentry/react"
import type { Contributor } from "../types/datacite"
import { SingleContributorDisplay } from "./contributor"
import { Loading } from "../components/loading/Loading"
import { ContributorFormRow } from "./contributor-form-row"
import { cloneContributor } from "./contributor-utils"
import { CREATE_CONTRIBUTOR_CITATION_EVENT } from "../queries/datasetEvents"

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

export const ContributorsListDisplay: React.FC<ContributorsListDisplayProps> = (
  {
    contributors,
    separator = <br />,
    datasetId,
    editable,
  },
) => {
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
          fields: { draft: () => ({ ...updatedDraft }) },
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
        Sentry.captureException(err)
      },
    },
  )
  const [createContributorCitationEvent] = useMutation(
    CREATE_CONTRIBUTOR_CITATION_EVENT,
    {
      onError(err) {
        Sentry.captureException(err)
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
          ? { ...cloneContributor(c), [field]: value }
          : cloneContributor(c)
      )
    )
    if (field === "name") {
      setErrors((prev) => ({
        ...prev,
        ...(value.trim() ? {} : { [index]: "Required" }),
      }))
    }
  }

  const handleAdd = () =>
    setEditingContributors((prev) => [
      ...prev.map(cloneContributor),
      {
        name: "",
        givenName: "",
        familyName: "",
        orcid: "",
        contributorType: "Researcher",
        order: prev.length + 1,
      },
    ])

  const handleRemove = (index: number) =>
    setEditingContributors((prev) =>
      prev.filter((_, i) => i !== index).map((c, idx) => ({
        ...cloneContributor(c),
        order: idx + 1,
      }))
    )

  const handleMove = (index: number, direction: "up" | "down") =>
    setEditingContributors((prev) => {
      const newIndex = direction === "up" ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) {
        return prev.map(cloneContributor)
      }
      const updated = prev.map(cloneContributor)
      const [movedItem] = updated.splice(index, 1)
      updated.splice(newIndex, 0, movedItem)
      return updated.map((c, idx) => ({ ...c, order: idx + 1 }))
    })

  const handleSave = async () => {
    if (!datasetId) return
    const newErrors: Record<number, string> = {}
    editingContributors.forEach((c, idx) => {
      if (!c.name.trim()) newErrors[idx] = "Required"
    })
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors)

    const cleanContributors = editingContributors.map((c) => ({
      name: c.name.trim(),
      givenName: c.givenName || "",
      familyName: c.familyName || "",
      orcid: c.orcid || "",
      contributorType: c.contributorType,
      order: c.order,
    }))

    try {
      const { data } = await updateContributorsMutation({
        variables: { datasetId, newContributors: cleanContributors },
      })

      const prevOrcids = new Set(contributors?.map((c) => c.orcid))
      const newContributors = cleanContributors.filter(
        (c) => c.orcid && !prevOrcids.has(c.orcid),
      )

      await Promise.all(
        newContributors.map((contributor) =>
          createContributorCitationEvent({
            variables: {
              datasetId,
              targetUserId: contributor.orcid || contributor.name,
              contributorData: {
                name: contributor.name,
                givenName: contributor.givenName,
                familyName: contributor.familyName,
                orcid: contributor.orcid,
                contributorType: contributor.contributorType,
                order: contributor.order,
              },
            },
          })
        ),
      )
    } catch (err) {
      Sentry.captureException(err)
    }
  }

  if (!contributors || contributors.length === 0) return <>N/A</>

  if (isEditing && editable) {
    return (
      <div>
        {loading ? <Loading /> : (
          <>
            {editingContributors.map((c, i) => (
              <ContributorFormRow
                key={i}
                contributor={c}
                index={i}
                errors={errors}
                onChange={handleChange}
                onMove={handleMove}
                onRemove={handleRemove}
                isFirst={i === 0}
                isLast={i === editingContributors.length - 1}
              />
            ))}
            <button
              onClick={handleAdd}
              className="on-button on-button--small on-button--primary"
              style={{ marginRight: 8, padding: 3 }}
            >
              Add Contributor
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="on-button on-button--small on-button--primary"
              style={{ padding: 3 }}
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
              width: 60,
              top: -5,
              position: "absolute",
              right: 0,
              padding: 3,
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
