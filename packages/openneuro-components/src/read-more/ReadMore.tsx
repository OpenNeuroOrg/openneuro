import React from 'react'

import './read-more.scss'

export interface ReadMoreProps {
  children: React.ReactElement
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
