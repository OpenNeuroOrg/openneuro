import React from "react"
import styles from "./scss/usercard.module.scss"
import type { UserCardProps } from "../types/user-types"

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const { location, institution, email, orcid, links = [], github, name } = user
  return (
    <div className={styles.userCard}>
      <ul>
        {institution && (
          <li>
            <i className="fa fa-building"></i>
            {institution}
          </li>
        )}
        {location && (
          <li>
            <i className="fas fa-map-marker-alt"></i>
            {location}
          </li>
        )}
        <li>
          <i className="fas fa-envelope"></i>
          <a href={"mailto:" + email} target="_blank" rel="noopener noreferrer">
            {email}
          </a>
        </li>
        {orcid && (
          <li className={styles.orcid}>
            <i className="fab fa-orcid" aria-hidden="true"></i>
            <a
              href={`https://orcid.org/${orcid}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`ORCID profile of ${name}`}
            >
              {orcid}
            </a>
          </li>
        )}
        {github && (
          <li>
            <i className="fab fa-github"></i>
            <a
              href={`https://github.com/${github}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Github profile of ${name}`}
            >
              {github}
            </a>
          </li>
        )}
        {links.length > 0 &&
          links.filter(Boolean).map((link, index) => (
            <li key={index}>
              <i className="fa fa-link"></i>
              <a href={link} target="_blank" rel="noopener noreferrer">
                {link}
              </a>
            </li>
          ))}
      </ul>
    </div>
  )
}
