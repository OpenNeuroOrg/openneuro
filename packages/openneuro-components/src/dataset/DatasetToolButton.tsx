import React from "react"
import styled, { StyledComponent } from "@emotion/styled"
import { Link } from "react-router-dom"
import { Tooltip } from "../tooltip/Tooltip"
import { Icon } from "../icon/Icon"
import { useLocation } from "react-router-dom"

interface DatasetToolStyleProps {
  active: boolean
}

export const DatasetToolStyle: StyledComponent<DatasetToolStyleProps> = styled
  .span<DatasetToolStyleProps>(
    (props) => `
  display: flex;
  margin: 0 auto 10px;
  flex-basis: auto;
  padding: 0 15px;
  justify-content: center;
  a {
    color: var(--current-theme-primary);
    font-size: 17px;
    text-decoration: none;
    font-weight: 400;
    padding: 4px;
    border-bottom: 2px solid transparent;
    border-bottom-color: ${
      props.active ? "var(--current-theme-primary)" : "transparent"
    };
    i {
      margin-right: 6px;
      font-size: 15px;
    }
    &:hover {
      border-bottom-color: var(--current-theme-primary);
    }
  }
`,
  )

export const DatasetToolButton = ({ path, icon, tooltip, label }) => {
  const location = useLocation()
  return (
    <DatasetToolStyle active={location.pathname == path}>
      <Tooltip tooltip={tooltip} flow="up">
        <Link to={path}>
          <Icon icon={`fa ${icon}`} label={label} />
        </Link>
      </Tooltip>
    </DatasetToolStyle>
  )
}
