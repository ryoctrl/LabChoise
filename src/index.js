const React = require('react');
const ReactDOM = require('react-dom');

class LabsList extends React.Component {
	//eslint-disable-next-line
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				Hello React
			</div>
		);
	}
}

ReactDOM.render(
	<LabsList />,
	document.getElementById('root')
);

