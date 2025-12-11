import React, { useRef, useState } from "react"
import styled from "@emotion/styled"

const ShellExamplePre = styled.pre`
  max-width: 80em;
  white-space: pre-wrap;
  word-break: keep-all;
  border: 1px solid #ddd;
  background: #eee;
  padding: 10px;
  padding-right: 40px; /* space for clipboard button */
  position: relative;
`

const CopyButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  background: transparent;
  padding: 10px;
  cursor: pointer;
  color: #888;
  &:hover {
    color: #333;
  }
`

function ShellExample({ children }) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef(null)

  const copy = () => {
    const text = typeof children === "string"
      ? children
      : preRef.current.innerText
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <ShellExamplePre ref={preRef} role="figure">
      {children}
      <CopyButton onClick={copy} aria-label="Copy to clipboard">
        {copied
          ? <i className="fa fa-check"></i>
          : <i className="fa fa-clipboard"></i>}
      </CopyButton>
    </ShellExamplePre>
  )
}

export default ShellExample
