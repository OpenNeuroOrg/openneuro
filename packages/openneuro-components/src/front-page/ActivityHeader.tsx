import React from "react"
import { Icon } from "../icon/Icon"
import activityIcon from "../assets/activity-icon.png"

export const ActivityHeader: React.FC = () => {
  return (
    <h2>
      <Icon label="Activity" imgSrc={activityIcon} iconSize="40px" />
    </h2>
  )
}
