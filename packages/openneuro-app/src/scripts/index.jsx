import React from 'react'
import FeatureToggle from './components/feature-toggle'
import Redesign from './redesign'
import Classic from './classic'

const Index = () => {
  return (
    <FeatureToggle
      feature="redesign-2021"
      renderOnEnabled={() => <Redesign />}
      renderOnDisabled={() => <Classic />}
    />
  )
}

export default Index
