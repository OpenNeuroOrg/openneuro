import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

const Span = styled.span`
  &::before {
    content: attr(data-tip);

    position: absolute;
    top: 20px;
    right: -9999px;
    z-index: 9001;
    height: 24px;
    padding: 0px 7px;
    color: #565656;
    font-size: 12px;
    white-space: nowrap;
    line-height: 24px;
    border: 1px solid #ddd;
    box-shadow: 0 0 0 #ddd;

    opacity: 0;
    transition: opacity 0.4s ease-out, box-shadow 0.4s ease-out;
  }

  &:hover::before {
    opacity: 1;
    right: 15px;
    box-shadow: 0 2px 5px #ddd;
  }
`

const Tooltip = ({ text, tip }) => <Span data-tip={tip}>{text}</Span>

Tooltip.propTypes = {
  text: PropTypes.string,
  tip: PropTypes.string,
}

export default Tooltip
