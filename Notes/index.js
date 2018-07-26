const notes = [];

const noteIcon = require('./Icons/ic_note.png');
const addNoteIcon = require('./Icons/ic_note_add.png');

function plugin({term, display, update, actions}) {
	const specifiers = term.split(/\s+/);
	specifiers.shift();

	if (specifiers.length > 0) {
		if (specifiers[0].toLowerCase() == 'add' && specifiers.length > 2) {
			const title = specifiers[1].trim();
			const content = specifiers.slice(2).join(' ').trim();

			if (title != '' && content != '') {
				display({
					id: 'addNote',
					icon: addNoteIcon,
					title: 'Add note named: ' + title,
					subtitle: 'Width content: ' + content,
					onSelect: (evt) => {
						evt.preventDefault();
						notes.push({
							title: title,
							content: content,
							createdDateTime: Date()
						});
						actions.replaceTerm('notes');
					}
				});
			}
		} else if (specifiers[0].toLowerCase() == 'edit' && specifiers.length > 3) {
			const id = Number(specifiers[1].trim());
			const newTitle = specifiers[2].trim();
			const newContent = specifiers.slice(3).join(' ').trim();

			display({
				id: 'update',
				icon: noteIcon,
				title: 'Edit note with id: ' + id,
				subtitle: `Setting title to: ${newTitle} and content to: ${newContent}`,
				onSelect: (evt) => {
					evt.preventDefault();
					if (notes[id]) {
						notes[id].title = newTitle;
						notes[id].content = newContent;
					} else {
						notes.push({
							title: newTitle,
							content: newContent,
							createdDateTime: Date()
						});
					}
					actions.replaceTerm('notes');
				}
			});
		} else if (specifiers[0].toLowerCase() == 'search' && specifiers.length > 1) {
			const query = specifiers[1].toString().toLowerCase();

			notes.forEach((object, index) => {
				for (key in object) {
					if (index.toString() == query || object[key].toString().toLowerCase().search(query) > -1) showNote(object, index);
				}
			});
		} else notes.forEach((object, key) => {showNote(object, key)});
	} else notes.forEach((object, key) => {showNote(object, key)});

	function showNote(note, index) {
		display({
			icon: noteIcon,
			id: 'note' + index,
			title: index + ' - ' + note.title,
			subtitle: note.content,
				getPreview: () => {}, // Add a preview
				onSelect: () => actions.copyToClipboard(note.title + ' - ' + note.content),
				onKeyDown: (evt) => {
					if (evt.key.toLowerCase() === 'delete') {
						if (evt.metaKey || evt.ctrlKey) {
							evt.preventDefault();
							notes.splice(index);
							actions.hideWindow();
						} else {
							update('note' + index, {
								title: 'Remove?',
								subtitle: 'You can also press CTRL + DEL or the metakey + DEL',
								onKeyDown: () => {},
								onSelect: (evt) => {
									evt.preventDefault();
									notes.splice(index);
									actions.replaceTerm('notes');
								}
							});
						}
					}
				}
			});
	}
}

module.exports = plugin;