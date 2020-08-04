// react
import React, { Component, Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';

// redux
import { connect } from 'react-redux';
import { logOut } from '../../redux/actions/userActions';

// components
import Notifications from './Notifications';

// semantic ui
import { Menu, Dropdown, Image, Icon } from 'semantic-ui-react';

export class Header extends Component {
	handleLogout = () => {
		this.props.logOut();
	};

	render() {
		const trigger = <Image avatar src={this.props.imageUrl} />;

		return (
			<Menu secondary pointing icon color='teal'>
				<Link to='/' className='item'>
					Squeaker
				</Link>
				<Menu.Menu position='right'>
					<NavLink exact to='/' className='item'>
						<Icon name='home' size='large' />
					</NavLink>
					{this.props.authenticated !== true ? (
						<NavLink exact to='/login' className='item'>
							<Icon name='sign-in' size='large' />
						</NavLink>
					) : (
						<Fragment>
							<Menu.Item>
								<Notifications />
							</Menu.Item>
							<Dropdown pointing='top right' trigger={trigger} style={{ marginTop: '10px' }}>
								<Dropdown.Menu>
									<Dropdown.Item>
										<NavLink exact to='/profile' className='item'>
											<Image src={this.props.imageUrl} avatar />
											Profile
										</NavLink>
									</Dropdown.Item>
									<Dropdown.Item icon='sign-out' text='Sign Out' onClick={this.handleLogout} />
								</Dropdown.Menu>
							</Dropdown>
						</Fragment>
					)}
				</Menu.Menu>
			</Menu>
		);
	}
}

const mapStateToProps = (state) => ({
	authenticated : state.user.authenticated,
	imageUrl      : state.user.credentials.imageUrl,
	username      : state.user.credentials.username,
});

export default connect(mapStateToProps, { logOut })(Header);
