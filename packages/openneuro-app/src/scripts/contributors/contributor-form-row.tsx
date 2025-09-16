import React, { FC } from "react"
import type { Contributor } from "../types/datacite"
import { SelectGroup } from "../components/select/SelectGroup"
import { cloneContributor, CONTRIBUTOR_TYPES } from "./contributor-utils"

interface Props {
  contributor: Contributor
  index: number
  errors: Record<number, string>
  onChange: (index: number, field: keyof Contributor, value: string) => void
  onMove: (index: number, direction: "up" | "down") => void
  onRemove: (index: number) => void
  isFirst: boolean
  isLast: boolean
}

export const ContributorFormRow: FC<Props> = ({
  contributor,
  index,
  errors,
  onChange,
  onMove,
  onRemove,
  isFirst,
  isLast,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      marginBottom: 8,
      gap: 8,
      flexWrap: "wrap",
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <button
        type="button"
        onClick={() => onMove(index, "up")}
        disabled={isFirst}
      >
        ↑
      </button>
      <button
        type="button"
        onClick={() => onMove(index, "down")}
        disabled={isLast}
      >
        ↓
      </button>
    </div>

    <div style={{ display: "flex", flexDirection: "column" }}>
      <input
        type="text"
        placeholder="Name"
        value={contributor.name || ""}
        onChange={(e) => onChange(index, "name", e.target.value)}
        style={{
          borderColor: errors[index] ? "red" : undefined,
          borderWidth: errors[index] ? 2 : undefined,
        }}
        required
      />
      {errors[index] && (
        <span style={{ color: "red", fontSize: "0.8em" }}>{errors[index]}</span>
      )}
    </div>

    <SelectGroup
      id={`contributor-type-${index}`}
      layout="inline"
      options={CONTRIBUTOR_TYPES.map((t) => ({ label: t, value: t }))}
      value={contributor.contributorType?.trim() ?? ""}
      setValue={(v) => onChange(index, "contributorType", v)}
    />

    <button
      type="button"
      onClick={() => onRemove(index)}
      style={{ color: "#C82429", border: 0, background: "none" }}
    >
      <i className="fa fa-trash"></i>
    </button>
  </div>
)
