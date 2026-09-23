import React from "react"
import { DatasetAlert } from "../components/DatasetAlert"

export const DatasetAlertSynthetic: React.FC = (
  {},
) => (
  <DatasetAlert
    alert="This dataset contains synthetic data."
    level="warning"
  >
  </DatasetAlert>
)
