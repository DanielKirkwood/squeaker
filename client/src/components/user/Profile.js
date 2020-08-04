// react
import React, { Component } from 'react';

// redux
import { connect } from 'react-redux';
import { uploadImage } from '../../redux/actions/userActions';

// util
import dayjs from 'dayjs';

// components
import EditProfile from './EditProfile';

// semantic ui
import { Card, Image, Icon, Button, Divider } from 'semantic-ui-react';

export class Profile extends Component {
	handleImageChange = (event) => {
		const image = event.target.files[0];
		const formData = new FormData();
		formData.append('image', image, image.name);
		this.props.uploadImage(formData);
	};

	handleEditImage = () => {
		const fileInput = document.getElementById('imageInput');
		fileInput.click();
	};

	render() {
		const { user: { credentials: { username, createdAt, imageUrl, bio, location, website } } } = this.props;

		return (
			<Card color='teal' centered>
				<Image src={imageUrl} alt={`${username} profile`} />
				<input type='file' id='imageInput' onChange={this.handleImageChange} hidden='hidden' />
				<Button icon labelPosition='left' onClick={this.handleEditImage} color='teal'>
					<Icon name='image' />
					Change Profile Picture
				</Button>

				<Card.Content>
					<Card.Header content={`@${username}`} />
					<Card.Meta>{dayjs(createdAt).format('[Joined] MMM YYYY')}</Card.Meta>

					{bio && <Card.Description>{bio}</Card.Description>}
				</Card.Content>

				<Card.Content extra>
					{website && <div className='right floated'>{website}</div>}

					{location && (
						<span>
							<Icon name='location arrow' color='teal' />
							{location}
						</span>
					)}

					<Divider hidden />

					<EditProfile />
				</Card.Content>
			</Card>
		);
	}
}

const mapStateToProps = (state) => ({
	user : state.user,
});

export default connect(mapStateToProps, { uploadImage })(Profile);
