import React from 'react'
import { Input } from '../input/Input'

export const KeywordInputContainerExample = ({ searchValue }) => {
  const [value, setValue] = React.useState(searchValue)
  console.log(value)
  return (
    <>
      <Input
        type="search"
        label="Keyword"
        placeholder="eg. something here"
        labelStyle="default"
        name="default-example"
        value={value}
        setValue={setValue}
      />
    </>
  )
}
