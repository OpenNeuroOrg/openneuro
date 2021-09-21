import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

export const TooltipSpan = styled.span`
  &::before {
    content: attr(data-tip);

    position: absolute;
    top: 20px;
    z-index: 9001;
    height: 24px;
    border: 1px solid #ddd;
    padding: 0px 10px;

    color: #565656;
    font-size: 12px;
    white-space: nowrap;
    line-height: 24px;

    opacity: 0;
    right: -10000px;
    box-shadow: 0 0 0 #ddd;
    transition: opacity 0.4s ease-out, box-shadow 0.4s ease-out;
  }

  &:hover::before {
    opacity: 1;
    right: 15px;
    box-shadow: 0 2px 5px #ddd;
    background-color: white;
  }
`
const CopyButton = styled('i')({
  cursor: 'copy',
})

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const success = document.execCommand('copy')
    console.log(
      `Copying text command was ${success ? 'successful!' : 'unsuccessful.'}`,
    )
  } catch (err) {
    console.error('Could not copy text: ', err)
  }

  document.body.removeChild(textArea)
}

function copyTextToClipboard(text) {
  if (!navigator.clipboard) fallbackCopyTextToClipboard(text)
  else
    navigator.clipboard.writeText(text).then(
      () => console.log('Copying to clipboard was successful!'),
      err => console.error('Could not copy text: ', err),
    )
}

const Tooltip = ({ text, tip }) => (
  <TooltipSpan data-tip={tip}>
    {text}&nbsp;
    <CopyButton
      className="fa fa-copy"
      onClick={() => copyTextToClipboard(tip)}
    />
  </TooltipSpan>
)

Tooltip.propTypes = {
  text: PropTypes.string,
  tip: PropTypes.string,
}

export default Tooltip
