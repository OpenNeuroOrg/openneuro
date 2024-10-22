import React, { FC, useContext } from "react"
import useState from "react-usestateref"
import UploaderContext from "../../uploader/uploader-context.js"
import UploadProgress from "../../uploader/upload-progress.jsx"
import { Header, LandingExpandedHeader } from "@openneuro/components/header"
import { Input } from "@openneuro/components/input"
import ModalitySelect from "../../search/inputs/modality-select"
import { UserModalOpenCtx } from "../../utils/user-login-modal-ctx"
import { useLocation, useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie"
import signOut from "../../authentication/signOut"
import { getUnexpiredProfile } from "../../authentication/profile"
import FreshdeskWidget from "../partials/freshdesk-widget"
import AggregateCountsContainer from "../../pages/front-page/aggregate-queries/aggregate-counts-container"
import loginUrls from "../../authentication/loginUrls"
import UploaderView from "../../uploader/uploader-view.jsx"
import UploadButton from "../../uploader/upload-button.jsx"
import UploadProgressButton from "../../uploader/upload-progress-button.jsx"

export const HeaderContainer: FC = () => {
  const navigate = useNavigate()

  const { pathname: currentPath } = useLocation()
  const expanded = currentPath === "/"

  const [cookies] = useCookies()
  const profile = getUnexpiredProfile(cookies)

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { userModalOpen, setUserModalOpen } = useContext(UserModalOpenCtx)

  const [newKeyword, setNewKeyword, newKeywordRef] = useState("")

  const handleSubmit = () => {
    const newQuery = {
      keywords: newKeywordRef.current ? [newKeywordRef.current] : [],
    }
    const query = JSON.stringify(newQuery)
    setNewKeyword("")
    if (
      newQuery?.keywords?.length && newQuery.keywords[0].match(/^ds[0-9]{6,6}$/)
    ) {
      navigate(`/datasets/${newQuery.keywords[0]}`)
    } else {
      navigate(`/search?query=${query}`)
    }
  }

  const toggleLoginModal = (): void => {
    setUserModalOpen((prevState) => ({
      ...prevState,
      userModalOpen: !prevState.userModalOpen,
    }))
  }

  const signOutAndRedirect = () => {
    signOut()
    const homepage = "/"
    if (window.location.pathname === homepage) window.location.reload()
    else window.location.pathname = homepage
  }

  const [isOpenSupport, setSupportIsOpen] = React.useState(false)

  const toggleSupport = () => setSupportIsOpen((prevIsOpen) => !prevIsOpen)

  return (
    <>
      <UploaderContext.Consumer>
        {(uploader) => {
          if (uploader?.uploading) {
            return (
              <span className="header-progress-wrap">
                <UploadProgress progress={uploader.progress} />
              </span>
            )
          } else {
            return
          }
        }}
      </UploaderContext.Consumer>
      <Header
        isOpenSupport={isOpenSupport}
        toggleLoginModal={toggleLoginModal}
        signOutAndRedirect={signOutAndRedirect}
        toggleSupport={toggleSupport}
        profile={profile}
        expanded={expanded}
        navigateToNewSearch={handleSubmit}
        renderUploader={() => (
          <UploaderContext.Consumer>
            {(uploader) => {
              if (uploader?.uploading) {
                return <UploadProgressButton />
              } else {
                return (
                  <UploadButton
                    onClick={() => uploader.setLocation("/upload")}
                  />
                )
              }
            }}
          </UploaderContext.Consumer>
        )}
        renderOnFreshDeskWidget={() => <FreshdeskWidget />}
        renderOnExpanded={(profile) => (
          <LandingExpandedHeader
            user={profile}
            loginUrls={loginUrls}
            renderAggregateCounts={(modality: string) => (
              <AggregateCountsContainer modality={modality} />
            )}
            renderFacetSelect={() => (
              <ModalitySelect
                inHeader={true}
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
                onKeyDown={(e) => {
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
      <UploaderContext.Consumer>
        {(uploader) => <UploaderView uploader={uploader} />}
      </UploaderContext.Consumer>
    </>
  )
}

export default HeaderContainer
