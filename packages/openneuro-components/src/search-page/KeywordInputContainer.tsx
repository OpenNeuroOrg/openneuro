import React from 'react'
import { Input } from '../input/Input'

export const KeywordInputContainer = () => {
  const [value, setValue] = React.useState()

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
