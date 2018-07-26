const fileUrl = './scream.mp3';
const audio = new Audio(fileUrl);

const plugin = ({term, display, actions}) => {
	const val = term.match(/^(SITV:?)\s+(.+)/i);

	if (val) {
		display({title: 'Scream ' + val[2], subtitle: 'This will make you feel better', onSelect: () => {
			audio.play();
		}});
	}
};

module.exports = plugin;