import React, { useRef, useEffect, useState } from 'react'

export interface ReadMoreProps {
  children: React.ReactNode
  id: string
  collapseLabel: string
  expandLabel: string
}

export const ReadMore = ({
  children,
  id,
  expandLabel,
  collapseLabel,
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
      {dimensions.height > 400 ? (
        <article className="has-read-more file-tree">
          <input type="checkbox" className="show-more" id={id} />

          <section>
            {children}
            <label htmlFor={id} className="expand-collapse">
              <span>{expandLabel}</span>
              <span>{collapseLabel}</span>
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
