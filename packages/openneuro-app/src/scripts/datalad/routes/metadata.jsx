import React from 'react'

const Metadata = ({ dataset }) => (
  <>
    <h1>Metadata</h1>
    <p>{JSON.stringify(dataset)}</p>
  </>
)

export default Metadata