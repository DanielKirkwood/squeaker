// react
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// redux
import { connect } from 'react-redux';
import { signIn } from '../../redux/actions/userActions';

// components
import LoginForm from './LoginForm';

//semantic ui
import { Grid, Message, Header } from 'semantic-ui-react';

export class Login extends Component {
	onSubmit = (formValues) => {
		this.props.signIn(formValues, this.props.history);
	};

	render() {
		return (
			<Grid textAlign='center'>
				<Grid.Column>
					<Header as='h2' color='teal'>
						Login
					</Header>
					<LoginForm onSubmit={this.onSubmit} ui={this.props.ui} />
					<Message>
						<Link to='/signup' className='ui secondary animated fade button' tabIndex='0'>
							<div className='visible content'>Not got an account?</div>
							<div className='hidden content'>Sign Up Now</div>
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

export default connect(mapStateToProps, { signIn })(Login);
