import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@openneuro/components/button";
import './scss/user-meta-blocks.scss'

/**
 * EditList Component
 * Allows adding and removing strings from a list.
 */
export const EditList = ({ placeholder, elements = [], setElements }) => {
  const [newElement, setNewElement] = useState("");
  const [warnEmpty, setWarnEmpty] = useState(false);

  /**
   * Remove an element from the list by index
   * @param {number} index - The index of the element to remove
   */
  const removeElement = (index) => {
    setElements(elements.filter((_, i) => i !== index));
  };

  /**
   * Add a new element to the list
   */
  const addElement = () => {
    if (!newElement.trim()) {
      setWarnEmpty(true);
    } else {
      setElements([...elements, newElement.trim()]);
      setWarnEmpty(false);
      setNewElement("");
    }
  };

  return (
    <div className="edit-list-container">
      <div className="el-group">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={newElement}
          onChange={(e) => setNewElement(e.target.value)}
        />
        <Button
          className="edit-list-add"
          primary={true}
          size="small"
          label="Add"
          onClick={addElement}
        />
      </div>
      {warnEmpty && <small className="warning-text">Your input was empty</small>}
      <div className="edit-list-items">
        {elements.map((element, index) => (
          <div key={index} className="edit-list-group-item">
            {element}
            <Button
              className="edit-list-remove"
              nobg={true}
              size="xsmall"
              icon="fa fa-times"
              label="Remove"
              color="red"
              onClick={() => removeElement(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// PropTypes for type-checking
EditList.propTypes = {
  placeholder: PropTypes.string,
  elements: PropTypes.arrayOf(PropTypes.string),
  setElements: PropTypes.func.isRequired,
};

// Default Props
EditList.defaultProps = {
  placeholder: "Enter item",
  elements: [],
};

export default EditList;
