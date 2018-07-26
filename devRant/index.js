let prev;
let RantPreview;
let UserPreview;

const defaultType = 'algo';
const React = require('react');
const icon = require('./Icons/ic_devrant.png');

const plugin = ({term, display, update, actions}) => {
	const regExArr = term.match(/^(devrant)\s+(.+)/i);

	if (regExArr) {
		const modifiers = regExArr[2].split(/\s+/g);
		const type = modifiers[0].toLowerCase();
		const typeMatch = type.match(/(algo|recent|top|rand|user)/i);

		if (typeMatch) {
			if (typeMatch[1].toLowerCase() == 'user') {
				if (modifiers[1]) {
					const username = modifiers[1];
					display({
						icon: icon,
						id: 'userSeach',
						title: 'Find user: ' + username,
						subtitle: 'Press enter to search',
						onSelect: (evt) => {
							evt.preventDefault();
							actions.replaceTerm(term);
							getUser(username);
						}
					});
				}
			} else getRant(typeMatch[1], actions);
		} else getRant(defaultType, actions);
	} else getRant(defaultType, actions);

	function getRant(type, actions) {
		if (prev != type) {
			display({
				icon: icon,
				id: 'loading',
				title: 'Loading...',
				subtitle: 'Fetching rant with ' + type
			});

			let url = `https://www.devrant.io/api/devrant/rants?app=3&sort=${type}&limit=1`;

			if (type == 'rand') {
				url = `https://www.devrant.io/api/devrant/rants?app=3&sort=algo&limit=20`;
			}

			get(url).then(response => {
				const rant = (response.rants.length > 1) ? response.rants[Math.floor(Math.random() * response.rants.length)] : response.rants[0];

				if (!RantPreview) RantPreview = require('./Previews/Rant.js');

				update('loading', {
					title: 'Post from the devRant feed',
					subtitle: 'A post from the devRant API',
					onSelect: () => {actions.open('https://www.devrant.io/rants/' + rant.id)},
					getPreview: () => (<RantPreview rant = {rant} />)
				});
			}).catch(err => {
				alert(err);
			});
		}

		prev = type;
	}

	function getUser(username) {
		if (username) {
			const userIdUrl = `https://devrant.io/api/get-user-id?username=${username}&app=3`;
			const userContentUrl = `https://www.devrant.io/api/users/{userId}?app=3`;

			get(userIdUrl).then(response => {
				if (response.success) {
					get(userContentUrl.replace('{userId}', response.user_id)).then(response => {
						if (response.success) {
							if (!UserPreview) UserPreview = require('./Previews/User.js');

							console.log(response);
							update('userSeach', {
								title: `Found ${username}!`,
								subtitle: '',
								onSelect: () => actions.open('https://devrant.io/users/' + username),
								getPreview: () => (<UserPreview profile={response.profile} />)
							});
						} else {
							// No user found
							update('userSeach', {
								title: `No user named ${username} found.`,
								subtitle: '',
								onSelect: () => {}
							});
						}
					}).catch(err => {
						console.error(err);
					});
				} else {
					// No user found
					update('userSeach', {
						title: `No user named ${username} found.`,
						subtitle: '',
						onSelect: () => {}
					});
				}
			}).catch(err => {
				console.error(err);
			});
		}
	}

	function get(url) {
		return fetch(url).then(response => {
			return response.json();

			// if (response.type === 'opaque') {
				// 	return 'Received a response, but it\'s opaque so can\'t examine it';
				// } else if (response.status !== 200) {
					// 	return 'Looks like there was a problem. Status Code: ' + response.status;
					// } else {
						// 	return response.json();
						// }
					}).catch(err => {
						return Error('An error occurred', err);
					});
				}
			}

			module.exports = plugin;