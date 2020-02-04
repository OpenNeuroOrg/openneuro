import React, { useEffect, useRef } from 'react'

const SearchInput = ({ onSearch }: { onSearch: Function }) => {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus()
  })

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={() => onSearch(inputRef.current.value)}>Search</button>
    </>
  )
}

export default SearchInput
