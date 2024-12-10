import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./scss/usertabs.module.scss";

export interface UserAccountTabsProps {
  hasEdit: boolean;
}

export const UserAccountTabs: React.FC<UserAccountTabsProps> = ({ hasEdit }) => {
  const ulRef = useRef<HTMLUListElement>(null);
  const [activePosition, setActivePosition] = useState<number>(0);
  const [clicked, setClicked] = useState(false); // Track click state
  const location = useLocation();

  useEffect(() => {
    const activeLink = ulRef.current?.querySelector(`.${styles.active}`) as HTMLElement;
    if (activeLink) {
      const li = activeLink.parentElement as HTMLElement;
      setActivePosition(li.offsetTop);
    }
  }, [location]);

  const handleClick = () => {
    // Reset clicked state to false to restart animation
    setClicked(false);

    // Wait for a short time before re-enabling the animation
    setTimeout(() => {
      setClicked(true);
    }, 50); // Small delay to trigger the animation
  };

  if (!hasEdit) return null;

  return (
    <div className={styles.userAccountTabLinks}>
      <ul
        ref={ulRef}
        className={`${clicked ? styles.clicked : ""} ${styles.userAccountTabLinks}`}
        style={{ "--active-offset": `${activePosition}px` } as React.CSSProperties}
      >
        <li>
          <NavLink
            to=""
            end
            className={({ isActive }) => (isActive ? styles.active : "")}
            onClick={handleClick}
          >
            User Datasets
          </NavLink>
        </li>
        <li>
          <NavLink
            to="notifications"
            className={({ isActive }) => (isActive ? styles.active : "")}
            onClick={handleClick}
          >
            User Notifications
          </NavLink>
        </li>
        <li>
          <NavLink
            to="account"
            className={({ isActive }) => (isActive ? styles.active : "")}
            onClick={handleClick}
          >
            Account Info
          </NavLink>
        </li>
      </ul>
    </div>
  );
};
