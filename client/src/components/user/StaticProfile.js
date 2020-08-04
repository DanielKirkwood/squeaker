// react
import React, { Fragment } from 'react';

// util
import dayjs from 'dayjs';

// semantic ui
import { Image, Icon, Divider, Card } from 'semantic-ui-react';

export const StaticProfile = (props) => {
	const { profile: { username, createdAt, imageUrl, bio, website, location } } = props;

	return (
		<Fragment>
			<Card color='teal' centered>
				<Image src={imageUrl} alt={`${username} profile`} />

				<Card.Content>
					<Card.Header textAlign='center' content={`@${username}`} />
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
				</Card.Content>
			</Card>
		</Fragment>
	);
};

export default StaticProfile;
