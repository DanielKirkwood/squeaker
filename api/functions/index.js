const functions = require('firebase-functions');
const { app } = require('firebase-admin');
const firebase = require('firebase');
const sharp = require('sharp');
const expressApp = require('express')();

const { db, admin } = require('./util/admin');
const config = require('./util/config');

const { validateSignUpData, validateLoginData, reduceUserDetails } = require('./util/validators');
const authenticate = require('./util/authenticate');

firebase.initializeApp(config);

let cors_options = {
	origin               : '*',
	methods              : 'GET, POST, DELETE',
	preflightContinue    : false,
	optionsSuccessStatus : 204,
};

const cors = require('cors')(cors_options);
expressApp.use(cors);

//* Squeak Routes

// get all squeaks
expressApp.get('/squeaks', async (req, res) => {
	try {
		const data = await db.collection('squeaks').orderBy('createdAt', 'desc').get();
		let squeaks = [];
		data.forEach((doc) => {
			squeaks.push({
				squeakId     : doc.id,
				body         : doc.data().body,
				username     : doc.data().username,
				createdAt    : doc.data().createdAt,
				commentCount : doc.data().commentCount,
				likeCount    : doc.data().likeCount,
				userImage    : doc.data().userImage,
			});
		});
		return res.json(squeaks);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'something went wrong' });
	}
});

// get one squeak by ID
expressApp.get('/squeak/:squeakId', async (req, res) => {
	try {
		let squeakData = {};

		// find the squeak document by ID, addding to squeakData
		const document = await db.doc(`/squeaks/${req.params.squeakId}`).get();

		if (!document.exists) {
			return res.status(404).json({ error: 'Squeak not found' });
		}

		squeakData = document.data();
		squeakData.squeakId = document.id;

		// get squeaks comments, addding to squeakData
		const commentData = await db
			.collection('comments')
			.orderBy('createdAt', 'desc')
			.where('squeakId', '==', req.params.squeakId)
			.get();

		squeakData.comments = [];
		commentData.forEach((doc) => {
			squeakData.comments.push(doc.data());
		});

		return res.json(squeakData);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error.code });
	}
});

// post a squeak
expressApp.post('/squeak', authenticate, async (req, res) => {
	try {
		if (req.body.body.trim() === '') {
			return res.status(400).json({ body: 'Body must not be empty' });
		}

		const newSqueak = {
			body         : req.body.body,
			username     : req.user.username,
			userImage    : req.user.imageUrl,
			createdAt    : new Date().toISOString(),
			likeCount    : 0,
			commentCount : 0,
		};

		const doc = await db.collection('squeaks').add(newSqueak);

		const resSqueak = newSqueak;
		resSqueak.squeakId = doc.id;
		res.json({ resSqueak });
	} catch (error) {
		console.error(error);
		if (error.code === 'auth/email-already-in-use') {
			return res.status(400).json({ email: 'email already in use' });
		} else {
			return res.status(500).json({ error: error.code });
		}
	}
});

// like squeak
expressApp.get('/squeak/:squeakId/like', authenticate, async (req, res) => {
	try {
		const likeDocument = await db
			.collection('likes')
			.where('username', '==', req.user.username)
			.where('squeakId', '==', req.params.squeakId)
			.limit(1);

		let squeakData;
		const squeakDocument = db.doc(`/squeaks/${req.params.squeakId}`);

		const doc = await squeakDocument.get();
		if (doc.exists) {
			squeakData = doc.data();
			squeakData.squeakId = doc.id;
			const data = await likeDocument.get();

			if (data.empty) {
				await db.collection('likes').add({
					squeakId : req.params.squeakId,
					username : req.user.username,
				});

				squeakData.likeCount++;
				await squeakDocument.update({ likeCount: squeakData.likeCount });

				return res.json(squeakData);
			} else {
				return res.status(400).json({ error: 'Squeak already liked' });
			}
		} else {
			return res.status(404).json({ error: 'Squeaks not found' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.code });
	}
});

// unlike squeak
expressApp.get('/squeak/:squeakId/unlike', authenticate, async (req, res) => {
	try {
		const likeDocument = await db
			.collection('likes')
			.where('username', '==', req.user.username)
			.where('squeakId', '==', req.params.squeakId)
			.limit(1);

		const squeakDocument = db.doc(`/squeaks/${req.params.squeakId}`);

		const doc = await squeakDocument.get();
		if (doc.exists) {
			squeakData = doc.data();
			squeakData.squeakId = doc.id;
			const data = await likeDocument.get();

			if (data.empty) {
				return res.status(400).json({ error: 'Squeak not liked' });
			} else {
				await db.doc(`/likes/${data.docs[0].id}`).delete();
				squeakData.likeCount--;
				await squeakDocument.update({ likeCount: squeakData.likeCount });
				return res.json(squeakData);
			}
		} else {
			return res.status(404).json({ error: 'Squeaks not found' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.code });
	}
});

// comment on squeak
expressApp.post('/squeak/:squeakId/comment', authenticate, async (req, res) => {
	try {
		if (req.body.body.trim() === '') {
			return res.status(400).json({ comment: 'Must not be empty ' });
		}

		const newComment = {
			body      : req.body.body,
			createdAt : new Date().toISOString(),
			squeakId  : req.params.squeakId,
			username  : req.user.username,
			userImage : req.user.imageUrl,
		};

		const doc = await db.doc(`/squeaks/${req.params.squeakId}`).get();

		if (!doc.exists) {
			return res.status(404).json({ error: 'Squeak not found' });
		}

		await doc.ref.update({ commentCount: doc.data().commentCount + 1 });

		await db.collection('comments').add(newComment);

		return res.json(newComment);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Something went wrong' });
	}
});

// delete squeak
expressApp.delete('/squeak/:squeakId', authenticate, async (req, res) => {
	try {
		const squeakDocument = db.doc(`/squeaks/${req.params.squeakId}`);
		const doc = await squeakDocument.get();
		if (!doc.exists) {
			return res.status(404).json({ error: 'Squeak not found' });
		}
		if (doc.data().username != req.user.username) {
			return res.status(403).json({ error: 'Unauthorized' });
		} else {
			await squeakDocument.delete();
		}

		res.json({ message: 'Squeak deleted successfully' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error.code });
	}
});

//* User Routes

// signup new users
expressApp.post('/signup', async (req, res) => {
	try {
		const newUser = {
			email           : req.body.email,
			password        : req.body.password,
			confirmPassword : req.body.confirmPassword,
			username        : req.body.username,
		};

		const { valid, errors } = validateSignUpData(newUser);

		if (!valid) return res.status(400).json(errors);

		const noImg = 'no-img.png';
		let token, userId;

		const doc = await db.doc(`/users/${newUser.username}`).get();
		if (doc.exists) {
			return res.status(400).json({ username: 'this username is already taken' });
		} else {
			const data = await firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
			userId = data.user.uid;
			const idToken = await data.user.getIdToken();

			token = idToken;
			const userCredentials = {
				username  : newUser.username,
				email     : newUser.email,
				createdAt : new Date().toISOString(),
				imageUrl  : `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
				userId    : userId,
			};

			await db.doc(`/users/${newUser.username}`).set(userCredentials);

			return res.status(201).json({ token });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ general: 'Something went wrong, please try again' });
	}
});

// login users
expressApp.post('/login', async (req, res) => {
	try {
		const user = {
			email    : req.body.email,
			password : req.body.password,
		};

		const { valid, errors } = validateLoginData(user);

		if (!valid) return res.status(400).json(errors);

		const data = await firebase.auth().signInWithEmailAndPassword(user.email, user.password);

		const token = await data.user.getIdToken();

		return res.json({ token });
	} catch (error) {
		console.error(error);
		return res.status(403).json({ general: 'Wrong credentials, please try again' });
	}
});

// get another users details
expressApp.get('/user/:username', async (req, res) => {
	try {
		let userData = {};
		const doc = await db.doc(`/users/${req.params.username}`).get();

		if (doc.exists) {
			userData.user = doc.data();
			const data = await db
				.collection('squeaks')
				.where('username', '==', req.params.username)
				.orderBy('createdAt', 'desc')
				.get();

			userData.squeaks = [];
			data.forEach((doc) => {
				userData.squeaks.push({
					body         : doc.data().body,
					createdAt    : doc.data().createdAt,
					username     : doc.data().username,
					userImage    : doc.data().userImage,
					likeCount    : doc.data().likeCount,
					commentCount : doc.data().commentCount,
					squeakId     : doc.id,
				});
			});
			return res.json(userData);
		} else {
			return res.status(404).json({ error: 'User not found' });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error.code });
	}
});

// get current authenticated user
expressApp.get('/user', authenticate, async (req, res) => {
	try {
		let userData = {};
		const doc = await db.doc(`/users/${req.user.username}`).get();

		if (doc.exists) {
			userData.credentials = doc.data();
			const data = await db.collection('likes').where('username', '==', req.user.username).get();

			userData.likes = [];
			data.forEach((item) => {
				userData.likes.push(item.data());
			});

			const notificationsData = await db
				.collection('notifications')
				.where('recipient', '==', req.user.username)
				.orderBy('createdAt', 'desc')
				.limit(10)
				.get();

			userData.notifications = [];
			notificationsData.forEach((notification) => {
				userData.notifications.push({
					recipient      : notification.data().recipient,
					sender         : notification.data().sender,
					createdAt      : notification.data().createdAt,
					squeakId       : notification.data().squeakId,
					type           : notification.data().type,
					read           : notification.data().read,
					notificationId : notification.id,
				});
			});
		}
		return res.json(userData);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error.code });
	}
});

// add/update user details
expressApp.post('/user', authenticate, async (req, res) => {
	try {
		let userDetails = reduceUserDetails(req.body);
		await db.doc(`/users/${req.user.username}`).update(userDetails);

		return res.json({ message: 'details added successfully' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error.code });
	}
});

// mark notifications as read
expressApp.post('/notifications', authenticate, async (req, res) => {
	try {
		let batch = db.batch();
		req.body.forEach((notificationId) => {
			const notification = db.doc(`/notifications/${notificationId}`);
			batch.update(notification, { read: true });
		});

		await batch.commit();

		return res.json({ message: 'notifications marked as read' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error.code });
	}
});

function resize(originalFile, resizedFile, size) {
	let height, width;
	if (size.indexOf(',') !== -1) {
		[ width, height ] = size.split(',');
	} else if (size.indexOf('x') !== -1) {
		[ width, height ] = size.split('x');
	} else {
		throw new Error("height and width are not delimited by a ',' or a 'x'");
	}

	return sharp(originalFile)
		.rotate()
		.resize(parseInt(width, 10), parseInt(height, 10), {
			fit                : 'inside',
			withoutEnlargement : true,
		})
		.toFile(resizedFile);
}

// upload image
expressApp.post('/user/image', authenticate, (req, res) => {
	const BusBoy = require('busboy');
	const path = require('path');
	const os = require('os');
	const fs = require('fs');

	const busboy = new BusBoy({ headers: req.headers });

	let imageToBeUploaded = {};
	let imageFileName;
	let imageExtension;

	busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
		if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
			return res.status(400).json({ error: 'Wrong file type submitted' });
		}

		// my.image.png => ['my', 'image', 'png']
		imageExtension = filename.split('.')[filename.split('.').length - 1];

		// 32756238461724837.png
		imageFileName = `${Math.round(Math.random() * 1000000000000).toString()}`;
		fullFileName = `${imageFileName}.${imageExtension}`;
		const filepath = path.join(os.tmpdir(), fullFileName);
		imageToBeUploaded = { filepath, mimetype };

		file.pipe(fs.createWriteStream(filepath));
	});

	busboy.on('finish', async (fieldname, file, filename, encoding, mimetype) => {
		try {
			const size = '200x200';
			const resizedFileName = `${imageFileName}_${size}.${imageExtension}`;

			resizedFile = path.join(os.tmpdir(), resizedFileName);

			await resize(imageToBeUploaded.filepath, resizedFile, size);

			await admin.storage().bucket(config.storageBucket).upload(resizedFile, {
				resumable : false,
				metadata  : {
					metadata : {
						contentType : mimetype,
					},
				},
			});

			const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${resizedFileName}?alt=media`;

			await db.doc(`/users/${req.user.username}`).update({ imageUrl });

			return res.json({ message: 'image uploaded successfully' });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'something went wrong' });
		} finally {
			try {
				if (resizedFile) {
					fs.unlinkSync(resizedFile);
				}
			} catch (err) {
				console.log(err);
			}
		}
	});

	busboy.end(req.rawBody);
});

exports.api = functions.region('europe-west3').https.onRequest(expressApp);

//* Functions

// generate a notification on like
exports.createNotificationOnLike = functions
	.region('europe-west3')
	.firestore.document('likes/{id}')
	.onCreate(async (snapshot) => {
		try {
			const doc = await db.doc(`/squeaks/${snapshot.data().squeakId}`).get();

			if (doc.exists && doc.data().username !== snapshot.data().username) {
				await db.doc(`/notifications/${snapshot.id}`).set({
					createdAt : new Date().toISOString(),
					recipient : doc.data().username,
					sender    : snapshot.data().username,
					type      : 'like',
					read      : false,
					squeakId  : doc.id,
				});
			}

			return;
		} catch (error) {
			console.error(error);
		}
	});

// deletes like notfication if squeak unliked
exports.deleteNotificationOnUnlike = functions
	.region('europe-west3')
	.firestore.document('likes/{id}')
	.onDelete(async (snapshot) => {
		try {
			await db.doc(`/notifications/${snapshot.id}`).delete();
		} catch (error) {
			console.error(error);
		}
	});

// creates notification when a squeak is commented on
exports.createNotificationOnComment = functions
	.region('europe-west3')
	.firestore.document('comments/{id}')
	.onCreate(async (snapshot) => {
		try {
			const doc = await db.doc(`/squeaks/${snapshot.data().squeakId}`).get();

			if (doc.exists && doc.data().username !== snapshot.data().username) {
				await db.doc(`/notifications/${snapshot.id}`).set({
					createdAt : new Date().toISOString(),
					recipient : doc.data().username,
					sender    : snapshot.data().username,
					type      : 'comment',
					read      : false,
					squeakId  : doc.id,
				});
			}
		} catch (error) {
			console.error(error);
		}
	});

// update user image
exports.onUserImageChange = functions
	.region('europe-west3')
	.firestore.document('users/{userId}')
	.onUpdate(async (change) => {
		if (change.before.data().imageUrl !== change.after.data().imageUrl) {
			try {
				const batch = db.batch();
				const squeakData = await db
					.collection('squeaks')
					.where('username', '==', change.before.data().username)
					.get();

				squeakData.forEach((doc) => {
					const squeak = db.doc(`/squeaks/${doc.id}`);
					batch.update(squeak, { userImage: change.after.data().imageUrl });
				});

				const commentData = await db
					.collection('comments')
					.where('username', '==', change.before.data().username)
					.get();

				commentData.forEach((doc) => {
					const comment = db.doc(`/comments/${doc.id}`);
					batch.update(comment, { userImage: change.after.data().imageUrl });
				});

				return batch.commit();
			} catch (error) {
				console.error(error);
			}
		} else {
			return true;
		}
	});
