import React from "react"
import { ModalityHeader } from "./ModalityHeader"
import { CommunityHeader } from "./CommunityHeader"
import "./search-page.scss"

export interface PortalContent {
  className?: string
  portalName?: string
  pageBrand?: string
  portalPrimary?: string
  hexBackgroundImage?: string
  communityHeader?: string
  communityPrimary?: string
  communitySecondary?: string
}

export interface SearchPageProps {
  portalContent?: PortalContent
  renderSearchFacets: () => React.ReactNode
  renderSearchResultsList: () => React.ReactNode
  renderSortBy: () => React.ReactNode
  renderFilterBlock: () => React.ReactNode
  renderSearchHeader: () => React.ReactNode
  renderLoading: () => React.ReactNode
  renderAggregateCounts: () => React.ReactNode
}

export const SearchPage = ({
  portalContent,
  renderSearchFacets,
  renderSearchResultsList,
  renderSortBy,
  renderFilterBlock,
  renderSearchHeader,
  renderLoading,
  renderAggregateCounts,
}: SearchPageProps) => {
  const [isOpen, setOpen] = React.useState(false)
  return (
    <>
      <section
        className={`search search-page ${portalContent?.className || " "} ${
          isOpen ? " search-filters-open" : " "
        }`}
      >
        {portalContent
          ? (
            <>
              {portalContent.portalName
                ? (
                  <ModalityHeader
                    pageBrand={portalContent.pageBrand}
                    portalName={portalContent.portalName}
                    portalPrimary={portalContent.portalPrimary}
                    hexBackgroundImage={portalContent.hexBackgroundImage}
                    renderAggregateCounts={renderAggregateCounts}
                  />
                )
                : null}
              {portalContent.communityHeader
                ? (
                  <CommunityHeader
                    communityHeader={portalContent.communityHeader}
                    communityPrimary={portalContent.communityPrimary}
                    communitySecondary={portalContent.communitySecondary}
                  />
                )
                : null}
            </>
          )
          : null}
        <div className="container">
          <div className="grid grid-nogutter">
            <div className="col col-12 search-heading">
              <h1>{renderSearchHeader()}</h1>
            </div>

            <div className="col col-12 search-wrapper">
              <button
                className="show-filters-btn"
                onClick={() => setOpen(!isOpen)}
              >
                Show Filters
              </button>
              <div
                className={isOpen
                  ? "search-nav search-facet-wrapper show-mobile-filters"
                  : "search-nav search-facet-wrapper"}
              >
                <button
                  className="close-filters-btn"
                  onClick={() => setOpen(!isOpen)}
                >
                  Close Filters
                </button>
                {renderSearchFacets()}
              </div>
              <div className="search-content">
                {renderLoading()}
                <div className="grid grid-nogutter">
                  <div className="col col-12">{renderFilterBlock()}</div>
                  <div className="col col-12">
                    <div className="grid grid-nogutter">{renderSortBy()}</div>
                  </div>
                  {renderSearchResultsList()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
