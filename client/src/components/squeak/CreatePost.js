// react
import React, { Component } from 'react';
import { connect } from 'react-redux';

// redux
import { postSqueak } from '../../redux/actions/dataActions';

// semantic ui
import { Container, Button, Input, Image, Divider, Message } from 'semantic-ui-react';

export class CreatePost extends Component {
	state = {
		body   : '',
		errors : {},
	};

	static getDerivedStateFromProps(nextProps) {
		if (nextProps.ui.errors) {
			return { errors: nextProps.ui.errors };
		} else return { errors: {} };
	}

	componentDidUpdate(prevProps) {
		if (prevProps.ui.errors !== this.props.ui.errors) {
			this.setState({ errors: this.props.ui.errors });
		}
	}

	onInputChange = (event) => {
		this.setState({ body: event.target.value });
	};

	onPostSubmit = (event) => {
		event.preventDefault();
		this.props.postSqueak({ body: this.state.body });
		this.setState({ body: '' });
	};

	render() {
		const { errors } = this.state;
		return (
			<Container>
				<Input fluid transparent>
					<Image avatar src={this.props.imageUrl} alt='profile' />
					<input
						type='text'
						name='body'
						placeholder='What&#39;s on your mind&#63;'
						value={this.state.body}
						onChange={this.onInputChange}
					/>
					<Button color='teal' onClick={this.onPostSubmit}>
						Post
					</Button>
				</Input>

				{errors.data && <Message error content={errors.data.body} />}

				<Divider />
			</Container>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		imageUrl : state.user.credentials.imageUrl,
		ui       : state.ui,
	};
};

export default connect(mapStateToProps, { postSqueak })(CreatePost);
