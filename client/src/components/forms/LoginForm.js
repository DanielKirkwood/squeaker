// react
import React, { Component } from 'react';

// semantic ui
import { Form, Button, Message, Segment, Checkbox } from 'semantic-ui-react';

class LoginForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errors          : {},
			serverError     : false,
			email           : '',
			emailError      : false,
			emailMessage    : '',
			password        : '',
			passwordError   : false,
			passwordMessage : '',
			formError       : false,
			showPassword    : false,
		};
	}

	// ! Depreciated method
	// UNSAFE_componentWillReceiveProps(nextProps) {
	// 	if (nextProps.ui.errors) {
	// 		this.setState({ errors: nextProps.ui.errors });
	// 	}
	// }

	static getDerivedStateFromProps(nextProps) {
		if (nextProps.ui.errors) {
			return { errors: nextProps.ui.errors, serverError: true };
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

	toggle = () => this.setState((prevState) => ({ showPassword: !prevState.showPassword }));

	handleSubmit = (event) => {
		event.preventDefault();
		const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		let error = false;

		if (this.state.email === '') {
			this.setState({
				emailError   : true,
				emailMessage : 'You must not leave email blank',
			});
			error = true;
		} else if (!regexp.test(this.state.email)) {
			this.setState({
				emailError   : true,
				emailMessage : 'You must enter a valid email',
			});
			error = true;
		} else {
			this.setState({ emailError: false });
		}

		if (this.state.password === '') {
			this.setState({
				passwordError   : true,
				passwordMessage : 'You must not leave email blank',
			});
			error = true;
		}

		if (error) {
			this.setState({ formError: true });
			return;
		}
		this.setState({ formError: false });
		this.props.onSubmit({
			email    : this.state.email,
			password : this.state.password,
		});
	};

	onSubmit = (formValues) => {
		this.props.onSubmit(formValues);
	};

	render() {
		const { ui: { loading } } = this.props;
		const { errors } = this.state;
		return (
			<Form
				onSubmit={(event) => {
					this.handleSubmit(event);
				}}
				error={this.state.serverError || this.state.formError}
				noValidate
			>
				<Segment stacked>
					<Form.Field>
						<Form.Input
							label='Email'
							name='email'
							type='email'
							error={this.state.emailError}
							onChange={this.onInputChange}
							value={this.state.email}
						/>
						{this.state.emailError ? <Message error content={this.state.emailMessage} /> : null}
					</Form.Field>

					<Form.Field>
						<Form.Input
							label='Password'
							name='password'
							type={this.state.showPassword === false ? 'password' : 'text'}
							error={this.state.passwordError}
							onChange={this.onInputChange}
							value={this.state.password}
						/>
						{this.state.passwordError ? <Message error content={this.state.passwordMessage} /> : null}

						<Checkbox label='Show password' onChange={this.toggle} checked={this.state.showPassword} />
					</Form.Field>

					<Button fluid color='teal' loading={loading} disabled={loading}>
						Submit
					</Button>

					{errors.general ? <Message error content={errors.general} /> : null}
				</Segment>
			</Form>
		);
	}
}

export default LoginForm;
