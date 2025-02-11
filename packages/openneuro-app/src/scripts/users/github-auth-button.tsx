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
    border: 1px solid var(--on-dark-aqua);
    padding: 3px 5px;
    border-radius: 4px;
    text-decoration: none;
    &:hover {
      background: #efefef;
      color: #333;
    }
  }

  img.inline-icon {
    height: 1.1em;
    vertical-align: middle;
  }

  .on-accordion-wrapper {
    .keyword-accordion {
      .accordion-title {
        position: absolute;
        top: -20px;
        left: 250px;
      }
      &.synced .accordion-title {
        left: 435px;
      }
    }
  }
`

export const GitHubAuthButton: React.FC<GitHubAuthButtonProps> = ({ sync }) => {
  const buttonText = sync ? "Re-sync" : "Sync"
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
      toast.success("GitHub data successfully synced!")
    }
  }, [searchParams])

  return (
    <GithubSyncDiv>
      <a
        href="/crn/auth/github"
        className="synced-btn"
        data-testid="github-sync-button" // Added data-testid here
      >
        {buttonText} user data from <i className="fab fa-github"></i> GitHub
      </a>
      <span>
        {lastSyncedText && (
          <small className="synced-text">- {lastSyncedText}</small>
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
            Here is some text for a description and/or policy for syncing data
          </span>
        </AccordionTab>
      </AccordionWrap>
    </GithubSyncDiv>
  )
}
