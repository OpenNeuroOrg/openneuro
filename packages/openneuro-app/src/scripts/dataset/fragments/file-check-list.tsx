import React from "react"

export const FileCheckList = ({ fileCheck }) => {
  if (!fileCheck) return null
  return (
    <table className="table file-check-table">
      <thead>
        <tr>
          <th>File</th>
          <th>Key</th>
          <th>Error Messages</th>
        </tr>
      </thead>
      <tbody>
        {fileCheck.annexFsck.map((item, index) => (
          <tr key={index}>
            <td>{item.file}</td>
            <td>{item.key}</td>
            <td>
              {item.errorMessages && item.errorMessages.length > 0
                ? (
                  <ul>
                    {item.errorMessages.map((msg, i) => <li key={i}>{msg}</li>)}
                  </ul>
                )
                : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
