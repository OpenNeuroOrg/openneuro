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
  const targetRef = useRef()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  useEffect(() => {
    if (targetRef.current) {
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight,
      })
    }
  }, [])

  return (
    <div ref={targetRef}>
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
