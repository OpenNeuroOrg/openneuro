import React, { useRef, useEffect, useState } from 'react'

export interface ReadMoreProps {
  children: React.ReactNode
  id: string
  collapseabel: string
  expandLabel: string
  fileTree?: boolean
}

export const ReadMore = ({
  children,
  id,
  expandLabel,
  collapseabel,
  fileTree,
}: ReadMoreProps) => {
  const readmoreRef = useRef<HTMLDivElement>()
  const [dimensions, setDimensions] = useState({ height: 0 })
  useEffect(() => {
    if (readmoreRef.current) {
      setDimensions({
        height: readmoreRef.current.offsetHeight,
      })
    }
  }, [])

  return (
    <div ref={readmoreRef}>
      {fileTree && dimensions.height > 990 ? (
        <article className="has-read-more readmore-file-tree">
          <input type="checkbox" className="show-more" id={id} />

          <section>
            {children}
            <label htmlFor={id}>
              <span>{expandLabel}</span>
              <span>{collapseabel}</span>
            </label>
          </section>
        </article>
      ) : !fileTree && dimensions.height > 400 ? (
        <article className="has-read-more file-tree">
          <input type="checkbox" className="show-more" id={id} />

          <section>
            {children}
            <label htmlFor={id}>
              <span>{expandLabel}</span>
              <span>{collapseabel}</span>
            </label>
          </section>
        </article>
      ) : (
        <article>
          <section>{children}</section>
        </article>
      )}
    </div>
  )
}
