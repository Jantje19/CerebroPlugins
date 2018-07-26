const WMAQ = require('./WMAQ.js');

let noErrs = true;
let apps;

if (!WMAQ.osOk()) {
	alert('Windows Metro App Module:\n\nYou are not on a Windows device! This plugin is useless...');
	noErrs = false;
}

WMAQ.getApps().then(data => {
	apps = data;
}).catch(err => {
	noErrs = err;
})

const plugin = ({term, display, actions}) => {
	const val = term.match(/^(\#)(\s+)?(.+)/i);

	if (val && noErrs === true) {
		const value = val[3].trim();

		if (value.trim().toLowerCase() == 'update') {
			display({
				title: 'Update list?',
				onSelect: () => {
					WMAQ.init().then(data => {
						apps = data;
					}).catch(console.error);
				}
			})

			return;
		}

		if (!apps) {
			display({
				title: 'Windows Metro App Module',
				subtitle: 'Not done loading (yet)...'
			});
		} else {
			Object.keys(apps).forEach(key => {
				const displayData = {
					title: key,
					onSelect: () => {
						WMAQ.start(apps[key]).then(() => {
							console.log('Updated list!');
						}).catch(console.error);
					}
				}

				if (apps[key]['manifestInfo']) {
					if (apps[key]['manifestInfo']['appDescription'])
						displayData.subtitle = apps[key]['manifestInfo']['appDescription'];

					if (apps[key]['manifestInfo']['appName'])
						displayData.title = apps[key]['manifestInfo']['appName'];

					if (apps[key]['manifestInfo']['appIconLocation'])
						displayData.icon = apps[key]['manifestInfo']['appIconLocation'];
				}

				if (displayData.title.toLowerCase().indexOf(value.toLowerCase()) > -1)
					display(displayData);
			});
		}
	} else if ((typeof noErrs).toLowerCase() != 'boolean') {
		console.error(noErrs);
		display({
			title: 'Windows Metro App Module - Error',
			subtitle: 'ERROR: Was not able to query Windows Metro apps'
		});
	}
};

module.exports = plugin;