import React, { useState } from "react"
import PropTypes from "prop-types"
import getYear from "date-fns/getYear"
import parseISO from "date-fns/parseISO"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { Button } from "../../components/button/Button"
import { Tooltip } from "../../components/tooltip/Tooltip"

export const formatCitation = (snapshot, style) => {
  const year = getYear(parseISO(snapshot.created))
  const authors = snapshot.description.Authors
    ? snapshot.description.Authors.join(" and ")
    : "NO AUTHORS FOUND"
  if (style === "Text") {
    return `${authors} (${year}). ${snapshot.description.Name}. OpenNeuro. [Dataset] doi: ${snapshot.description.DatasetDOI}`
  } else if (style === "BibTeX") {
    return `@dataset{${snapshot.id},
  author = {${snapshot.description.Authors.join(" AND ")}},
  title = {"${snapshot.description.Name}"},
  year = {${year}},
  doi = {${snapshot.description.DatasetDOI}},
  publisher = {OpenNeuro}
}`
  }
}

const DatasetCitation = ({ snapshot }) => {
  const [style, setStyle] = useState("Text")
  const [copied, setCopied] = useState(false)
  const copiedTimeout = () => {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }
  const citation = formatCitation(snapshot, style)
  return (
    <>
      <div className="button-group-wrapper">
        <div className="description-item btn-group">
          <Button
            secondary={true}
            label="Text"
            size="xsmall"
            onClick={() => {
              setStyle("Text")
              setCopied(false)
            }}
            className={style === "Text" ? "active" : ""}
          />

          <Button
            secondary={true}
            label="BibTeX"
            size="xsmall"
            onClick={() => {
              setStyle("BibTeX")
              setCopied(false)
            }}
            className={style === "BibTeX" ? "active" : ""}
          />
          <Tooltip
            tooltip={"Copy " + style + " to clipboard"}
            className="tooltip"
          >
            <CopyToClipboard
              text={citation}
              onCopy={() => copiedTimeout()}
              className="on-button on-button--small on-button--nobg "
            >
              <span className="copy-key">
                <i className="fa fa-link" aria-hidden="true" />{" "}
                {copied ? <span>Copied to clipboard</span> : <span>Copy</span>}
              </span>
            </CopyToClipboard>
          </Tooltip>
        </div>
        <h5 className="cite-content-block">
          {style === "BibTeX" ? <pre>{citation}</pre> : citation}
        </h5>
      </div>
    </>
  )
}

DatasetCitation.propTypes = {
  snapshot: PropTypes.object,
}

export default DatasetCitation
