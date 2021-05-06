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
              <div className="col col-6">
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
        <section className="search-page-coms">
          <div className="container">
            <div className="grid grid-start">
              <div className="col col-6">
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
