const fs = require('fs');
const {shellCommand} = require('cerebro-tools');
const icon = require('./Icons/ic_open_in_new.png');

let appsArr;
const JsonFilePath = './JSON.json';

const plugin = ({term, display, actions}) => {
	term = term.replace(/^(app:?)(\s+)/i, '');

	if (term.match(/^(update)/i)) {
		display({
			title: 'Update the apps array',
			subtitle: 'This may take a while depending on your harddrive and processor speed',
			onSelect: () => getApps(true)
		});
	} else {
		if (!appsArr) {
			console.log('Apps array is empty, I am gonna go get them from the JSON file!');
			getApps(false);
		} else {
			const res = appsArr.search(term);
			res.forEach((object, key) => {
				display({
					title: object.file.replace(/\.(.{2,5})$/, ''),
					icon: icon, //object.path + object.file
					subtitle: object.path + object.file,
					onSelect: () => {
						actions.open(object.path + object.file);
					}
				});
			});
		}
	}

	function getApps(update) {
		if (update) {
			searchSystem();
		} else {
			fs.exists(JsonFilePath, (response) => {
				if (response) {
					return fs.readFile(JsonFilePath, 'utf-8', (err, response) => {
						if (err) throw err;
						else {
							if (response) {
								if (response != '' && response.length > 0) {
									const items = JSON.parse(response).items;
									if (items.length > 0) appsArr =  items;
									else {
										console.log('The JSON file is empty, filling it!');
										return searchSystem();
									}
								} else {
									console.log('Error with JSON file');
									return searchSystem();
								}
							} else {
								console.log('Something went wrong... :/');
								return searchSystem();
							}
						}
					});
				} else {
					console.log('JSON file doesn\'t exists. I will create it.');
					searchSystem();
				}
			});
		}

		function searchSystem() {
			const fileArr = [];
			const folderPathOne = 'C:/ProgramData/Microsoft/Windows/Start Menu/Programs/';
			const folderPathTwo = 'C:/Users/Vic/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/';

			Promise.all([handleFolders(folderPathOne), handleFolders(folderPathTwo)]).then(() => {
				appsArr = fileArr;
				jsonFileArr = {items: appsArr};

				setTimeout(() => {
					fs.writeFile(JsonFilePath, JSON.stringify(jsonFileArr), (err) => {
						if (err) throw err;
						else console.log('Updated the Json file');
					});
				}, 500);
			}).catch(err => console.error(err));

			function handleFolders(path) {
				return new Promise((resolve, reject) => {
					fs.readdir(path, (err, files) => {
						if (err) reject(err);
						else {
							files.forEach((object, key) => {
								if (object.toLowerCase() != 'desktop.ini') {
									if (object.match(/(.+)(\.\w{2,5})$/i)) {
										if (fs.lstatSync(path + object).isDirectory()) handleFolders(path + object + '/');
										else fileArr.push({path: path, file: object});
									} else handleFolders(path + object + '/');
								}
							});

							resolve();
						}
					});
				});
			}
		}
	}

	Array.prototype.search = function(str) {
		const occ = [];

		this.forEach((object, key) => {
			if (object.file.toLowerCase().indexOf(str.toLowerCase()) > -1) occ.push(object);
		});

		return occ;
	};
}

module.exports = plugin;