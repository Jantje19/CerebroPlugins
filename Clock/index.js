const Preview = require('./Preview.js');

function plugin({term, display, update, actions}) {
	const date = new Date();

	display({
		title: date.getHours() + ':' + date.getMinutes(),
		getPreview: () => (<Preview />)
	});
}

module.exports = plugin;