import React, { useEffect } from "react"
import { AccordionTab } from "@openneuro/components/accordion"
import { AccordionWrap } from "@openneuro/components/accordion/"
import styled from "@emotion/styled"
import { toast } from "react-toastify"
import { useSearchParams } from "react-router-dom" // React Router for URL parsing

interface GitHubAuthButtonProps {
  sync: Date | null
}

const GithubSyncDiv = styled.div`
  .synced-btn {
    border-radius: var(--border-radius-default);
    padding: 2px 10px;
    transition: background-color 0.3s;
    border: 1px solid var(--current-theme-secondary);
    margin: 10px;

    &:hover {
      background-color: var(--current-theme-primary-ultralight);
       color: var(--current-theme-primary);
    }
    &.active {
      background-color: transparent;
      color: var(--current-theme-primary);
      border-color: var(--current-theme-primary-hover);
    }
  }

  img.inline-icon {
    height: 1.1em;
    vertical-align: middle;
  }

  .on-accordion-wrapper {
    margin-top: 5px;
    .keyword-accordion {
      .accordion-title {
        position: absolute;
        top: -25px;
        left: 270px;
      }
      &.synced .accordion-title {
        left: 430px;
      }
    }
  }
`

export const GitHubAuthButton: React.FC<GitHubAuthButtonProps> = ({ sync }) => {
  const lastSyncedText = sync ? `Last synced: ${sync.toLocaleString()}` : null
  const [searchParams] = useSearchParams()
  useEffect(() => {
    const error = searchParams.get("error")

    if (error === "orcid_required") {
      toast.error("Please login with your ORCID account")
    } else if (error) {
      toast.error(error.replace(/_/g, " ")) // Replace underscores with spaces for readability
    }

    const success = searchParams.get("success")
    if (success === "github_auth_success") {
      toast.success("GitHub linked!")
    }
  }, [searchParams])

  return (
    <GithubSyncDiv>
      <a
        href="/crn/auth/github"
        className="synced-btn"
        data-testid="github-sync-button" // Added data-testid here
      >
        Link user data from <i className="fab fa-github"></i> GitHub
      </a>
      <span>
        {lastSyncedText && (
          <small className="synced-text">{lastSyncedText}</small>
        )}
      </span>
      <AccordionWrap>
        <AccordionTab
          accordionStyle="plain"
          label="?"
          className={lastSyncedText
            ? "keyword-accordion synced"
            : "keyword-accordion"}
        >
          <span>
            Link profile data from GitHub (avatar, institution, or location).
          </span>
        </AccordionTab>
      </AccordionWrap>
    </GithubSyncDiv>
  )
}
