import React from 'react'
import FeatureToggle from './components/feature-toggle'
import Redesign from './redesign'
import Classic from './classic'

const Index = () => {
  return (
    <FeatureToggle
      feature="redesign-classic"
      renderOnEnabled={<Classic />}
      renderOnDisabled={<Redesign />}
    />
  )
}

export default Index
