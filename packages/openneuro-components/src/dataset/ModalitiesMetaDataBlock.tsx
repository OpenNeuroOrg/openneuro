import React from 'react'
import { Link } from 'react-router-dom'
import Markdown from 'markdown-to-jsx'

export interface ModalitiesMetaDataBlockProps {
  items: string[]
  className?: string
}

export const ModalitiesMetaDataBlock = ({
  items,
  className,
}: ModalitiesMetaDataBlockProps) => {
  const uppercased = {
    mri: 'MRI',
    ieeg: 'iEEG',
    pet: 'PET',
    eeg: 'EEG',
    meg: 'MEG',
  }
  return (
    <div className={'dataset-meta-block ' + className}>
      <h2 className="dmb-heading">Available Modalities</h2>
      {items.map((item, index) => (
        <Link
          key={index}
          to={'/search/modality/' + uppercased[item.toLowerCase()]}
        >
          {item}
        </Link>
      ))}
    </div>
  )
}
