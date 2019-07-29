import React from 'react'
import DatasetCount from './dataset-count.jsx'
import UserCount from './user-count.jsx'
import styled from '@emotion/styled'

const breakpoint = '@media (max-width: 900px)'

const StatsSection = styled.section({
  backgroundColor: 'white',
  padding: '4rem 0'
})
const StatsContainer = styled.div({
  backgroundColor: '#f5f5f5',
  margin: 'auto',
  width: '90rem',
  display: 'flex',
  justifyContent: 'space-between',
  fontFamily: ['"Open Sans", sans-serif', 'var(--font-family-open)'],
  [breakpoint]: {
    flexDirection: 'column',
    maxWidth: '45rem',
    width: '100%',
  }
})
const Panel = styled.section({
 backgroundColor: 'transparent',
 flexBasis: '1px',
 flexGrow: '1',
 padding: '2rem 0 3rem',
 textAlign: 'center'
})
const Value = styled.div({
  color: '#007C92',
  fontSize: '70px',

})
const Label = styled.div({
  fontWeight: '200',
  fontSize: '40px',
})
const VerticalDivider = styled.div({
  width: '2px',
  backgroundColor: 'white',
  margin: '1rem 0',
  [breakpoint]: {
    height: '2px',
    width: 'calc(100% - 4rem)',
    margin: '0 auto',
  }
})

const FrontPageStats = () => (
  <StatsSection className="openneuro-stats">
    <StatsContainer>
      <Panel className="dataset-count">
        <Value><DatasetCount/></Value>
        <Label>Public Datasets</Label>
      </Panel>
      <VerticalDivider/>
      <Panel className="participant-count">
        <Value><UserCount/></Value>
        <Label>Participants</Label>
      </Panel>
    </StatsContainer>
  </StatsSection>
)

export default FrontPageStats
