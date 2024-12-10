import React from 'react'
import { Outlet } from 'react-router-dom'
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
		<>
			<div className='container'>
				<header className={styles.userHeader}>
					<img className={styles.avatar} src={user.avatar} alt={user.name} />
					<h2 className={styles.username}>{user.name}</h2>
				</header>
			</div>
			<div className={styles.usercontainer + ' container'}>
				<section className={styles.userSidebar}>
					<UserCard user={user} />
					<UserAccountTabs hasEdit={hasEdit} />
				</section>
				<section className={styles.userViews}>
					<Outlet />
				</section>
			</div>
		</>
	)
}
