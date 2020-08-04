// react
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// redux
import { connect } from 'react-redux';
import { signUp } from '../../redux/actions/userActions';

// components
import SignupForm from './SignupForm';

//semantic ui
import { Grid, Message, Header } from 'semantic-ui-react';

export class Signup extends Component {
	onSubmit = (formValues) => {
		this.props.signUp(formValues, this.props.history);
	};

	render() {
		return (
			<Grid textAlign='center'>
				<Grid.Column>
					<Header as='h2' color='teal'>
						Sign-Up
					</Header>
					<SignupForm onSubmit={this.onSubmit} ui={this.props.ui} />
					<Message>
						<Link to='/login' className='ui secondary animated fade button' tabIndex='0'>
							<div className='visible content'>Already have an account?</div>
							<div className='hidden content'>Log In Now</div>
						</Link>
					</Message>
				</Grid.Column>
			</Grid>
		);
	}
}

const mapStateToProps = (state) => ({
	user : state.user,
	ui   : state.ui,
});

export default connect(mapStateToProps, { signUp })(Signup);
