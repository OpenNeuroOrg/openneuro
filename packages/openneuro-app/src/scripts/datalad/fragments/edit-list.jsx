import React, { useState } from 'react'
import PropTypes from 'prop-types'

/**
 * Generic add/remove strings from an Array list
 */
const EditList = ({ placeholder, elements, setElements }) => {
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
      <div className="row">
        <ul>
          {elements.map((element, index) => (
            <div className="change col-xs-12" key={index}>
              <div className="change-text col-xs-8">{element}</div>
              <div className="col-xs-3 change-controls">
                <a onClick={removeElement(index)}>
                  <i className="fa fa-times" />
                  Remove
                </a>
              </div>
            </div>
          ))}
        </ul>
      </div>
      <div className="row">
        <div className="col-xs-8">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder={placeholder}
              value={newElement}
              onChange={e => updateNewElement(e.target.value)}
            />
            <span className="input-group-btn">
              <button
                className="btn btn-default"
                type="button"
                onClick={() => {
                  setElements([...elements, newElement])
                  updateNewElement('')
                }}>
                Add
              </button>
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditList
