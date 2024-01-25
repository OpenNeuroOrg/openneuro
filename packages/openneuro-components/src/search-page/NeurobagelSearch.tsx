import React from "react"
import { AccordionTab } from "../accordion/AccordionTab"
import { AccordionWrap } from "../accordion/AccordionWrap"
import { Icon } from "@openneuro/components/icon"
import styled from "@emotion/styled"

const NeurobagelSearchDiv = styled.div`
  padding-bottom: 10px;
  .on-accordion-wrapper .keyword-accordion {
    .accordion-title {
        position: absolute;
        top: -20px;
        @media (max-width: 394px) {
          left: 115px;
        }
        left: 350px;
    }
  }
`

export const NeurobagelSearch = () => {
  return (
    <NeurobagelSearchDiv>
      <a href="https://query.neurobagel.org/?node=OpenNeuro" target="_blank">
        <Icon icon="fas fa-user" label="Search at participant level with Neurobagel" />
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