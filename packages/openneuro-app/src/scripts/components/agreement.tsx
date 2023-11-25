import React from "react"
import { useLocalStorage } from "../utils/local-storage"
import styled from "@emotion/styled"

const STORAGE_KEY = "openneuro-terms"

const AgreementDiv = styled.div`
  overflow: hidden;
  position: fixed;
  bottom: 0;
  height: 96px;
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
  transform: translateY(-50%);
`

/**
 * Floating agreement for data use that is only present if the user has not accepted this
 */
export const Agreement = () => {
  const [agreed, setAgreed] = useLocalStorage(STORAGE_KEY, false)

  if (agreed) {
    return null
  } else {
    return (
      <AgreementDiv>
        <div className="container">
          <div className="grid grid-between">
            <div className="col col-lg col-11">
              The agreement text goes here. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Vivamus a condimentum nibh.
              Pellentesque aliquet volutpat odio sit amet imperdiet. Praesent
              erat lorem, varius in libero sit amet, pulvinar placerat enim. Sed
              lacus nibh, dapibus vitae fermentum sit amet, volutpat at purus.
              Cras accumsan, massa vitae sagittis cursus, magna lorem finibus
              orci, sit amet sollicitudin arcu turpis quis mi. Aenean vel
              feugiat arcu. Morbi congue nulla quam, eu hendrerit metus viverra
              vel. Vestibulum non urna dignissim, tincidunt enim sit amet,
              molestie nisi. Pellentesque sed lacus eu quam ultricies ultricies
              at eu sem. Suspendisse sed eleifend lorem, vel fermentum odio.
              Vivamus nunc lorem, ultricies vel tellus eget, molestie tristique
              metus.
            </div>
            <div className="col col-lg col-1">
              <AgreementButton
                className="on-button on-button--small on-button--primary"
                onClick={() => setAgreed(true)}
              >
                I Agree
              </AgreementButton>
            </div>
          </div>
        </div>
      </AgreementDiv>
    )
  }
}
