// react
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// util
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// semantic ui
import { Image, Feed } from 'semantic-ui-react';

export class Comments extends Component {
	render() {
		dayjs.extend(relativeTime);
		const { comments } = this.props;
		return (
			<Feed>
				{comments.map((comment) => {
					const { body, createdAt, userImage, username } = comment;
					return (
						<Feed.Event key={createdAt}>
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
								</Feed.Summary>

								<Feed.Extra text>{body}</Feed.Extra>
							</Feed.Content>
						</Feed.Event>
					);
				})}
			</Feed>
		);
	}
}

export default Comments;
