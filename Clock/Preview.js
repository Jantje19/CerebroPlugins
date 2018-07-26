class CanvasComponent extends React.Component {
	componentDidMount() {
		this.updateCanvas();
	}

	updateCanvas() {
		const ctx = this.refs.canvas.getContext('2d');
		const date = new Date();
		const center = {
			x: this.refs.canvas.width / 2,
			y: this.refs.canvas.height / 2
		}

		let hrs = date.getHours();
		const min = date.getMinutes();

		Number.prototype.map = function(start1, stop1, start2, stop2) {
			return ((this - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
		}

		Math.toRadians = function(degrees, pointUp) {
			if (pointUp) return (degrees - 90) * Math.PI / 180;
			else return degrees * Math.PI / 180;
		};

		function drawCircle(x, y, r, fromRads, toRads, color, strokeWidth) {
			ctx.beginPath();
			ctx.strokeStyle = color;
			ctx.lineWidth = strokeWidth;
			ctx.arc(x, y, r, fromRads, toRads);
			ctx.stroke();
		}

		function drawLine(startX, startY, endX, endY, color, lineWidth) {
			ctx.beginPath();
			ctx.lineWidth = lineWidth;
			ctx.strokeStyle = color;
			ctx.moveTo(startX, startY);
			ctx.lineTo(endX, endY);
			ctx.stroke();
		}

		if (hrs > 12)
			hrs -= 12;

		const hrsDeg = Math.toRadians(hrs.map(0, 12, 0, 360) - 90 + min.map(0, 60, 0, 360 / 12 - 10));
		const minDeg = Math.toRadians(min.map(0, 60, 0, 360) - 90);

		ctx.lineCap = 'round';
		ctx.save();
		ctx.translate(center.x, center.y);
		ctx.save();
		ctx.rotate(hrsDeg);
		drawLine(0, 0, 50, 0, 'rgb(255, 100, 150)', 10);

		ctx.restore();
		ctx.save();
		ctx.rotate(minDeg);
		drawLine(0, 0, 70, 0, 'rgb(150, 255, 100)', 8);

		ctx.restore();
		ctx.restore();

		drawCircle(center.x, center.y, 85, Math.toRadians(-90), minDeg, 'rgb(150, 255, 100)', 10);
		drawCircle(center.x, center.y, 95, Math.toRadians(-90), hrsDeg, 'rgb(255, 100, 150)', 10);

		// Numbers
		const rad = 105;
		for (let i = 0; i < 360; i += 30) {
			ctx.fillStyle = 'white';
			const radsDegs = Math.toRadians(i - 60);
			ctx.fillText((i / 30) + 1, center.x + Math.cos(radsDegs) * rad - 3, center.y + Math.sin(radsDegs) * rad + 3);
		}
	}

	render() {
		return (
			<canvas ref="canvas" width={300} height={300}/>
			);
	}
}

module.exports = () => {
	return React.createElement(CanvasComponent);
}