import React, { FC, ReactNode } from 'react'
import { useCookies } from 'react-cookie'

interface FeatureToggleProps {
  renderOnEnabled(): ReactNode
  renderOnDisabled(): ReactNode
}

const FeatureToggle: FC<FeatureToggleProps> = ({
  feature,
  renderOnEnabled,
  renderOnDisabled,
}) => {
  const [cookies] = useCookies()
  return cookies[feature] ? renderOnEnabled() : renderOnDisabled()
}

export default FeatureToggle
