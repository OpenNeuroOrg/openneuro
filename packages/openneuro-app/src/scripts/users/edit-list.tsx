import React, { useState } from 'react';
import { Button } from '@openneuro/components/button';
import './scss/user-meta-blocks.scss';

interface EditListProps {
  placeholder?: string;
  elements?: string[];
  setElements: (elements: string[]) => void;
}

/**
 * EditList Component
 * Allows adding and removing strings from a list.
 */
export const EditList: React.FC<EditListProps> = ({ placeholder = 'Enter item', elements = [], setElements }) => {
  const [newElement, setNewElement] = useState<string>('');
  const [warnEmpty, setWarnEmpty] = useState<boolean>(false);

  /**
   * Remove an element from the list by index
   * @param index - The index of the element to remove
   */
  const removeElement = (index: number): void => {
    setElements(elements.filter((_, i) => i !== index));
  };

  /**
   * Add a new element to the list
   */
  const addElement = (): void => {
    if (!newElement.trim()) {
      setWarnEmpty(true);
    } else {
      setElements([...elements, newElement.trim()]);
      setWarnEmpty(false);
      setNewElement('');
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


