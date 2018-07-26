const React = require('react');
const Rant = require('./Rant.js');
const styles = require('./styles.css');

module.exports = ({profile}) => {
	const {avatar, username, score, skills, website} = profile;
	const avatarImg = 'https://avatars.devrant.io/' + avatar.i;

	return (
		<div className={styles.main}>
		<img src={avatarImg} className={styles.img} />
		<h3>{username}</h3>
		<p>Score: {score}</p>
		<p>Skills: {skills}</p>
		<p>Website: <a href={website}>{website}</a></p>
		<hr/>
		<h4>Latest rant</h4>
		<Rant rant={profile.content.content.rants[0]} className={'rantWithin'} />
		</div>
		);
}