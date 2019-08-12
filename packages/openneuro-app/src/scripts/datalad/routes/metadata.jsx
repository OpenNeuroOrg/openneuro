import React from 'react'

const Metadata = ({ metadata }) => (
  console.log({metadata}),
  <>
    <h1>Metadata</h1>
    <p>{JSON.stringify(metadata)}</p>
  </>
)

export default Metadata