import React from "react";
import styles from "./scss/usercard.module.scss";

export interface User {
    location: string;
    name: string;
    email: string;
    orcid: string;
    avatar: string;
    institution: string;
    links: string[];
}

export interface UserCardProps {
    user: User;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
    const { location, institution, name, email, orcid, avatar, links } = user;

    return (
        <div className={styles.userCard}>
            <div className={styles.userWrap}>
                <img className={styles.avatar} src={avatar} alt={name} />
                <h2 className={styles.username}>{name}</h2>
            </div>
            <ul>
                <li><i className="fa fa-building"></i>{institution}</li>
                <li><i className="fas fa-map-marker-alt"></i>{location}</li>
                <li><i className="fas fa-envelope"></i><a href={'mailto:'+email} target="_blank" rel="noopener noreferrer">{email}</a></li>
                <li className={styles.orcid}><i className="fab fa-orcid"></i><a href={'https://orcid.org/'+orcid} target="_blank" rel="noopener noreferrer">{orcid}</a></li>
                {links.map((link, index) =>
                    link ? (
                        <li key={index}>
                           <i className="fa fa-link"></i> <a href={link} target="_blank" rel="noopener noreferrer">
                                {link}
                            </a>
                        </li>
                    ) : null
                )}
            </ul>
        </div>
    );
};
