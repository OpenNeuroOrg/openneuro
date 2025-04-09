import React from "react"
import styled from "@emotion/styled"
import type { StyledComponent } from "@emotion/styled"
import { Link } from "react-router-dom"
import { Tooltip } from "../../components/tooltip/Tooltip"
import { Icon } from "../../components/icon/Icon"
import { useLocation } from "react-router-dom"

interface DatasetToolStyleProps {
  active: boolean
  disable: boolean
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
    pointer-events: ${props.disable ? "none" : "auto"};
    color: ${
      props.disable ? "rgba(0, 0, 0, 0.5);" : "var(--current-theme-primary);"
    }
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

interface DatasetToolButtonProps {
  path: string
  label: string
  tooltip: string
  icon: string
  disable?: boolean
}

export const DatasetToolButton = (
  { path, icon, tooltip, label, disable = false }: DatasetToolButtonProps,
) => {
  const location = useLocation()
  return (
    <DatasetToolStyle active={location.pathname == path} disable={disable}>
      <Tooltip tooltip={tooltip} flow="up">
        <Link to={path}>
          <Icon icon={`fa ${icon}`} label={label} />
        </Link>
      </Tooltip>
    </DatasetToolStyle>
  )
}
