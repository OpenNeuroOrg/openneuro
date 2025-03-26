import React from "react"
import "./header.scss"
export interface HeaderProps {
  profile?: {
    name: string
    admin: boolean
    email: string
    provider: string
  }
  expanded?: boolean
  isOpenSupport: boolean
  toggleLoginModal: (
    userModalParams?: React.MouseEvent<Element, MouseEvent>,
  ) => void
  signOutAndRedirect: () => void
  toggleSupport: () => void
  navigateToNewSearch: (resetSearchParams?: boolean) => void
  renderOnExpanded: (profile: any) => React.ReactNode
  renderOnFreshDeskWidget: () => React.ReactNode
  renderUploader: () => React.ReactNode
}
export declare const Header: ({
  profile,
  expanded,
  isOpenSupport,
  toggleLoginModal,
  signOutAndRedirect,
  toggleSupport,
  navigateToNewSearch,
  renderOnExpanded,
  renderOnFreshDeskWidget,
  renderUploader,
}: HeaderProps) => JSX.Element
//# sourceMappingURL=Header.d.ts.map
