import React, { useEffect, useRef, useState } from "react"
import type { Contributor } from "../types/datacite"
import { SelectGroup } from "../components/select/SelectGroup"
import { CONTRIBUTOR_TYPES } from "./contributor-utils"
import { useUsers } from "../queries/users"

const useDebounced = (value: string, delay = 250) => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

interface ContributorFormRowProps {
  contributor: Contributor & { isNew?: boolean }
  index: number
  errors: Record<number, string>
  onChange: (index: number, field: keyof Contributor, value: string) => void
  onMove: (index: number, direction: "up" | "down") => void
  onRemove: (index: number) => void
  isFirst: boolean
  isLast: boolean
}

export const ContributorFormRow: React.FC<ContributorFormRowProps> = ({
  contributor,
  index,
  errors,
  onChange,
  onMove,
  onRemove,
  isFirst,
  isLast,
}) => {
  const [query, setQuery] = useState(contributor.name || "")
  const debouncedQuery = useDebounced(query, 250)
  const [open, setOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState<number>(-1)
  const [isFocused, setIsFocused] = useState(false)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const { users = [], loading, refetchFullList } = useUsers({
    search: debouncedQuery,
    initialLimit: 10,
  })

  // Fetch suggestions on debounced input
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.trim().length > 0) {
      void refetchFullList({ search: debouncedQuery, limit: 10 })
      setOpen(true)
      setHighlightIndex(-1)
    } else {
      setOpen(false)
      setHighlightIndex(-1)
    }
  }, [debouncedQuery, refetchFullList])

  // Keep input in sync with external contributor name updates
  useEffect(() => {
    if (contributor.name !== undefined && contributor.name !== query) {
      setQuery(contributor.name)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contributor.name])

  // Close dropdown on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  const onInputChange = (v: string) => {
    setQuery(v)
    onChange(index, "name", v)
    setOpen(true)
    setHighlightIndex(-1)
  }

  const selectUser = (user: any) => {
    onChange(index, "name", user.name ?? "")
    onChange(index, "givenName", user.givenName ?? "")
    onChange(index, "familyName", user.familyName ?? "")
    onChange(index, "orcid", user.orcid ?? "")
    onChange(
      index,
      "contributorType",
      (contributor.contributorType || user.contributorType ||
        "Researcher") as string,
    )
    if (user.order !== undefined) onChange(index, "order", String(user.order))
    setQuery(user.name ?? "")
    setOpen(false)
    setHighlightIndex(-1)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === "ArrowDown" && users.length > 0) {
        setOpen(true)
        setHighlightIndex(0)
        e.preventDefault()
      }
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightIndex((hi) => Math.min(hi + 1, users.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightIndex((hi) => Math.max(hi - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (highlightIndex >= 0 && highlightIndex < users.length) {
        selectUser(users[highlightIndex])
      } else {
        // manual add
        setOpen(false)
        onChange(index, "name", query.trim())
      }
    } else if (e.key === "Escape") {
      e.preventDefault()
      setOpen(false)
    }
  }

  const showDropdown = open && isFocused

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        marginBottom: 8,
        flexWrap: "wrap",
        position: "relative",
      }}
    >
      {/* Move buttons */}
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

      {/* Typeahead input */}
      <div style={{ position: "relative", minWidth: 220, flex: 1 }}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder="Type name or ORCID (or add new)"
          onChange={(e) => onInputChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={onKeyDown}
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "6px 8px",
            borderColor: errors[index] ? "red" : undefined,
            borderWidth: errors[index] ? 2 : undefined,
          }}
          required
        />

        {showDropdown && (
          <div
            role="listbox"
            aria-label="User suggestions"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.12)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              zIndex: 2000,
              maxHeight: 240,
              overflowY: "auto",
            }}
          >
            {loading
              ? <div style={{ padding: 8 }}>Searching…</div>
              : users && users.length > 0
              ? (
                users.map((u, i) => {
                  const isHighlighted = i === highlightIndex
                  return (
                    <div
                      key={u.id ?? `${u.name}-${i}`}
                      role="option"
                      aria-selected={isHighlighted}
                      onMouseDown={(ev) => ev.preventDefault()}
                      onClick={() => selectUser(u)}
                      onMouseEnter={() => setHighlightIndex(i)}
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        padding: "8px 10px",
                        background: isHighlighted
                          ? "rgba(0,0,0,0.04)"
                          : undefined,
                        cursor: "pointer",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      {u.avatar && (
                        <img
                          src={u.avatar}
                          alt=""
                          style={{ width: 28, height: 28, borderRadius: "50%" }}
                        />
                      )}
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {u.name}
                        </div>
                        {u.orcid && (
                          <div style={{ fontSize: 12, color: "#666" }}>
                            ORCID: {u.orcid}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )
              : (
                <div style={{ padding: 8, color: "#666" }}>
                  No matches. Press Enter to add “{query}”.
                </div>
              )}
          </div>
        )}

        {errors[index] && (
          <div style={{ color: "red", fontSize: "0.8em", marginTop: 4 }}>
            {errors[index]}
          </div>
        )}
      </div>

      {/* Contributor Type */}
      <SelectGroup
        id={`contributor-type-${index}`}
        layout="inline"
        options={CONTRIBUTOR_TYPES.map((t) => ({ label: t, value: t }))}
        value={contributor.contributorType?.trim() ?? ""}
        setValue={(v) => onChange(index, "contributorType", v)}
      />

      {/* ORCID display */}
      {contributor.orcid && (
        <span style={{ fontSize: 0.9, color: "#555" }}>
          ORCID: {contributor.orcid}
        </span>
      )}

      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        style={{ color: "#C82429", border: 0, background: "none" }}
      >
        <i className="fa fa-trash"></i>
      </button>
    </div>
  )
}
