import React from 'react'

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
  return (
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
  )
}
