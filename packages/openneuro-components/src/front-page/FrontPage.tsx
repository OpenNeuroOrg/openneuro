import React from 'react'

import { Header } from '../header/Header'
import { AffiliateBlock } from './AffiliateBlock'
import { ActivitySliderFront } from './ActivitySlider'
import { Contributors } from './Contributors'
import { Infographic } from '../infographic/Infographic'

import { Footer } from '../footer/Footer'

import './front-page.scss'

export interface FrontPageProps {
  user?: {}
  onLogin: () => void
  onLogout: () => void
  onCreateAccount: () => void
}

export const FrontPage: React.FC<FrontPageProps> = ({
  user,
  onLogin,
  onLogout,
  onCreateAccount,
}) => (
  <>
    <article className="front-page">
      <Header
        user={user}
        onLogin={onLogin}
        onLogout={onLogout}
        onCreateAccount={onCreateAccount}
        expanded={true}
      />

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
        <Contributors />
      </section>
    </article>
    <div className="on-foot">
      <Footer />
    </div>
  </>
)
