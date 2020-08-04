// react
import React, { Component } from 'react';

// redux
import { connect } from 'react-redux';
import { editUserDetails } from '../../redux/actions/userActions';

// semantic ui
import { Button, Header, Icon, Modal, Form, TextArea } from 'semantic-ui-react';

class EditProfile extends Component {
	state = {
		bio       : '',
		website   : '',
		location  : '',
		modalOpen : false,
	};

	handleOpen = () => {
		this.setState({ modalOpen: true });
		this.mapUserDetailsToState(this.props.credentials);
	};

	handleClose = () => this.setState({ modalOpen: false });

	mapUserDetailsToState = (credentials) => {
		this.setState({
			bio      : credentials.bio ? credentials.bio : '',
			website  : credentials.website ? credentials.website : '',
			location : credentials.location ? credentials.location : '',
		});
	};

	componentDidMount() {
		const { credentials } = this.props;
		this.mapUserDetailsToState(credentials);
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	handleSubmit = () => {
		const userDetails = {
			bio      : this.state.bio,
			website  : this.state.website,
			location : this.state.location,
		};
		this.props.editUserDetails(userDetails);
		this.handleClose();
	};

	render() {
		return (
			<Modal
				trigger={<Button color='teal' floated='right' content='Edit Profile' onClick={this.handleOpen} />}
				open={this.state.modalOpen}
				onClose={this.handleClose}
				closeIcon
			>
				<Header icon='edit' content='Edit Profile' />
				<Modal.Content>
					<Form>
						<Form.Field>
							<label>Bio</label>
							<TextArea
								name='bio'
								placeholder='A short bio about yourself'
								value={this.state.bio}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field>
							<label>Location</label>
							<input
								name='location'
								placeholder='Glasgow, UK'
								value={this.state.location}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field>
							<label>Website</label>
							<input
								name='website'
								placeholder='https://website.com'
								value={this.state.website}
								onChange={this.handleChange}
							/>
						</Form.Field>
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button color='red' onClick={this.handleClose}>
						<Icon name='remove' /> Cancel
					</Button>
					<Button color='green' onClick={this.handleSubmit}>
						<Icon name='checkmark' /> Save
					</Button>
				</Modal.Actions>
			</Modal>
		);
	}
}

const mapStateToProps = (state) => ({
	credentials : state.user.credentials,
});

export default connect(mapStateToProps, { editUserDetails })(EditProfile);
