import React from "react"
import { Link } from "react-router-dom"
import { Dropdown } from "../../components/dropdown/Dropdown"
import { formatDate } from "../../utils/date"

export interface VersionListProps {
  items: {
    label: string
    value: string
    id: string
    tag: string
    created: Date
    deprecated: boolean
  }[]
  hasEdit: boolean
  selected: string
  setSelected: (selected: string) => void
  className: string
  activeDataset: string
  dateModified: string
  datasetId?: string
}
export const VersionList = ({
  items,
  selected,
  setSelected,
  className,
  dateModified,
  datasetId,
  hasEdit,
}: VersionListProps) => {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const deprecatedItem = (itemTag, itemCreated) => {
    setSelected(itemTag)
  }
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const setVersion = (itemTag, itemCreated) => {
    setSelected(itemTag)
  }
  return (
    <>
      <div className="active-version">
        <div>{selected === "draft" ? "Draft" : selected}</div>
        {selected === "draft" ? "Updated" : "Created"}:{" "}
        {formatDate(dateModified)}
      </div>
      {items.length
        ? (
          <Dropdown
            className={className}
            label={
              <div className="version-list-label">
                <b>Versions</b>
                <i className="fas fa-chevron-up" />
                <i className="fas fa-chevron-down" />
              </div>
            }
          >
            <div className="version-list-dropdown">
              <ul>
                <li
                  onClick={() => setVersion("draft", dateModified)}
                  className={selected === "draft" ? "selected" : ""}
                >
                  <Link className="dataset-tool" to={"/datasets/" + datasetId}>
                    <span className="label">
                      Draft
                      <span className="active">
                        {selected === "draft" ? "*" : ""}
                      </span>
                    </span>
                    {formatDate(dateModified)}
                  </Link>
                </li>
                {items.map((item, index) => (
                  <li
                    key={index}
                    onClick={item.deprecated === true
                      ? () => deprecatedItem(item.tag, item.created)
                      : () => setVersion(item.tag, formatDate(item.created))}
                    className={selected === item.tag ? "selected" : ""}
                  >
                    <Link
                      className="dataset-tool"
                      to={"/datasets/" + datasetId + "/versions/" + item.tag}
                    >
                      <span className="label">
                        v{item.tag}
                        <span className="active">
                          {selected === item.tag ? "*" : ""}
                        </span>
                        <span className="deprecated">
                          {item.deprecated === true ? "Deprecated" : ""}
                        </span>
                      </span>
                      {formatDate(item.created)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Dropdown>
        )
        : hasEdit
        ? (
          <Link
            className="dataset-tool"
            to={"/datasets/" + datasetId + "/snapshot"}
          >
            Create Version
          </Link>
        )
        : null}
    </>
  )
}
