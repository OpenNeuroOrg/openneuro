import React from 'react'

import { AffiliateBlock } from './AffiliateBlock'
import { ActivitySliderFront } from './ActivitySlider'
import { Contributors } from './Contributors'
import { GetUpdates } from './GetUpdates'
import { Infographic } from './Infographic'

import './front-page.scss'

export interface FrontPageProps {}

export const FrontPage: React.FC<FrontPageProps> = ({}) => (
  <>
    <div className="page">
      <section>
        <AffiliateBlock />
      </section>
      <section>
        <Infographic />
      </section>
      <section className="front-page-activity">
        <div className="activity-swoop">
          <div></div>
        </div>
        <div className="swoop-content gray-bg">
          <ActivitySliderFront />
        </div>
      </section>
      <section className="gray-bg">
        <GetUpdates />
      </section>
      <section className="gray-bg">
        <Contributors />
      </section>
    </div>
  </>
)
