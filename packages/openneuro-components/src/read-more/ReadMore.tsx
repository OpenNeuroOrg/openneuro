import React, { useRef, useEffect, useState } from 'react'

export interface ReadMoreProps {
  children: React.ReactNode
  id: string
  collapseabel: string
  expandLabel: string
}

export const ReadMore = ({
  children,
  id,
  expandLabel,
  collapseabel,
}: ReadMoreProps) => {
  const readmoreRef = useRef()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
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
        <article className="has-read-more">
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
