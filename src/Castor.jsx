
// Complete collection of JSX components for Castor main view 
var React = require('react');
var ReactDOM = require('react-dom');
var SPIndex = require('./SPIndex');
var TabbedPanel = require('./TabbedPanel');
var TrafficView = require('./TrafficView');
var Banner = require('./Banner');
var CastorViewStore = require('./CastorViewStore');

class Castor extends React.Component {

	constructor(props) {
		super(props);
		this.state = CastorViewStore.getState();
	    this.onChange = this.onChange.bind(this);
		console.log('Hello Castor');
	}

  	componentWillUnmount() {
    	CastorViewStore.unlisten(this.onChange);
  	}

  	componentDidMount() {
    	CastorViewStore.listen(this.onChange);
  	}

  	onChange(newState) {
    	this.state = newState;
    	this.forceUpdate();
  	}

  	render() {
  		if ( this.state.showTraffic ) {
	  		return (
	  			<div id="castor">
	  			<TrafficView from={this.state.trafficPorts[0]} to={this.state.trafficPorts[1]} />
				</div>
			);
  		} else {
	  		return (
	  			<div id="castor" style={{display:"inline-block"}} >
	  			<div id="castor-banner">
	  			<Banner height={200} />
	  			</div>
				<div id="castor-top">
				<SPIndex />
				</div>
				<div id="castor-bottom">
				<TabbedPanel />
				</div>
				</div>
			);
	  	}
  	}
}

ReactDOM.render( <Castor />, document.getElementById('react-main-mount') );
