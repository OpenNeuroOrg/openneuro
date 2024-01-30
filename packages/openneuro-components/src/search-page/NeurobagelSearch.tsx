import React from "react"

import NeurobagelLogo from "./neurobagel_logo.svg"
import { AccordionTab } from "../accordion/AccordionTab"
import { AccordionWrap } from "../accordion/AccordionWrap"
import { Icon } from "@openneuro/components/icon"
import styled from "@emotion/styled"

const NeurobagelSearchDiv = styled.div`
display: block;
margin-left: auto;
// margin-right: auto;
width: 280px;
// text-align: end;
border: 0;
border-radius: 0;
padding: 0;
background: none;
  img.inline-icon {
    height: 1.1em;
    vertical-align: middle;
  }
  .on-accordion-wrapper .keyword-accordion {
    .accordion-title {
        position: absolute;
        top: -20px;
        @media (max-width: 394px) {
          left: 115px;
        }
        left: 252px;
    }
  }
`

export const NeurobagelSearch = () => {
  return (
    <NeurobagelSearchDiv>
      <img src={NeurobagelLogo} className="inline-icon"/>{" "}
      <a href="https://query.neurobagel.org/?node=OpenNeuro" target="_blank">
        Neurobagel participant search
      </a>        
      <AccordionWrap>
        <AccordionTab
        accordionStyle="plain"
        label="?"
        className="keyword-accordion"
        >
          <span>
            Search at the participant level is provided by{" "}
            <a href="https://neurobagel.org" target="_blank">
            Neurobagel
            </a>
            {", "}a third party project.

            Neurobagel is a collection of tools for harmonizing phenotypic 
            and imaging data descriptions, searching for participants across datasets, 
            and constructing cohorts from multiple source datasets.
          </span>
        </AccordionTab>
      </AccordionWrap>
    </NeurobagelSearchDiv>
  )
}