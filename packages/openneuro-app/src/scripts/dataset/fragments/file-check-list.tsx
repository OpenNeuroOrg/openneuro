import React from "react"
import styles from "./scss/file-check-list.module.scss"

export const FileCheckList = ({ fileCheck }) => {
  if (!fileCheck) return null
  return (
    <div className={styles["fileCheck-container"]}>
      {fileCheck.annexFsck.map((item, index) => (
        <div key={index} className={styles["fileCheck-card"]}>
          <div className={styles["fileCheck-header"]}>
            <span className={styles["fileCheck-fileIcon"]}>
              <i className="fas fa-file"></i>
            </span>
            <span className={styles["fileCheck-fileName"]}>{item.file}</span>
          </div>
          <div className={styles["fileCheck-body"]}>
            <div className={styles["fileCheck-key"]}>
              <span className={styles["fileCheck-label"]}>Key:</span>
              <span className={styles["fileCheck-value"]}>{item.key}</span>
            </div>
            {item.errorMessages && item.errorMessages.length > 0 && (
              <div className={styles["fileCheck-errors"]}>
                <span className={styles["fileCheck-errorIcon"]}>
                  <i className="fas fa-exclamation"></i>
                </span>
                <span className={styles["fileCheck-label"]}>Errors:</span>
                <ul className={styles["fileCheck-errorList"]}>
                  {item.errorMessages.map((msg, i) => <li key={i}>{msg}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
