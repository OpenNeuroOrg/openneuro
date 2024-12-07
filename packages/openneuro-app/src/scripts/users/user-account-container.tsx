import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { UserCard } from './user-card'
import { UserAccountTabs } from './user-account-tabs'
import styles from './scss/usercontainer.module.scss'

export interface AccountContainerProps {
	user: any
	hasEdit: boolean
}

export const UserAccountContainer: React.FC<AccountContainerProps> = ({
	user,
	hasEdit,
}) => {
	return (
		<div className={styles.usercontainer}>
			<div className={styles.userInfo}>
				<UserCard user={user} />
				<UserAccountTabs hasEdit={hasEdit} />
			</div>
			<div className={styles.userViews}>
				<Outlet />
			</div>
		</div>
	)
}
