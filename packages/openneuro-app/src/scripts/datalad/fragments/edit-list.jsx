import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

const EditListButton = styled.button`
  width: 6em;
`

const EditListRow = styled.div`
  margin-top: 6px;
  margin-bottom: 6px;
`

/**
 * Generic add/remove strings from an Array list
 */
const EditList = ({ placeholder, elements = [], setElements }) => {
  const [newElement, updateNewElement] = useState('')

  /**
   * Remove one element from list
   * @param {number} index Which entry to remove
   */
  const removeElement = index => () => {
    // Avoid mutating elements array directly
    const newElements = [...elements]
    newElements.splice(index, 1)
    setElements(newElements)
  }

  return (
    <>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={newElement}
          onChange={e => updateNewElement(e.target.value)}
        />
        <span className="input-group-btn">
          <EditListButton
            className="btn btn-default"
            type="button"
            onClick={() => {
              setElements([...elements, newElement])
              updateNewElement('')
            }}>
            Add
          </EditListButton>
        </span>
      </div>
      <div>
        {elements.map((element, index) => (
          <EditListRow key={index}>
            <div className="input-group">
              <span className="input-group-addon" style={{ width: '100%' }}>
                {element}
              </span>
              <div className="input-group-btn">
                <EditListButton
                  className="btn btn-default"
                  onClick={removeElement(index)}>
                  <i className="fa fa-times" />
                  Remove
                </EditListButton>
              </div>
            </div>
          </EditListRow>
        ))}
      </div>
    </>
  )
}

EditList.propTypes = {
  placeholder: PropTypes.string,
  elements: PropTypes.array,
  setElements: PropTypes.func,
}

export default EditList
