// react
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

// redux
import { connect } from 'react-redux';
import { markNotificationsRead } from '../../redux/actions/userActions';

// utils
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// semantic ui
import { Dropdown, Icon, Label } from 'semantic-ui-react';

// styles
import '../../styles/Notifications.css';

export class Notifications extends Component {
	onMenuOpened = () => {
		let unreadNotificationsIds = this.props.notifications
			.filter((notification) => !notification.read)
			.map((notification) => notification.notificationId);
		this.props.markNotificationsRead(unreadNotificationsIds);
	};

	render() {
		dayjs.extend(relativeTime);
		const notifications = this.props.notifications;

		let notificationIcon;

		if (notifications && notifications.length > 0) {
			// check if we have unread notifications
			const numNotifications = notifications.filter((notification) => notification.read === false).length;

			if (numNotifications > 0) {
				notificationIcon = (
					<Fragment>
						<Icon color='yellow' size='large' name='bell' />
						<Label size='tiny' color='red' floating>
							{numNotifications}
						</Label>
					</Fragment>
				);
			} else {
				notificationIcon = <Icon size='large' name='bell outline' />;
			}
		} else {
			notificationIcon = <Icon size='large' name='bell outline' />;
		}

		let notificationsMarkup =
			notifications && notifications.length > 0 ? (
				notifications.map((notification) => {
					const time = dayjs(notification.createdAt).fromNow();
					const iconFill = notification.read ? ' outline' : '';
					const icon =
						notification.type === 'like' ? (
							<Icon fitted name={`heart${iconFill}`} color='red' />
						) : (
							<Icon fitted name={`comment${iconFill}`} color='blue' />
						);

					return (
						<Dropdown.Item key={notification.createdAt}>
							<Link to={`/users/${notification.recipient}/squeak/${notification.squeakId}`}>
								{`${notification.sender}`} {icon} {`your squeak ${time}`}
							</Link>
						</Dropdown.Item>
					);
				})
			) : (
				<Dropdown.Item>You have no notifications yet</Dropdown.Item>
			);

		return (
			<Dropdown icon={notificationIcon} onClose={this.onMenuOpened}>
				<Dropdown.Menu>{notificationsMarkup}</Dropdown.Menu>
			</Dropdown>
		);
	}
}

const mapStateToProps = (state) => ({
	notifications : state.user.notifications,
});

export default connect(mapStateToProps, { markNotificationsRead })(Notifications);
