import React from "react"

import NeurobagelLogo from "./neurobagel_logo.svg"
import { AccordionTab } from "../../components/accordion/AccordionTab"
import { AccordionWrap } from "../../components/accordion/AccordionWrap"
import styled from "@emotion/styled"

const NeurobagelSearchDiv = styled.div`
padding-bottom: 15px;
border-bottom: 1px solid #dfdfdf; // $newspaper in _variables.scss
margin-bottom: 10px;
  img.inline-icon {
    height: 1.1em;
    vertical-align: middle;
  }
  .on-accordion-wrapper .keyword-accordion {
    .accordion-title {
        position: absolute;
        top: -20px;
        @media (max-width: 421px) {
          left: 93px;
        }
        @media (max-width: 330px) {
          left: 130px;
        }
        left: 375px;
    }
  }
`

export const NeurobagelSearch = () => {
  return (
    <NeurobagelSearchDiv>
      <img src={NeurobagelLogo} className="inline-icon" />{" "}
      <a href="https://query.neurobagel.org/?node=OpenNeuro" target="_blank">
        Search at the participant-level with Neurobagel
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

            Neurobagel is a collection of tools for harmonizing phenotypic and
            imaging data descriptions, searching for participants across
            datasets, and constructing cohorts from multiple source datasets.
          </span>
        </AccordionTab>
      </AccordionWrap>
    </NeurobagelSearchDiv>
  )
}
