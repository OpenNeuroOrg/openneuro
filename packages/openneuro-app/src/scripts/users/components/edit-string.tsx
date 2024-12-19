import React, { useState } from 'react';
import { Button } from '@openneuro/components/button';
import '../scss/user-meta-blocks.scss';

interface EditStringProps {
  value?: string;
  setValue: (value: string) => void;
  placeholder?: string;
}

/**
 * EditString Component
 * Allows editing a single string value.
 */
export const EditString: React.FC<EditStringProps> = ({ value = '', setValue, placeholder = 'Enter text' }) => {
  const [currentValue, setCurrentValue] = useState<string>(value);
  const [warnEmpty, setWarnEmpty] = useState<boolean>(false);

  const handleSave = (): void => {
    if (!currentValue.trim()) {
      setWarnEmpty(true);
    } else {
      setWarnEmpty(false);
      setValue(currentValue.trim());
    }
  };

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
          onClick={handleSave}
        />
      </div>
      {warnEmpty && <small className="warning-text">The input cannot be empty</small>}
    </div>
  );
};
