// react
import React, { Component } from 'react';

// redux
import { connect } from 'react-redux';
import { deleteSqueak } from '../../redux/actions/dataActions';

// semantic ui
import { Button, Confirm, Icon } from 'semantic-ui-react';

export class DeleteButton extends Component {
	state = { open: false };

	open = () => this.setState({ open: true });
	close = () => this.setState({ open: false });

	deleteSqueak = () => {
		this.props.deleteSqueak(this.props.squeakId);
		this.setState({ open: false });
	};

	render() {
		return (
			<div>
				<Button icon floated='right' size='tiny' color='red' onClick={this.open}>
					<Icon name='trash' />
				</Button>
				<Confirm
					open={this.state.open}
					header='Delete Squeak'
					content='Are you sure you want to delete this squeak?'
					cancelButton='No'
					onCancel={this.close}
					confirmButton='Yes, I am sure'
					onConfirm={this.deleteSqueak}
				/>
			</div>
		);
	}
}

export default connect(null, { deleteSqueak })(DeleteButton);
