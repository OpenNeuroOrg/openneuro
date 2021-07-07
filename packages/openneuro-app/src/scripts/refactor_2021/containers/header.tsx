import React, { FC, useContext } from 'react'
import useState from 'react-usestateref'
import { Header, LandingExpandedHeader } from '@openneuro/components'
import ModalitySelect from '../search/inputs/modality-select'
import { SearchParamsCtx } from '../search/search-params-ctx'
import initialSearchParams from '../search/initial-search-params'
import { UserModalOpenCtx } from '../user-login-modal-ctx'
import { Input } from '@openneuro/components'
import { useLocation, useHistory } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import signOut from '../authentication/signOut'
import { getUnexpiredProfile } from '../authentication/profile'
import FreshdeskWidget from '../freshdesk-widget'
import AggregateCountsContainer from '../aggregate-queries/aggregate-counts-container'
import loginUrls from '../authentication/loginUrls'

const HeaderContainer: FC = () => {
  const history = useHistory()

  const { pathname: currentPath } = useLocation()
  const expanded = currentPath === '/'

  const [cookies] = useCookies()
  const profile = getUnexpiredProfile(cookies)

  const { setSearchParams } = useContext(SearchParamsCtx)
  const { userModalOpen, setUserModalOpen } = useContext(UserModalOpenCtx)

  const [newKeyword, setNewKeyword, newKeywordRef] = useState('')

  const handleSubmit = () => {
    // reset search params and set keyword to initiate new search, then navigate to global search page
    if (newKeywordRef.current) {
      setSearchParams(() => ({
        ...initialSearchParams,
        keywords: [newKeywordRef.current],
      }))
    }
    setNewKeyword('')
    history.push('/search')
  }

  const toggleLoginModal = (): void => {
    setUserModalOpen(prevState => ({
      ...prevState,
      userModalOpen: !prevState.userModalOpen,
    }))
  }

  const signOutAndRedirect = () => {
    signOut()
    const homepage = '/'
    if (window.location.pathname === homepage) window.location.reload()
    else window.location.pathname = homepage
  }

  const [isOpenSupport, setSupportIsOpen] = React.useState(false)
  const [isOpenUpload, setUploadIsOpen] = React.useState(false)

  const toggleUpload = () => setUploadIsOpen(prevIsOpen => !prevIsOpen)
  const toggleSupport = () => setSupportIsOpen(prevIsOpen => !prevIsOpen)

  return (
    <Header
      isOpenSupport={isOpenSupport}
      isOpenUpload={isOpenUpload}
      toggleLoginModal={toggleLoginModal}
      signOutAndRedirect={signOutAndRedirect}
      toggleSupport={toggleSupport}
      toggleUpload={toggleUpload}
      profile={profile}
      expanded={expanded}
      renderOnFreshDeskWidget={() => <FreshdeskWidget />}
      renderOnExpanded={profile => (
        <LandingExpandedHeader
          user={profile}
          loginUrls={loginUrls}
          renderAggregateCounts={(modality: string) => (
            <AggregateCountsContainer modality={modality} />
          )}
          renderFacetSelect={() => (
            <ModalitySelect
              startOpen={false}
              label="Browse by Modalities"
              dropdown={true}
            />
          )}
          renderSearchInput={() => (
            <Input
              placeholder="Search"
              type="text"
              name="front-page-search"
              labelStyle="default"
              value={newKeyword}
              setValue={setNewKeyword}
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  handleSubmit()
                }
              }}
            />
          )}
          onSearch={() => {
            handleSubmit()
          }}
        />
      )}
    />
  )
}

export default HeaderContainer
