import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@openneuro/components/button'

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

  const updateElements = () => {
    setElements([...elements, newElement])
    updateNewElement('')
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
          <Button
            className="edit-list-add"
            primary={true}
            size="small"
            label="Add"
            onClick={() => {
              updateElements()
            }}
          />
        </span>
      </div>
      <div>
        {elements.map((element, index) => (
          <div key={index}>
            <div className="input-group">
              <span className="input-group-addon" style={{ width: '100%' }}>
                {element}
              </span>
              <div className="input-group-btn">
                <Button
                  className="edit-list-add"
                  nobg={true}
                  size="xsmall"
                  icon="fa fa-times"
                  label="Remove"
                  color="red"
                  onClick={removeElement(index)}
                />
              </div>
            </div>
          </div>
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
