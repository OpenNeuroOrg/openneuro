import React, { FC, ReactElement } from 'react'
import { useCookies } from 'react-cookie'

interface FeatureToggleProps {
  feature: string
  renderOnEnabled: ReactElement
  renderOnDisabled: ReactElement
}

const FeatureToggle: FC<FeatureToggleProps> = ({
  feature,
  renderOnEnabled,
  renderOnDisabled,
}) => {
  const [cookies] = useCookies()
  return <>{cookies[feature] ? renderOnEnabled : renderOnDisabled}</>
}

export default FeatureToggle
