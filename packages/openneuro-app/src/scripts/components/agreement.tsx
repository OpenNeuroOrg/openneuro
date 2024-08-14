import React from "react"
import { useLocalStorage } from "../utils/local-storage"
import { DownloadAgreement } from "../common/content/download-agreement"
import styled from "@emotion/styled"

export const STORAGE_KEY = "agreement"

const AgreementDiv = styled.div`
  overflow: hidden;
  position: fixed;
  bottom: 0;
  width: 100%;
  background: white;
  z-index: 1005;
  -webkit-box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.5);
  -moz-box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.5);
  box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.5);
  padding: 4px;
`

const AgreementButton = styled.div`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

/**
 * Hook to use the download agreement state from localStorage
 */
export function useAgreement() {
  return useLocalStorage(STORAGE_KEY)
}

/**
 * Floating agreement for data use that is only present if the user has not accepted this
 */
export const Agreement = () => {
  const [agreed, setAgreed] = useAgreement()

  if (agreed) {
    return null
  } else {
    return (
      <AgreementDiv>
        <div className="container">
          <div className="grid grid-between">
            <div className="col col-lg col-11">
              <p>
                By clicking "I Agree", {DownloadAgreement}
              </p>
            </div>
            <div className="col col-lg col-1">
              <AgreementButton
                className="on-button on-button--small on-button--primary"
                onClick={() => setAgreed(true)}
                role="button"
              >
                I&nbsp;Agree
              </AgreementButton>
            </div>
          </div>
        </div>
      </AgreementDiv>
    )
  }
}
