import React, { useState } from "react";
import { EditableContent } from "./components/editable-content";
import styles from './scss/useraccountview.module.scss'

interface UserAccountViewProps {
  user: {
    name: string;
    email: string;
    orcid: string;
    links: string[];
    location: string;
    institution: string;
    github?: string;
  };
}

export const UserAccountView: React.FC<UserAccountViewProps> = ({ user }) => {
  const [userLinks, setLinks] = useState<string[]>(user.links || []);
  const [userLocation, setLocation] = useState<string>(user.location || "");
  const [userInstitution, setInstitution] = useState<string>(user.institution || "");

  return (
    <div data-testid="user-account-view" className={styles.useraccountview}>
      <h3>Account</h3>
      <ul className={styles.accountDetail}>
        <li>
          <span>Name:</span>
          {user.name}
        </li>
        <li>
          <span>Email:</span>
          {user.email}
        </li>
        <li>
          <span>ORCID:</span>
          {user.orcid}
        </li>
        {user.github ? <li><span>github:</span>{user.github}</li> : <li>Connect your github</li>}
      </ul>

      <EditableContent
        editableContent={userLinks}
        setRows={setLinks}
        className="custom-class"
        heading="Links"
      />
      <EditableContent
        editableContent={userLocation}
        setRows={(newLocation: string) => setLocation(newLocation)}
        className="custom-class"
        heading="Location"
      />
      <EditableContent
        editableContent={userInstitution}
        setRows={(newInstitution: string) => setInstitution(newInstitution)}
        className="custom-class"
        heading="Institution"
      />
    </div>
  );
};

