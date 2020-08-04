// react
import React, { Component, Fragment } from 'react';

// Redux
import { connect } from 'react-redux';
import { submitComment } from '../../redux/actions/dataActions';

// semantic ui
import { Button, Input, Message } from 'semantic-ui-react';

export class CreateComment extends Component {
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
		this.setState({ [event.target.name]: event.target.value });
	};

	onPostSubmit = (event) => {
		event.preventDefault();
		this.props.submitComment(this.props.squeakId, { body: this.state.body });
		this.setState({ body: '' });
	};

	render() {
		const { authenticated } = this.props;
		const { errors } = this.state;

		const createCommentMarkup = authenticated ? (
			<Fragment>
				<Input
					fluid
					error={errors.comment ? true : false}
					action={
						<Button color='teal' onClick={this.onPostSubmit}>
							Post
						</Button>
					}
					name='body'
					placeholder='Leave a comment...'
					onChange={this.onInputChange}
					value={this.state.body}
				/>
				{errors.comment && <Message error content={errors.comment} />}
			</Fragment>
		) : null;

		return createCommentMarkup;
	}
}

const mapStateToProps = (state) => ({
	ui            : state.ui,
	authenticated : state.user.authenticated,
});

export default connect(mapStateToProps, { submitComment })(CreateComment);
