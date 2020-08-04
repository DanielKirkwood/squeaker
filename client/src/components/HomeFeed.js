// react
import React, { Component, Fragment } from 'react';

// redux
import { connect } from 'react-redux';
import { fetchSqueaks } from '../redux/actions/dataActions';

// components
import Squeak from './squeak/Squeak';
import CreatePost from './squeak/CreatePost';

// semantic ui
import { Header, Image, Feed, Placeholder, Divider } from 'semantic-ui-react';

// styles
import Logo from '../logo.svg';

export class HomeFeed extends Component {
	componentDidMount() {
		this.props.fetchSqueaks();
	}

	renderList() {
		return this.props.data.squeaks.map((squeak) => {
			return <Squeak squeak={squeak} key={squeak.squeakId} />;
		});
	}

	// code taken from Stack Overflow
	// https://stackoverflow.com/a/39438518
	renderLoading() {
		const n = 8; // number of times to repeat placeholder

		return [ ...Array(n) ].map((e, i) => (
			<span key={i}>
				<Placeholder>
					<Placeholder.Header image>
						<Placeholder.Line />
						<Placeholder.Line />
					</Placeholder.Header>
					<Placeholder.Paragraph>
						<Placeholder.Line />
						<Placeholder.Line />
					</Placeholder.Paragraph>
				</Placeholder>
				<Divider hidden />
			</span>
		));
	}

	render() {
		return (
			<Fragment>
				<Header as='h2' textAlign='center' color='teal'>
					<Image src={Logo} alt='Squeaker Logo' />
					Home Feed
				</Header>

				{this.props.isAuthenticated && <CreatePost />}

				{this.props.data.loading ? this.renderLoading() : <Feed size='large'>{this.renderList()}</Feed>}
			</Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		data            : state.data,
		isAuthenticated : state.user.authenticated,
	};
};

export default connect(mapStateToProps, { fetchSqueaks })(HomeFeed);
