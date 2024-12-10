import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@openneuro/components/button";
import './scss/user-meta-blocks.scss'
/**
 * EditString Component
 * Allows editing a single string value.
 */
export const EditString = ({ value, setValue, placeholder }) => {
  const [currentValue, setCurrentValue] = useState(value || "");
  const [warnEmpty, setWarnEmpty] = useState(false);


  return (
    <div className="edit-string-container">
      <div className="edit-string-group">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
        />
        <Button
          className="edit-string-save"
          primary={true}
          size="small"
          label="Save"
          onClick={() =>alert('need to handlesave')}
        />
      </div>
      {warnEmpty && <small className="warning-text">The input cannot be empty</small>}
    </div>
  );
};

// PropTypes for type-checking
EditString.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

// Default Props
EditString.defaultProps = {
  value: "",
  placeholder: "Enter text",
};

export default EditString;
