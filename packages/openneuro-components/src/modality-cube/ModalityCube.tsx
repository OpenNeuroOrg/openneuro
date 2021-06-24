import React from 'react'

import './modality-cube.scss'
import { toLowerCase } from './modality-cube.scss'

export interface ModalityCubeProps {
  label: string
  stats: string
  cubeImage: string
}

export const ModalityCube: React.FC<ModalityCubeProps> = ({
  label,
  stats,
  cubeImage,
}) => {
  return (
    <li className="hex">
      <a href={'search/' + label.toLowerCase()}>
        <div className={'hexIn ' + label.toLowerCase() + '-cube'}>
          <div>
            <div
              className="img"
              style={{ backgroundImage: `url(${cubeImage})` }}>
              <div className="modality-cube">
                <div className="front">
                  <span className="label">{label}</span>
                </div>
                <div className="top"></div>
                <div className="right"></div>
              </div>
              <h3 className="content1">{label}</h3>
              <div className="content2">{stats}</div>
            </div>
          </div>
        </div>
      </a>
    </li>
  )
}
