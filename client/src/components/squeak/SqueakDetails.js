// react
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

// redux
import { connect } from 'react-redux';
import { getSqueak, clearErrors } from '../../redux/actions/dataActions';

// util
import dayjs from 'dayjs';

// components
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import Comments from './Comments';
import CreateComment from './CreateComment';

// semantic ui
import { Modal, Header, Icon, Image, Grid, Divider, Loader, Dimmer, Placeholder } from 'semantic-ui-react';

export class SqueakDetails extends Component {
	state = {
		modalOpen : false,
		oldPath   : '',
		newPath   : '',
	};

	componentDidMount() {
		if (this.props.openModal) {
			this.handleOpen();
		}
	}

	handleOpen = () => {
		let oldPath = window.location.pathname;

		const { username, squeakId } = this.props;
		const newPath = `/users/${username}/squeak/${squeakId}`;

		if (oldPath === newPath) {
			oldPath = `/users/${username}`;
		}

		window.history.pushState(null, null, newPath);

		this.setState({ modalOpen: true, oldPath, newPath });
		this.props.getSqueak(this.props.squeakId);
	};

	handleClose = () => {
		window.history.pushState(null, null, this.state.oldPath);
		this.setState({ modalOpen: false });
		this.props.clearErrors();
	};

	renderLoading() {
		return (
			<Dimmer.Dimmable>
				<Grid container columns={2}>
					<Grid.Column width={5}>
						<Placeholder fluid>
							<Placeholder.Image />
						</Placeholder>
					</Grid.Column>
					<Grid.Column width={11}>
						<Placeholder>
							<Placeholder.Paragraph>
								<Placeholder.Line />
								<Placeholder.Line />
								<Placeholder.Line />
								<Placeholder.Line />
								<Placeholder.Line />
							</Placeholder.Paragraph>
						</Placeholder>
					</Grid.Column>
				</Grid>

				<Dimmer active inverted>
					<Loader inverted>Loading...</Loader>
				</Dimmer>
			</Dimmer.Dimmable>
		);
	}

	renderMarkup() {
		const {
			squeak : { squeakId, body, createdAt, likeCount, commentCount, username, userImage, comments },
			user   : { authenticated },
		} = this.props;

		const deleteButton =
			authenticated && username === this.props.user.credentials.username ? (
				<DeleteButton squeakId={squeakId} />
			) : null;

		return (
			<Fragment>
				<Grid container columns={3}>
					<Grid.Column width={5}>
						<Image circular src={userImage} />
					</Grid.Column>

					<Grid.Column width={9}>
						<Grid.Row>
							<Header size='large'>
								<Link to={`/users/${username}`}>{`@${username}`}</Link>
							</Header>
						</Grid.Row>

						<Grid.Row>
							<Header size='tiny' color='grey'>
								{dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
							</Header>
						</Grid.Row>

						<Divider hidden />

						<Grid.Row>
							<Header color='black' size='medium'>
								{body}
							</Header>
						</Grid.Row>

						<Divider hidden />

						<Grid.Row>
							<Grid.Column>
								<LikeButton squeakId={squeakId} />
								{likeCount} likes
							</Grid.Column>

							<Grid.Column>
								<Icon name='comments' />
								{commentCount} comments
							</Grid.Column>
						</Grid.Row>

						<Divider />
					</Grid.Column>
					<Grid.Column width={2}>{deleteButton}</Grid.Column>
				</Grid>
				<Grid columns={1}>
					<Grid.Column>
						<CreateComment squeakId={squeakId} />

						<Comments comments={comments} />
					</Grid.Column>
				</Grid>
			</Fragment>
		);
	}

	render() {
		return (
			<Fragment>
				<Modal
					trigger={
						this.props.commentBtn ? (
							<Icon link name='comments' onClick={this.handleOpen} />
						) : (
							<Icon
								link
								name='ellipsis horizontal'
								onClick={this.handleOpen}
								style={{ marginLeft: '.5rem' }}
							/>
						)
					}
					open={this.state.modalOpen}
					onClose={this.handleClose}
					closeIcon
				>
					<Modal.Content scrolling>
						{this.props.ui.loading ? this.renderLoading() : this.renderMarkup()}
					</Modal.Content>
				</Modal>
			</Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	squeak : state.data.squeak,
	user   : state.user,
	ui     : state.ui,
});

export default connect(mapStateToProps, { getSqueak, clearErrors })(SqueakDetails);
