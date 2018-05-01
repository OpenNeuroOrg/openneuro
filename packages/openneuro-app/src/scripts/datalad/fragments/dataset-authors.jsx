import React from 'react'

const DatasetAuthors = ({ authors }) => (
  <h6>{`authored by ${authors.join(', ')}`}</h6>
)

export default DatasetAuthors
