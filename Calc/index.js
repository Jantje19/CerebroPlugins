function plugin({term, display, update, actions}) {
	let result;
	const specifiers = term.split(/\s+/);
	specifiers.shift();

	try {
		const str = specifiers.join('').replace(/\,/g, '.');

		result = eval(str);
	} catch (err) {};

	if (result) {
		display({
			title: specifiers.join(' ') + ' = ' + result,
			subtitle: 'Copy to clipboard',
			onSelect: (evt) => {
				// evt.preventDefault();
				actions.copyToClipboard(result.toString());
			}
		});
	} else {
		display({
			title: 'Error calculating'
		});
	}
}

module.exports = plugin;