const React = require('react');
const styles = require('./styles.css');

function getImg(img) {
	const {url, width, height} = img;

	if (img) {
		return (
			<div>
			<img src={url} className={styles.img} />
			{<div className={styles.imgDetails}>{width}px x {height}px</div>}
			</div>
			)
		} else return;
	}

	module.exports = ({rant, className}) => {
		const {text, tags, attached_image, user_username, score} = rant;
		const img = getImg(attached_image);
		className = styles[className] || styles.main;

		return (
		<div className={className}>
		<h3>{text}</h3>
		{img}
		<div className={styles.tags}>{tags.map(e => <span key={e} className={styles.tag}>{e}</span>)}</div>
		<div className={styles.details}>
		<p>Score: {score}</p>
		<p>From: <a href={'https://www.devrant.io/users/' + user_username}>{user_username}</a></p>
		</div>
		</div>
		);
	}