// react
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// utils
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// components
import LikeButton from './LikeButton';
import SqueakDetails from './SqueakDetails';

// semantic ui
import { Feed, Image } from 'semantic-ui-react';

export class Squeak extends Component {
	render() {
		dayjs.extend(relativeTime);

		const { squeak: { body, createdAt, userImage, username, squeakId, likeCount, commentCount } } = this.props;

		return (
			<Feed.Event>
				<Feed.Label>
					<Link to={`users/${username}`}>
						<Image src={userImage} alt={username} />
					</Link>
				</Feed.Label>

				<Feed.Content>
					<Feed.Summary>
						<Link to={`users/${username}`} className='user'>
							{username}
						</Link>
						<Feed.Date>{dayjs(createdAt).fromNow()}</Feed.Date>

						<SqueakDetails
							commentBtn={false}
							squeakId={squeakId}
							username={username}
							openModal={this.props.openModal}
						/>
					</Feed.Summary>

					<Feed.Extra text>{body}</Feed.Extra>

					<Feed.Meta>
						<LikeButton squeakId={squeakId} />
						{likeCount} likes
						<SqueakDetails
							commentBtn={true}
							squeakId={squeakId}
							username={username}
							openModal={this.props.openModal}
						/>
						{commentCount} comments
					</Feed.Meta>
				</Feed.Content>
			</Feed.Event>
		);
	}
}

export default Squeak;
