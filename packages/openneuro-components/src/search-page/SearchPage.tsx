import React from 'react'

import './search-page.scss'

export interface SearchPageProps {}

export const SearchPage = ({}: SearchPageProps) => {
  return (
    <>
      <div className="page">
        <section className="search-page-portal-header">
          <div className="container">
            <div className="grid grid-start">
              <div className="col col-7">
                <h1>OpenNeuro Pet</h1>
                <div className="primary-content">
                  The OpenNeuro platform was developed by the Center for
                  Reproducible Neuroscience as a tool to encourage and enhance
                  data sharing and analysis of raw MRI data, using BIDS to
                  organize and standardize this data. Since its release in 2017,
                  the site has seen the upload of more than 200 public
                  MRI-specific datasets.
                </div>
                <div className="secondary-content">
                  Visit the Eventbright for more information.
                </div>
              </div>
              <div className="col">
                <div
                  className="search-hexagon"
                  style={{
                    backgroundImage: `url(http://csshexagon.com/img/meow.jpg)`,
                  }}>
                  <div className="hexTop"></div>
                  <div className="hexBottom"></div>
                </div>
                <div className="search-shade-cube">
                  <div className="front"></div>
                  <div className="top"></div>
                  <div className="right"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="swoop-wrap">
            <div
              className="search-swoop"
              style={{
                backgroundColor: `rgb(45,34,64)`,
                background: `linear-gradient(16deg, rgba(45,34,64,1) 0%, rgba(109,83,156,1) 70%)`,
              }}>
              <div></div>
            </div>
          </div>
        </section>
        <section className="search-page-coms">
          <div className="container">
            <div className="grid grid-start">
              <div className="col col-7">
                <h2>Join the PET hackathon on July, 1st 2021</h2>
                <div className="primary-content">
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deser unt mollit anim id est laborumror sit
                  voluptatem accusantium doloremque.
                </div>
                <div className="secondary-content">
                  Visit the Eventbright for more information.
                </div>
              </div>
            </div>
          </div>
          <div className="search-swoop">
            <div></div>
          </div>
        </section>

        <section className="search">
          <div className="container">
            <div className="grid grid-start">
              <div className="col col-4">facets</div>
              <div className="col col-8">results</div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
