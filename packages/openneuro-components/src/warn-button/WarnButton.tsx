import React, { useRef, useEffect } from 'react'
import './warn-button.scss'
import { Tooltip } from '../tooltip/Tooltip'

export interface WarnButtonProps {
  message?: string
  icon?: string
  warn?: boolean
  tooltip?: string
  link?: string
  cancel?: JSX.Element
  confirm?: JSX.Element
  validations?: []
  onClick?: () => void
  prepDownload?: () => void
  lock?: boolean
  modalLink?: string
  location?: object
}
export const WarnButton = ({
  message,
  icon,
  warn,
  tooltip,
  link,
  cancel,
  confirm,
  validations,
  onClick,
  prepDownload,
  lock,
  modalLink,
  location,
}: WarnButtonProps) => {
  const [displayOptions, setDisplayOptions] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  // const toggle = action => {
  //   // initial click actions
  //   if (displayOptions == false) {
  //    // validate & warn
  //     if (validations) {
  //       for (let i = 0; i < validations.length; i++) {
  //         const validation = validations[i]
  //         if (validation.check) {
  //           toast.error(
  //             <ToastContent
  //               title={validation.type}
  //               body={validation.message}
  //             />,
  //             { autoClose: validation.timeout ? validation.timeout : 5000 },
  //           )
  //           return
  //         }
  //       }
  //     }

  //     // generate download links
  //     if (prepDownload) {
  //       setLoading(true)
  //       setDisplayOptions(true)
  //       prepDownload(link => {
  //         this.setState({ displayOptions: true, link: link, loading: false })
  //       })
  //       return
  //     }

  //     if (!warn) {
  //       // Wait 250ms before bothering to render loading
  //       const waitLoading = setTimeout(() => {
  //         setLoading(true)
  //       }, 250)
  //       action(() => {
  //         clearTimeout(waitLoading)
  //          if (this._mounted) {
  //         setLoading(false)
  //        }
  //       })
  //       return
  //     } else {
  //       setDisplayOptions(true)
  //       return
  //     }
  //   }
  // }

  // check for bad validations and add disabled class
  let disabled = false
  // if (validations) {
  //   for (let i = 0; i < validations.length; i++) {
  //     const validation = validations[i]
  //     // if (validation.check) {
  //     //   disabled = true
  //     // }
  //   }
  // }

  const viewAction = (
    <span className="btn-group slide-in-right-fast" role="group">
      <button
        className="btn-warn-component cancel"
        onClick={() => setDisplayOptions(!displayOptions)}>
        {cancel}
      </button>
      {link ? (
        <a className="btn-warn-component success" onClick={onClick} href={link}>
          {confirm}
        </a>
      ) : (
        <button className={'btn-warn-component success'} onClick={onClick}>
          {confirm}
        </button>
      )}
    </span>
  )

  const hideAction = (
    <span className={disabled ? ' disabled' : ''}>
      <button
        className="btn-warn-component warning"
        onClick={() => setDisplayOptions(!displayOptions)}
        disabled={lock}>
        <i className={'fa ' + icon} /> {message}
      </button>
    </span>
  )

  const button = displayOptions ? viewAction : hideAction
  const loadingWrapper = (
    <span className="btn-warn-load" role="group">
      <span className="warning-loading">
        <i className="fa fa-spin fa-circle-o-notch" />
      </span>
    </span>
  )

  return (
    <>
      {tooltip ? (
        <Tooltip flow="up" tooltip={tooltip}>
          {loading ? loadingWrapper : button}
        </Tooltip>
      ) : loading ? (
        loadingWrapper
      ) : (
        button
      )}
    </>
  )
}
