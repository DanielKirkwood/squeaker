// react
import React, { Component, Fragment } from 'react';

// redux
import { connect } from 'react-redux';
import { getUserData } from '../../redux/actions/dataActions';

// util
import db from '../../apis/db';

// components
import Squeak from '../squeak/Squeak';
import StaticProfile from './StaticProfile';

// semantic ui
import { Feed, Header } from 'semantic-ui-react';

export class User extends Component {
	state = {
		profile       : null,
		squeakIdParam : null,
	};

	async componentDidMount() {
		const { username, squeakId } = this.props.match.params;

		if (squeakId) {
			this.setState({ squeakIdParam: squeakId });
		}

		this.props.getUserData(username);
		try {
			const response = await db.get(`/user/${username}`);
			this.setState({
				profile : response.data.user,
			});
		} catch (error) {
			console.log(error);
		}
	}

	renderList() {
		return this.props.data.squeaks.map((squeak) => {
			return <Squeak squeak={squeak} key={squeak.squeakId} />;
		});
	}

	render() {
		const { squeaks, loading } = this.props.data;
		const { squeakIdParam } = this.state;

		const squeaksMarkup = loading ? (
			<p>Loading...</p>
		) : squeaks === null ? (
			<p>No squeaks from this user</p>
		) : !squeakIdParam ? (
			<Fragment>
				<Header as='h2' textAlign='center' color='teal'>
					Posts
				</Header>
				<Feed size='large'>{squeaks.map((squeak) => <Squeak squeak={squeak} key={squeak.squeakId} />)}</Feed>
			</Fragment>
		) : (
			<Fragment>
				<Header as='h2' textAlign='center' color='teal'>
					Posts
				</Header>
				<Feed size='large'>
					{squeaks.map((squeak) => {
						if (squeak.squeakId !== squeakIdParam) {
							return <Squeak squeak={squeak} key={squeak.squeakId} />;
						} else {
							return <Squeak squeak={squeak} key={squeak.squeakId} openModal />;
						}
					})}
				</Feed>
			</Fragment>
		);

		return (
			<Fragment>
				{this.state.profile === null ? <p>Loading...</p> : <StaticProfile profile={this.state.profile} />}
				{squeaksMarkup}
			</Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	data : state.data,
	user : state.user,
});

export default connect(mapStateToProps, { getUserData })(User);
