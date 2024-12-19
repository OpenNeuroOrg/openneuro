import React, { useState } from "react";
import { EditList } from "./edit-list";
import { EditString } from "./edit-string";
import { EditButton } from "./edit-button";
import { CloseButton } from "./close-button";
import { Markdown } from "../../utils/markdown";
import '../scss/editable-content.scss'

interface EditableContentProps {
  editableContent: string[] | string;
  setRows: React.Dispatch<React.SetStateAction<string[] | string>>;
  className: string;
  heading: string;
}

export const EditableContent: React.FC<EditableContentProps> = ({
  editableContent,
  setRows,
  className,
  heading,
}) => {
  const [editing, setEditing] = useState(false);

  return (
    <div className={`user-meta-block ${className}`}>
      <span className="umb-heading"><h4>{heading}</h4>{editing ? <CloseButton action={() => setEditing(false)} /> : <EditButton action={() => setEditing(true)} />}</span>
      {editing ? (
        <>
          {Array.isArray(editableContent) ? (
            <EditList
              placeholder="Add new item"
              elements={editableContent}
              setElements={setRows as React.Dispatch<React.SetStateAction<string[]>>}
            />
          ) : (
            <EditString
              value={editableContent}
              setValue={setRows as React.Dispatch<React.SetStateAction<string>>}
              placeholder="Edit content"
            />
          )}
        </>
      ) : (
        <>
          {Array.isArray(editableContent) ? (
            <ul>
              {editableContent.map((item, index) => (
                <li key={index}>
                  <Markdown>{item}</Markdown>
                </li>
              ))}
            </ul>
          ) : (
            <Markdown>{editableContent}</Markdown>
          )}
        </>
      )}
    </div>
  );
};



