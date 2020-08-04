// react
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// redux
import { connect } from 'react-redux';
import { likeSqueak, unlikeSqueak } from '../../redux/actions/dataActions';

// semantic ui
import { Icon } from 'semantic-ui-react';

export class LikeButton extends Component {
	likedSqueak = () => {
		if (this.props.user.likes && this.props.user.likes.find((like) => like.squeakId === this.props.squeakId)) {
			return true;
		} else {
			return false;
		}
	};

	likeSqueak = () => {
		this.props.likeSqueak(this.props.squeakId);
	};

	unlikeSqueak = () => {
		this.props.unlikeSqueak(this.props.squeakId);
	};

	render() {
		const { authenticated } = this.props.user;
		const likeButton = !authenticated ? (
			<Link to='/login'>
				<Icon name='heart outline' color='red' />
			</Link>
		) : this.likedSqueak() ? (
			<Icon name='heart' color='red' onClick={this.unlikeSqueak} />
		) : (
			<Icon name='heart outline' color='red' onClick={this.likeSqueak} />
		);

		return likeButton;
	}
}

const mapStateToProps = (state) => ({
	user : state.user,
});

const mapActionsToProps = {
	likeSqueak,
	unlikeSqueak,
};

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
